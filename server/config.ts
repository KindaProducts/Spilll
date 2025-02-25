import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3001,
  database: {
    url: process.env.DATABASE_URL,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL,
    welcomeTemplateId: process.env.SENDGRID_WELCOME_TEMPLATE_ID,
  },
  presets: {
    downloadUrl: process.env.FREE_PRESET_DOWNLOAD_URL,
  },
  nodeEnv: process.env.NODE_ENV || 'development',
}; 