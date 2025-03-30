import { Router } from 'express';
import { db } from '../config/firebase.config';

const router = Router();

// Test route to verify Firebase connection
router.get('/test', async (req, res) => {
    try {
        // Test Firestore
        const collections = await db.listCollections();
        
        res.json({
            success: true,
            message: 'Firebase Firestore connection is working',
            data: {
                collections: collections.map(col => col.id)
            }
        });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test Firebase connection',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 