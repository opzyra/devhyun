import validator from './validator';
import { debugLogger } from './logger';

const query = (...querys) => {
  return (req, res, next) => {
    let validate = true;

    // 해당 파라미터가 유효한지 체크
    for (let i = 0; i < querys.length; i++) {
      if (!req.query[querys[i]]) validate = false;
    }

    if (validate) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(400).json({ message: '잘못된 접근입니다.' });
    } else {
      // TODO 404페이지로 처리
      res.render('error/404', { layout: false });
    }

    return;
  };
};

const params = (...params) => {
  return (req, res, next) => {
    let validate = true;

    // 해당 파라미터가 유효한지 체크
    for (let i = 0; i < params.length; i++) {
      if (!req.params[params[i]]) validate = false;
    }

    if (validate) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(400).json({ message: '잘못된 접근입니다.' });
    } else {
      // TODO 404페이지로 처리
      res.render('error/404', { layout: false });
    }

    return;
  };
};

const body = rules => {
  return (req, res, next) => {
    const keys = Object.keys(rules);
    const data = {};
    keys.forEach(e => {
      data[e] = req.body[e];
    });

    debugLogger.info(JSON.stringify(data));

    const v = validator.make(data, rules);

    if (v.fails()) {
      res.status(400).json({ message: '데이터 검증에서 오류가 발생했습니다.' });
      debugLogger.info(JSON.stringify(v.getErrors()));
      return;
    }

    next();
    return;
  };
};

export default { query, params, body };
