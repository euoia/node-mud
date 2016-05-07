"use strict";
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    app: {
        port: process.env.APP_PORT,
    },
    log: {
        level: process.env.LOG_LEVEL,
    },
};
//# sourceMappingURL=config.js.map