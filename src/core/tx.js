import knex from './db';
import logger from '../lib/logger';

export const rtfn = fn => {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
};

export const txfn = fn => {
  return async function() {
    const conn = await knex.transaction();
    logger.info('DATABASE TRANSACTION START');

    fn(conn)
      .then(async () => {
        await conn.commit();
        logger.info('DATABASE COMMIT');
      })
      .catch(async error => {
        await conn.rollback();
        logger.info('DATABASE ROLBACK');
        logger.error(error.stack);
      })
      .finally(async () => {
        logger.info('DATABASE CONNECTION RELEASE');
      });
  };
};

export const txrtfn = fn => {
  return async function(req, res, next) {
    const conn = await knex.transaction();
    logger.info('DATABASE TRANSACTION START');

    fn(req, res, next, conn)
      .then(async () => {
        await conn.commit();
        logger.info('DATABASE COMMIT');
      })
      .catch(async error => {
        await conn.rollback();
        logger.info('DATABASE ROLBACK');
        next(error);
      })
      .finally(async () => {
        logger.info('DATABASE CONNECTION RELEASE');
      });
  };
};
