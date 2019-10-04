import express from 'express';

import { rtfn } from '../../core/tx';

const router = express.Router();

router.get(
  '/about',
  rtfn(async (req, res, next) => {
    res.render('client/about', {
      layout: false,
    });
  }),
);

export default router;
