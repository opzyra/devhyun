import express from 'express';
import moment from 'moment';

import wrap from '../../core/wrap';

const router = express.Router();

router.get(
  '/project',
  wrap.base(async (req, res, next) => {
    res.render('client/project', {
      layout: false,
    });
  }),
);

router.get(
  '/project/aboutperiod',
  wrap.base(async (req, res, next) => {
    res.render('client/project/aboutperiod', {
      layout: false,
    });
  }),
);

router.get(
  '/project/codepresso',
  wrap.base(async (req, res, next) => {
    res.render('client/project/codepresso', {
      layout: false,
    });
  }),
);

router.get(
  '/project/jabis',
  wrap.base(async (req, res, next) => {
    res.render('client/project/jabis', {
      layout: false,
    });
  }),
);

export default router;
