import knex from 'knex';
import logger from '../lib/logger';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
  log: {
    debug(message) {
      if (process.env != 'production') {
        message.sql && logger.info(`DATABASE SQL - ${message.sql}`);
        message.bindings &&
          logger.info(`DATABASE PARAMS - {${message.bindings}}`);
      }
    },
  },
  debug: process.env != 'production' ? true : false,
});

const initialize = async () => {};

initialize();

export default db;
