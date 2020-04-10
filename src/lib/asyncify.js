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
    const transaction = await database.transaction();
    asyncFunc(req, res, transaction)
      .then(async () => {
        await transaction.commit();
      })
      .catch(async error => {
        await transaction.rollback();
        next(error);
      });
  };
};

export const txWrap = asyncFunc => {
  return async () => {
    const transaction = await database.transaction();
    asyncFunc(transaction)
      .then(async () => {
        await transaction.commit();
      })
      .catch(async error => {
        await transaction.rollback();
        throw error;
      });
  };
};

export default function controller() {
  return {
    router: asyncify(express.Router()),
    get(url, ...middle) {
      this.router.get(url, ...middle);
      return [...middle];
    },
    post(url, ...middle) {
      this.router.post(url, ...middle);
      return [...middle];
    },
    put(url, ...middle) {
      this.router.put(url, ...middle);
      return [...middle];
    },
    delete(url, ...middle) {
      this.router.delete(url, ...middle);
      return [...middle];
    },
  };
}
