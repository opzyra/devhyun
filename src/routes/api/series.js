import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

import { anchorConvert, safeMarkdown } from '../../lib/utils';
import validator, { Joi } from '../../lib/validator';

import SeriesPost from '../../sql/SeriesPost';
import BoardSeries from '../../sql/BoardSeries';

const router = express.Router();

router.post(
  '/',
  sessionCtx.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    let { title, contents, posts, thumbnail } = req.body;
    const SERIES_POST = SeriesPost(conn);
    const BOARD_SERIES = BoardSeries(conn);

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    const insertId = await BOARD_SERIES.insertOne({
      title,
      contents,
      thumbnail,
    });

    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        await SERIES_POST.insertOne({
          series_idx: insertId,
          post_idx: posts[i],
          odr: i + 1,
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
    let { title, contents, posts, thumbnail } = req.body;

    const SERIES_POST = SeriesPost(conn);
    const BOARD_SERIES = BoardSeries(conn);

    contents = safeMarkdown(contents);
    contents = anchorConvert(contents);

    await BOARD_SERIES.updateOne(
      {
        title,
        contents,
        thumbnail,
      },
      idx,
    );

    await SERIES_POST.deleteRelatedSeries(idx);

    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        await SERIES_POST.insertOne({
          series_idx: idx,
          post_idx: posts[i],
          odr: i + 1,
        });
      }
    }

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

    const SERIES_POST = SeriesPost(conn);
    const BOARD_SERIES = BoardSeries(conn);

    await BOARD_SERIES.deleteOne(idx);

    await SERIES_POST.deleteRelatedSeries(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  }),
);

export default router;
