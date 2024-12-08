@echo off
set BASE_URL=https://baseline-env.com
set THREADS=2

echo Capturing baseline from %BASE_URL% with %THREADS% threads...
node run_tests.js --baseUrl=%BASE_URL% --threads=%THREADS% --mode=baseline
pause
