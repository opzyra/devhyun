import express from "express";

import upload from "./upload";
import editor from "./editor";
import member from "./member";
import group from "./group";
import schedule from "./schedule";
import task from "./task";
import note from "./note";
import post from "./post";
import series from "./series";

const router = express.Router();

router.use("/upload", upload);
router.use("/editor", editor);
router.use("/member", member);
router.use("/group", group);
router.use("/schedule", schedule);
router.use("/task", task);
router.use("/note", note);
router.use("/post", post);
router.use("/series", series);

export default router;
