import express from 'express';
import { analyzeTeaRecommendation } from '../controllers/analysis.js';

export const apiRouter = express.Router();

// Health check route
apiRouter.get('/status', (req, res) => {
  res.status(200).json({ status: 'API is operational' });
});

// Analysis route for tea recommendations
apiRouter.post('/analyze', analyzeTeaRecommendation);