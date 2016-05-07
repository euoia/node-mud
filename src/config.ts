import dotenv = require('dotenv');

dotenv.config();

export = {
  app: {
    port: process.env.APP_PORT,
  },
  log: {
    level: process.env.LOG_LEVEL,
  },
};
