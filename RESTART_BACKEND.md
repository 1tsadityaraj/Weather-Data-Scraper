# Restart Backend Server

## Steps to Restart

1. **Stop the current backend server:**
   - Find the terminal where backend is running
   - Press `Ctrl+C` to stop it

2. **Restart the backend:**
   ```bash
   cd /Users/aditya/weather/backend
   source venv/bin/activate
   python run.py
   ```

3. **You should see:**
   - `⚠️  MongoDB not available - data will not be saved to database` (if MongoDB not connected)
   - `INFO:     Uvicorn running on http://0.0.0.0:8000`
   - The API will still work, just without database storage

## Test the API

After restarting, test with:
```bash
curl "http://localhost:8000/api/weather?city=Delhi"
```

## Fix MongoDB Later

The app works without MongoDB! To fix MongoDB later:

1. Run the test script:
   ```bash
   cd /Users/aditya/weather/backend
   source venv/bin/activate
   python test_mongodb.py
   ```

2. Follow the instructions in `MONGODB_TROUBLESHOOTING.md`

3. Once MongoDB is fixed, restart the backend again

