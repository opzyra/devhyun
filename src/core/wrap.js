import db from '../db';
import { debugLogger, errorLogger } from './logger';

const base = fn => {
  return function(req, res, next) {
    fn(req, res, next).catch(next);
  };
};

const query = fn => {
  return async function(req, res, next) {
    // DB 커넥션 취득
    let conn;
    try {
      conn = await db.conn();
      debugLogger.info('DATABASE CONNECTION CREATE');

      await conn.beginTransaction();
      debugLogger.info('DATABASE TRANSACTION START');
    } catch (error) {
      next(error);
      return;
    }

    // 쿼리 실행
    let mapper = async (table, id, params) => {
      return await db.query(conn, table, id, params);
    };

    // 라우터 처리
    fn(req, res, next, mapper)
      .then(async () => {
        await conn.commit();
        debugLogger.info('DATABASE COMMIT');
      })
      .catch(async error => {
        await conn.rollback();
        debugLogger.info('DATABASE ROLBACK');
        next(error);
      })
      .finally(() => {
        conn.release();
        debugLogger.info('DATABASE CONNECTION RELEASE');
      });
  };
};

const batch = fn => {
  return async function() {
    // DB 커넥션 취득
    let conn;
    try {
      conn = await db.conn();
      debugLogger.info('DATABASE CONNECTION CREATE');

      await conn.beginTransaction();
      debugLogger.info('DATABASE TRANSACTION START');
    } catch (error) {
      throw new Error(error);
    }
    // 라우터 처리
    fn(conn)
      .then(async () => {
        await conn.commit();
        debugLogger.info('DATABASE COMMIT');
      })
      .catch(async error => {
        await conn.rollback();
        debugLogger.info('DATABASE ROLBACK');
        errorLogger.error(error.stack);
      })
      .finally(() => {
        conn.release();
        debugLogger.info('DATABASE CONNECTION RELEASE');
      });
  };
};

export default { base, query, batch };
