require('dotenv').config();

const required = ['MONGODB_URI'];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`[config] Missing required env variable: ${key}`);
    process.exit(1);
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10) || 5000,
  mongoUri: process.env.MONGODB_URI,
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};
