import express from "express";

import validator, { Joi } from "../../lib/validator";
import sessionCtx from "../../core/session";
import oauth, { loginUrl } from "../../lib/oauth";

import { txrtfn } from "../../core/tx";

const router = express.Router();

router.get("/login", sessionCtx.isAnonymous(), (req, res) => {
  res.render("client/login", { loginUrl, layout: false });
});

router.get(
  "/login/:platform",
  sessionCtx.isAnonymous(),
  validator.query({
    code: Joi.string().required()
  }),
  validator.params({
    platform: Joi.string().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { platform } = req.params;
    const { code } = req.query;

    const auth = oauth[platform];

    if (!auth) {
      throw new Error("platform error");
    }

    const user = await auth(code);

    //TODO 테이블 작업
    console.log(user);

    res.redirect("/");
  })
);

export default router;
