```markdown
# Visual Regression Testing Framework

This framework leverages [BackstopJS](https://github.com/garris/backstopjs) and [Playwright](https://playwright.dev/) to perform visual regression tests across multiple environments and device viewports. Scenarios are defined externally in an Excel file and dynamically injected into the test configuration before running.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration Files](#configuration-files)
- [Scripts & Utilities](#scripts--utilities)
- [How It Works](#how-it-works)
- [Running the Tests](#running-the-tests)
  - [Capturing Baseline Images](#capturing-baseline-images)
  - [Validating Against Baseline](#validating-against-baseline)
- [Adding or Modifying Scenarios](#adding-or-modifying-scenarios)
- [Debugging & Troubleshooting](#debugging--troubleshooting)
- [Additional Tips](#additional-tips)

## Prerequisites
- **Node.js and npm**: Ensure you have [Node.js](https://nodejs.org) installed. Run:
  ```bash
  node -v
  npm -v
  ```
- **Visual Studio Code (optional)**: For debugging and easier code management, install [VS Code](https://code.visualstudio.com/).

## Project Structure

```
project/
├─ config/
│  ├─ urls.xlsx
│  └─ backstop.template.json
├─ engine_scripts/
│  └─ onReady.js
├─ screenshots/
│  ├─ baseline/
│  └─ test/
├─ utils/
│  ├─ excelReader.js
│  ├─ generateBackstopConfig.js
├─ run_tests.js
├─ capture_baseline.bat
└─ validate_baseline.bat
```

### Folder & File Details

**config/**  
- **urls.xlsx**: Excel file containing scenario paths under a `Path` column. The framework reads these and generates full scenario URLs.
- **backstop.template.json**: A template BackstopJS configuration. The framework dynamically modifies this to include scenarios, viewports, and engine options before running tests.

**engine_scripts/**  
- **onReady.js**: A script executed by BackstopJS on page load before taking a screenshot. It handles tasks like clicking an accept button (if present) and slow-scrolling through the page to ensure lazy-loaded elements are visible.

**screenshots/**  
- **baseline/**: Stores baseline images captured when you run in baseline mode.
- **test/**: Stores images captured during test mode to compare against the baseline.

**utils/**  
- **excelReader.js**: Reads `urls.xlsx` and extracts scenario paths.
- **generateBackstopConfig.js**: Takes the scenarios and updates the `backstop.template.json` file to produce a `backstop.json` with all scenario details.

**run_tests.js**  
- The main Node.js script. Takes command-line arguments (`--baseUrl`, `--threads`, `--mode`), reads the Excel file, generates `backstop.json`, and triggers BackstopJS commands (`reference` or `test`).

**capture_baseline.bat** & **validate_baseline.bat**  
- Windows batch files to easily trigger baseline capture or validation against baseline. Adjust `BASE_URL` and `THREADS` as needed.

## Installation & Setup

1. **Initialize the Project:**
   ```bash
   npm init -y
   ```

2. **Install Dependencies:**
   ```bash
   npm install backstopjs playwright read-excel-file minimist --save-dev
   npx playwright install
   ```
   This installs BackstopJS, Playwright, the Excel reading library, and the argument parsing tool.

3. **Verify Directory Structure & Files:**
   Ensure all files and folders listed above are present.  
   Place `urls.xlsx` in `config/` with a `Path` column.

## Configuration Files

**backstop.template.json**  
Defines viewports (desktop, iPhone, iPad), paths to scripts, report settings, and engine options.  
The scenarios section is empty in the template; `run_tests.js` dynamically populates it.

**urls.xlsx**  
Lists scenario paths. For example:
```
Path
/
 /products
 /contact
```
The script auto-generates scenario labels like `Scenario_1`, `Scenario_2`, etc.

## Scripts & Utilities

- **run_tests.js**:
  - Reads command-line arguments:  
    - `--baseUrl` (e.g., `https://example.com`)  
    - `--threads` (e.g., `2`)  
    - `--mode` (`baseline` or `test`)
  - Reads `urls.xlsx` using `excelReader.js`.
  - Generates `backstop.json` from `backstop.template.json` using `generateBackstopConfig.js`.
  - Runs `backstop reference` in baseline mode or `backstop test` in test mode.

- **excelReader.js**:
  - Uses `read-excel-file` to parse `urls.xlsx`.
  - Returns an array of objects containing the `Path`.

- **generateBackstopConfig.js**:
  - Takes scenarios, threads, and mode.
  - Updates `backstop.template.json` with scenario labels, URLs, and sets `asyncCaptureLimit` and `asyncCompareLimit`.
  - Writes out the final `backstop.json`.

- **onReady.js**:
  - Runs in the browser context (Playwright) before capturing screenshots.
  - Clicks the "Accept" button if present.
  - Slowly scrolls through the page to ensure all lazy-load elements appear.

## How It Works

1. You run `run_tests.js` with arguments.
2. The script reads Excel data, creates scenario objects, and inserts them into `backstop.template.json`.
3. A `backstop.json` file is generated.
4. Depending on the `--mode`:
   - `baseline`: `backstop reference` is run to capture baseline images.
   - `test`: `backstop test` is run to compare current environment screenshots against baseline images.

During the tests, Playwright (via BackstopJS) launches a browser (headless by default) for each scenario and viewport, navigates to the URL, executes `onReady.js` for preprocessing, and takes screenshots.

## Running the Tests

### Capturing Baseline Images

Run the baseline batch file:
```bash
./capture_baseline.bat
```
This will:
- Use `--mode baseline`.
- Generate `backstop.json`.
- Run `backstop reference` to produce baseline images in `screenshots/baseline`.

### Validating Against Baseline

Run the validation batch file:
```bash
./validate_baseline.bat
```
This will:
- Use `--mode test`.
- Generate `backstop.json`.
- Run `backstop test` to compare new screenshots in `screenshots/test` against the existing baseline in `screenshots/baseline`.
- Produce a report showing differences, if any.

## Adding or Modifying Scenarios

1. Open `config/urls.xlsx`.
2. Add new rows under the `Path` column for new pages or remove/update existing paths.
3. Save `urls.xlsx`.
4. Run `capture_baseline.bat` again if new scenarios are introduced, creating new baseline images.
5. Or run `validate_baseline.bat` to test against the existing baseline.

If you want a fresh start (completely new scenarios with no old baseline):
- Delete or rename `screenshots/baseline` and `screenshots/test`.
- Run the baseline capture again to produce a new set of baseline images.

## Debugging & Troubleshooting

- **Engine Scripts Not Found Warning:**  
  Ensure `onReadyScript` in `backstop.template.json` is set to `"onReady.js"` (not `"engine_scripts/onReady.js"`) since `paths.engine_scripts` already points to the `engine_scripts` folder.

- **Headless vs Headed Mode:**  
  If you want to see the browser, edit `backstop.template.json`:
  ```json
  "engineOptions": {
    "browser": "chromium",
    "headless": false
  }
  ```
  Running in headed mode may help visualize what’s happening.

- **File Not Found Errors:**
  Check paths and ensure `urls.xlsx` is inside `config/`. Use `path.join(__dirname, 'config', 'urls.xlsx')` in `run_tests.js`.

- **Visual Studio Code Debugging:**
  Create a `.vscode/launch.json` to run `run_tests.js` in debug mode. Set breakpoints, step through code, and inspect variables.

## Additional Tips

- **Parallel Execution:**  
  The `--threads` argument controls how many scenarios are processed in parallel. Increase for faster execution if your system can handle it.
  
- **CI Integration:**  
  Integrate `npm run` commands or the batch scripts into your CI pipeline to generate baseline images or run tests automatically on code changes.

- **Version Control:**  
  Commit your `backstop.template.json`, `urls.xlsx`, and script files to version control. Avoid committing large screenshot directories.

This README provides a comprehensive guide on setting up, configuring, running, and maintaining the visual regression testing framework.
```