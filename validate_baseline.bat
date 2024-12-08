@echo off
set BASE_URL=https://test-env.com
set THREADS=2

echo Validating test environment %BASE_URL% against baseline...
node run_tests.js --baseUrl=%BASE_URL% --threads=%THREADS% --mode=test
pause
