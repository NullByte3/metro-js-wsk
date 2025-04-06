import express from 'express';
import cors from 'cors';
import api from './api/index.js';
import { notFoundHandler, errorHandler } from './middlewares.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', api);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
