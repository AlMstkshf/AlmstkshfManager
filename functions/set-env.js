const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Check if API_KEY is set
if (!process.env.API_KEY) {
  console.error('Error: API_KEY environment variable is not set.');
  console.error('Please create a .env file in the functions directory with API_KEY=your_gemini_api_key');
  process.exit(1);
}

// Set environment variables in Firebase Functions
const setEnvCommand = `firebase functions:config:set gemini.api_key="${process.env.API_KEY}"`;

const { execSync } = require('child_process');

try {
  console.log('Setting environment variables in Firebase Functions...');
  execSync(setEnvCommand, { stdio: 'inherit' });
  console.log('Environment variables set successfully!');
} catch (error) {
  console.error('Error setting environment variables:', error.message);
  process.exit(1);
}