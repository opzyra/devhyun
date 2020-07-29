import requestIp from 'request-ip';

import db from '../db';
import warp from './wrap';

import { accessLogger } from './logger';
import CONFIG from '../config/index';

const getClientIp = req => {
  let ip = requestIp.getClientIp(req);
  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  if (
    !ip.match(
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    )
  ) {
    ip = '0.0.0.0';
  }
  return ip;
};

const getClientDevice = req => {
  const header = req.headers['user-agent'];
  if (!header) return 'undefined';

  if (header.indexOf('MSIE') > -1) {
    return 'MSIE';
  } else if (header.indexOf('Chrome') > -1) {
    return 'Chrome';
  } else if (header.indexOf('Opera') > -1) {
    return 'Opera';
  } else if (header.indexOf('Firefox') > -1) {
    return 'Firefox';
  } else if (header.indexOf('rv:') > -1) {
    return 'MSIE';
  } else if (header.indexOf('iPhone') > -1) {
    return 'Iphone';
  } else if (header.indexOf('iPad') > -1) {
    return 'Ipad';
  } else if (header.indexOf('Android') > -1) {
    return 'Android';
  } else if (header.indexOf('BlackBerry') > -1) {
    return 'BlackBerry';
  } else if (header.indexOf('symbian') > -1) {
    return 'Symbian';
  } else if (header.indexOf('sony') > -1) {
    return 'Sony';
  } else if (header.indexOf('Mobile') > -1) {
    return 'Mobile';
  }
  return 'undefined';
};

const listener = store => {
  return warp.base(async (req, res, next) => {
    const page = req.path || '';
    const uri = page.replace(/\?.*/, '');

    // 정적파일 요청의 경우 스킵
    if (uri.includes('.')) {
      next();
      return;
    }

    let ip = getClientIp(req);
    let device = getClientDevice(req);
    let referer = req.headers['referer'];
    let id = req.sessionID;
    let query = '';
    let domain = '';

    // 최초 세션이 생성되는 경우 DB에 저장
    if (!req.session.returning) {
      req.session.returning = true;

      if (!!referer && !referer.includes(CONFIG.CTX.DOMAIN)) {
        domain = referer.replace(/(http(s)?):\/\//g, '').replace(/\/.*/, '');
        let qs = referer.substring(referer.lastIndexOf('?') + 1).split('&');
        for (let i = 0; i < qs.length; i++) {
          let el = qs[i];
          if (el.includes('query=') || el.includes('q=')) {
            query = el.replace('query=', '').replace('q=', '');
            query = decodeURI(query);
          }
        }
      } else {
        referer = '';
      }

      // 관리자 페이지로 접근하는 경우는 제외
      if (
        !page.includes('admin') &&
        !page.includes('api') &&
        device != 'undefined'
      ) {
        // 디비 로그 저장
        const conn = await db.conn();
        await db.query(conn, 'SessionLog', 'insertOne', {
          device,
          domain,
          id,
          ip,
          page,
          query,
          referer,
        });
        await db.close(conn);
      }
    }

    // 이전 요청 주소 저장
    let history = req.headers['referer'];
    req.session.history = history;

    // 템플릿 엔진에서 사용하기 위한 세션 주입
    res.locals.session = req.session;

    // 중복 로그인 체크
    if (req.session.member) {
      const { member } = req.session;
      store.all((_, sessions) => {
        for (let i = 0; i < sessions.length; i++) {
          let e = sessions[i];
          if (
            !!e.member &&
            e.member.id == member.id &&
            e.id != req.session.id
          ) {
            store.destroy(e.id, error => {});
          }
        }
      });
    }

    let member = req.session.member;

    // 접근 로그
    accessLogger.info(
      `${ip}, ${device}, ${id}, ${member ? member.id : 'guest'}, ${uri}`,
    );

    // 앱 이름
    res.locals.APP = CONFIG.CTX.NAME;
    res.locals.ENV = process.env.NODE_ENV;
    res.locals.DOMAIN = CONFIG.CTX.DOMAIN;
    res.locals.URL = CONFIG.CTX.DOMAIN + req.url;

    next();
  });
};

// 전체 권한
const isAll = () => {
  return (req, res, next) => {
    next();
    return;
  };
};

// 로그인 하지 않은 사용자
const isAnonymous = () => {
  return (req, res, next) => {
    // 로그인 하지 않은 경우
    if (!req.session.member) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
  };
};

// 로그인한 사용자
const isAuthenticated = () => {
  return (req, res, next) => {
    // 로그인 한 경우
    if (req.session.member) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
  };
};

// 관리자
const isAdmin = () => {
  return (req, res, next) => {
    // 세션에 정보가 있을 때
    if (req.session.member) {
      // 관리자 권한이 있는 경우
      if (req.session.member.role.indexOf('ADMIN') != -1) {
        next();
        return;
      }
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
  };
};

// 사용자
const isUser = () => {
  return (req, res, next) => {
    // 세션에 정보가 있을 때
    if (req.session.member) {
      // 관리자 권한이 있는 경우
      if (req.session.member.role.indexOf('USER') != -1) {
        next();
        return;
      }
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
  };
};

// 마스터 관리자 이상 권한
const isGeMaster = () => {
  return (req, res, next) => {
    // 세션에 정보가 있을 때
    if (req.session.member) {
      let roles = ['SUPER_ADMIN', 'MASTER_ADMIN'];
      for (let i = 0; i < roles.length; i++) {
        if (req.session.member.role == roles[i]) {
          next();
          return;
        }
      }
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
  };
};

// 지정 권한
const hasRole = (...roles) => {
  return (req, res, next) => {
    // 세션에 정보가 있을 때
    if (req.session.member) {
      // 해당 권한이 있는지 체크
      for (let i = 0; i < roles.length; i++) {
        if (req.session.member.role == roles[i]) {
          next();
          return;
        }
      }
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      // TODO 401페이지로 처리
      res.render('error/401', { layout: false });
    }
    return;
  };
};

export default {
  getClientIp,
  getClientDevice,
  listener,
  isAll,
  isAdmin,
  isUser,
  isAnonymous,
  isAuthenticated,
  isGeMaster,
  hasRole,
};
