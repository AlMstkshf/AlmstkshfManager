const { execSync } = require('child_process');

const token = process.argv[2];

if (!token) {
  console.error('Firebase token not provided.');
  process.exit(1);
}

try {
  execSync(`firebase deploy --token "${token}"`, { stdio: 'inherit' });
} catch (error) {
  console.error('Deployment failed:', error.message);
  process.exit(1);
}
