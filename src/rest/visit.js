import express from 'express';

import sessionCtx from '../core/session';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '/month', // 월별 방문자수
  sessionCtx.isGeMaster(), // 마스터 관리자 이상 권한
  wrap.query(async (req, res, next, mapper) => {
    const { ym } = req.query;

    if (ym == '') {
      res.status(400).json({ message: '해당 월을 선택해주세요.' });
      return;
    }

    const [monthData] = await mapper('YmStat', 'selectMonthData', {
      ym,
    });
    let monthArray = monthData.map(e => e.rcount);

    res.status(200).json({ monthArray });
  }),
);

export default router;
