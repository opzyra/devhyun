import express from 'express';
import bcrypt from 'bcrypt';
import randomString from 'random-string';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '/checkid', // 아이디 중복 체크
  sessionCtx.isAll(), // 전체 권한
  wrap.query(async (req, res, next, mapper) => {
    const { id } = req.query;

    if (id == '') {
      res.status(400).json({ message: '아이디를 입력해주세요.' });
      return;
    }

    const [[member]] = await mapper('Member', 'selectById', { id });

    if (member) {
      res.status(400).json({ message: '이미 사용중인 아이디 입니다.' });
      return;
    }

    res.status(200).json({ message: '아이디를 사용할 수 있습니다.' });
  }),
);

router.post(
  '/admin', // 관리자 등록
  sessionCtx.isGeMaster(), // 최고 관리자 권한
  validateCtx.body({
    // 유효성 검사
    role: 'required',
    id: 'required',
    password: ['required', 'min:8'],
    name: 'required',
    phone: [
      'required',
      'regex:/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/',
    ],
    email: ['required', 'email'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    const { role, id, password, name, position, phone, email } = req.body;

    const [[member]] = await mapper('Member', 'selectById', { id });

    if (member) {
      res.status(400).json({ message: '아이디가 이미 존재합니다.' });
      return;
    }

    const encodedPassword = await bcrypt.hash(password, 10);

    await mapper('Member', 'insertAdminOne', {
      role,
      id,
      password: encodedPassword,
      name,
      position,
      phone,
      email,
    });

    await adminCtx.log(req, mapper, `관리자 등록(${name})`);
    res.status(200).json({ message: `${name}님을 관리자로 등록하였습니다.` });
  }),
);

router.put(
  '/admin', // 관리자 정보 수정
  sessionCtx.isGeMaster(), // 최고 관리자 권한
  validateCtx.body({
    // 유효성 검사
    idx: 'required',
    role: 'required',
    id: 'required',
    name: 'required',
    phone: [
      'required',
      'regex:/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/',
    ],
    email: ['required', 'email'],
    active: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const { idx, role, name, position, phone, email, active } = req.body;

    await mapper('Member', 'updateAdmin', {
      idx,
      role,
      name,
      position,
      phone,
      email,
      active,
    });

    await adminCtx.log(req, mapper, `관리자 정보 수정(${name})`);
    res.status(200).json({ message: `${name}님의 정보가 수정되었습니다.` });
  }),
);

router.post(
  '/login', // 로그인
  sessionCtx.isAnonymous(), // 비로그인 권한
  wrap.query(async (req, res, next, mapper) => {
    const { id, password } = req.body;

    const [[member]] = await mapper('Member', 'selectById', { id });

    if (!member) {
      res.status(400).json({ message: '아이디가 존재하지 않습니다.' });
      return;
    }

    const match = await bcrypt.compare(password, member.password);
    if (!match) {
      res.status(400).json({ message: '비밀번호가 올바르지 않습니다.' });
      return;
    }

    if (!member.active) {
      res.status(403).json({ message: '관리자에 의해 정지된 계정입니다.' });
      return;
    }

    if (member.withdraw) {
      res.status(403).json({ message: '탈퇴한 계정입니다.' });
      return;
    }

    req.session.member = member;

    await adminCtx.access(req, mapper, `시스템 로그인`);
    res.status(200).json({ message: `${member.name}님 환영합니다.` });
  }),
);

router.post(
  '/logout', // 로그아웃
  sessionCtx.isAuthenticated(), // 로그인 권한
  (req, res) => {
    req.session.member = null;
    res.status(200).json({ message: '로그아웃 되었습니다.' });
  },
);

router.put(
  '/repwd', // 비밀번호 변경
  sessionCtx.isAuthenticated(), // 로그인 권한
  validateCtx.body({
    // 유효성 검사
    oldPassword: 'required',
    newPassword: ['required', 'min:8'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    const { oldPassword, newPassword } = req.body;
    const member = req.session.member;
    const id = member.id;

    const match = await bcrypt.compare(oldPassword, member.password);
    if (!match) {
      res.status(403).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
      return;
    }
    const password = await bcrypt.hash(newPassword, 10);

    await mapper('Member', 'updatePassword', { id, password });

    // 세션을 초기화
    req.session.member = null;

    res
      .status(200)
      .json({ message: '비밀번호가 변경되었습니다.<br/>다시 로그인해주세요.' });
  }),
);

router.put(
  '/thumbnail', // 썸네일 변경
  sessionCtx.isAuthenticated(), // 로그인 권한
  wrap.query(async (req, res, next, mapper) => {
    const { thumbnail } = req.body;
    const member = req.session.member;

    await mapper('Member', 'updateThumbnail', {
      id: member.id,
      thumbnail,
    });

    const [[sMember]] = await mapper('Member', 'selectById', { id: member.id });

    // 세션 처리
    req.session.member = sMember;

    res.status(200).json({ message: '사진이 변경되었습니다.' });
  }),
);

router.post(
  '/search/id', // 아이디찾기
  sessionCtx.isAnonymous(), // 비 로그인 권한
  validateCtx.body({
    // 유효성 검사
    name: 'required',
    birth: 'required',
    phone: ['required', 'regex:/[01](0|1|6|7|8|9)[-](d{4}|d{3})[-]d{4}$/g'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    let { name, birth, phone } = req.body;

    const [members] = await mapper('Member', 'selectSearchId', {
      name,
      birth,
      phone,
    });

    if (members.length == 0) {
      res.status(500).json({ message: '사용자 정보가 일치하지 않습니다.' });
      return;
    }

    res.status(200).json({ members });
  }),
);

router.post(
  '/search/password', // 비밀번호 찾기
  sessionCtx.isAnonymous(), // 비 로그인 권한
  validateCtx.body({
    // 유효성 검사
    id: 'required',
    birth: 'required',
    phone: ['required', 'regex:/[01](0|1|6|7|8|9)[-](d{4}|d{3})[-]d{4}$/g'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    let { id, birth, phone } = req.body;

    const [[member]] = await mapper('Member', 'selectSearchPassword', {
      id,
      birth,
      phone,
    });

    if (!member) {
      res.status(500).json({ message: '사용자 정보가 일치하지 않습니다.' });
      return;
    }

    const ptmp = randomString({ length: 20 });

    // 임시 비밀번호 코드 처리
    await mapper('Member', 'updatePassTemp', {
      id,
      pass_temp: ptmp,
    });

    res.status(200).json({ id: member.id, ptmp });
  }),
);

router.post(
  '/change/password', // 비밀번호 찾기
  sessionCtx.isAnonymous(), // 비 로그인 권한
  validateCtx.body({
    // 유효성 검사
    id: 'required',
    pass_temp: 'required',
    password: ['required', 'min:8'],
  }),
  wrap.query(async (req, res, next, mapper) => {
    let { id, pass_temp, password } = req.body;

    const [[member]] = await mapper('Member', 'selectById', {
      id,
    });

    if (!member) {
      res.status(500).json({ message: '사용자 정보가 일치하지 않습니다.' });
      return;
    }

    if (member.pass_temp != pass_temp && member.pass_temp != '') {
      res.status(500).json({ message: '잘못된 접근입니다.' });
      return;
    }

    const newpassword = await bcrypt.hash(password, 10);

    // 임시 비밀번호 코드 처리
    await mapper('Member', 'updatePassword', {
      id,
      password: newpassword,
    });

    res.status(200).json({ message: '비밀번호가 변경되었습니다.' });
  }),
);

export default router;
