import express from 'express';
import {
  createPatientInEhr,
  getBlockConfiguration,
  getBlockConfigurations,
  getTemplates
} from '../controllers/atlas.controller';

const router = express.Router();
router.get('/block-templates', getTemplates);
router.post('/block-configurations', getBlockConfigurations);
router.post('/create-ehr', createPatientInEhr);
router.post('/blocks', getBlockConfiguration);

export default router;
