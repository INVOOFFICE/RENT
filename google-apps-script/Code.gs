/**
 * Remons Car Rental — Google Sheets ↔ GitHub sync
 *
 * Setup:
 * 1. Create a new Google Apps Script project (Extensions > Apps Script).
 * 2. Paste this file as Code.gs.
 * 3. Add the following script properties (File > Project settings > Script properties):
 *    - GITHUB_TOKEN : your GitHub personal access token (classic, repo scope)
 *    - GITHUB_OWNER : repository owner (username or org)
 *    - GITHUB_REPO  : repository name
 *    - GITHUB_BRANCH: branch name (default: main)
 *    - GITHUB_PATH  : path inside repo (default: public/data/cars.json)
 * 4. Run setupSheet() once to initialise the sheet.
 * 5. Set an installable onChange trigger (Edit > Current project's triggers):
 *    - Function: onSheetChange
 *    - Event: On change
 *    - Notifications: optional
 */

// ── Sheet configuration ──────────────────────────────────────────────────────
const SHEET_NAME  = 'Cars';
const COLUMNS = [
  'Car Name',
  'Price (MAD)',
  'Duration',
  'Seats',
  'Transmission',
  'Doors',
  'Fuel',
  'Image URL',
];

// ── Run once to create the sheet ─────────────────────────────────────────────
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  sheet.clear();
  sheet.appendRow(COLUMNS);

  const headerRange = sheet.getRange(1, 1, 1, COLUMNS.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#1E293B');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setHorizontalAlignment('center');

  Logger.log('✅ Sheet "' + SHEET_NAME + '" is ready.');
}

// ── Trigger: runs automatically when sheet changes ──────────────────────────
function onSheetChange(e) {
  // Ignore changes to other sheets
  if (e.changeType === 'OTHER') return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('Sheet "' + SHEET_NAME + '" not found. Run setupSheet() first.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    Logger.log('No data rows to export.');
    return;
  }

  const headers = data[0];
  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Skip completely empty rows
    if (row.every(cell => cell === '')) continue;

    const car = {
      id: i,
      name: String(row[0] || '').trim(),
      price: parseFloat(String(row[1]).replace(/[^0-9.]/g, '')) || 0,
      duration: String(row[2] || 'Per Day').trim(),
      seats: parseInt(String(row[3]), 10) || 4,
      transmission: String(row[4] || 'Automatic').trim(),
      doors: parseInt(String(row[5]), 10) || 4,
      fuel: String(row[6] || 'Petrol').trim(),
      image: String(row[7] || '/images/car-placeholder.jpg').trim(),
    };

    if (!car.name) continue; // skip rows without a name

    rows.push(car);
  }

  if (rows.length === 0) {
    Logger.log('No valid cars found.');
    return;
  }

  const json = JSON.stringify(rows, null, 2);
  pushToGitHub(json);
}

// ── Push JSON to GitHub ──────────────────────────────────────────────────────
function pushToGitHub(jsonContent) {
  const token    = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const owner    = PropertiesService.getScriptProperties().getProperty('GITHUB_OWNER');
  const repo     = PropertiesService.getScriptProperties().getProperty('GITHUB_REPO');
  const branch   = PropertiesService.getScriptProperties().getProperty('GITHUB_BRANCH') || 'main';
  const path     = PropertiesService.getScriptProperties().getProperty('GITHUB_PATH') || 'public/data/cars.json';

  if (!token || !owner || !repo) {
    Logger.log('❌ Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO in script properties.');
    return;
  }

  const api = 'https://api.github.com';

  // 1. Get the reference SHA for the branch
  let refSha;
  try {
    const refRes = UrlFetchApp.fetch(api + '/repos/' + owner + '/' + repo + '/git/ref/heads/' + branch, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true,
    });
    const refData = JSON.parse(refRes);
    refSha = refData.object.sha;
  } catch (e) {
    Logger.log('❌ Failed to get branch ref: ' + e.message);
    return;
  }

  // 2. Get the current file SHA (if the file already exists)
  let fileSha = null;
  try {
    const fileRes = UrlFetchApp.fetch(api + '/repos/' + owner + '/' + repo + '/contents/' + path + '?ref=' + branch, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true,
    });
    if (fileRes.getResponseCode() === 200) {
      fileSha = JSON.parse(fileRes).sha;
    }
  } catch (e) {
    // File doesn't exist yet — that's fine
  }

  // 3. Create or update the file
  const contentBase64 = Utilities.base64Encode(jsonContent);
  const body = {
    message: '🔄 Auto-sync cars from Google Sheets',
    branch: branch,
    content: contentBase64,
  };
  if (fileSha) body.sha = fileSha;

  const commitRes = UrlFetchApp.fetch(api + '/repos/' + owner + '/' + repo + '/contents/' + path, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + token },
    contentType: 'application/json',
    payload: JSON.stringify(body),
    muteHttpExceptions: true,
  });

  if (commitRes.getResponseCode() === 200 || commitRes.getResponseCode() === 201) {
    Logger.log('✅ Successfully pushed cars.json to GitHub.');
  } else {
    Logger.log('❌ GitHub API error: ' + commitRes.getContentText());
  }
}

// ── Manual trigger (can be run from editor) ──────────────────────────────────
function manualSync() {
  onSheetChange({ changeType: 'EDIT' });
}
