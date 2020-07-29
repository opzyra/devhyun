import express from 'express';

import wrap from '../../core/wrap';

const router = express.Router();

router.get(
  '/about',
  wrap.base(async (req, res, next) => {
    res.render('client/about', {
      layout: false,
    });
  }),
);

export default router;
