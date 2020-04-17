import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import { safeMarkdown, anchorConvert } from '@/lib/utils';

import validator, { Joi } from '@/middleware/validator';

import Note from '@/models/Note';

const controller = asyncify();

export const selectOne = controller.get(
  '/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const note = await Note.selectOne(idx)(transaction);

    res.status(200).json(note);
  },
);

export const countOne = controller.get(
  '/count/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const rowCount = await Note.countRelatedGroup(idx)(transaction);

    res.status(200).json(rowCount);
  },
);

export const insertOne = controller.post(
  '/',
  session.isAdmin(),
  validator.body({
    noteGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    let { noteGroupIdx, title, contents } = req.body;

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const note = await Note.insertOne({
      title,
      contents,
    })(transaction);

    await note.setNoteGroup(noteGroupIdx, { transaction });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: note.idx });
  },
);

export const updateOne = controller.put(
  '/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    noteGroupIdx: Joi.number().required(),
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    let { noteGroupIdx, title, contents } = req.body;

    const note = await Note.selectOne(idx)(transaction);

    if (!note) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    await note.setNoteGroup(noteGroupIdx, { transaction });

    await Note.updateOne(
      {
        title,
        contents,
      },
      idx,
    )(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const updateNoteGroup = controller.put(
  '/group/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    noteGroupIdx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { noteGroupIdx } = req.body;

    const note = await Note.selectOne(idx)(transaction);

    await note.setNoteGroup(noteGroupIdx, { transaction });

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

    const note = await Note.selectOne(idx)(transaction);

    if (!note) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Note.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
