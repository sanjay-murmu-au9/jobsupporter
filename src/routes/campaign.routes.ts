import { Router } from 'express';
import { createCampaignDetails } from '../controllers/campaigndetails';

const router = Router();

router.post('/', createCampaignDetails);

export default router;
