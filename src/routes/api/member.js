import express from "express";
import bcrypt from "bcrypt";
import randomString from "random-string";

import { txrtfn } from "../../core/tx";
import sessionCtx from "../../core/session";

import validator, { Joi } from "../../lib/validator";

import Member from "../../sql/Member";

const router = express.Router();

router.post(
  "/logout", // 로그아웃
  sessionCtx.isAuthenticated(), // 로그인 권한
  (req, res) => {
    req.session.member = null;
    res.status(200).json({ message: "로그아웃 되었습니다" });
  }
);

router.post(
  "/email",
  sessionCtx.isAuthenticated(),
  validator.body({
    email: Joi.string()
      .email()
      .required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { email } = req.body;
    const member = req.session.member;

    const MEMBER = Member(conn);

    await MEMBER.updateOne({ email }, member.idx);

    req.session.member = { ...member, email };

    res.status(200).json({ message: `이메일 정보가 변경되었습니다` });
  })
);

router.post(
  "/marketing",
  sessionCtx.isAuthenticated(),
  validator.body({
    marketing: Joi.boolean().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { marketing } = req.body;
    const member = req.session.member;

    const MEMBER = Member(conn);

    await MEMBER.updateOne({ marketing }, member.idx);

    req.session.member = { ...member, marketing };

    res.status(200).json({ message: `마케팅 수신 동의가 변경되었습니다` });
  })
);

router.delete(
  "/",
  sessionCtx.isAuthenticated(),
  txrtfn(async (req, res, next, conn) => {
    const member = req.session.member;

    const MEMBER = Member(conn);

    await MEMBER.updateOne({ withdraw: true }, member.idx);

    req.session.member = null;

    res.status(200).json({
      message: `탈퇴가 완료되었습니다<br>데브현을 이용해주셔서 감사합니다`
    });
  })
);

export default router;
