# Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Module Not Found Errors

#### Problem: Missing dotenv module

```
Error: Cannot find module 'dotenv'
Require stack:
- D:\GitHub\AlmstkshfManager\AlmstkshfManager\functions\set-env.js
```

**Solution:**

Install the dotenv package in the functions directory:

```bash
cd functions
npm install dotenv --save
```

The updated set-env.js script now includes auto-installation of dotenv if it's missing.

### 2. ES Module vs CommonJS Issues

#### Problem: require() not defined in ES module

```
ReferenceError: require is not defined in ES module scope, you can use import instead
This file is being treated as an ES module because it has a '.js' file extension and 'package.json' contains "type": "module".
```

**Solution:**

Use the CommonJS version of the deployment script:

```bash
npm run deploy
```

The package.json has been updated to use deploy.cjs instead of deploy.js.

### 3. TypeScript Build Errors

#### Problem: Output file has not been built from source file

```
error TS6305: Output file 'vite.config.d.ts' has not been built from source file 'vite.config.ts'.
```

**Solution:**

The tsconfig.json has been updated to exclude vite.config.ts from the main configuration since it's already included in tsconfig.node.json.

### 4. Firebase Deployment Issues

#### Problem: Firebase Functions deployment fails

**Solution:**

Try deploying functions and hosting separately:

```bash
npm run deploy:functions
npm run deploy:hosting
```

### 5. Environment Variables Issues

#### Problem: Environment variables not available in Firebase Functions

**Solution:**

1. Make sure your .env file exists in the functions directory
2. Run the set-env script manually:

```bash
cd functions
node set-env.js
```

3. Verify the environment variables are set in Firebase:

```bash
firebase functions:config:get
```

## Advanced Troubleshooting

### Debugging Firebase Functions Locally

To test Firebase Functions locally before deployment:

```bash
cd functions
npm run serve
```

### Checking Firebase Logs

To view logs for deployed Firebase Functions:

```bash
firebase functions:log
```

### Clearing Firebase Cache

If you're experiencing persistent issues, try clearing the Firebase cache:

```bash
firebase logout
firebase login
```

### Reinstalling Dependencies

If you're experiencing dependency-related issues:

```bash
rm -rf node_modules
rm -rf functions/node_modules
npm install
cd functions && npm install
```

On Windows, use `rmdir /s /q node_modules` instead of `rm -rf node_modules`.