import express from 'express';
import xssFilter from 'xssfilter';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '', // 전체 조회
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [schedules] = await mapper('Schedule', 'selectAll');

    res.status(200).json({ schedules });
  }),
);

router.get(
  '/:idx', // 요소 조회
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });
    const [members] = await mapper('Schedule', 'selectFkMember', {
      idx,
    });

    schedule.members = members;
    schedule.own = true;
    schedule.mown = true;

    if (member.role == 'MEMBER_ADMIN' && member.idx != schedule.member_idx) {
      schedule.own = false;
    }

    const ma = members.map(e => e.idx);
    if (member.idx != schedule.member_idx) {
      schedule.mown = false;
    }

    if (ma.includes(member.idx)) {
      schedule.mown = true;
    }

    res.status(200).json({ schedule });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    color: 'required',
    start: ['required', 'date'],
    end: ['required', 'date'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    let { title, location, description, color, start, end, members } = req.body;

    // 시큐어 - XSS 방어
    description = new xssFilter().filter(description);

    const [{ insertId }] = await mapper('Schedule', 'insertOne', {
      member_idx: member.idx,
      title,
      location,
      description,
      color,
      start,
      end,
    });

    if (members) {
      for (let i = 0; i < members.length; i++) {
        await mapper('Schedule', 'insertFkMember', {
          schedule_idx: insertId,
          member_idx: members[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `일정 등록 (${title})`);

    res.status(200).json({ message: `일정을 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    color: 'required',
    start: ['required', 'date'],
    end: ['required', 'date'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    let { title, location, description, color, start, end, members } = req.body;

    // 권한 체크
    // 자신이 작성한것이거나 대표, 매너저 권한 이상인 경우 처리
    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });

    if (member.role == 'MEMBER_ADMIN' && member.idx != schedule.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    // 시큐어 - XSS 방어
    description = new xssFilter().filter(description);

    await mapper('Schedule', 'updateOne', {
      idx,
      title,
      location,
      description,
      color,
      start,
      end,
    });

    await mapper('Schedule', 'deleteFkMember', { schedule_idx: idx });

    if (members) {
      for (let i = 0; i < members.length; i++) {
        await mapper('Schedule', 'insertFkMember', {
          schedule_idx: idx,
          member_idx: members[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `일정 수정 (${title})`);

    res.status(200).json({ message: `일정을 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });

    if (role == 'MEMBER_ADMIN' && member.idx != schedule.member_idx) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }

    await mapper('Schedule', 'deleteFkMember', { schedule_idx: idx });

    await mapper('Schedule', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `일정 삭제 (${schedule.title})`);

    res.status(200).json({ message: `일정을 삭제하였습니다.` });
  }),
);

router.put(
  '/move/:idx', // 이동
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    const { title, start, end } = req.body;

    // 권한 체크
    // 자신이 작성한것이거나 대표, 매너저 권한 이상인 경우 처리
    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });

    if (member.role == 'MEMBER_ADMIN' && member.idx != schedule.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    await mapper('Schedule', 'updateDate', {
      idx,
      start,
      end,
    });

    await adminCtx.log(req, mapper, `일정 수정 (${title})`);

    res.status(200).json({ message: `일정을 수정하였습니다.` });
  }),
);

router.put(
  '/clear/:idx', // 상태 변경
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    // 권한 체크
    // 자신이 작성한것이거나 대표, 매너저 권한 이상인 경우 처리
    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });
    const [members] = await mapper('Schedule', 'selectFkMember', {
      idx,
    });

    const ma = members.map(e => e.idx);

    if (
      member.role == 'MEMBER_ADMIN' &&
      !ma.includes(member.idx) &&
      member.idx != schedule.member_idx
    ) {
      res.status(401).json({ message: `변경 권한이 없습니다.` });
      return;
    }

    await mapper('Schedule', 'updateClear', {
      idx,
      clear: !schedule.clear,
    });

    await adminCtx.log(
      req,
      mapper,
      `일정 상태 변경 (${schedule.title}, ${
        !schedule.clear ? '완료' : '진행'
      })`,
    );

    res
      .status(200)
      .json({ clear: !schedule.clear, message: `일정 상태를 변경하였습니다.` });
  }),
);

export default router;
