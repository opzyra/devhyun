import express from 'express';
import sessionCtx from '../../core/session';
import validateCtx from '../../core/validate';
import wrap from '../../core/wrap';

const router = express.Router();

/* 게시판 */
router.get(
  '/board/post', // 포스트
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

    const [items] = await mapper('PostBoard', 'selectAllPage', param);
    const [[{ row }]] = await mapper('PostBoard', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/board/post', {
      postList: {
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
  '/board/post/detail', // 포스트 상세보기
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[post]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (!post) {
      throw new Error('잘못된 접근입니다.');
    }

    // 권한 처리
    post.own = true;
    const role = req.session.member.role;
    if (role == 'MEMBER_ADMIN' && req.session.member.idx != post.member_idx) {
      post.own = false;
    }

    res.render('admin/board/post/detail', {
      post,
      layout: false,
    });
  }),
);

router.get(
  '/board/post/create', // 포스트 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/board/post/create', {
      layout: false,
    });
  },
);

router.get(
  '/board/post/edit', // 포스트 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[post]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (!post) {
      throw new Error('잘못된 접근입니다.');
    }

    // 수정 권한 체크
    const role = req.session.member.role;
    if (role == 'MEMBER_ADMIN' && req.session.member.idx != post.member_idx) {
      throw new Error('수정 권한이 없습니다.');
    }

    res.render('admin/board/post/edit', {
      post,
      layout: false,
    });
  }),
);

router.get(
  '/board/series', // 시리즈
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

    const [items] = await mapper('SeriesBoard', 'selectAllPage', param);
    const [[{ row }]] = await mapper('SeriesBoard', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/board/series', {
      seriesList: {
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
  '/board/series/detail', // 시리즈 상세보기
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[series]] = await mapper('SeriesBoard', 'selectOne', {
      idx,
    });

    if (!series) {
      throw new Error('잘못된 접근입니다.');
    }

    // 관련 포스트
    const [posts] = await mapper('SeriesBoard', 'selectAlFkPost', {
      series_idx: idx,
    });

    // 권한 처리
    series.own = true;
    const role = req.session.member.role;
    if (role == 'MEMBER_ADMIN' && req.session.member.idx != series.member_idx) {
      series.own = false;
    }

    res.render('admin/board/series/detail', {
      series,
      posts,
      layout: false,
    });
  }),
);

router.get(
  '/board/series/create', // 시리즈 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/board/series/create', {
      layout: false,
    });
  },
);

router.get(
  '/board/series/edit', // 시리즈 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;

    const [[series]] = await mapper('SeriesBoard', 'selectOne', {
      idx,
    });

    if (!series) {
      throw new Error('잘못된 접근입니다.');
    }

    // 관련 포스트
    const [posts] = await mapper('SeriesBoard', 'selectAlFkPost', {
      series_idx: idx,
    });

    // 수정 권한 체크
    const role = req.session.member.role;
    if (role == 'MEMBER_ADMIN' && req.session.member.idx != series.member_idx) {
      throw new Error('수정 권한이 없습니다.');
    }

    res.render('admin/board/series/edit', {
      series,
      posts,
      layout: false,
    });
  }),
);

export default router;
