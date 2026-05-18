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
 *    - GITHUB_BRANCH: branch name (default: master)
 *    - GITHUB_PATH  : path inside repo (default: data/cars.json)
 * 4. Run setupSheet() once to initialise the sheet.
 * 5. Click "⚡ Installer le trigger automatique" in the menu — done!
 */

// ── Sheet configuration ──────────────────────────────────────────────────────
const SHEET_NAME = 'Cars';
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

// ── Menu ──────────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚗 Remons Car Rental')
    .addItem('📋 Initialiser la feuille', 'setupSheet')
    .addSeparator()
    .addItem('⚡ Installer le trigger automatique', 'installTrigger')
    .addItem('🗑️ Désinstaller le trigger', 'uninstallTrigger')
    .addSeparator()
    .addItem('🔄 Synchroniser vers GitHub', 'manualSync')
    .addItem('🔍 Inspecter les données brutes', 'testExport')
    .addSeparator()
    .addItem('✅ Vérifier la connexion GitHub', 'checkGitHubConnection')
    .addItem('📊 Résumé du catalogue', 'showSummary')
    .addSeparator()
    .addItem('🗑️ Vider le catalogue (garder l\'en-tête)', 'clearCars')
    .addItem('ℹ️ À propos', 'showAbout')
    .addToUi();
}

// ── Initialiser la feuille ────────────────────────────────────────────────────
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

  sheet.autoResizeColumns(1, COLUMNS.length);

  Logger.log('✅ Sheet "' + SHEET_NAME + '" is ready.');
  SpreadsheetApp.getUi().alert('✅ Feuille "' + SHEET_NAME + '" initialisée avec succès !');
}

// ── Installer le trigger onChange ─────────────────────────────────────────────
function installTrigger() {
  const ui = SpreadsheetApp.getUi();

  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onSheetChange') {
      ui.alert(
        '⚡ Trigger déjà installé',
        'Le trigger automatique est déjà actif.\nChaque modification du sheet déclenchera une sync vers GitHub.',
        ui.ButtonSet.OK
      );
      return;
    }
  }

  ScriptApp.newTrigger('onSheetChange')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onChange()
    .create();

  ui.alert(
    '✅ Trigger installé avec succès !',
    'Désormais, chaque modification du sheet "Cars" sera automatiquement synchronisée vers GitHub.\n\nAucune action supplémentaire requise.',
    ui.ButtonSet.OK
  );
}

// ── Désinstaller le trigger ───────────────────────────────────────────────────
function uninstallTrigger() {
  const ui = SpreadsheetApp.getUi();
  const triggers = ScriptApp.getProjectTriggers();
  let removed = 0;

  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === 'onSheetChange') {
      ScriptApp.deleteTrigger(trigger);
      removed++;
    }
  }

  if (removed > 0) {
    ui.alert('✅ Trigger désinstallé', removed + ' trigger(s) supprimé(s). La sync automatique est désactivée.', ui.ButtonSet.OK);
  } else {
    ui.alert('ℹ️ Aucun trigger trouvé', 'Aucun trigger automatique n\'était installé.', ui.ButtonSet.OK);
  }
}

// ── Trigger: se déclenche automatiquement à chaque modification ───────────────
function onSheetChange(e) {
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

  const rows = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
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

    if (!car.name) continue;

    rows.push(car);
  }

  if (rows.length === 0) {
    Logger.log('No valid cars found.');
    return;
  }

  Logger.log('[DEBUG] raw data rows: ' + JSON.stringify(data));
  Logger.log('[DEBUG] parsed cars: ' + JSON.stringify(rows));

  const json = JSON.stringify(rows, null, 2);
  pushToGitHub(json);
}

// ── Push JSON vers GitHub ─────────────────────────────────────────────────────
function pushToGitHub(jsonContent) {
  const token  = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const owner  = PropertiesService.getScriptProperties().getProperty('GITHUB_OWNER');
  const repo   = PropertiesService.getScriptProperties().getProperty('GITHUB_REPO');
  const branch = PropertiesService.getScriptProperties().getProperty('GITHUB_BRANCH') || 'master';
  const path   = PropertiesService.getScriptProperties().getProperty('GITHUB_PATH') || 'data/cars.json';

  if (!token || !owner || !repo) {
    Logger.log('❌ Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO in script properties.');
    return;
  }

  const api = 'https://api.github.com';

  // 1. Récupérer le SHA du fichier existant (si présent)
  let fileSha = null;
  try {
    const fileRes = UrlFetchApp.fetch(
      api + '/repos/' + owner + '/' + repo + '/contents/' + path + '?ref=' + branch,
      {
        headers: { Authorization: 'Bearer ' + token },
        muteHttpExceptions: true,
      }
    );
    Logger.log('[GitHub GET Response] ' + fileRes.getContentText());
    if (fileRes.getResponseCode() === 200) {
      const fileData = JSON.parse(fileRes.getContentText());
      fileSha = fileData.sha;
    }
  } catch (e) {
    // Le fichier n'existe pas encore — c'est normal
  }

  // 2. Valider le contenu
  if (!jsonContent || jsonContent.trim() === '') {
    Logger.log('❌ jsonContent vide — rien à pusher.');
    return;
  }

  // 3. Créer ou mettre à jour le fichier
  const contentBase64 = Utilities.base64Encode(jsonContent);
  const body = {
    message: '🔄 Auto-sync cars from Google Sheets',
    branch: branch,
    content: contentBase64,
  };
  if (fileSha) body.sha = fileSha;

  const commitRes = UrlFetchApp.fetch(
    api + '/repos/' + owner + '/' + repo + '/contents/' + path,
    {
      method: 'PUT',
      headers: { Authorization: 'Bearer ' + token },
      contentType: 'application/json',
      payload: JSON.stringify(body),
      muteHttpExceptions: true,
    }
  );

  Logger.log('[GitHub PUT Response] ' + commitRes.getContentText());

  const code = commitRes.getResponseCode();
  if (code === 200 || code === 201) {
    Logger.log('✅ Successfully pushed cars.json to GitHub.');
  } else {
    Logger.log('❌ GitHub API error: ' + commitRes.getContentText());
  }
}

// ── Sync manuelle (bouton menu) ───────────────────────────────────────────────
function manualSync() {
  const ui = SpreadsheetApp.getUi();
  try {
    onSheetChange({ changeType: 'EDIT' });
    ui.alert('✅ Synchronisation réussie !', 'Les données ont été envoyées vers GitHub.', ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('❌ Erreur de synchronisation', e.message, ui.ButtonSet.OK);
  }
}

// ── Inspecter les données brutes ──────────────────────────────────────────────
function testExport() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log('❌ Sheet "' + SHEET_NAME + '" not found.');
    SpreadsheetApp.getUi().alert('❌ Feuille "' + SHEET_NAME + '" introuvable. Lance setupSheet() d\'abord.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  Logger.log('[testExport] raw data: ' + JSON.stringify(data));

  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row.every(cell => cell === '')) continue;
    rows.push({
      id: i,
      name: String(row[0] || '').trim(),
      price: row[1],
      transmission: String(row[4] || '').trim(),
      fuel: String(row[6] || '').trim(),
    });
  }

  Logger.log('[testExport] parsed rows: ' + JSON.stringify(rows));

  const msg = rows.length > 0
    ? rows.map(r => `#${r.id} — ${r.name || '(sans nom)'} | ${r.price} MAD | ${r.transmission} | ${r.fuel}`).join('\n')
    : '⚠️ Aucune ligne valide trouvée.';

  SpreadsheetApp.getUi().alert('🔍 Données brutes (' + rows.length + ' voiture(s))', msg, SpreadsheetApp.getUi().ButtonSet.OK);
}

// ── Vérifier la connexion GitHub ──────────────────────────────────────────────
function checkGitHubConnection() {
  const ui = SpreadsheetApp.getUi();
  const token = PropertiesService.getScriptProperties().getProperty('GITHUB_TOKEN');
  const owner = PropertiesService.getScriptProperties().getProperty('GITHUB_OWNER');
  const repo  = PropertiesService.getScriptProperties().getProperty('GITHUB_REPO');

  if (!token || !owner || !repo) {
    ui.alert(
      '❌ Configuration manquante',
      'Vérifie que GITHUB_TOKEN, GITHUB_OWNER et GITHUB_REPO sont définis dans les propriétés du script.',
      ui.ButtonSet.OK
    );
    return;
  }

  try {
    const res = UrlFetchApp.fetch(
      'https://api.github.com/repos/' + owner + '/' + repo,
      {
        headers: { Authorization: 'Bearer ' + token },
        muteHttpExceptions: true,
      }
    );
    const code = res.getResponseCode();
    if (code === 200) {
      const repoData = JSON.parse(res.getContentText());
      ui.alert(
        '✅ Connexion GitHub OK',
        'Dépôt : ' + repoData.full_name + '\n' +
        'Visibilité : ' + (repoData.private ? 'Privé' : 'Public') + '\n' +
        'Branche par défaut : ' + repoData.default_branch,
        ui.ButtonSet.OK
      );
    } else if (code === 401) {
      ui.alert('❌ Token invalide', 'GITHUB_TOKEN est incorrect ou expiré.', ui.ButtonSet.OK);
    } else if (code === 404) {
      ui.alert('❌ Dépôt introuvable', 'Vérifie GITHUB_OWNER et GITHUB_REPO.', ui.ButtonSet.OK);
    } else {
      ui.alert('❌ Erreur ' + code, res.getContentText(), ui.ButtonSet.OK);
    }
  } catch (e) {
    ui.alert('❌ Erreur réseau', e.message, ui.ButtonSet.OK);
  }
}

// ── Résumé du catalogue ───────────────────────────────────────────────────────
function showSummary() {
  const ui = SpreadsheetApp.getUi();
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  if (!sheet) {
    ui.alert('❌ Feuille "' + SHEET_NAME + '" introuvable.');
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    ui.alert('📊 Catalogue vide', 'Aucune voiture enregistrée.', ui.ButtonSet.OK);
    return;
  }

  const rows = data.slice(1).filter(r => r[0] && r[0] !== '');
  const prices = rows.map(r => parseFloat(String(r[1]).replace(/[^0-9.]/g, '')) || 0);
  const totalCars = rows.length;
  const avgPrice = prices.length ? (prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(0) : 0;
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;

  const fuels = {};
  const transmissions = {};
  rows.forEach(r => {
    const f = String(r[6] || 'N/A').trim();
    const t = String(r[4] || 'N/A').trim();
    fuels[f] = (fuels[f] || 0) + 1;
    transmissions[t] = (transmissions[t] || 0) + 1;
  });

  const fuelStr = Object.entries(fuels).map(([k, v]) => k + ': ' + v).join(', ');
  const transStr = Object.entries(transmissions).map(([k, v]) => k + ': ' + v).join(', ');

  ui.alert(
    '📊 Résumé du catalogue',
    '🚗 Total voitures : ' + totalCars + '\n\n' +
    '💰 Prix moyen : ' + avgPrice + ' MAD\n' +
    '   Min : ' + minPrice + ' MAD | Max : ' + maxPrice + ' MAD\n\n' +
    '⛽ Carburants : ' + (fuelStr || 'N/A') + '\n' +
    '⚙️ Transmissions : ' + (transStr || 'N/A'),
    ui.ButtonSet.OK
  );
}

// ── Vider le catalogue ────────────────────────────────────────────────────────
function clearCars() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.alert(
    '⚠️ Confirmer la suppression',
    'Vider toutes les voitures du catalogue ? L\'en-tête sera conservé.',
    ui.ButtonSet.YES_NO
  );

  if (response !== ui.Button.YES) return;

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    ui.alert('❌ Feuille "' + SHEET_NAME + '" introuvable.');
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.deleteRows(2, lastRow - 1);
  }

  ui.alert('✅ Catalogue vidé', 'Toutes les voitures ont été supprimées. L\'en-tête est conservé.', ui.ButtonSet.OK);
}

// ── À propos ──────────────────────────────────────────────────────────────────
function showAbout() {
  SpreadsheetApp.getUi().alert(
    'ℹ️ Remons Car Rental — Sync Tool',
    'Version : 1.2\n' +
    'Auteur  : Remons\n\n' +
    'Ce script synchronise automatiquement le catalogue de voitures\n' +
    'de Google Sheets vers GitHub (data/cars.json) à chaque modification.\n\n' +
    'Fonctionnalités du menu :\n' +
    '• Initialiser la feuille\n' +
    '• Installer / désinstaller le trigger automatique\n' +
    '• Sync manuel vers GitHub\n' +
    '• Inspecter les données brutes\n' +
    '• Vérifier la connexion GitHub\n' +
    '• Résumé du catalogue\n' +
    '• Vider le catalogue',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}
