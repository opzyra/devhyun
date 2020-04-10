import fs from 'fs';
import path from 'path';

import app from '@/app';
import batch from '@/batch';
import logger from '@/lib/logger';

const runServer = async () => {
  const db = require('./models').default;
  const models = Object.assign(
    {},
    ...fs
      .readdirSync(__dirname + '/models')
      .filter(
        file =>
          file.indexOf('.') !== 0 &&
          file.indexOf('.map') < 0 &&
          file !== 'index.js',
      )
      .map(file => {
        const model = require(path.join(__dirname + '/models', file)).default;

        return {
          [model.name]: model,
        };
      }),
  );

  for (const model of Object.keys(models)) {
    typeof models[model].associate === 'function' &&
      models[model].associate(models);
  }

  const server = app.listen(process.env.APP_PORT, () => {});
  batch.initialize();

  try {
    if (process.env.NODE_ENV !== 'production') {
      // await db.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
      // await db.sync({ force: true });
    } else {
      await db.sync();
    }
  } catch (e) {
    stopServer(server, db);
    throw e;
  }
};

const stopServer = async (server, db) => {
  await server.close();
  await db.close();
  process.exit();
};

runServer()
  .then(() => {
    logger.info(`Server is running on port ${process.env.APP_PORT}`);
    logger.info(`APP: ${process.env.APP_PROJECT}`);
    logger.info(`ENV: ${process.env.NODE_ENV}`);
    logger.info(`DOMAIN: ${process.env.APP_DOMAIN}`);
  })
  .catch(e => {
    logger.error(`Unable run`, e.stack);
  });
