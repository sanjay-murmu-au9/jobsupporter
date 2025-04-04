#!/bin/bash

# Create deploy directory
mkdir -p deploy

# Copy necessary files
cp -r dist deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp .env deploy/
cp ecosystem.config.js deploy/

# Create zip file
cd deploy
zip -r ../deploy.zip .
cd ..

# Clean up
rm -rf deploy

echo "Deployment package created successfully!" 