import express from 'express';
import sessionCtx from '../../core/session';

const router = express.Router();

router.get('/login', sessionCtx.isAnonymous(), (req, res) => {
  res.render('client/login', { layout: false });
});

export default router;
