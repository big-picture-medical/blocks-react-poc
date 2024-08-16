import express from 'express';
import blockRouter from './routes/block.route';

const app = express();
app
  .use(express.json())
  .use('/blocks', blockRouter);

export default app;
