@echo off
echo Creating .env file for frontend...
echo.

(
echo # Flutterwave Public Key
echo VITE_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST-509fa4d386a258410a2579e8b4d12474-X
echo.
echo # Backend API URL
echo VITE_BASE_URL=http://127.0.0.1:8000
) > .env

echo .env file created successfully!
echo.
echo Contents:
type .env
echo.
echo Now restart your dev server with: npm run dev
pause
