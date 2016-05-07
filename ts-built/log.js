"use strict";
var config = require('./config');
var winston = require('winston');
var repeat = require('repeat-string');
function zeroPad(num, len) {
    return (repeat('0', len) + num.toString()).slice(0 - len);
}
module.exports = new (winston.Logger)({
    level: config.log.level,
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                var d = new Date();
                var year = d.getUTCFullYear();
                var month = zeroPad(d.getUTCMonth(), 2);
                var day = zeroPad(d.getUTCDay(), 2);
                var hours = zeroPad(d.getUTCHours(), 2);
                var minutes = zeroPad(d.getUTCMinutes(), 2);
                var seconds = zeroPad(d.getUTCSeconds(), 2);
                var milliseconds = zeroPad(d.getUTCMilliseconds(), 3);
                return year + "-" + month + "-" + day + "T" + hours + ":" + minutes + ":" + seconds + "." + milliseconds + "Z";
            },
            formatter: function (options) {
                // Log metadata as stringified objects.
                var extra = Object.keys(options.meta).length > 0 ?
                    " " + JSON.stringify(options.meta) : "";
                return options.timestamp() + " - " + options.level.toUpperCase() + ": " + options.message + extra;
            }
        })
    ]
});
//# sourceMappingURL=log.js.map