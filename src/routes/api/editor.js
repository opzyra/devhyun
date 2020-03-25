import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import { safeMarkdown, removeMarkdown } from '@/lib/utils';

import validator, { Joi } from '@/middleware/validator';

import Temp from '@/models/Temp';

const controller = asyncify();

export const spellCheck = controller.post(
  '/markdown',
  session.isAdmin(),
  validator.body({
    markdown: Joi.string().required(),
  }),
  (req, res) => {
    const { markdown } = req.body;
    const rmMd = removeMarkdown(markdown);

    res.status(200).json(rmMd);
  },
);

export const selectAll = controller.get(
  '/temp',
  session.isAdmin(),
  async (req, res, transaction) => {
    const temps = await Temp.selectAll()(transaction);

    res.status(200).json(temps);
  },
);

export const selectOne = controller.get(
  '/temp/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const temp = await Temp.selectOne(idx)(transaction);

    res.status(200).json(temp);
  },
);

export const insertOne = controller.post(
  '/temp',
  session.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { title, contents, thumbnail } = req.body;

    const temp = await Temp.insertOne({
      title,
      thumbnail:
        thumbnail || `${process.env.APP_DOMAIN}/images/default_blog.png`,
      contents: safeMarkdown(contents),
    })(transaction);

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: temp.idx });
  },
);

export const updateOne = controller.put(
  '/temp/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { title, contents, thumbnail } = req.body;

    const temp = await Temp.selectOne(idx)(transaction);

    if (!temp) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Temp.updateOne(
      {
        title,
        thumbnail:
          thumbnail || `${process.env.APP_DOMAIN}/images/default_blog.png`,
        contents: safeMarkdown(contents),
      },
      idx,
    )(transaction);

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  },
);

export const deleteOne = controller.delete(
  '/temp/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const temp = await Temp.selectOne(idx)(transaction);

    if (!temp) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await Temp.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
