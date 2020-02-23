import app from './app';
// import batch from './batch';
import sequelize from './models';

import logger from './lib/logger';

const runServer = async () => {
  const db = sequelize.init();
  const server = app.listen(process.env.APP_PORT, () => {});
  // batch.initialize();

  try {
    if (process.env.NODE_ENV !== 'production') {
      await db.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
      await db.sync({});
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
