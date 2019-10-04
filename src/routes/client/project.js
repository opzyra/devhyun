import express from "express";

import { rtfn } from "../../core/tx";

const router = express.Router();

router.get(
  "/project",
  rtfn(async (req, res, next) => {
    res.render("client/project", {
      layout: false
    });
  })
);

router.get(
  "/project/aboutperiod",
  rtfn(async (req, res, next) => {
    res.render("client/project/aboutperiod", {
      layout: false
    });
  })
);

router.get(
  "/project/codepresso",
  rtfn(async (req, res, next) => {
    res.render("client/project/codepresso", {
      layout: false
    });
  })
);

router.get(
  "/project/jabis",
  rtfn(async (req, res, next) => {
    res.render("client/project/jabis", {
      layout: false
    });
  })
);

export default router;
