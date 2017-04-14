import * as winston from 'winston';
import config from './config';

function zeroPad(num: number, len: number) {
  return ('0'.repeat(len) + num.toString()).slice(0 - len);
}

export default new (winston.Logger)({
  level: config.log.level,
  transports: [
    new (winston.transports.Console)({
      formatter: function(options:any) {
        // Log metadata as stringified objects.
        const extra = Object.keys(options.meta).length > 0 ?
          ` ${JSON.stringify(options.meta)}` : ``;

        return `${options.timestamp()} - ${options.level.toUpperCase()}: ${options.message}${extra}`;
      },
      timestamp: function() {
        const d = new Date();
        const year = d.getUTCFullYear();
        const month = zeroPad(d.getUTCMonth(), 2);
        const day = zeroPad(d.getUTCDay(), 2);
        const hours = zeroPad(d.getUTCHours(), 2);
        const minutes = zeroPad(d.getUTCMinutes(), 2);
        const seconds = zeroPad(d.getUTCSeconds(), 2);
        const milliseconds = zeroPad(d.getUTCMilliseconds(), 3);

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
      },
    }),
  ],
});
