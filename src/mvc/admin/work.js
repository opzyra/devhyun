import express from 'express';
import moment from 'moment';
import sessionCtx from '../../core/session';
import validateCtx from '../../core/validate';
import wrap from '../../core/wrap';

const router = express.Router();

router.get(
  '/work/schedule', // 스케줄
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { year, month } = req.query;
    let start = moment()
      .subtract(1, 'months')
      .format('YYYY-MM-01');
    let end = moment()
      .add(1, 'months')
      .endOf('month')
      .format('YYYY-MM-DD');
    if (year && month) {
      start = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
        .subtract(1, 'months')
        .format('YYYY-MM-01');
      end = moment(`${year}-${month}-01`, 'YYYY-MM-DD')
        .add(1, 'months')
        .endOf('month')
        .format('YYYY-MM-DD');
    }

    let [schedules] = await mapper('Schedule', 'selectAll', {
      start,
      end,
    });

    res.render('admin/work/schedule', {
      schedules: { data: JSON.stringify(schedules) },
      layout: false,
    });
  }),
);

router.get(
  '/work/schedule/create', // 스케줄 등록
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [admins] = await mapper('Member', 'selectAdmin');
    res.render('admin/work/schedule/create', { admins, layout: false });
  }),
);

router.get(
  '/work/schedule/edit', // 스케줄 수정
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;
    const [[schedule]] = await mapper('Schedule', 'selectOne', { idx });

    if (!schedule) {
      throw new Error('잘못된 접근입니다.');
    }

    // 권한 체크
    const role = req.session.member.role;
    if (
      role == 'MEMBER_ADMIN' &&
      req.session.member.idx != schedule.member_idx
    ) {
      throw new Error('접근 권한이 없습니다.');
    }

    const [members] = await mapper('Schedule', 'selectFkMember', {
      idx,
    });

    schedule.members = members;

    const [admins] = await mapper('Member', 'selectAdmin');
    res.render('admin/work/schedule/edit', {
      admins,
      schedule,
      members: {
        data: JSON.stringify(members.map(e => e.idx)) || [],
      },
      layout: false,
    });
  }),
);

router.get(
  '/work/project', // 프로젝트
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const {
      title,
      page,
      now,
      complete,
      important,
      join,
      order,
      sort,
    } = req.query;

    // 디폴트 파라미터
    const param = {
      member_idx: req.session.member.idx,
      title: title || '',
      now: now || '',
      complete: complete || '',
      important: important || '',
      join: join || '',
      order: order || '',
      sort: sort || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    const [items] = await mapper('Project', 'selectAllPage', param);
    const [[{ row }]] = await mapper('Project', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    // 참여자 정보
    for (let i = 0; i < items.length; i++) {
      let [members] = await mapper('Project', 'selectFkMember', {
        idx: items[i].idx,
      });
      items[i].members = members;
    }

    res.render('admin/work/project', {
      projectList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

router.get(
  '/work/project/create', // 프로젝트 등록
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [admins] = await mapper('Member', 'selectAdmin');
    res.render('admin/work/project/create', { admins, layout: false });
  }),
);

router.get(
  '/work/project/edit', // 프로젝트 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[project]] = await mapper('Project', 'selectOne', { idx });

    if (!project) {
      throw new Error('잘못된 접근입니다.');
    }

    // 권한 체크
    if (req.session.member.idx != project.member_idx) {
      throw new Error('접근 권한이 없습니다.');
    }

    const [members] = await mapper('Project', 'selectFkMember', {
      idx,
    });

    project.members = members;

    const [admins] = await mapper('Member', 'selectAdmin');
    res.render('admin/work/project/edit', {
      project,
      members: {
        data: JSON.stringify(members.map(e => e.idx)) || [],
      },
      admins,
      layout: false,
    });
  }),
);

router.get(
  '/work/project/detail', // 프로젝트 상세보기
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
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

    let [[project]] = await mapper('Project', 'selectOne', { idx });

    if (!project) {
      throw new Error('잘못된 접근입니다.');
    }

    let [members] = await mapper('Project', 'selectFkMember', {
      idx,
    });
    project.members = members;

    // 프로젝트 권한처리 -------------------------------------
    project.own = false;
    project.ma = false;
    project.in = false;
    const member = req.session.member;

    // 1. 프로젝트 등록자
    if (member.idx == project.member_idx) {
      project.own = true;
    }

    // 2. 웹 관리자, 마스터 관리자
    if (member.role == 'SUPER_ADMIN' || member.role == 'MASTER_ADMIN') {
      project.ma = true;
    }

    // 3. 프로젝트 참여자
    const membersIdx = members.map(e => e.idx);
    if (membersIdx.includes(member.idx)) {
      project.in = true;
    }

    // 프로젝트 권한처리 -------------------------------------

    // 카테고리
    const [categoryList] = await mapper('Task', 'selectCategory', {
      idx,
    });

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

    res.render('admin/work/project/detail', {
      project,
      category: categoryList,
      taskList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

router.get(
  '/work/project/task/create', // 태스크 등록
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    // 카테고리
    const [category] = await mapper('Task', 'selectCategory', {
      idx,
    });

    res.render('admin/work/project/task/create', {
      idx,
      category: category.map(e => e.category),
      layout: false,
    });
  }),
);

router.get(
  '/work/project/task/edit', // 태스크 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[task]] = await mapper('Task', 'selectOne', { idx });

    if (!task) {
      throw new Error('잘못된 접근입니다.');
    }

    // 수정 권한 체크
    const member = req.session.member;
    if (member.idx != task.member_idx) {
      throw new Error('수정 권한이 없습니다.');
    }

    let [files] = await mapper('Upload', 'selectFkTask', {
      task_idx: task.idx,
    });

    if (!files) {
      files = [];
    }

    // 카테고리
    const [category] = await mapper('Task', 'selectCategory', {
      idx: task.project_idx,
    });

    res.render('admin/work/project/task/edit', {
      task,
      category: category.map(e => e.category),
      files: {
        items: files,
        data: JSON.stringify(files),
      },
      layout: false,
    });
  }),
);

/* 노트 */
router.get(
  '/work/lecture', // 노트
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { title, contents, name, page } = req.query;

    // 디폴트 파라미터
    const param = {
      title: title || '',
      contents: contents || '',
      name: name || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    const [items] = await mapper('Lecture', 'selectAllPage', param);
    const [[{ row }]] = await mapper('Lecture', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/work/lecture', {
      lectureList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

router.get(
  '/work/lecture/detail', // 노트 상세보기
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[lecture]] = await mapper('Lecture', 'selectOne', {
      idx,
    });

    if (!lecture) {
      throw new Error('잘못된 접근입니다.');
    }

    // 권한 처리
    lecture.own = true;
    const role = req.session.member.role;
    if (
      role == 'MEMBER_ADMIN' &&
      req.session.member.idx != lecture.member_idx
    ) {
      lecture.own = false;
    }

    res.render('admin/work/lecture/detail', {
      lecture,
      layout: false,
    });
  }),
);

router.get(
  '/work/lecture/create', // 노트 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/work/lecture/create', {
      layout: false,
    });
  },
);

router.get(
  '/work/lecture/edit', // 노트 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[lecture]] = await mapper('Lecture', 'selectOne', {
      idx,
    });

    if (!lecture) {
      throw new Error('잘못된 접근입니다.');
    }

    // 수정 권한 체크
    const role = req.session.member.role;
    if (
      role == 'MEMBER_ADMIN' &&
      req.session.member.idx != lecture.member_idx
    ) {
      throw new Error('수정 권한이 없습니다.');
    }

    res.render('admin/work/lecture/edit', {
      lecture,
      layout: false,
    });
  }),
);

export default router;
