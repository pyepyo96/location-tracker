require('dotenv').config(); // Load environment variables from .env
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios'); // For making API requests
const cors = require('cors');

const app = express();
const PORT = 3000;

// Load Google API Key from .env file
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

if (!GOOGLE_API_KEY) {
  console.error('Google API Key is missing. Ensure it is set in the .env file.');
  process.exit(1); // Exit if API key is not found
}

// Middleware
app.use(cors({ origin: '*' })); // Allow all origins (update for specific domains in production)
app.use(bodyParser.json()); // Parse JSON body

// Submit endpoint
app.post('/submit', async (req, res) => {
  try {
    const { name, phone, load, message, latitude, longitude } = req.body;

    if (!name || !phone || !load || !message || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Log the incoming data
    console.log('New Submission:', req.body);

    // Fetch address from Google Geocoding API
    const geocodeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );

    if (geocodeResponse.data.status !== 'OK') {
      throw new Error('Failed to fetch address from Google API.');
    }

    const address = geocodeResponse.data.results[0].formatted_address;

    // Log the fetched address
    console.log('Address Fetched:', address);

    // Respond back with success and the address
    res.json({ message: 'Data received successfully!', address });
  } catch (error) {
    console.error('Error in /submit endpoint:', error.message);
    res.status(500).json({ message: 'Failed to process the request.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
