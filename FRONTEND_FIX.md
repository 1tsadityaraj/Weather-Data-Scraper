# Frontend Fix Applied

## Changes Made

1. **Increased API timeout** from 10 to 30 seconds
2. **Fixed API base URL** to use Vite proxy (`/api` instead of `http://localhost:8000/api`)

## What You Need to Do

**Restart the frontend server** to apply changes:

1. Stop the frontend (Ctrl+C in the terminal where it's running)
2. Restart it:
   ```bash
   cd /Users/aditya/weather/frontend
   npm run dev
   ```

## Why This Fixes It

- The Vite proxy in `vite.config.js` forwards `/api/*` requests to `http://localhost:8000`
- Using `/api` as baseURL lets Vite handle the proxying automatically
- Increased timeout prevents timeout errors on slow network requests

## Test After Restart

1. Open http://localhost:3000
2. Search for "Delhi" or any city
3. You should see weather data displayed

