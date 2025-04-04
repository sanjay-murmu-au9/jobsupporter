# Required GitHub Secrets

## EC2 Configuration
- `EC2_HOST`: Your EC2 instance's public IP (e.g., 65.0.107.5)
- `EC2_SSH_KEY`: The entire content of your jobsupport-key.pem file

## Application Configuration
- `NODE_ENV`: Set to 'production'
- `PORT`: Set to '3001'
- `JWT_SECRET`: Your JWT signing secret

## Firebase Configuration
- `FIREBASE_PROJECT_ID`: Your Firebase project ID
- `FIREBASE_PRIVATE_KEY`: Your Firebase private key (including the BEGIN and END markers)
- `FIREBASE_CLIENT_EMAIL`: Your Firebase client email

## Redis Configuration
- `REDIS_HOST`: Your Redis host (e.g., localhost)
- `REDIS_PORT`: Your Redis port (e.g., 6379)
- `REDIS_PASSWORD`: Your Redis password

## How to Add Secrets
1. Go to your GitHub repository
2. Click on "Settings"
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with its corresponding value

## Important Notes
- Keep these secrets secure and never commit them to the repository
- The EC2_SSH_KEY should include the entire content of the .pem file, including the BEGIN and END markers
- Make sure to use the correct format for each secret value 