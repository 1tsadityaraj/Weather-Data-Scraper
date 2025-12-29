# MongoDB Atlas Authentication Troubleshooting

## Current Issue: Authentication Failed

If you're seeing `bad auth : authentication failed`, check the following:

### 1. Verify Database User Credentials

1. Go to MongoDB Atlas Dashboard: https://cloud.mongodb.com
2. Navigate to **Database Access** (left sidebar)
3. Find your user: `ar9983239_db_user`
4. Click **Edit** and verify:
   - Username is correct
   - Password matches what's in your `.env` file
   - User has **Atlas admin** or **Read and write to any database** privileges

### 2. Reset Database Password (if needed)

1. Go to **Database Access**
2. Click **Edit** on your user
3. Click **Edit Password**
4. Set a new password
5. Update `backend/.env` file with the new password

### 3. Check Network Access

1. Go to **Network Access** (left sidebar)
2. Ensure your IP address is allowed, OR
3. Click **Add IP Address** → **Allow Access from Anywhere** (for development)

### 4. Verify Connection String Format

Your connection string should look like:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.i7cz041.mongodb.net/weather_db?retryWrites=true&w=majority
```

**Important:**
- Replace `USERNAME` with your actual username
- Replace `PASSWORD` with your actual password
- If password contains special characters, URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `%` becomes `%25`
  - etc.

### 5. Test Connection Manually

You can test the connection using MongoDB Compass or mongo shell:

**Using MongoDB Compass:**
1. Download: https://www.mongodb.com/try/download/compass
2. Paste your connection string
3. Click Connect

**Using Python:**
```python
from pymongo import MongoClient
client = MongoClient("mongodb+srv://ar9983239_db_user:YOUR_PASSWORD@cluster0.i7cz041.mongodb.net/weather_db?retryWrites=true&w=majority", tlsAllowInvalidCertificates=True)
client.admin.command('ping')
print("Connected!")
```

### 6. Common Issues

**Issue: Password contains special characters**
- Solution: URL-encode special characters in the password

**Issue: User doesn't have permissions**
- Solution: Grant "Atlas admin" or "Read and write to any database" role

**Issue: IP not whitelisted**
- Solution: Add your IP or use "Allow Access from Anywhere"

**Issue: Cluster is paused**
- Solution: Resume cluster in MongoDB Atlas dashboard

### Quick Fix: Create New Database User

1. Go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Create username: `weather_user`
4. Create password: `YourSecurePassword123`
5. Set privileges: **Atlas admin**
6. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://weather_user:YourSecurePassword123@cluster0.i7cz041.mongodb.net/weather_db?retryWrites=true&w=majority
   ```

