import express from "express";

import { txrtfn } from "../../core/tx";

import BoardPost from "../../sql/BoardPost";

const router = express.Router();

router.get(
  "/",
  txrtfn(async (req, res, next, conn) => {
    const POST = BoardPost(conn);

    // 각 내용 ellipsis 처리
    const latestPosts = await POST.selectLatest();

    res.render("client/index", {
      latestPosts,
      layout: false
    });
  })
);

export default router;
