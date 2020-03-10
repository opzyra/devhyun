import Sequelize from 'sequelize';

export default class Temp extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(100) },
        thumbnail: { type: Sequelize.STRING(200) },
        contents: { type: Sequelize.TEXT('medium') },
      },
      {
        tableName: 'temp',
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  static selectByTitle(title) {
    return async transaction => {
      return await this.findOne({ where: { title }, transaction });
    };
  }

  static selectAll() {
    return async transaction => {
      return await this.findAll({ order: [['idx', 'desc']], transaction });
    };
  }

  static selectOne(idx) {
    return async transaction => {
      return await this.findByPk(idx, { transaction });
    };
  }

  static insertOne(model) {
    return async transaction => {
      return await this.create(model, { transaction });
    };
  }

  static updateOne(model, idx) {
    return async transaction => {
      return await this.update(model, { where: { idx }, transaction });
    };
  }

  static deleteOne(idx) {
    return async transaction => {
      return await this.destroy({ where: { idx }, transaction });
    };
  }
}
