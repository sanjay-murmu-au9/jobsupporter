import express from 'express';
import { config } from 'dotenv';
import { verifyFirebaseConnection } from './config/firebase.config';
import testRoutes from './routes/test.routes';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());

// Routes
app.use('/api', testRoutes);
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);

// Verify Firebase connection and start server
const startServer = async () => {
    try {
        // Verify Firebase connection
        await verifyFirebaseConnection();
        console.log('Firebase connection verified successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};


startServer(); 