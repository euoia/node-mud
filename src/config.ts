import dotenv = require('dotenv');

dotenv.config();

const config = {
  app: {
    port: process.env.APP_PORT,
  },
  log: {
    level: process.env.LOG_LEVEL,
  },
};

export = config;
