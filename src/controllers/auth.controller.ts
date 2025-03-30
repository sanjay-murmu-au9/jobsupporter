import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { IUser, IUserResponse } from '../interfaces/user.interface';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.utils';
import { Query, CollectionReference } from 'firebase-admin/firestore';

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
        const now = new Date();
        const userData: IUser = {
            email,
            password: hashedPassword,
            name,
            createdAt: now,
            updatedAt: now
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

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const usersRef = db.collection('users');
        const userSnapshot = await usersRef.where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Get user data
        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data() as IUser;

        // Verify password
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = generateToken(userDoc.id);

        // Create response object (excluding password)
        const userResponse: IUserResponse = {
            id: userDoc.id,
            email: userData.email,
            name: userData.name,
            createdAt: userData.createdAt || new Date(),
            updatedAt: userData.updatedAt || new Date()
        };

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userResponse,
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to login',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const listUsers = async (req: Request, res: Response) => {
    try {
        const {
            page = '1',
            limit = '10',
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const pageNumber = parseInt(page as string);
        const limitNumber = parseInt(limit as string);
        const skip = (pageNumber - 1) * limitNumber;

        // Get users collection reference
        const usersRef = db.collection('users') as CollectionReference;

        // Build query
        let query: Query = usersRef;

        // Apply search filter if provided
        if (search) {
            query = query.where('name', '>=', search)
                        .where('name', '<=', search + '\uf8ff');
        }

        // Apply sorting
        query = query.orderBy(sortBy as string, sortOrder as 'asc' | 'desc');

        // Apply pagination
        query = query.limit(limitNumber).offset(skip);

        // Execute query
        const snapshot = await query.get();

        // Get total count for pagination
        const totalSnapshot = await usersRef.count().get();
        const total = totalSnapshot.data().count;

        // Map documents to user response objects
        const users: IUserResponse[] = snapshot.docs.map(doc => {
            const userData = doc.data() as IUser;
            return {
                id: doc.id,
                email: userData.email,
                name: userData.name,
                createdAt: userData.createdAt || new Date(),
                updatedAt: userData.updatedAt || new Date()
            };
        });

        res.status(200).json({
            success: true,
            message: 'Users retrieved successfully',
            data: {
                users,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber)
                }
            }
        });
    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve users',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 