import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import { anchorConvert, safeMarkdown } from '@/lib/utils';
import validator, { Joi } from '@/middleware/validator';

import Series from '@/models/Series';
import BoardSeries from '../../sql/BoardSeries';

const controller = asyncify();

export const insertOne = controller.post(
  '/',
  session.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    let { title, contents, posts, thumbnail } = req.body;

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const series = await Series.insertOne({
      title,
      contents,
      thumbnail,
    })(transaction);

    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        await series.addPost(posts[i], {
          through: { odr: i + 1 },
          transaction,
        });
      }
    }

    res
      .status(200)
      .json({ message: `등록이 완료 되었습니다`, idx: series.idx });
  },
);

export const updateOne = controller.put(
  '/:idx',
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
    let { title, contents, posts, thumbnail } = req.body;

    const series = await Series.selectOne(idx)(transaction);

    await Series.updateOne(
      {
        title,
        contents,
        thumbnail,
      },
      idx,
    )(transaction);

    if (posts) {
      await series.setPosts([], { transaction });
      for (let i = 0; i < posts.length; i++) {
        await series.addPost(posts[i], {
          through: { odr: i + 1 },
          transaction,
        });
      }
    }

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

    const series = await Series.selectOne(idx)(transaction);

    if (!series) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await series.setPosts([], { transaction });

    await Series.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
