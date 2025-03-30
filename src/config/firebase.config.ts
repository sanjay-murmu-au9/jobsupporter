import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { config } from 'dotenv';
import * as path from 'path';

config();

class FirebaseService {
    private static instance: FirebaseService;
    private app: admin.app.App;

    private constructor() {
        try {
            // Check if an app is already initialized
            if (getApps().length === 0) {
                const serviceAccountPath = path.join(__dirname, 'credentials', 'firebase-service-account.json');
                
                // Initialize the app with the new service account
                this.app = admin.initializeApp({
                    credential: admin.credential.cert(serviceAccountPath),
                    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
                });

                console.log('Firebase Admin SDK initialized successfully');
            } else {
                this.app = admin.app();
                console.log('Using existing Firebase Admin SDK instance');
            }
        } catch (error) {
            console.error('Error initializing Firebase Admin SDK:', error);
            throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static getInstance(): FirebaseService {
        if (!FirebaseService.instance) {
            FirebaseService.instance = new FirebaseService();
        }
        return FirebaseService.instance;
    }

    public getFirestore(): admin.firestore.Firestore {
        return this.app.firestore();
    }

    public async verifyConnection(): Promise<boolean> {
        try {
            // Test Firestore connection
            const db = this.getFirestore();
            await db.listCollections();
            console.log('Firebase Firestore connection verified successfully');
            return true;
        } catch (error) {
            console.error('Firebase connection verification failed:', error);
            throw new Error(`Failed to verify Firebase connection: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
}

// Export a singleton instance
const firebaseService = FirebaseService.getInstance();

// Export Firestore instance
export const db = firebaseService.getFirestore();
export const verifyFirebaseConnection = () => firebaseService.verifyConnection();

export default firebaseService; 