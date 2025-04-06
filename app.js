import api from './api/index.js';
import express from 'express';

const app = express();

app.use(express.json());
app.use('/api/v1', api);

export default app;
