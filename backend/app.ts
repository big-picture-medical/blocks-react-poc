import express from 'express';
import blockTemplateRouter from './routes/block-template.route';
import blockConfigurationRouter from './routes/block-configuration.route';
import cors from 'cors';

const app = express();
app.use(cors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE' }));
app.use(express.json());
app.use('/block-configurations', blockConfigurationRouter);
app.use('/block-templates', blockTemplateRouter);
export default app;
