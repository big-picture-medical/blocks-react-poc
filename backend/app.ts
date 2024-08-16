import express from 'express';
import blockRouter from './routes/block.route';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());
app.use('/blocks', blockRouter);
export default app;
