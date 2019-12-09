import express from "express";

import main from "./main";
import about from "./about";
import project from "./project";
import blog from "./blog";
import policy from "./policy";
import login from "./login";
import mypage from "./mypage";

const router = express.Router();

router.use(main);
router.use(about);
router.use(project);
router.use(blog);
router.use(policy);
router.use(login);
router.use(mypage);

export default router;
