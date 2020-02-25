import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import logger from '@/lib/logger';

class Database {
  init() {
    const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST || '',
      dialect: 'mysql',
      define: {
        underscored: true,
        freezeTableName: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
        timestamps: true,
      },
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
      logging: msg => logger.debug(msg),
    });

    const models = Object.assign(
      {},
      ...fs
        .readdirSync(__dirname)
        .filter(
          file =>
            file.indexOf('.') !== 0 &&
            file.indexOf('.map') < 0 &&
            file !== 'index.js',
        )
        .map(file => {
          const model = require(path.join(__dirname, file)).default;
          return {
            [model.name]: model.init(sequelize),
          };
        }),
    );

    for (const model of Object.keys(models)) {
      typeof models[model].associate === 'function' &&
        models[model].associate(models);
    }

    this.sequelize = sequelize;
    this.models = models;

    return sequelize;
  }
}

const database = new Database();

export default database;
