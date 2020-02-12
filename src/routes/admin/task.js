import express from 'express';
import { go, filter } from 'fxjs';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';
import store from '../../lib/store';

import Task from '../../sql/Task';
import TaskGroup from '../../sql/TaskGroup';

const router = express.Router();

router.get(
  '/task',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { group, query, page } = req.query;

    const TASK = Task(conn);
    const TASK_GROUP = TaskGroup(conn);

    let taskGroups = await TASK_GROUP.selectAll();

    const [ctxGroup] = go(taskGroups, filter(e => e.idx == group));

    if (group && !ctxGroup) {
      throw new Error('잘못된 접근입니다');
    }

    let taskGroup = ctxGroup;

    let tasks = await TASK.selectPage(query, group, page);
    let taskPage = await TASK.selectPageInfo(query, group, page);

    store(res).setState({
      taskPage,
    });

    res.render('admin/task', {
      query,
      tasks,
      taskPage,
      taskGroup,
      taskGroups,
      layout: false,
    });
  }),
);

export default router;
