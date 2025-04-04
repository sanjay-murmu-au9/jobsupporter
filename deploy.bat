@echo off
echo Building application...
call npm run build

echo Creating deployment package...
if exist deploy rmdir /s /q deploy
mkdir deploy

echo Copying files...
xcopy /s /y dist deploy\dist
copy package.json deploy\
copy package-lock.json deploy\
copy .env deploy\
copy ecosystem.config.js deploy\

echo Creating zip file...
powershell Compress-Archive -Path deploy\* -DestinationPath deploy.zip -Force

echo Cleaning up...
rmdir /s /q deploy

echo Uploading to EC2...
"C:\Program Files\PuTTY\pscp.exe" -i "C:\Users\Sanjay Murmu\OneDrive\Desktop\pem\jobsupport-key.pem" deploy.zip ubuntu@65.0.107.5:~/jobsupport/

echo Deployment package uploaded successfully!
echo To complete deployment, connect to EC2 and run:
echo ssh -i "C:\Users\Sanjay Murmu\OneDrive\Desktop\pem\jobsupport-key.pem" ubuntu@65.0.107.5
echo cd ~/jobsupport
echo unzip deploy.zip
echo npm install --production
echo pm2 restart ecosystem.config.js 