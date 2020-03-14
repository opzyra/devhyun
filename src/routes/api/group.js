import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import validator, { Joi } from '@/middleware/validator';

import ScheduleGroup from '@/models/ScheduleGroup';
import TaskGroup from '@/models/TaskGroup';
import NoteGroup from '@/models/NoteGroup';

const controller = asyncify();

export const selectAllScheduleGroup = controller.get(
  '/schedule',
  session.isAdmin(),
  async (req, res, transaction) => {
    const scheduleGroups = await ScheduleGroup.selectAll()(transaction);

    res.status(200).json(scheduleGroups);
  },
);

export const selectOneScheduleGroup = controller.get(
  '/schedule/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const scheduleGroup = await ScheduleGroup.selectOne(idx)(transaction);

    if (!scheduleGroup) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(scheduleGroup);
  },
);

export const insertOneScheduleGroup = controller.post(
  '/schedule',
  session.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { name, color } = req.body;

    const unique = await ScheduleGroup.selectByName(name)(transaction);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await ScheduleGroup.countAll()(transaction);

    await ScheduleGroup.insertOne({
      name,
      color,
      odr: count + 1,
    })(transaction);

    res.status(200).json({ message: `등록이 완료 되었습니다` });
  },
);

export const updateOneScheduleGroup = controller.put(
  '/schedule/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    await ScheduleGroup.updateOne({ name, color }, idx)(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const deleteOneScheduleGroup = controller.delete(
  '/schedule/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    await ScheduleGroup.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export const updateOdrScheduleGroup = controller.post(
  '/schedule/odr',
  session.isAdmin(),
  validator.body({
    calendars: Joi.array().required(),
  }),
  async (req, res, transaction) => {
    const { calendars } = req.body;

    for (let i = 0; i < calendars.length; i++) {
      const idx = calendars[i];
      await ScheduleGroup.updateOne({ odr: i + 1 }, idx)(transaction);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const selectAllTaskGroup = controller.get(
  '/task',
  session.isAdmin(),
  async (req, res, transaction) => {
    const taskGroups = await TaskGroup.selectAll()(transaction);

    res.status(200).json(taskGroups);
  },
);

export const selectOneTaskGroup = controller.get(
  '/task/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const taskGroup = await TaskGroup.selectOne(idx)(transaction);

    if (!taskGroup) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(taskGroup);
  },
);

export const insertOneTaskGroup = controller.post(
  '/task',
  session.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { name, color } = req.body;

    const unique = await TaskGroup.selectByName(name)(transaction);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await TaskGroup.countAll()(transaction);

    const task = await TaskGroup.insertOne({
      name,
      color,
      odr: count + 1,
    })(transaction);

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: task.idx });
  },
);

export const updateOneTaskGroup = controller.put(
  '/task/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    await TaskGroup.updateOne({ name, color }, idx)(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const deleteOneTaskGroup = controller.delete(
  '/task/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    await TaskGroup.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export const updateOdrTaskGroup = controller.post(
  '/task/odr',
  session.isAdmin(),
  validator.body({
    taskGroup: Joi.array().required(),
  }),
  async (req, res, transaction) => {
    const { taskGroup } = req.body;

    for (let i = 0; i < taskGroup.length; i++) {
      const idx = taskGroup[i];
      await TaskGroup.updateOne({ odr: i + 1 }, idx)(transaction);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const selectAllNoteGroup = controller.get(
  '/note',
  session.isAdmin(),
  async (req, res, transaction) => {
    const noteGroups = await NoteGroup.selectAll()(transaction);

    res.status(200).json(noteGroups);
  },
);

export const selectOneNoteGroup = controller.get(
  '/note/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const noteGroup = await NoteGroup.selectOne(idx)(transaction);

    if (!noteGroup) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(noteGroup);
  },
);

export const insertOneNoteGroup = controller.post(
  '/note',
  session.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { name, color } = req.body;

    const unique = await NoteGroup.selectByName(name)(transaction);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await NoteGroup.countAll()(transaction);

    const note = await NoteGroup.insertOne({
      name,
      color,
      odr: count + 1,
    })(transaction);

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: note.idx });
  },
);

export const updateOneNoteGroup = controller.put(
  '/note/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    await NoteGroup.updateOne({ name, color }, idx)(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const deleteOneNoteGroup = controller.delete(
  '/note/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    await NoteGroup.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export const updateOdrNoteGroup = controller.post(
  '/note/odr',
  session.isAdmin(),
  validator.body({
    noteGroup: Joi.array().required(),
  }),
  async (req, res, transaction) => {
    const { noteGroup } = req.body;

    for (let i = 0; i < noteGroup.length; i++) {
      const idx = noteGroup[i];
      await NoteGroup.updateOne({ odr: i + 1 }, idx)(transaction);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export default controller.router;
