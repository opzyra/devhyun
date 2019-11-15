import express from "express";
import xssFilter from "xssfilter";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";

import { anchorConvert, safeMarkdown } from "../../lib/utils";
import validator, { Joi } from "../../lib/validator";

import Comment from "../../sql/Comment";
import BoardPost from "../../sql/BoardPost";

const router = express.Router();

router.get(
  "/:idx",
  sessionCtx.isAuthenticated(),
  validator.params({
    idx: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const COMMENT = Comment(conn);

    const item = await COMMENT.selectOne(idx);

    res.status(200).json(item);
  })
);

router.post(
  "/",
  sessionCtx.isAuthenticated(),
  validator.body({
    board: Joi.string().required(),
    board_idx: Joi.number().required(),
    contents: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    let { board, board_idx, target_idx, contents } = req.body;
    const member_idx = req.session.member.idx;

    const COMMENT = Comment(conn);

    contents = new xssFilter().filter(contents);

    const insertId = await COMMENT.insertOne({
      board,
      board_idx,
      member_idx,
      target_idx: target_idx == "" ? null : target_idx,
      contents
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: insertId });
  })
);

router.put(
  "/:idx",
  sessionCtx.isAuthenticated(),
  validator.params({
    idx: Joi.number().required()
  }),
  validator.body({
    board: Joi.string().required(),
    board_idx: Joi.number().required(),
    contents: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    let { board, board_idx, target_idx, contents } = req.body;
    const member_idx = req.session.member.idx;

    const COMMENT = Comment(conn);

    contents = new xssFilter().filter(contents);

    const comment = await COMMENT.selectOne(idx);

    if (comment.member_idx != member_idx) {
      throw new Error("잘못된 접근입니다");
    }

    const insertId = await COMMENT.updateOne(
      {
        board,
        board_idx,
        member_idx,
        target_idx: target_idx == "" ? null : target_idx,
        contents
      },
      idx
    );

    res.status(200).json({ message: `수정이 완료 되었습니다`, idx: insertId });
  })
);

router.delete(
  "/:idx",
  sessionCtx.isAuthenticated(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const member_idx = req.session.member.idx;

    const COMMENT = Comment(conn);

    const comment = await COMMENT.selectOne(idx);

    if (comment.member_idx != member_idx) {
      throw new Error("잘못된 접근입니다");
    }

    await COMMENT.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  })
);

export default router;
