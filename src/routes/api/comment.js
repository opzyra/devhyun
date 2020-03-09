import asyncify from '@/lib/asyncify';

import session from '@/lib/session';

import validator, { Joi } from '@/middleware/validator';
import { xssFilter } from '@/lib/utils';

import Comment from '@/models/Comment';

const controller = asyncify();

export const selectOne = controller.get(
  '/:idx',
  session.isAuthenticated(),
  validator.params({
    idx: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const comment = await Comment.selectOne(idx)(transaction);

    res.status(200).json(comment);
  },
);

export const insertOne = controller.post(
  '/',
  session.isAuthenticated(),
  validator.body({
    board: Joi.string().required(),
    postIdx: Joi.number().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    let { postIdx, targetIdx, contents } = req.body;
    const memberIdx = req.session.member.idx;

    contents = xssFilter(contents);

    const comment = await Comment.insertOne({
      memberIdx: memberIdx,
      targetIdx: targetIdx == '' ? null : targetIdx,
      contents,
    })(transaction);

    await comment.addPost([postIdx], { transaction });

    res
      .status(200)
      .json({ message: `등록이 완료 되었습니다`, idx: comment.idx });
  },
);

export const updateOne = controller.put(
  '/:idx',
  session.isAuthenticated(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    board: Joi.string().required(),
    contents: Joi.string().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    let { targetIdx, contents } = req.body;
    const memberIdx = req.session.member.idx;

    contents = xssFilter(contents);

    const comment = await Comment.selectOne(idx)(transaction);

    if (comment.memberIdx != memberIdx) {
      throw new Error('잘못된 접근입니다');
    }

    await Comment.updateOne(
      {
        ...comment,
        memberIdx,
        targetIdx: targetIdx == '' ? null : targetIdx,
        contents,
      },
      comment.idx,
    )(transaction);

    res
      .status(200)
      .json({ message: `수정이 완료 되었습니다`, idx: comment.idx });
  },
);

export const deleteOne = controller.delete(
  '/:idx',
  session.isAuthenticated(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const memberIdx = req.session.member.idx;

    const comment = await Comment.selectOne(idx)(transaction);

    if (comment.memberIdx != memberIdx) {
      throw new Error('잘못된 접근입니다');
    }

    await Comment.deleteOne(idx)(transaction);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  },
);

export default controller.router;
