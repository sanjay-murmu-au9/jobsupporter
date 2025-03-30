import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { IUser, IUserResponse } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';

export const signIn = async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Validate input
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        // Check if user already exists
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (!userSnapshot.empty) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user object
        const userData: IUser = {
            email,
            password: hashedPassword,
            name,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Save user to Firestore
        const docRef = await usersRef.add(userData);

        // Generate JWT token
        const token = generateToken(docRef.id);

        // Create response object (excluding password)
        const userResponse: IUserResponse = {
            id: docRef.id,
            email: userData.email,
            name: userData.name,
            createdAt: userData.createdAt || new Date(),
            updatedAt: userData.updatedAt || new Date()
        };

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 