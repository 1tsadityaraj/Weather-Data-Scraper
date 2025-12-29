# Google Maps API Setup (Optional - for Better Location Accuracy)

## Why Use Google Maps API?

Google Maps Geocoding API provides the most accurate location results, typically within 10-50 meters of your actual location, compared to free services which may be 1-10 km away.

## Setup Instructions

### Step 1: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Geocoding API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Geocoding API"
   - Click "Enable"

### Step 2: Create API Key

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy your API key
4. (Recommended) Restrict the API key:
   - Click on the API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Geocoding API"
   - Under "Application restrictions", you can restrict by HTTP referrer

### Step 3: Add API Key to Frontend

1. Create a `.env` file in the `frontend` directory:
   ```bash
   cd frontend
   touch .env
   ```

2. Add your API key:
   ```env
   VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. Restart the frontend server:
   ```bash
   npm run dev
   ```

## Pricing

- **Free Tier**: $200 credit per month (covers ~40,000 geocoding requests)
- **After Free Tier**: $5 per 1,000 requests
- For personal use, the free tier is usually sufficient

## Without Google Maps API

The app will still work using free geocoding services (OpenStreetMap, BigDataCloud), but accuracy may be lower (typically 1-10 km away from actual location).

## Testing

After adding the API key:
1. Restart the frontend
2. Click "📍 Use My Location"
3. Check browser console - you should see "Found city: [City] (via Google Maps, accuracy: High)"
4. The location should be much more accurate!

