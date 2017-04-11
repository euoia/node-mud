import * as dotenv from 'dotenv';

dotenv.config();

export default {
  app: {
    port: process.env.APP_PORT,
    secret: process.env.APP_SECRET,
  },
  log: {
    level: process.env.LOG_LEVEL,
  },
  mongo: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
  },
};
