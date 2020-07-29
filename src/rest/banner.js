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
    const [banners] = await mapper('Banner', 'selectAll');
    res.status(200).json({ banners });
  }),
);

router.get(
  '/:idx', // 요소 조회
  sessionCtx.isAll(), // 전체 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[banner]] = await mapper('Banner', 'selectOne', { idx });

    res.status(200).json({ banner });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    name: 'required',
    img: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const { name, url, target, img } = req.body;

    const [[{ row }]] = await mapper('Banner', 'countAll');

    await mapper('Banner', 'insertOne', {
      odr: row + 1,
      name,
      url,
      target: target || 0,
      img,
    });

    await adminCtx.log(req, mapper, `배너 등록 (${name})`);

    res.status(200).json({ message: `배너를 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    name: 'required',
    img: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;
    const { name, url, target, img } = req.body;

    await mapper('Banner', 'updateOne', {
      idx,
      name,
      url,
      target: target || 0,
      img,
    });

    await adminCtx.log(req, mapper, `배너 수정 (${name})`);

    res.status(200).json({ message: `배너를 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[banner]] = await mapper('Banner', 'selectOne', { idx });

    await mapper('Banner', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `배너 삭제 (${banner.name})`);

    res.status(200).json({ message: `배너를 삭제하였습니다.` });
  }),
);

router.post(
  '/order', // 순서 수정
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { items } = req.body;
    for (let i = 0; i < items.length; i++) {
      await mapper('Banner', 'updateOrder', {
        idx: items[i],
        odr: i + 1,
      });
    }

    await adminCtx.log(req, mapper, `배너 순서 변경`);

    res.status(200).json({ message: `배너의 순서를 변경하였습니다.` });
  }),
);

export default router;
