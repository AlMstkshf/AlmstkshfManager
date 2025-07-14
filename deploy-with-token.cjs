const { execSync } = require('child_process');

const token = process.env.FIREBASE_TOKEN;

if (!token) {
  console.error('Firebase token not provided. Set the FIREBASE_TOKEN environment variable.');
  process.exit(1);
}

try {
  execSync(`firebase deploy --token "${token}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
