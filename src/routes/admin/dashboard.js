import express from 'express';
import moment from 'moment';
import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import Application from '../../sql/Application';
import BoardPost from '../../sql/BoardPost';
import PostTag from '../../sql/PostTag';
import Schedule from '../../sql/Schedule';
import Task from '../../sql/Task';

const router = express.Router();

router.get(
  '/',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const APPLICATION = Application(conn);
    const POST_TAG = PostTag(conn);
    const BOARD_POST = BoardPost(conn);

    const SCHEDULE = Schedule(conn);
    const TASK = Task(conn);

    const post_count = await BOARD_POST.countAll();
    const tag_count = await POST_TAG.countDistinct();

    const date = moment().format('YYYY-MM-DD');
    const schedules = await SCHEDULE.selectBetweenToday(date);

    const tasks = await TASK.selectAllNotCompleted();

    const app = await APPLICATION.selectOne(1);

    res.render('admin/index', {
      app,
      tasks,
      schedules,
      countPostTag: {
        post_count,
        tag_count,
      },
      layout: false,
    });
  }),
);

export default router;
