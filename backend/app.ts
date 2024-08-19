import express from 'express';
import atlasRouter from './routes/atlas.route';
import compositionRouter from './routes/composition.route';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());
app.use('/', atlasRouter);
app.use('/compositions', compositionRouter);
export default app;
