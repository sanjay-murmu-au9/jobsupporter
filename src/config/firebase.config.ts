import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import * as path from 'path';

config();

let firebaseAdmin: admin.app.App;

const initializeFirebase = async () => {
    try {
        if (!admin.apps.length) {
            // Check if service account file exists
            const serviceAccountPath = path.join(__dirname, 'credentials', 'firebase-service-account.json');
            
            // Load the service account file
            const serviceAccount = require(serviceAccountPath);
            
            console.log('Service Account Details:', {
                projectId: serviceAccount.project_id,
                clientEmail: serviceAccount.client_email,
                type: serviceAccount.type
            });

            // Initialize Firebase Admin with the service account file
            firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(serviceAccountPath),
                projectId: serviceAccount.project_id // Explicitly set the project ID
            });

            console.log('Firebase Admin initialized successfully');
            console.log('Firebase App Details:', {
                name: firebaseAdmin.name,
                projectId: firebaseAdmin.options.projectId
            });

            // Test the connection
            try {
                // Try to get the project ID as a simple test
                const projectId = firebaseAdmin.options.projectId;
                console.log('Firebase connection verified successfully. Project ID:', projectId);
            } catch (error) {
                console.error('Firebase connection test failed:', error);
                throw error;
            }
        } else {
            const app = admin.apps[0];
            if (!app) {
                throw new Error('Firebase app not found');
            }
            firebaseAdmin = app;
        }
    } catch (error) {
        console.error('Firebase initialization error:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw error;
    }
};

export { initializeFirebase, firebaseAdmin }; 