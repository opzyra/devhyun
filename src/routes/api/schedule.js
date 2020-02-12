import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import validator, { Joi } from '../../lib/validator';

import Schedule from '../../sql/Schedule';

const router = express.Router();

router.get(
  '/',
  validator.query({
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { start, end } = req.query;

    const SCHEDULE = Schedule(conn);

    const items = await SCHEDULE.selectAllPeriod({ start, end });

    res.status(200).json(items);
  }),
);

router.get(
  '/count/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const SCHEDULE = Schedule(conn);

    const rowCount = await SCHEDULE.countRelatedGroup(idx);

    res.status(200).json(rowCount);
  }),
);

router.post(
  '/',
  sessionCtx.isAdmin(),
  validator.body({
    schedule_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    state: Joi.string().required(),
    all_day: Joi.boolean().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const {
      schedule_group_idx,
      title,
      location,
      state,
      all_day,
      start,
      end,
    } = req.body;

    const SCHEDULE = Schedule(conn);

    const schedule = await SCHEDULE.insertOne({
      schedule_group_idx,
      title,
      location,
      state,
      all_day,
      start,
      end,
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: schedule });
  }),
);

router.put(
  '/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    schedule_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    state: Joi.string().required(),
    all_day: Joi.boolean().required(),
    start: Joi.date().required(),
    end: Joi.date().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const {
      schedule_group_idx,
      title,
      location,
      state,
      all_day,
      start,
      end,
    } = req.body;

    const SCHEDULE = Schedule(conn);

    const schedule = await SCHEDULE.selectOne(idx);

    if (!schedule) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await SCHEDULE.updateOne(
      {
        schedule_group_idx,
        title,
        location,
        state,
        all_day,
        start,
        end,
      },
      idx,
    );

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.delete(
  '/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const SCHEDULE = Schedule(conn);

    const schedule = await SCHEDULE.selectOne(idx);

    if (!schedule) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await SCHEDULE.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

export default router;
