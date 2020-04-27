import { go, map, filter } from 'fxjs';

import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import store from '@/lib/store';

import Task from '@/models/Task';
import TaskGroup from '@/models/TaskGroup';

const controller = asyncify();

export const task = controller.get(
  '/task',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { group, query, page } = req.query;

    let taskGroups = await TaskGroup.selectAll()(transaction);

    const [ctxGroup] = go(
      taskGroups,
      filter(e => e.idx == group),
    );

    if (group && !ctxGroup) {
      throw new Error('잘못된 접근입니다');
    }

    let taskGroup = ctxGroup;

    let { tasks, taskPage } = await Task.selectPaginated(
      query,
      group,
      page,
    )(transaction);

    tasks = go(
      tasks,
      map(task => {
        let group = taskGroups.find(group => group.idx == task.taskGroupIdx);
        return {
          ...task,
          color: group.color,
        };
      }),
    );

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
  },
);

export default controller.router;
