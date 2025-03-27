import express from 'express';
import { config } from 'dotenv';
import { initializeRedis } from './config/redis.config';
import { initializeFirebase } from './config/firebase.config';
import healthRoutes from './routes/health.routes';

// Load environment variables
config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/health', healthRoutes);

// Initialize databases
const initializeDatabases = async () => {
    try {
        // Initialize Redis
        await initializeRedis();
        console.log('Connected to Redis');

        // Initialize Firebase
        await initializeFirebase();
        console.log('Connected to Firebase');

        // Start server only after databases are connected
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to initialize databases:', error);
        process.exit(1);
    }
};

// Start the application
initializeDatabases(); 