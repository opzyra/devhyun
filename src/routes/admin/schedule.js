import express from "express";

import sessionCtx from "../../core/session";
import { rtfn } from "../../core/tx";

const router = express.Router();

router.get(
  "/schedule",
  sessionCtx.isAdmin(),
  rtfn(async (req, res, next) => {
    res.render("admin/schedule", {
      layout: false
    });
  })
);

export default router;
