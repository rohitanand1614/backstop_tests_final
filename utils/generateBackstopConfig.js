const fs = require('fs');
const path = require('path');

module.exports = function generateBackstopConfig(scenarios, threads, mode) {
  const templatePath = path.join(__dirname, '../config/backstop.template.json');
  const template = JSON.parse(fs.readFileSync(templatePath, 'utf8'));

  const backstopScenarios = scenarios.map(scenario => ({
    label: scenario.Label, // Already set in run_tests.js
    cookiePath: "cookies.json",
    url: scenario.FullURL,
    hideSelectors: [],
    removeSelectors: [],
    selectors: ["document"],
    readyEvent: null,
    delay: 1000,
    misMatchThreshold: 0.1,
    requireSameDimensions: true,
    onReadyScript: "onReady.js"
  }));

  template.scenarios = backstopScenarios;
  
  template.asyncCaptureLimit = threads;
  template.asyncCompareLimit = threads * 10;

  const outputPath = path.join(process.cwd(), 'backstop.json');
  fs.writeFileSync(outputPath, JSON.stringify(template, null, 2), 'utf8');
};
