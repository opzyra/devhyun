import knex from "./db";
import { debugLogger, errorLogger } from "./logger";

export const rtfn = fn => {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
};

export const txfn = fn => {
  return async function() {
    const conn = await knex.transaction();
    debugLogger.info("DATABASE TRANSACTION START");

    fn(conn)
      .then(async () => {
        await conn.commit();
        debugLogger.info("DATABASE COMMIT");
      })
      .catch(async error => {
        await conn.rollback();
        debugLogger.info("DATABASE ROLBACK");
        errorLogger.error(error.stack);
      })
      .finally(async () => {
        debugLogger.info("DATABASE CONNECTION RELEASE");
      });
  };
};

export const txrtfn = fn => {
  return async function(req, res, next) {
    const conn = await knex.transaction();
    debugLogger.info("DATABASE TRANSACTION START");

    fn(req, res, next, conn)
      .then(async () => {
        await conn.commit();
        debugLogger.info("DATABASE COMMIT");
      })
      .catch(async error => {
        await conn.rollback();
        debugLogger.info("DATABASE ROLBACK");
        next(error);
      })
      .finally(async () => {
        debugLogger.info("DATABASE CONNECTION RELEASE");
      });
  };
};
