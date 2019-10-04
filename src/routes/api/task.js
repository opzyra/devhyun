import express from "express";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";

import validator, { Joi } from "../../lib/validator";

import Task from "../../sql/Task";

const router = express.Router();

router.get(
  "/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TASK = Task(conn);

    const item = await TASK.selectOne(idx);

    res.status(200).json(item);
  })
);

router.get(
  "/count/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TASK = Task(conn);

    const rowCount = await TASK.countRelatedGroup(idx);

    res.status(200).json(rowCount);
  })
);

router.post(
  "/",
  sessionCtx.isAdmin(),
  validator.body({
    task_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { task_group_idx, title, contents, start, end } = req.body;

    const TASK = Task(conn);

    const task = await TASK.insertOne({
      task_group_idx,
      title,
      contents,
      start,
      end
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: task });
  })
);

router.put(
  "/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  validator.body({
    task_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
    start: Joi.date().required(),
    end: Joi.date().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { task_group_idx, title, contents, start, end } = req.body;

    const TASK = Task(conn);

    const task = await TASK.selectOne(idx);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await TASK.updateOne(
      {
        task_group_idx,
        title,
        contents,
        start,
        end
      },
      idx
    );

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  })
);

router.put(
  "/group/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  validator.body({
    task_group_idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { task_group_idx } = req.body;

    const TASK = Task(conn);

    await TASK.updateOne({ task_group_idx }, idx);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  })
);

router.put(
  "/complete/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  validator.body({
    completed: Joi.boolean().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { completed } = req.body;

    const TASK = Task(conn);

    const task = await TASK.selectOne(idx);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await TASK.updateOne(
      {
        completed
      },
      idx
    );

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  })
);

router.delete(
  "/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TASK = Task(conn);

    const task = await TASK.selectOne(idx);

    if (!task) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await TASK.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  })
);

export default router;
