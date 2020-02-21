import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import { anchorConvert, safeMarkdown } from '../../lib/utils';
import validator, { Joi } from '@/middleware/validator';

import PostTag from '../../sql/PostTag';
import BoardPost from '../../sql/BoardPost';

const router = express.Router();

router.get(
  '/',
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const BOARD_POST = BoardPost(conn);

    const items = await BOARD_POST.selectAll();

    res.status(200).json(items);
  }),
);

router.post(
  '/',
  sessionCtx.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    let { title, contents, tags, thumbnail } = req.body;
    const POST_TAG = PostTag(conn);
    const BOARD_POST = BoardPost(conn);

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const insertId = await BOARD_POST.insertOne({
      title,
      contents,
      thumbnail,
    });

    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        await POST_TAG.insertOne({
          post_idx: insertId,
          tag: tags[i],
        });
      }
    }

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: insertId });
  }),
);

router.put(
  '/:idx',
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    let { title, contents, tags, thumbnail } = req.body;

    const POST_TAG = PostTag(conn);
    const BOARD_POST = BoardPost(conn);

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const insertId = await BOARD_POST.updateOne(
      {
        title,
        contents,
        thumbnail,
      },
      idx,
    );

    await POST_TAG.deleteRelatedPost(idx);

    if (tags) {
      for (let i = 0; i < tags.length; i++) {
        await POST_TAG.insertOne({
          post_idx: idx,
          tag: tags[i],
        });
      }
    }

    res.status(200).json({ message: `수정이 완료 되었습니다`, idx: insertId });
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

    const POST_TAG = PostTag(conn);
    const BOARD_POST = BoardPost(conn);

    await BOARD_POST.deleteOne(idx);

    await POST_TAG.deleteRelatedPost(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

export default router;
