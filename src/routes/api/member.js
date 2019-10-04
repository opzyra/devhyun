import express from "express";
import bcrypt from "bcrypt";
import randomString from "random-string";

import { txrtfn } from "../../core/tx";
import sessionCtx from "../../core/session";

import validator, { Joi } from "../../lib/validator";

import Member from "../../sql/Member";

const router = express.Router();

router.post(
  "/login", // 로그인
  sessionCtx.isAnonymous(), // 비로그인 권한
  validator.body({
    id: Joi.string().required(),
    password: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { id, password } = req.body;

    const MEMBER = Member(conn);

    const member = await MEMBER.selectById(id);

    if (!member) {
      res.status(400).json({ message: "아이디가 존재하지 않습니다." });
      return;
    }

    const match = await bcrypt.compare(password, member.password);
    if (!match) {
      res.status(400).json({ message: "비밀번호가 올바르지 않습니다." });
      return;
    }

    if (!member.active) {
      res.status(403).json({ message: "관리자에 의해 정지된 계정입니다." });
      return;
    }

    if (member.withdraw) {
      res.status(403).json({ message: "탈퇴한 계정입니다." });
      return;
    }

    req.session.member = member;

    res.status(200).json({ message: `${member.name}님 환영합니다.` });
  })
);

router.post(
  "/logout", // 로그아웃
  sessionCtx.isAuthenticated(), // 로그인 권한
  (req, res) => {
    req.session.member = null;
    res.status(200).json({ message: "로그아웃 되었습니다." });
  }
);

export default router;
