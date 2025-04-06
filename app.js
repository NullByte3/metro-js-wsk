import api from './api/index.js';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use('/api/v1', api);
app.use('/public', express.static(path.join(__dirname, 'public')));

export default app;
