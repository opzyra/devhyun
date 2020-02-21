import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import validator, { Joi } from '@/middleware/validator';

import ScheduleGroup from '../../sql/ScheduleGroup';
import TaskGroup from '../../sql/TaskGroup';
import NoteGroup from '../../sql/NoteGroup';

const router = express.Router();

router.get(
  '/schedule',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const SCHEDULE_GROUP = ScheduleGroup(conn);

    const items = await SCHEDULE_GROUP.selectAll();

    res.status(200).json(items);
  }),
);

router.get(
  '/schedule/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const SCHEDULE_GROUP = ScheduleGroup(conn);

    const item = await SCHEDULE_GROUP.selectOne(idx);

    if (!item) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(item);
  }),
);

router.post(
  '/schedule',
  sessionCtx.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { name, color } = req.body;

    const SCHEDULE_GROUP = ScheduleGroup(conn);

    const unique = await SCHEDULE_GROUP.selectByName(name);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await SCHEDULE_GROUP.countAll();

    await SCHEDULE_GROUP.insertOne({
      name,
      color,
      odr: count + 1,
    });

    res.status(200).json({ message: `등록이 완료 되었습니다` });
  }),
);

router.put(
  '/schedule/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    const SCHEDULE_GROUP = ScheduleGroup(conn);

    await SCHEDULE_GROUP.updateOne({ name, color }, idx);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.delete(
  '/schedule/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const SCHEDULE_GROUP = ScheduleGroup(conn);

    await SCHEDULE_GROUP.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

router.post(
  '/schedule/odr',
  sessionCtx.isAdmin(),
  validator.body({
    calendars: Joi.array().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { calendars } = req.body;

    const SCHEDULE_GROUP = ScheduleGroup(conn);

    for (let i = 0; i < calendars.length; i++) {
      const idx = calendars[i];
      await SCHEDULE_GROUP.updateOne({ odr: i + 1 }, idx);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.get(
  '/task',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const TASK_GROUP = TaskGroup(conn);

    const items = await TASK_GROUP.selectAll();

    res.status(200).json(items);
  }),
);

router.get(
  '/task/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TASK_GROUP = TaskGroup(conn);

    const item = await TASK_GROUP.selectOne(idx);

    if (!item) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(item);
  }),
);

router.post(
  '/task',
  sessionCtx.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { name, color } = req.body;

    const TASK_GROUP = TaskGroup(conn);

    const unique = await TASK_GROUP.selectByName(name);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await TASK_GROUP.countAll();

    const task = await TASK_GROUP.insertOne({
      name,
      color,
      odr: count + 1,
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: task });
  }),
);

router.put(
  '/task/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    const TASK_GROUP = TaskGroup(conn);

    await TASK_GROUP.updateOne({ name, color }, idx);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.delete(
  '/task/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TASK_GROUP = TaskGroup(conn);

    await TASK_GROUP.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

router.post(
  '/task/odr',
  sessionCtx.isAdmin(),
  validator.body({
    taskGroup: Joi.array().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { taskGroup } = req.body;

    const TASK_GROUP = TaskGroup(conn);

    for (let i = 0; i < taskGroup.length; i++) {
      const idx = taskGroup[i];
      await TASK_GROUP.updateOne({ odr: i + 1 }, idx);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.get(
  '/note',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const NOTE_GROUP = NoteGroup(conn);

    const items = await NOTE_GROUP.selectAll();

    res.status(200).json(items);
  }),
);

router.get(
  '/note/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const NOTE_GROUP = NoteGroup(conn);

    const item = await NOTE_GROUP.selectOne(idx);

    if (!item) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    res.status(200).json(item);
  }),
);

router.post(
  '/note',
  sessionCtx.isAdmin(),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { name, color } = req.body;

    const NOTE_GROUP = NoteGroup(conn);

    const unique = await NOTE_GROUP.selectByName(name);

    if (unique) {
      res.status(400).json({ message: `이미 등록된 이름입니다` });
      return;
    }

    const count = await NOTE_GROUP.countAll();

    const note = await NOTE_GROUP.insertOne({
      name,
      color,
      odr: count + 1,
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: note });
  }),
);

router.put(
  '/note/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    name: Joi.string().required(),
    color: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { name, color } = req.body;

    const NOTE_GROUP = NoteGroup(conn);

    await NOTE_GROUP.updateOne({ name, color }, idx);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.delete(
  '/note/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const NOTE_GROUP = NoteGroup(conn);

    await NOTE_GROUP.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

router.post(
  '/note/odr',
  sessionCtx.isAdmin(),
  validator.body({
    noteGroup: Joi.array().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { noteGroup } = req.body;

    const NOTE_GROUP = NoteGroup(conn);

    for (let i = 0; i < noteGroup.length; i++) {
      const idx = noteGroup[i];
      await NOTE_GROUP.updateOne({ odr: i + 1 }, idx);
    }

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

export default router;
