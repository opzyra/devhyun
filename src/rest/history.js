import express from 'express';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '', // 전체 조회
  sessionCtx.isAll(), // 전체 권한
  wrap.query(async (req, res, next, mapper) => {
    const [historys] = await mapper('History', 'selectAll');

    let yrs = historys
      .map(e => e.year)
      .filter((e, idx, arr) => arr.indexOf(e) === idx)
      .map(e => {
        return {
          year: e,
          list: [],
        };
      });

    yrs.forEach(e => {
      let yearItems = items.filter(el => el.year == e.year);
      let months = yearItems
        .map(e => e.month)
        .filter((e, idx, arr) => arr.indexOf(e) === idx)
        .map(e => {
          return {
            month: e,
            list: [],
          };
        });
      months.forEach(e => {
        e.list.push(...yearItems.filter(el => el.month == e.month));
      });
      e.list.push(...months);
    });

    res.status(200).json({ historys: yrs });
  }),
);

router.get(
  '/:idx', // 요소 조회
  sessionCtx.isAll(), // 전체 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[history]] = await mapper('History', 'selectOne', { idx });

    res.status(200).json({ history });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { contents, year, month } = req.body;

    await mapper('History', 'insertOne', { contents, year, month });

    await adminCtx.log(req, mapper, `연혁 등록 (${contents})`);
    res.status(200).json({ message: `연혁을 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;
    const { contents, year, month } = req.body;

    await mapper('History', 'updateOne', {
      idx,
      contents,
      year,
      month,
    });

    await adminCtx.log(req, mapper, `연혁을 수정하였습니다.`);
    res.status(200).json({ message: `연혁을 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[history]] = await mapper('History', 'selectOne', { idx });

    await mapper('History', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `연혁 삭제 (${history.contents})`);
    res.status(200).json({ message: `연혁을 삭제하였습니다.` });
  }),
);

router.post(
  '/order', // 순서 수정
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { items } = req.body;
    for (let i = 0; i < items.length; i++) {
      await mapper('History', 'updateOrder', {
        idx: items[i],
        odr: i + 1,
      });
    }

    await adminCtx.log(req, mapper, `연혁 순서 변경`);
    res.status(200).json({ message: `연혁의 순서를 변경하였습니다.` });
  }),
);

export default router;
