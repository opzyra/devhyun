import { go, map } from 'fxjs';

import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import Post from '@/models/Post';
import Tag from '@/models/Tag';
import Task from '@/models/Task';
import Schedule from '@/models/Schedule';
import Application from '@/models/Application';
import TaskGroup from '@/models/TaskGroup';

const controller = asyncify();

export const dashboard = controller.get(
  '/',
  session.isAdmin(),
  async (req, res, transaction) => {
    const postCount = await Post.countAll()(transaction);
    const tagCount = await Tag.countDistinct()(transaction);

    const schedules = await Schedule.selectBetweenToday()(transaction);

    let tasks = await Task.selectAllNotCompleted()(transaction);
    const taskGropups = await TaskGroup.selectAll()(transaction);

    tasks = go(
      tasks,
      map(task => {
        let taskGroup = taskGropups.find(
          group => group.idx === task.TaskGroupIdx,
        );
        return {
          ...task,
          color: taskGroup.color,
        };
      }),
    );

    const app = await Application.selectOne(1)(transaction);

    res.render('admin/index', {
      app,
      tasks,
      schedules,
      countPostTag: {
        postCount,
        tagCount,
      },
      layout: false,
    });
  },
);

export default controller.router;
