import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import validator, { Joi } from '../../lib/validator';
import { safeMarkdown, anchorConvert } from '../../lib/utils';

import Note from '../../sql/Note';

const router = express.Router();

router.get(
  '/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const NOTE = Note(conn);

    const item = await NOTE.selectOne(idx);

    res.status(200).json(item);
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

    const NOTE = Note(conn);

    const rowCount = await NOTE.countRelatedGroup(idx);

    res.status(200).json(rowCount);
  }),
);

router.post(
  '/',
  sessionCtx.isAdmin(),
  validator.body({
    note_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    let { note_group_idx, title, contents } = req.body;

    const NOTE = Note(conn);

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const note = await NOTE.insertOne({
      note_group_idx,
      title,
      contents,
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: note });
  }),
);

router.put(
  '/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    note_group_idx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    let { note_group_idx, title, contents } = req.body;

    const NOTE = Note(conn);

    const note = await NOTE.selectOne(idx);

    if (!note) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    await NOTE.updateOne(
      {
        note_group_idx,
        title,
        contents,
      },
      idx,
    );

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  }),
);

router.put(
  '/group/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    note_group_idx: Joi.number().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { note_group_idx } = req.body;

    const NOTE = Note(conn);

    await NOTE.updateOne({ note_group_idx }, idx);

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

    const NOTE = Note(conn);

    const note = await NOTE.selectOne(idx);

    if (!note) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await NOTE.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

export default router;
