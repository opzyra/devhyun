import winston from 'winston';
import moment from 'moment';
import 'winston-daily-rotate-file';

const errorLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'error',
      format: winston.format.printf(
        info =>
          `${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} [ERROR]: ${
            info.message
          }`,
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error/error.log',
      zippedArchive: true,
      format: winston.format.printf(
        info =>
          `${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} [ERROR]: ${
            info.message
          }`,
      ),
    }),
  ],
});

const infoLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.printf(info => `${info.message}`),
      ),
    }),
  ],
});

const debugLogger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'debug' : 'info',
      format: winston.format.printf(
        info =>
          `${moment().format('YYYY-MM-DD HH:mm:ss.SSS')} [DEBUG]: ${
            info.message
          }`,
      ),
    }),
  ],
});

const logger = {
  error: (message, e) => {
    errorLogger.error(`${message}\r\n${e}`);
  },
  debug: message => {
    debugLogger.debug(message);
  },
  info: message => {
    infoLogger.info(message);
  },
};

export default logger;
