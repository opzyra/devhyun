import express from 'express';
import hbs from 'express-handlebars';
import session from 'express-session';
import connectRedis from 'connect-redis';
import bodyParser from 'body-parser';
import helpers from 'handlebars-helpers';
import compression from 'compression';

import helmet from 'helmet';

import batch from './batch';
import sessionMiddleware from './core/session';
import hbsHelpers from './core/hbs';
import { errorLogger } from './core/logger';
import mvc from './mvc';
import rest from './rest';

const app = express();
const RedisStore = connectRedis(session);
const store = new RedisStore({
  host: 'localhost',
  port: 6379,
  prefix: 'session:',
  db: 2,
});

// 뷰 엔진
app.engine(
  'hbs',
  hbs({
    extname: 'hbs',
    partialsDir: 'views/partials/',
    helpers: Object.assign(helpers(), hbsHelpers),
  }),
);

app.set('view engine', 'hbs');

if (process.env.NODE_ENV == 'production') {
  app.enable('view cache');
  app.use(compression());
}

// 보안
app.use(helmet());

// 정적파일
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// 바디파서
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// 세션
app.use(
  session({
    store,
    name: 'sessionId',
    secret: '#@$$DEV@$$@$',
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, maxAge: 1000 * 60 * 180 },
  }),
);

// 세션 리스너
app.use(sessionMiddleware.listener(store));

// 라우팅
app.use('/', mvc);
app.use('/api', rest);

// 404
app.use((req, res, next) => {
  res.statusCode = 404;

  res.render('error/404', {
    layout: false,
  });
});

// 예외 처리
app.use((error, req, res, next) => {
  errorLogger.error(error.stack);

  if (req.is('json') || req.is('multipart/form-data')) {
    res.status(500).json({ message: '시스템 오류가 발생하였습니다.' });
  }

  res.render('error/500', {
    layout: false,
  });
});

export default app;
