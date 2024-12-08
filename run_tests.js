#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const minimist = require('minimist');
const fs = require('fs');

const readScenariosFromExcel = require('./utils/excelReader.js');
const generateBackstopConfig = require('./utils/generateBackstopConfig.js');

(async () => {
  const args = minimist(process.argv.slice(2));
  const baseUrl = args.baseUrl || 'http://localhost:3000';
  const threads = parseInt(args.threads, 10) || 1;
  const mode = args.mode || 'baseline'; // 'baseline' or 'test'

  const scenariosData = await readScenariosFromExcel(path.join(__dirname, 'config', 'urls.xlsx'));

  // Auto-generate labels (Scenario_1, Scenario_2, etc.)
  const scenarios = scenariosData.map((s, index) => ({
    Label: s.Path.replace(/^\//, '').replace(/[^a-zA-Z0-9_-]/g, '_'),
    FullURL: baseUrl + s.Path
  }));

  generateBackstopConfig(scenarios, threads, mode);

  if (mode === 'baseline') {
    console.log('Generating baseline images...');
    execSync('npx backstop reference', { stdio: 'inherit' });
  } else {
    console.log('Running tests against baseline...');
    execSync('npx backstop test', { stdio: 'inherit' });
  }

  console.log('Done.');
})();
