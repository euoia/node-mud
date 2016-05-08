import dotenv = require('dotenv');

dotenv.config();

export = {
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
