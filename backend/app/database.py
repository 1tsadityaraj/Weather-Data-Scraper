"""
MongoDB database connection and configuration
"""
from pymongo import MongoClient
from pymongo.database import Database
import os
import ssl
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection settings
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "weather_db")

# Global MongoDB client
client: MongoClient = None
db: Database = None

def connect_db():
    """Initialize MongoDB connection"""
    global client, db
    try:
        # For MongoDB Atlas (mongodb+srv://), TLS is automatically enabled
        # Add tlsAllowInvalidCertificates for development to bypass SSL cert issues
        if "mongodb+srv://" in MONGODB_URI:
            client = MongoClient(
                MONGODB_URI,
                tlsAllowInvalidCertificates=True,  # For development only - bypasses SSL cert verification
                serverSelectionTimeoutMS=10000
            )
        else:
            # Local MongoDB connection
            client = MongoClient(MONGODB_URI)
        
        db = client[MONGODB_DB_NAME]
        # Test connection
        client.admin.command('ping')
        print(f"✓ Connected to MongoDB: {MONGODB_DB_NAME}")
        return db
    except Exception as e:
        error_msg = str(e)
        if "authentication failed" in error_msg.lower():
            print(f"✗ MongoDB authentication failed. Please check:")
            print(f"  1. Username and password in .env file")
            print(f"  2. Database user exists in MongoDB Atlas")
            print(f"  3. Database user has proper permissions")
            print(f"  4. Network Access allows your IP address")
        else:
            print(f"✗ MongoDB connection error: {error_msg}")
        raise

def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("✓ MongoDB connection closed")

def get_db():
    """Get database instance"""
    global db
    if db is None:
        connect_db()
    return db

