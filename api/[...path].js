import express from 'express';
import app from '../server/index.js';

const vercelApp = express();
vercelApp.use(app);

export default vercelApp;