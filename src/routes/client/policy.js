import express from 'express';

const router = express.Router();

router.get('/policy', (req, res) => {
  res.render('client/policy', {
    layout: false,
  });
});

export default router;
