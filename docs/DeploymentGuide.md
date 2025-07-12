# Firebase Deployment Guide

## Prerequisites

1. Firebase CLI installed globally
   ```
   npm install -g firebase-tools
   ```

2. Firebase account and project created

3. Logged in to Firebase CLI
   ```
   firebase login
   ```

4. Project configured with Firebase
   ```
   firebase use --add
   ```

## Environment Variables Setup

### Client-side Environment Variables

1. Create a `.env.local` file in the root directory with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

### Cloud Functions Environment Variables

1. Create a `.env` file in the `functions` directory with your Gemini API key:
   ```
   API_KEY=your_gemini_api_key
   ```

2. Set the environment variables in Firebase Functions config:
   ```
   cd functions
   npm run set-env
   ```

## Deployment

### Full Deployment (Recommended)

To deploy both hosting and functions in one command:

```
npm run deploy
```

This script will:
1. Install dependencies for both the client and functions
2. Build the client application
3. Set environment variables in Firebase Functions
4. Deploy everything to Firebase

### Partial Deployment

To deploy only Cloud Functions:

```
npm run deploy:functions
```

To deploy only hosting:

```
npm run deploy:hosting
```

## Verifying Deployment

1. Check the Firebase console to verify that your deployment was successful
2. Visit your Firebase hosting URL to see the deployed application
3. Test the Cloud Functions by using the application features that rely on them

## Troubleshooting

### Missing Environment Variables

If you encounter errors related to missing environment variables:

1. Verify that your `.env.local` and `functions/.env` files exist and contain the correct values
2. Run the set-env script manually:
   ```
   cd functions
   npm run set-env
   ```
3. Check the Firebase Functions logs for any errors:
   ```
   firebase functions:log
   ```

### Deployment Failures

If deployment fails:

1. Check the error messages in the console
2. Verify that you have the correct permissions for the Firebase project
3. Try deploying hosting and functions separately to isolate the issue

## Security Considerations

1. Never commit `.env` or `.env.local` files to version control
2. Regularly rotate your API keys for security
3. Use Firebase Security Rules to protect your data
4. Set up proper authentication for your Cloud Functions