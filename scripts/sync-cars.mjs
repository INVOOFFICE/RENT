#!/usr/bin/env node

/**
 * sync-cars.mjs — Manual cars.json sync from Google Sheets to local file.
 *
 * Usage:
 *   node scripts/sync-cars.mjs
 *
 * Environment variables (create a .env or set in CI):
 *   GITHUB_TOKEN   — GitHub personal access token
 *   GITHUB_OWNER   — repository owner
 *   GITHUB_REPO    — repository name
 *   GITHUB_BRANCH  — branch (default: main)
 *   GITHUB_PATH    — path in repo (default: public/data/cars.json)
 *
 * This script downloads the latest cars.json from the GitHub repo
 * and writes it to the local `public/data/cars.json` file.
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  GITHUB_TOKEN,
  GITHUB_OWNER,
  GITHUB_REPO,
  GITHUB_BRANCH = 'main',
  GITHUB_PATH = 'public/data/cars.json',
} = process.env;

if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO) {
  console.error('❌ Missing required env vars: GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO');
  process.exit(1);
}

const API = 'https://api.github.com';
const url = `${API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_PATH}?ref=${GITHUB_BRANCH}`;

async function sync() {
  console.log(`⬇️  Fetching cars.json from ${GITHUB_OWNER}/${GITHUB_REPO}...`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!res.ok) {
    console.error(`❌ GitHub API error (${res.status}): ${res.statusText}`);
    const body = await res.text();
    console.error(body);
    process.exit(1);
  }

  const data = await res.json();
  const content = Buffer.from(data.content, 'base64').toString('utf-8');

  const dest = resolve(__dirname, '..', GITHUB_PATH);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, content, 'utf-8');

  console.log(`✅ Written ${dest} (${content.length} bytes)`);
}

sync();
