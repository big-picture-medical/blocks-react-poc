import express from 'express';
import { all } from '../controllers/block-configuration.controller';

const router = express.Router();
router.post('/', all);

export default router;
