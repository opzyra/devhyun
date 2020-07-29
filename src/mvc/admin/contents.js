import express from 'express';
import sessionCtx from '../../core/session';
import validateCtx from '../../core/validate';
import wrap from '../../core/wrap';

const router = express.Router();

/* 콘텐츠 */
router.get(
  '/contents/history', // 연혁
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [historys] = await mapper('History', 'selectAll');

    let yrs = historys
      .map(e => e.year)
      .filter((e, idx, arr) => arr.indexOf(e) === idx)
      .map(e => {
        return {
          year: e,
          list: [],
        };
      });
    yrs.forEach(e => {
      let yearItems = historys.filter(el => el.year == e.year);
      let months = yearItems
        .map(e => e.month)
        .filter((e, idx, arr) => arr.indexOf(e) === idx)
        .map(e => {
          return {
            month: e,
            list: [],
          };
        });
      months.forEach(e => {
        e.list.push(...yearItems.filter(el => el.month == e.month));
      });
      e.list.push(...months);
    });

    res.render('admin/contents/history', {
      historys: yrs,
      historyCount: historys.length,
      layout: false,
    });
  }),
);

router.get(
  '/contents/history/create', // 연혁 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/contents/history/create', {
      layout: false,
    });
  },
);

router.get(
  '/contents/history/edit', // 연혁 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;
    const [[history]] = await mapper('History', 'selectOne', { idx });

    if (!history) {
      throw new Error('잘못된 접근입니다.');
    }

    res.render('admin/contents/history/edit', {
      history,
      layout: false,
    });
  }),
);

router.get(
  '/contents/history/order', // 연혁 순서
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [items] = await mapper('History', 'selectAll');
    const [[{ row }]] = await mapper('History', 'countAll');

    res.render('admin/contents/history/order', {
      historyList: {
        items,
        row,
      },
      layout: false,
    });
  }),
);

router.get(
  '/contents/partner', // 협력기업
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    // 관리자 목록 쿼리
    const { name, page } = req.query;

    // 디폴트 파라미터
    const param = {
      name: name || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    const [items] = await mapper('Partner', 'selectAllPage', param);
    const [[{ row }]] = await mapper('Partner', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/contents/partner', {
      partnerList: {
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
  '/contents/partner/create', // 협력 기업 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/contents/partner/create', {
      layout: false,
    });
  },
);

router.get(
  '/contents/partner/edit', // 협력 기업 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.query('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;
    const [[partner]] = await mapper('Partner', 'selectOne', { idx });

    if (!partner) {
      throw new Error('잘못된 접근입니다.');
    }

    res.render('admin/contents/partner/edit', {
      partner,
      layout: false,
    });
  }),
);

router.get(
  '/contents/partner/order', // 협력기업 순서
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [items] = awaitmapper('Partner', 'selectAll');
    const [[{ row }]] = awaitmapper('Partner', 'countAll');

    res.render('admin/contents/partner/order', {
      partnerList: {
        items,
        row,
      },
      layout: false,
    });
  }),
);

router.get(
  '/contents/banner', // 배너
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [items] = awaitmapper('Banner', 'selectAll');
    const [[{ row }]] = awaitmapper('Banner', 'countAll');

    res.render('admin/contents/banner', {
      bannerList: {
        items,
        row,
      },
      layout: false,
    });
  }),
);

router.get(
  '/contents/banner/create', // 배너 등록
  sessionCtx.isAdmin(), // 관리자 권한
  (req, res) => {
    res.render('admin/contents/banner/create', {
      layout: false,
    });
  },
);

router.get(
  '/contents/banner/edit', // 배너 수정
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;
    const [[banner]] = await mapper('Banner', 'selectOne', { idx });

    if (!banner) {
      throw new Error('잘못된 접근입니다.');
    }

    res.render('admin/contents/banner/edit', {
      banner,
      layout: false,
    });
  }),
);

router.get(
  '/contents/banner/order', // 배너 순서
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const [items] = await mapper('Banner', 'selectAll');
    const [[{ row }]] = await mapper('Banner', 'countAll');

    res.render('admin/contents/banner/order', {
      bannerList: {
        items,
        row,
      },
      layout: false,
    });
  }),
);

export default router;
