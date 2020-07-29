import express from 'express';
import { createMarkdown } from 'safe-marked';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import markdownCtx from '../core/markdown';
import wrap from '../core/wrap';

const router = express.Router();

router.post(
  '/', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    let { title, contents } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true, headerIds: false },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    await mapper('Lecture', 'insertOne', {
      member_idx: member.idx,
      title,
      contents,
    });

    await adminCtx.log(req, mapper, `노트 등록 (${title})`);

    res.status(200).json({ message: `노트를 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    let { title, contents } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    const [[lecture]] = await mapper('Lecture', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != lecture.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    await mapper('Lecture', 'updateOne', {
      idx,
      title,
      contents,
    });

    await adminCtx.log(req, mapper, `노트 수정 (${title})`);

    res.status(200).json({ message: `노트를 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    const [[lecture]] = await mapper('Lecture', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != lecture.member_idx) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }

    await mapper('Lecture', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `노트 삭제 (${lecture.title})`);

    res.status(200).json({ message: `노트를 삭제하였습니다.` });
  }),
);

export default router;
