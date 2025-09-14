import 'dotenv/config';

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 4000),
  BASE_URL: process.env.BASE_URL || 'http://localhost:4000',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_PATH: process.env.GOOGLE_REDIRECT_PATH || '/auth/google/callback',
  GOOGLE_SCOPES: (process.env.GOOGLE_SCOPES || 'https://www.googleapis.com/auth/drive.readonly').split(','),
  DRIVE_FOLDER_ID: process.env.DRIVE_FOLDER_ID || '',
  LOCAL_DATA_DIR: process.env.LOCAL_DATA_DIR || '../web/public/data',
  LOCAL_GLOB: process.env.LOCAL_GLOB || '*.json',
  // Optional integrations
  SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || '',
  SLACK_DEFAULT_CHANNEL: process.env.SLACK_DEFAULT_CHANNEL || '',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || '',
  EMAIL_TO_DEFAULT: process.env.EMAIL_TO_DEFAULT || '',
};

export function requireEnv(name: keyof typeof env) {
  const val = env[name];
  if (!val) throw new Error(`Missing env ${name}`);
  return val;
}
