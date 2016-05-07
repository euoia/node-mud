"use strict";
var dotenv = require('dotenv');
dotenv.config();
var config = {
    app: {
        port: process.env.APP_PORT,
    },
    log: {
        level: process.env.LOG_LEVEL,
    },
};
module.exports = config;
//# sourceMappingURL=config.js.map