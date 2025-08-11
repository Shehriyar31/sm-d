# Social Media Downloader

Download videos and reels from Instagram, YouTube, and Facebook using RapidAPI.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure RapidAPI**
   - Open `src/services/apiService.js`
   - Replace the following placeholders with your actual RapidAPI details:
     - `YOUR_RAPIDAPI_KEY` - Your RapidAPI key
     - `YOUR_INSTAGRAM_API_ENDPOINT` - Instagram API endpoint URL
     - `YOUR_INSTAGRAM_API_HOST` - Instagram API host
     - `YOUR_YOUTUBE_API_ENDPOINT` - YouTube API endpoint URL
     - `YOUR_YOUTUBE_API_HOST` - YouTube API host
     - `YOUR_FACEBOOK_API_ENDPOINT` - Facebook API endpoint URL
     - `YOUR_FACEBOOK_API_HOST` - Facebook API host

3. **Run the Application**
   ```bash
   npm run dev
   ```

## Features

- ✅ Support for Instagram, YouTube, and Facebook
- ✅ Clean and responsive UI
- ✅ Multiple download quality options
- ✅ Video thumbnail preview
- ✅ Error handling
- ✅ Mobile-friendly design

## How to Use

1. Select the platform (Instagram/YouTube/Facebook)
2. Paste the video URL
3. Click "Download" button
4. Choose your preferred quality and download

## API Integration

The app is designed to work with any RapidAPI endpoints. Just update the configuration in `apiService.js` with your API details.

## Tech Stack

- React 18
- Vite
- CSS3
- RapidAPI Integration