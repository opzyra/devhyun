import knex from 'knex';
import logger from '../lib/logger';

import Application from '../sql/Application';
import Member from '../sql/Member';
import BoardPost from '../sql/BoardPost';
import BoardSeries from '../sql/BoardSeries';
import SeriesPost from '../sql/SeriesPost';
import Comment from '../sql/Comment';
import HitBoard from '../sql/HitBoard';
import Note from '../sql/Note';
import NoteGroup from '../sql/NoteGroup';
import PostTag from '../sql/PostTag';
import Schedule from '../sql/Schedule';
import ScheduleGroup from '../sql/ScheduleGroup';
import Task from '../sql/Task';
import TaskGroup from '../sql/TaskGroup';
import Temp from '../sql/Temp';
import Upload from '../sql/Upload';

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
