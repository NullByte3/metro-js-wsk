import express from 'express';
import cors from 'cors';
import api from './api/index.js';
import { notFoundHandler, errorHandler } from './middlewares.js';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static('uploads'));

app.use('/api/v1', api);
app.use(notFoundHandler);
app.use(errorHandler);

app.use('/public', express.static(path.join(__dirname, 'public')));

export default app;
