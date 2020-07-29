import mybatis from 'mybatis-mapper';
import mysql from 'mysql2/promise';
import fs from 'fs';

import { debugLogger } from '../core/logger';
import CONFIG from '../config';

const pool = mysql.createPool({
  host: CONFIG.DB.HOST,
  user: CONFIG.DB.USER,
  password: CONFIG.DB.PASSWORD,
  database: CONFIG.DB.NAME,
  timezone: 'UTC',
  dateStrings: true,
});

const xml = fs
  .readdirSync(__dirname)
  .filter(e => e.includes('.xml'))
  .map(e => __dirname + '/' + e);

mybatis.createMapper(xml);

const conn = async () => {
  return await pool.getConnection(async conn => conn);
};

const query = async (conn, table, id, param) => {
  const sql = mybatis.getStatement(table, id, param, {
    language: 'sql',
    indent: '  ',
  });
  let qrs;
  try {
    qrs = await conn.query(sql);

    debugLogger.info('DATABASE SQL\n' + sql);
  } catch (error) {
    throw new Error(error);
  }

  return qrs;
};

const close = async conn => {
  try {
    await conn.commit();
    conn.release();
  } catch (error) {
    throw new Error(error);
  }
};

export default { conn, query, close };
