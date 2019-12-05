import express from "express";
import { go, map } from "fxjs";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";

import Member from "../../sql/Member";

const router = express.Router();

router.get(
  "/member",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { query, category, page } = req.query;

    const MEMBER = Member(conn);

    const members = await go(
      MEMBER.selectPage(query, category, query, page),
      map(member => {
        const [platform, ...rest] = member.id.split("_");
        return {
          ...member,
          platform
        };
      })
    );

    res.render("admin/member", {
      members,
      query,
      category,
      layout: false
    });
  })
);

export default router;
