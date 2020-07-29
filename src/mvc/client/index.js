import express from 'express';

import main from './main';
import about from './about';
import project from './project';
import blog from './blog';
import policy from './policy';
import login from './login';

const router = express.Router();

router.use(main);
router.use(about);
router.use(project);
router.use(blog);
router.use(policy);
router.use(login);

export default router;
