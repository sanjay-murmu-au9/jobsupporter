import { Request, Response } from 'express';
import { db } from '../config/firebase.config';
import { getStorage } from 'firebase-admin/storage';

const firebaseStorage = getStorage();

export const createCampaignDetails = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, country, city, education, employmentStatus, skills, experience, resume, agreeToTerms } = req.body;

        if (!firstName || !lastName || !email || !phone || !country || !education || !employmentStatus || !agreeToTerms) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format' 
            });
        }

        // Validate phone number
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid phone number format'
            });
        }

        // Validate country
        const allowedCountries = ['us', 'ca', 'uk', 'au', 'in', 'other'];
        if (!allowedCountries.includes(country)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid country'
            }); 
        }

        // Validate education
        const allowedEducations = ['high_school', 'associate', 'bachelor', 'master', 'doctorate', 'diploma', 'student', 'other'];
        if (!allowedEducations.includes(education)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid education'
            });
        }

        // Validate employment status
        const allowedEmploymentStatuses = ['unemployed', 'laid_off', 'underemployed', 'student', 'graduate', 'employed', 'other'];
        if (!allowedEmploymentStatuses.includes(employmentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid employment status'
            });
        }

        // Validate skills
        if (skills && skills.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Skills must be less than 500 characters'      
            });
        }

        // Validate experience
        if (experience && experience.length > 1000) {
            return res.status(400).json({
                success: false,
                message: 'Experience must be less than 1000 characters'
            });
        }
        
        // check if user already exists
        const existingUser = await db.collection('campaigns')
            .where('email', '==', email)
            .limit(1)
            .get();

        if (!existingUser.empty) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Save campaign details to Firestore
        const campaignRef = db.collection('campaigns').doc();
        await campaignRef.set({
            firstName,
            lastName,
            email,
            phone,
            country,
            city,
            education,
            employmentStatus,
            skills,
            experience,
            resume,//resume ? await uploadFile(resume) : null,
            agreeToTerms,
            createdAt: new Date()
        }); 

        return res.status(200).json({
            success: true,
            message: 'Campaign details saved successfully',
            campaignId: campaignRef.id
        });

    } catch (error) {
        console.error('Error saving campaign details:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to save campaign details'
        });
    }
}
