import express from 'express';
import database from '@/models';

const httpVerbsArray = ['get', 'post', 'put', 'delete', 'patch'];

const asyncify = app => {
  return new Proxy(app, {
    get(app, prop) {
      if (httpVerbsArray.includes(prop)) {
        return delegate(app, prop);
      } else {
        return app[prop] && app[prop].bind && app[prop].bind(app);
      }
    },
  });
};

const delegate = (app, prop) => {
  const func = app[prop].bind(app);
  return (url, ...funcs) => {
    return func(
      url,
      ...funcs.map(e =>
        e[Symbol.toStringTag] === 'AsyncFunction' ? wrap(e) : e,
      ),
    );
  };
};

const wrap = asyncFunc => {
  return async (req, res, next) => {
    const transaction = await database.sequelize.transaction();
    req.transaction = transaction;
    asyncFunc(req, res, next)
      .then(async () => {
        await transaction.commit();
      })
      .catch(async error => {
        await transaction.rollback();
        next(error);
      });
  };
};

export default function router() {
  return asyncify(express.Router());
}
