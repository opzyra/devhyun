import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import { anchorConvert, safeMarkdown } from '@/lib/utils';

import validator, { Joi } from '@/middleware/validator';

import Post from '@/models/Post';
import Tag from '@/models/Tag';

const controller = asyncify();

export const selectAll = controller.get(
  '/',
  session.isAdmin(),
  async (req, res, transaction) => {
    const posts = await Post.selectAll()(transaction);

    res.status(200).json(posts);
  },
);

export const insertOne = controller.post(
  '/',
  session.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    let { title, contents, tags, thumbnail } = req.body;

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const post = await Post.insertOne({
      title,
      contents,
      thumbnail,
    })(transaction);

    if (tags) {
      tags = tags.map(tag => ({
        tag,
      }));

      const insertedTags = await Tag.insertAll(tags)(transaction);

      await post.setTags(insertedTags, { transaction });
    }

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: post.idx });
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
    let { title, contents, tags, thumbnail } = req.body;

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const post = await Post.selectOne(idx)(transaction);

    await Post.updateOne(
      {
        title,
        contents,
        thumbnail,
      },
      idx,
    )(transaction);

    if (tags) {
      tags = tags.map(tag => ({
        tag,
      }));

      await Tag.deleteRelatedPost(idx)(transaction);

      const insertedTags = await Tag.insertAll(tags)(transaction);

      await post.setTags(insertedTags, { transaction });
    }

    res.status(200).json({ message: `수정이 완료 되었습니다`, idx });
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

    await Post.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
