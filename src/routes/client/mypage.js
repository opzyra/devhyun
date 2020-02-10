import express from 'express';

import sessionCtx from '../../lib/session';
import { txrtfn } from '../../core/tx';

const router = express.Router();

router.get(
  '/mypage',
  sessionCtx.isAuthenticated(),
  txrtfn(async (req, res, next, conn) => {
    res.render('client/mypage', {
      layout: false,
    });
  }),
);

export default router;
