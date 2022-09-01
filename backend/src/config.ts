import * as dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
});

export default {
  MONGO_URL:
    process.env.MONGO_URL ||
    'mongodb+srv://t3d:112234@cluster0.bzi8m.mongodb.net/neighbour?retryWrites=true&w=majority',
  APP_PORT: process.env.APP_PORT || '3001',
  VOICE_MODE: process.env.VOICE_MODE || 'default'
} as {
  MONGO_URL: string;
  APP_PORT: string;
  VOICE_MODE: 'default' | 'presentation';
};
