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
    const [partners] = await mapper('Partner', 'selectAll');
    res.status(200).json({ partners });
  }),
);

router.get(
  '/:idx', // 요소 조회
  sessionCtx.isAll(), // 전체 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;
    const [[partner]] = await mapper('Partner', 'selectOne', { idx });

    res.status(200).json({ partner });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자
  validateCtx.body({
    // 유효성 검사
    name: 'required',
    logo: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const { name, logo, description, url } = req.body;

    const [[{ row }]] = await mapper('Partner', 'countAll');

    await mapper('Partner', 'insertOne', {
      odr: row + 1,
      name,
      logo,
      description,
      url,
    });

    await adminCtx.log(req, mapper, `협력기업 등록 (${contents})`);

    res.status(200).json({ message: `협력기업을 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    name: 'required',
    logo: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;
    const { name, logo, description, url } = req.body;

    await mapper('Partner', 'updateOne', {
      idx,
      name,
      logo,
      description,
      url,
    });

    await adminCtx.log(req, mapper, `협력기업 수정 (${contents})`);

    res.status(200).json({ message: `협력기업을 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[partner]] = await mapper('Partner', 'selectOne', { idx });

    await mapper('Partner', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `협력기업 삭제 (${partner.name})`);

    res.status(200).json({ message: `협력기업을 삭제하였습니다.` });
  }),
);

router.post(
  '/order', // 순서 수정
  sessionCtx.isAdmin(), // 관리자
  wrap.query(async (req, res, next, mapper) => {
    const { items } = req.body;
    for (let i = 0; i < items.length; i++) {
      await mapper('Partner', 'updateOrder', {
        idx: items[i],
        odr: i + 1,
      });
    }

    await adminCtx.log(req, mapper, `협력기업 순서 변경`);

    res.status(200).json({ message: `협력기업의 순서를 변경하였습니다.` });
  }),
);

export default router;
