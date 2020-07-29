import express from 'express';
import xssFilter from 'xssfilter';

import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '/', // 조회
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const {
      idx,
      now,
      complete,
      join,
      category,
      title,
      contents,
      name,
      page,
    } = req.query;

    // 태스크
    // 디폴트 파라미터
    const param = {
      idx,
      now: now || '',
      complete: complete || '',
      join: join || '',
      category: category || '',
      title: title || '',
      contents: contents || '',
      name: name || '',
      member_idx: req.session.member.idx,
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    let [[project]] = await mapper('Project', 'selectOne', { idx });

    if (!project) {
      res.status(404).json({ message: `잘못된 접근입니다.` });
      return;
    }

    let [items] = await mapper('Task', 'selectAllPage', param);

    // 태스크 권한처리 -------------------------------------
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      item.own = false;
      item.ma = false;

      // 1. 태스크 작성자
      if (member.idx == item.member_idx) {
        item.own = true;
      }

      // 2. 프로젝트 작성자
      if (member.idx == project.member_idx) {
        item.ma = true;
      }

      // 3. 웹 관리자, 마스터 관리자
      if (member.role == 'SUPER_ADMIN' || member.role == 'MASTER_ADMIN') {
        item.ma = true;
      }
    }

    // 태스크 권한처리 -------------------------------------

    const [[{ row }]] = await mapper('Task', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.status(200).json({
      taskList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
    });
  }),
);

router.get(
  '/files/:idx', // 첨부파일 조회
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [files] = await mapper('Upload', 'selectFkTask', {
      task_idx: idx,
    });

    res.status(200).json({ files });
  }),
);

router.post(
  '', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    project_idx: 'required',
    category: 'required',
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    let { project_idx, category, title, contents, files } = req.body;

    // 시큐어 - XSS 방어
    contents = new xssFilter().filter(contents);

    // 권한처리 -------------------------------------
    const [members] = await mapper('Project', 'selectFkMember', {
      idx: project_idx,
    });
    const memberList = members.map(e => e.idx);

    if (!memberList.includes(member.idx)) {
      res.status(401).json({ message: `등록 권한이 없습니다.` });
      return;
    }
    // 권한처리 -------------------------------------

    const [{ insertId }] = await mapper('Task', 'insertOne', {
      project_idx,
      member_idx: member.idx,
      title,
      category,
      contents,
    });

    if (files) {
      for (let i = 0; i < files.length; i++) {
        await mapper('Upload', 'insertFkTask', {
          task_idx: insertId,
          upload_idx: files[i].idx,
        });
      }
    }

    // 진행률 처리
    const [[prs]] = await mapper('Task', 'selectProgress', {
      idx: project_idx,
    });

    const rts = Math.floor((prs.progress / (prs.row * 100)) * 100);
    await mapper('Project', 'updateProgress', {
      progress: rts,
      idx: project_idx,
    });

    await adminCtx.log(req, mapper, `태스크 등록 (${title})`);

    res.status(200).json({ message: `태스크를 등록하였습니다.` });
  }),
);

router.put(
  '/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    category: 'required',
    progress: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;
    let { title, category, progress, contents, files } = req.body;

    // 시큐어 - XSS 방어
    contents = new xssFilter().filter(contents);

    const [[task]] = await mapper('Task', 'selectOne', { idx });

    // 권한처리 -------------------------------------
    const member = req.session.member;
    let permission = false;

    // 1. 태스크 작성자
    if (member.idx == task.member_idx) {
      permission = true;
    }

    if (!permission) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }
    // 권한처리 -------------------------------------

    await mapper('Task', 'updateOne', {
      idx,
      title,
      category,
      progress,
      category,
      contents,
    });

    // 첨부파일 처리
    await mapper('Upload', 'deleteFkTask', {
      task_idx: idx,
    });

    if (files) {
      for (let i = 0; i < files.length; i++) {
        await mapper('Upload', 'insertFkTask', {
          task_idx: idx,
          upload_idx: files[i].idx,
        });
      }
    }

    // 진행률 처리
    const [[prs]] = await mapper('Task', 'selectProgress', {
      idx: task.project_idx,
    });

    const rts = Math.floor((prs.progress / (prs.row * 100)) * 100);
    await mapper('Project', 'updateProgress', {
      progress: rts,
      idx: task.project_idx,
    });

    await adminCtx.log(req, mapper, `태스크 수정 (${title})`);

    res.status(200).json({ message: `태스크를 수정하였습니다.` });
  }),
);

router.delete(
  '/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const idx = req.params.idx;

    const [[task]] = await mapper('Task', 'selectOne', { idx });

    // 권한처리 -------------------------------------
    const member = req.session.member;
    let permission = false;

    // 1. 프로젝트 생성자
    if (member.idx == task.project_idx) {
      permission = true;
    }

    //2. 태스크 작성자
    if (member.idx == task.member_idx) {
      permission = true;
    }

    // 3. 웹관리자, 최고관리자
    if (member.role == 'SUPER_ADMIN' || member.role == 'MASTER_ADMIN') {
      permission = true;
    }

    if (!permission) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }
    // 권한처리 -------------------------------------

    // 첨부파일 처리
    await mapper('Upload', 'deleteFkTask', {
      task_idx: idx,
    });

    await mapper('Task', 'deleteOne', {
      idx,
    });

    // 진행률 처리
    const [[prs]] = await mapper('Task', 'selectProgress', {
      idx: task.project_idx,
    });

    const rts = Math.floor((prs.progress / (prs.row * 100)) * 100);
    await mapper('Project', 'updateProgress', {
      progress: rts,
      idx: task.project_idx,
    });

    await adminCtx.log(req, mapper, `태스크 삭제 (${task.title})`);

    res.status(200).json({ message: `태스크를 삭제하였습니다.` });
  }),
);

export default router;
