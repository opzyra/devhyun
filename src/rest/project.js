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
    const [projects] = await mapper('Project', 'selectAll');

    res.status(200).json({ projects });
  }),
);

router.get(
  '/:idx', // 요소 조회
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[project]] = await mapper('Project', 'selectOne', { idx });
    const [members] = await mapper('Project', 'selectFkMember', {
      idx,
    });

    project.members = members;
    project.own = true;
    project.mown = true;

    const role = req.session.member.role;
    if (
      role == 'MEMBER_ADMIN' &&
      req.session.member.idx != project.member_idx
    ) {
      project.own = false;
    }

    const ma = members.map(e => e.idx);
    if (req.session.member.idx != project.member_idx) {
      project.mown = false;
    }

    if (ma.includes(req.session.member.idx)) {
      project.mown = true;
    }

    res.status(200).json({ project });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    description: 'required',
    important: 'required',
    start: ['required', 'date'],
    end: ['required', 'date'],
    members: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const { title, description, important, start, end, members } = req.body;

    const [{ insertId }] = await mapper('Project', 'insertOne', {
      member_idx: member.idx,
      title,
      description,
      important,
      progress: 0,
      start,
      end,
    });

    if (members) {
      for (let i = 0; i < members.length; i++) {
        await mapper('Project', 'insertFkMember', {
          project_idx: insertId,
          member_idx: members[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `프로젝트 등록 (${title})`);

    res.status(200).json({ message: `프로젝트를 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    description: 'required',
    important: 'required',
    start: ['required', 'date'],
    end: ['required', 'date'],
    members: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    const { title, description, important, start, end, members } = req.body;

    // 권한 체크
    // 자신이 작성한 경우만 수정 가능

    const [[project]] = await mapper('Project', 'selectOne', { idx });

    if (member.idx != project.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    await mapper('Project', 'updateOne', {
      idx,
      title,
      description,
      important,
      start,
      end,
    });

    await mapper('Project', 'deleteFkMember', { project_idx: idx });

    if (members) {
      for (let i = 0; i < members.length; i++) {
        await mapper('Project', 'insertFkMember', {
          project_idx: idx,
          member_idx: members[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `프로젝트 수정 (${title})`);

    res.status(200).json({ message: `프로젝트를 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[project]] = await mapper('Project', 'selectOne', { idx });

    // 권한처리 -------------------------------------
    const member = req.session.member;
    let permission = false;

    // 1. 작성자
    if (member.idx == project.member_idx) {
      permission = true;
    }

    // 2. 웹 관리자, 마스터 관리자
    if (member.role == 'SUPER_ADMIN' || member.role == 'MASTER_ADMIN') {
      permission = true;
    }

    if (!permission) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }
    // 권한처리 -------------------------------------

    await mapper('Project', 'deleteFkMember', { project_idx: idx });

    await mapper('Project', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `프로젝트 삭제 (${project.title})`);

    res.status(200).json({ message: `프로젝트를 삭제하였습니다.` });
  }),
);

export default router;
