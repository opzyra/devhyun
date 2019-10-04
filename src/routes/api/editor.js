import express from "express";

import sessionCtx from "../../core/session";
import { rtfn, txrtfn } from "../../core/tx";

import validator, { Joi } from "../../lib/validator";
import { safeMarkdown, removeMarkdown } from "../../lib/utils";

import Temp from "../../sql/Temp";

const router = express.Router();

router.post(
  "/markdown",
  sessionCtx.isAdmin(),
  validator.body({
    markdown: Joi.string().required()
  }),
  rtfn(async (req, res, next) => {
    const { markdown } = req.body;
    const rmMd = removeMarkdown(markdown);

    res.status(200).json(rmMd);
  })
);

router.get(
  "/temp",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const TEMP = Temp(conn);

    const items = await TEMP.selectAll();

    res.status(200).json(items);
  })
);

router.get(
  "/temp/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TEMP = Temp(conn);

    const item = await TEMP.selectOne(idx);

    res.status(200).json(item);
  })
);

router.post(
  "/temp",
  sessionCtx.isAdmin(),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { title, contents, thumbnail } = req.body;

    const TEMP = Temp(conn);

    const insertId = await TEMP.insertOne({
      title,
      thumbnail:
        thumbnail || `${process.env.APP_DOMAIN}/images/default_blog.png`,
      contents: safeMarkdown(contents)
    });

    res.status(200).json({ message: `등록이 완료 되었습니다`, idx: insertId });
  })
);

router.put(
  "/temp/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  validator.body({
    title: Joi.string().required(),
    contents: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;
    const { title, contents, thumbnail } = req.body;

    const TEMP = Temp(conn);

    const temp = await TEMP.selectOne(idx);

    if (!temp) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await TEMP.updateOne(
      {
        title,
        thumbnail:
          thumbnail || `${process.env.APP_DOMAIN}/images/default_blog.png`,
        contents: safeMarkdown(contents)
      },
      idx
    );

    res.status(200).json({ message: `수정이 완료 되었습니다` });
  })
);

router.delete(
  "/temp/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const TEMP = Temp(conn);

    const temp = await TEMP.selectOne(idx);

    if (!temp) {
      res.status(400).json({ message: `잘못된 접근입니다` });
      return;
    }

    await TEMP.deleteOne(idx);

    res.status(200).json({ message: `삭제가 완료 되었습니다` });
  })
);

export default router;
