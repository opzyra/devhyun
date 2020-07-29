import express from 'express';
import sessionCtx from '../../core/session';

const router = express.Router();

/* 대시보드 */
router.get(
  '/',
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.redirect('admin/work/schedule');
  },
);

export default router;
