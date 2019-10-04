import _knex from "knex";
import { debugLogger } from "./logger";

const knex = _knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: true,
    charset: "utf8mb4_unicode_ci"
  },
  log: {
    debug(message) {
      if (process.env != "production") {
        message.sql && debugLogger.info(`DATABASE SQL - ${message.sql}`);
        message.bindings &&
          debugLogger.info(`DATABASE PARAMS - {${message.bindings}}`);
      }
    }
  },
  debug: process.env != "production" ? true : false
});

const initialize = async () => {};

initialize();

export default knex;
