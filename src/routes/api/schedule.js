import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import validator, { Joi } from '@/middleware/validator';

import Schedule from '@/models/Schedule';

const controller = asyncify();

export const selectAllPeriod = controller.get(
  '/',
  validator.query({
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { startAt, endAt } = req.query;

    const schedule = await Schedule.selectAllPeriod({ startAt, endAt })(
      transaction,
    );

    res.status(200).json(schedule);
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

    const [{ rowCount }] = await Schedule.countRelatedGroup(idx)(transaction);

    res.status(200).json(rowCount);
  },
);

export const insertOne = controller.post(
  '/',
  session.isAdmin(),
  validator.body({
    scheduleGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    state: Joi.string().required(),
    allDay: Joi.boolean().required(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  async (req, res, transaction) => {
    const {
      scheduleGroupIdx,
      title,
      location,
      state,
      allDay,
      startAt,
      endAt,
    } = req.body;

    const schedule = await Schedule.insertOne({
      title,
      location,
      state,
      allDay,
      startAt,
      endAt,
    })(transaction);

    await schedule.setScheduleGroup(scheduleGroupIdx, { transaction });

    res
      .status(200)
      .json({ message: `등록이 완료 되었습니다`, idx: schedule.idx });
  },
);

export const updateOne = controller.put(
  '/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    scheduleGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    state: Joi.string().required(),
    allDay: Joi.boolean().required(),
    startAt: Joi.date().required(),
    endAt: Joi.date().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const {
      scheduleGroupIdx,
      title,
      location,
      state,
      allDay,
      startAt,
      endAt,
    } = req.body;

    const schedule = await Schedule.selectOne(idx)(transaction);

    if (!schedule) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await schedule.setScheduleGroup(scheduleGroupIdx, { transaction });

    await Schedule.updateOne(
      {
        title,
        location,
        state,
        allDay,
        startAt,
        endAt,
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

    const schedule = await Schedule.selectOne(idx)(transaction);

    if (!schedule) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Schedule.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
