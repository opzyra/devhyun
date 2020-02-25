import session from 'express-session';
import connectRedis from 'connect-redis';
import requestIp from 'request-ip';

const RedisStore = connectRedis(session);
const store = new RedisStore({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  prefix: 'session:',
  db: parseInt(process.env.REDIS_DB),
});

const config = session({
  store,
  name: 'sessionId',
  secret: process.env.APP_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 1000 * 60 * process.env.APP_MAX_SESSION_TIME,
  },
});

const info = req => {
  const header = req.headers['user-agent'];
  let ip = requestIp.getClientIp(req);
  let device = 'undefined';
  let robot = false;

  if (!header) {
    device = 'undefined';
  } else if (header.indexOf('MSIE') > -1) {
    device = 'MSIE';
  } else if (header.indexOf('Chrome') > -1) {
    device = 'Chrome';
  } else if (header.indexOf('Opera') > -1) {
    device = 'Opera';
  } else if (header.indexOf('Firefox') > -1) {
    device = 'Firefox';
  } else if (header.indexOf('rv:') > -1) {
    device = 'MSIE';
  } else if (header.indexOf('iPhone') > -1) {
    device = 'Iphone';
  } else if (header.indexOf('iPad') > -1) {
    device = 'Ipad';
  } else if (header.indexOf('Android') > -1) {
    device = 'Android';
  } else if (header.indexOf('BlackBerry') > -1) {
    device = 'BlackBerry';
  } else if (header.indexOf('symbian') > -1) {
    device = 'Symbian';
  } else if (header.indexOf('sony') > -1) {
    device = 'Sony';
  } else if (header.indexOf('Mobile') > -1) {
    device = 'Mobile';
  }

  if (header && header.indexOf('bot') > -1) {
    robot = true;
  }

  if (ip.substr(0, 7) == '::ffff:') {
    ip = ip.substr(7);
  }

  if (
    !ip.match(
      '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    )
  ) {
    ip = '127.0.0.1';
  }

  return {
    ip,
    device,
    robot,
  };
};

const listener = () => {
  return (req, res, next) => {
    const page = req.path || '';
    const uri = page.replace(/\?.*/, '');

    // 정적파일 요청의 경우 스킵
    if (uri.includes('.')) {
      next();
      return;
    }

    // 회원 관련 처리
    if (req.session.member) {
      const { member } = req.session;

      // 중복 로그인 체크
      store.all((_, sessions) => {
        for (let i = 0; i < sessions.length; i++) {
          let e = sessions[i];
          if (
            !!e.member &&
            e.member.id == member.id &&
            e.id != req.session.id
          ) {
            // eslint-disable-next-line no-unused-vars
            store.destroy(e.id, error => {});
          }
        }
      });

      // 로그인 플랫폼 처리
      // eslint-disable-next-line no-unused-vars
      const [platform, ...rest] = member.id.split('_');
      member.platform = platform;
    }

    // 클라이언트 IP 주입
    req.info = info(req);

    // 템플릿 엔진에서 사용하기 위한 세션 주입
    res.locals.session = req.session;

    // 애플리케이션 정보
    res.locals.APP = process.env.APP_NAME;
    res.locals.ENV = process.env.NODE_ENV;
    res.locals.DOMAIN = process.env.APP_DOMAIN;
    res.locals.URL = process.env.APP_DOMAIN + req.url;
    res.locals.CACHE = process.env.APP_CACHE;
    res.locals.VERSION = process.env.APP_VERSION;

    next();
  };
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
    if (!req.session.member) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      res.render('error/401', { layout: false });
    }
  };
};

// 로그인한 사용자
const isAuthenticated = () => {
  return (req, res, next) => {
    if (req.session.member) {
      next();
      return;
    }

    if (req.is('json') || req.is('multipart/form-data')) {
      res.status(401).json({ message: '접근 권한이 없습니다.' });
    } else {
      res.render('error/401', { layout: false });
    }
  };
};

// 관리자
const isAdmin = () => {
  return (req, res, next) => {
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
      res.render('error/401', { layout: false });
    }
  };
};

// 사용자
const isUser = () => {
  return (req, res, next) => {
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
      res.render('error/401', { layout: false });
    }
  };
};

// 지정 권한
const hasRole = (...roles) => {
  return (req, res, next) => {
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
      res.render('error/401', { layout: false });
    }
    return;
  };
};

export default {
  config,
  listener,
  isAll,
  isAdmin,
  isUser,
  isAnonymous,
  isAuthenticated,
  hasRole,
};
