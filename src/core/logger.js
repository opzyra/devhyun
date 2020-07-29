import winston from 'winston';
import moment from 'moment';
import 'winston-daily-rotate-file';

export const errorLogger = winston.createLogger({
  // 파일저장
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV == 'production' ? 'alert' : 'debug',
      format: winston.format.printf(
        info =>
          `${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/error/error.log',
      zippedArchive: true,
      format: winston.format.printf(
        info =>
          `${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
  ],
});

export const debugLogger = winston.createLogger({
  // 파일저장
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV == 'production' ? 'alert' : 'debug',
      format: winston.format.printf(
        info =>
          `${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
  ],
});

export const accessLogger = winston.createLogger({
  // 파일저장
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'logs/access/access.log',
      zippedArchive: true,
      format: winston.format.printf(
        info =>
          `${moment().format('YYYY, MM, DD, HH, mm, ss, SSS')}, ${
            info.message
          }`,
      ),
    }),
  ],
});

export const batchLogger = winston.createLogger({
  // 파일저장
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV == 'production' ? 'alert' : 'debug',
      format: winston.format.printf(
        info =>
          `${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'logs/batch/batch.log',
      zippedArchive: false,
      format: winston.format.printf(
        info =>
          `${moment().format(
            'YYYY-MM-DD HH:mm:ss.SSS',
          )} [${info.level.toUpperCase()}] - ${info.message}`,
      ),
    }),
  ],
});
