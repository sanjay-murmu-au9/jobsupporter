# GitHub Secrets Setup Guide

This guide will help you set up the necessary secrets for deploying your application to EC2 using GitHub Actions.

## Prerequisites

1. AWS EC2 instance running
2. Firebase project set up
3. Redis instance configured
4. GitHub repository with Actions enabled

## Step 1: Get Your EC2 Key Pair

1. Go to the AWS Console
2. Navigate to EC2 > Key Pairs
3. Create a new key pair named "jobsupport-key" if you haven't already
4. Download the .pem file
5. Create a directory named `pem` in your project root
6. Place the downloaded .pem file in the `pem` directory

## Step 2: Get Your Firebase Credentials

1. Go to the Firebase Console
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file securely
6. Extract the following values from the JSON:
   - `project_id` → FIREBASE_PROJECT_ID
   - `client_email` → FIREBASE_CLIENT_EMAIL
   - `private_key` → FIREBASE_PRIVATE_KEY

## Step 3: Generate Secure Secrets

Run the following command to generate secure secrets:
```bash
node .github/generate-secrets.js
```

This will generate:
- A secure JWT secret
- A secure Redis password

## Step 4: Update Your .env File

Update your `.env` file with the actual values:
- Replace placeholder Firebase credentials with your actual values
- Update the JWT_SECRET with the generated value
- Update the REDIS_PASSWORD with the generated value

## Step 5: Add GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| EC2_HOST | Your EC2 instance public IP (e.g., 65.0.107.5) |
| EC2_SSH_KEY | Content of your jobsupport-key.pem file |
| NODE_ENV | production |
| PORT | 3001 |
| JWT_SECRET | The generated JWT secret |
| FIREBASE_PROJECT_ID | Your Firebase project ID |
| FIREBASE_PRIVATE_KEY | Your Firebase private key (include the entire key with newlines) |
| FIREBASE_CLIENT_EMAIL | Your Firebase client email |
| REDIS_HOST | Your Redis host (e.g., localhost) |
| REDIS_PORT | Your Redis port (e.g., 6379) |
| REDIS_PASSWORD | The generated Redis password |

## Step 6: Test Your Deployment

1. Push your changes to the dev branch
2. Go to the "Actions" tab in your GitHub repository
3. Check if the deployment workflow runs successfully

## Troubleshooting

If you encounter issues:
1. Check the GitHub Actions logs for errors
2. Verify that all secrets are correctly set
3. Ensure your EC2 instance is running and accessible
4. Check that your security groups allow the necessary traffic 