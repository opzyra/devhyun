import knex from "knex";
import { debugLogger } from "./logger";

import Application from "../sql/Application";
import Member from "../sql/Member";
import BoardPost from "../sql/BoardPost";
import BoardSeries from "../sql/BoardSeries";
import SeriesPost from "../sql/SeriesPost";
import Comment from "../sql/Comment";
import HitBoard from "../sql/HitBoard";
import Note from "../sql/Note";
import NoteGroup from "../sql/NoteGroup";
import PostTag from "../sql/PostTag";
import Schedule from "../sql/Schedule";
import ScheduleGroup from "../sql/ScheduleGroup";
import Task from "../sql/Task";
import TaskGroup from "../sql/TaskGroup";
import Temp from "../sql/Temp";
import Upload from "../sql/Upload";

const db = knex({
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

const initialize = async () => {
  if (process.env == "production") return;
  Application(db).createSchema();
  Member(db).createSchema();
  BoardPost(db).createSchema();
  BoardSeries(db).createSchema();
  SeriesPost(db).createSchema();
  Comment(db).createSchema();
  HitBoard(db).createSchema();
  Note(db).createSchema();
  NoteGroup(db).createSchema();
  PostTag(db).createSchema();
  Schedule(db).createSchema();
  ScheduleGroup(db).createSchema();
  Task(db).createSchema();
  TaskGroup(db).createSchema();
  Temp(db).createSchema();
  Upload(db).createSchema();
};

initialize();

export default db;
