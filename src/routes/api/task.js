import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import validator, { Joi } from '@/middleware/validator';

import Task from '@/models/Task';

const controller = asyncify();

export const selectOne = controller.get(
  '/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const task = await Task.selectOne(idx)(transaction);

    res.status(200).json(task);
  },
);

export const countRelatedGroup = controller.get(
  '/count/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const [{ rowCount }] = await Task.countRelatedGroup(idx)(transaction);

    res.status(200).json(rowCount);
  },
);

export const insertOne = controller.post(
  '/',
  session.isAdmin(),
  validator.body({
    taskGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  async (req, res, transaction) => {
    const { taskGroupIdx, title, contents, startAt, endAt } = req.body;

    const task = await Task.insertOne({
      taskGroupIdx,
      title,
      contents,
      startAt,
      endAt,
    })(transaction);

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: task.idx });
  },
);

export const updateOne = controller.put(
  '/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    taskGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { taskGroupIdx, title, contents, startAt, endAt } = req.body;

    const task = await Task.selectOne(idx)(transaction);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await task.setTaskGroup(taskGroupIdx, { transaction });

    await Task.updateOne(
      {
        title,
        contents,
        startAt,
        endAt,
      },
      idx,
    )(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const updateOneGroup = controller.put(
  '/group/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    taskGroupIdx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { taskGroupIdx } = req.body;

    const task = await Task.selectOne(idx)(transaction);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await task.setTaskGroup(taskGroupIdx, { transaction });

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const updateOneComplate = controller.put(
  '/complete/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    completed: Joi.boolean().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { completed } = req.body;

    const task = await Task.selectOne(idx)(transaction);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Task.updateOne(
      {
        completed,
      },
      idx,
    )(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const deleteOne = controller.delete(
  '/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const task = await Task.selectOne(idx)(transaction);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Task.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
