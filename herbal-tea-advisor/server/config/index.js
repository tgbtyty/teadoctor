import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  openAiApiKey: process.env.OPENAI_API_KEY,
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  allowedOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'],
  // Add any other configuration variables here
};