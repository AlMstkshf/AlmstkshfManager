const fs = require('fs');
const path = require('path');

// Try to load dotenv, but handle the case when it's not installed
let dotenv;
try {
  dotenv = require('dotenv');
  // Load environment variables from .env file
  dotenv.config();
} catch (error) {
  console.error('Error loading dotenv module. Installing it now...');
  const { execSync } = require('child_process');
  try {
    execSync('npm install dotenv --save', { stdio: 'inherit' });
    console.log('dotenv installed successfully. Loading it now...');
    dotenv = require('dotenv');
    dotenv.config();
  } catch (installError) {
    console.error('Failed to install dotenv:', installError.message);
    // Try to load API_KEY from .env file manually if dotenv is not available
    try {
      const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
      const apiKeyMatch = envContent.match(/API_KEY=(.+)/);
      if (apiKeyMatch && apiKeyMatch[1]) {
        process.env.API_KEY = apiKeyMatch[1];
        console.log('API_KEY loaded manually from .env file');
      }
    } catch (readError) {
      console.error('Failed to read .env file manually:', readError.message);
    }
  }
}

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