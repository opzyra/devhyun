import express from 'express';

import dashboard from './dashboard';
import work from './work';
import contents from './contents';
import stat from './stat';
import manager from './manager';
import board from './board';

const router = express.Router();

router.use(dashboard);
router.use(work);
router.use(manager);
router.use(contents);
router.use(stat);
router.use(manager);
router.use(board);

export default router;
