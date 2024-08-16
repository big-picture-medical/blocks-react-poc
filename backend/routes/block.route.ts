import express from 'express';
import { all } from '../controllers/block.controller';

const router = express.Router();
router.get('/', all);

export default router;
