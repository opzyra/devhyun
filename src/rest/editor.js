import express from 'express';
import { createMarkdown } from 'safe-marked';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '/temp', // 에디터 임시저장 가져오기
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    let { query } = req.query;

    const [temp] = await mapper('EditorTemp', 'selectAll', {
      query: query || '',
    });

    res.status(200).json({ temp });
  }),
);

router.get(
  '/temp/:key', // 에디터 임시저장 하나 가져오기
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('key'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    let { key } = req.params;

    const [[temp]] = await mapper('EditorTemp', 'selectOne', {
      save_key: key,
    });

    res.status(200).json({ temp });
  }),
);

router.post(
  '/temp', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    save_key: 'required',
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    let { save_key, title, thumbnail, contents } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true, headerIds: false },
    });
    contents = markdown(contents);

    await mapper('EditorTemp', 'insertOne', {
      save_key,
      title,
      thumbnail,
      contents,
    });

    res.status(200).json({ message: `임시 저장이 완료되었습니다.` });
  }),
);

router.delete(
  '/temp/:key', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('key'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { key } = req.params;

    await mapper('EditorTemp', 'deleteOne', {
      save_key: key,
    });

    res.status(200).json({ message: `임시 저장된 글을 삭제하였습니다.` });
  }),
);

export default router;
