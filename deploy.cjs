const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env.local') });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

// Helper function to execute commands and log output
function runCommand(command, message) {
  console.log(`${colors.bright}${colors.cyan}${message}${colors.reset}`);
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    return false;
  }
}

const rootDir = path.resolve(__dirname);
const functionsEnvPath = path.join(rootDir, 'functions', '.env');

// Check if functions/.env exists
if (!fs.existsSync(functionsEnvPath)) {
  console.error(`${colors.red}Error: functions/.env file not found.${colors.reset}`);
  console.error(`Please create a .env file in the functions directory with your Gemini API key.`);
  process.exit(1);
}

// Main deployment process
async function deploy() {
  console.log(`${colors.bright}${colors.green}Starting deployment process...${colors.reset}`);
  
  // Install dependencies if needed
  if (!runCommand('npm install', 'Installing dependencies...')) {
    process.exit(1);
  }
  
  // Install functions dependencies
  if (!runCommand('npm install --prefix functions', 'Installing Cloud Functions dependencies...')) {
    process.exit(1);
  }
  
  // Build the application
  if (!runCommand('npm run build', 'Building the application...')) {
    process.exit(1);
  }
  
  // Deploy to Firebase
  const firebaseToken = process.env.FIREBASE_TOKEN;
  if (!firebaseToken) {
    console.error(`${colors.red}Error: FIREBASE_TOKEN not found in .env.local.${colors.reset}`);
    process.exit(1);
  }

  if (!runCommand(`firebase deploy --token "${firebaseToken}"`, 'Deploying to Firebase...')) {
    process.exit(1);
  }
  
  console.log(`${colors.bright}${colors.green}Deployment completed successfully!${colors.reset}`);
}

// Run the deployment
deploy().catch(error => {
  console.error(`${colors.red}Deployment failed: ${error.message}${colors.reset}`);
  process.exit(1);
});
