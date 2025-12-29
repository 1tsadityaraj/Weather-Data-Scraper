#!/usr/bin/env python3
"""
Test MongoDB Atlas connection
"""
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "weather_db")

print("=" * 60)
print("MongoDB Atlas Connection Test")
print("=" * 60)
print(f"\nConnection String: {MONGODB_URI.split('@')[0]}@***")
print(f"Database Name: {MONGODB_DB_NAME}\n")

try:
    print("Attempting to connect...")
    client = MongoClient(
        MONGODB_URI,
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=10000
    )
    
    # Test connection
    print("Testing connection...")
    result = client.admin.command('ping')
    print("✓ Connection successful!")
    print(f"  Ping result: {result}\n")
    
    # Try to access database
    db = client[MONGODB_DB_NAME]
    print(f"✓ Database '{MONGODB_DB_NAME}' accessible")
    
    # List collections
    collections = db.list_collection_names()
    print(f"  Collections: {collections if collections else 'None (empty database)'}\n")
    
    # Try a simple write operation
    print("Testing write operation...")
    test_collection = db.test_connection
    test_collection.insert_one({"test": "connection", "timestamp": "now"})
    print("✓ Write operation successful!")
    
    # Clean up
    test_collection.delete_one({"test": "connection"})
    print("✓ Test document cleaned up\n")
    
    print("=" * 60)
    print("SUCCESS: MongoDB Atlas connection is working!")
    print("=" * 60)
    
except Exception as e:
    print("\n" + "=" * 60)
    print("ERROR: Connection failed")
    print("=" * 60)
    print(f"\nError: {str(e)}\n")
    
    if "authentication failed" in str(e).lower():
        print("Possible issues:")
        print("1. Username or password is incorrect")
        print("2. Database user doesn't exist in MongoDB Atlas")
        print("3. Database user doesn't have proper permissions")
        print("\nTo fix:")
        print("1. Go to https://cloud.mongodb.com")
        print("2. Navigate to Database Access")
        print("3. Verify user 'ar9983239_db_user' exists")
        print("4. Check/reset the password")
        print("5. Ensure user has 'Atlas admin' privileges")
        print("6. Update backend/.env with correct password")
    elif "network" in str(e).lower() or "timeout" in str(e).lower():
        print("Possible issues:")
        print("1. Network Access not configured in MongoDB Atlas")
        print("2. Your IP address is not whitelisted")
        print("\nTo fix:")
        print("1. Go to MongoDB Atlas → Network Access")
        print("2. Click 'Add IP Address'")
        print("3. Click 'Allow Access from Anywhere' (for development)")
    else:
        print(f"Unexpected error: {e}")
    
    print("\n" + "=" * 60)

