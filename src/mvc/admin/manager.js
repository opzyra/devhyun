import express from 'express';
import sessionCtx from '../../core/session';
import wrap from '../../core/wrap';

const router = express.Router();

/* 관리자 */
router.get(
  '/manager/register', // 관리자 등록
  sessionCtx.isGeMaster(),
  (req, res) => {
    res.render('admin/manager/register', { layout: false });
  },
);

router.get(
  '/manager/list', // 관리자 정보
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    // 관리자 목록 쿼리
    const { id, name, page } = req.query;

    // 디폴트 파라미터
    const param = {
      id: id || '',
      name: name || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    const [items] = await mapper('Member', 'selectAdminAllPage', param);
    const [[{ row }]] = await mapper('Member', 'countAdminAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/manager/list', {
      adminList: {
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
  '/manager/actlog', // 관리자 활동 로그
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    // 관리자 목록 쿼리
    const { id, name, contents, start, end, page } = req.query;

    // 디폴트 파라미터
    const param = {
      id: id || '',
      name: name || '',
      contents: contents || '',
      start: start || '',
      end: end || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 20 || 0,
    };

    const [items] = await mapper('ActivityLog', 'selectAllPage', param);
    const [[{ row }]] = await mapper('ActivityLog', 'countAllPage', param);

    let totalPage = row / 20;

    if (row % 20 > 0) {
      totalPage++;
    }

    res.render('admin/manager/actlog', {
      activiyList: {
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
  '/manager/edit', // 관리자 정보 수정
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.query;
    const [[member]] = await mapper('Member', 'selectByIdx', { idx });

    res.render('admin/manager/edit', { admin: member, layout: false });
  }),
);

router.get('/manager/repwd', (req, res) => {
  res.render('admin/manager/repwd', { layout: false });
});

router.get('/manager/thumbnail', (req, res) => {
  res.render('admin/manager/thumbnail', { layout: false });
});

export default router;
