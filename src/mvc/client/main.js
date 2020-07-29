import express from 'express';

import wrap from '../../core/wrap';

const router = express.Router();

router.get(
  '/',
  wrap.query(async (req, res, next, mapper) => {
    const [latestPosts] = await mapper('PostBoard', 'selectLatest');

    res.render('client/index', {
      latestPosts,
      layout: false,
    });
  }),
);

export default router;
