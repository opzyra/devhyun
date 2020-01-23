import express from "express";
import { go, map } from "fxjs";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";
import store from "../../core/store";

import Member from "../../sql/Member";

const router = express.Router();

router.get(
  "/member",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { query, category, page } = req.query;

    const MEMBER = Member(conn);

    const members = await go(
      MEMBER.selectPage(query, category, page),
      map(member => {
        const [platform, ...rest] = member.id.split("_");
        return {
          ...member,
          platform
        };
      })
    );

    let memberPage = await MEMBER.selectPageInfo(query, category, page);
    let title = (() => {
      switch (category) {
        case "active":
          return "활성";
        case "disabled":
          return "정지";
        case "withdraw":
          return "탈퇴";
        default:
          return "전체";
      }
    })();

    store(res).setState({
      memberPage
    });

    res.render("admin/member", {
      members,
      query,
      category,
      memberPage,
      title,
      layout: false
    });
  })
);

export default router;
