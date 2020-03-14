import Sequelize from 'sequelize';

export default class ScheduleGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING(100), unique: true },
        color: { type: Sequelize.STRING(10) },
        odr: { type: Sequelize.INTEGER(11) },
      },
      {
        tableName: 'schedule_group',
        timestamps: false,
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  static selectAll() {
    return async transaction => {
      return await this.findAll({ order: [['odr', 'ASC']], transaction });
    };
  }

  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({ where: { idx }, transaction });
    };
  }

  static selectByName(name) {
    return async transaction => {
      return await this.findOne({ where: { name }, transaction });
    };
  }

  static countAll() {
    return async transaction => {
      return await this.count({ transaction });
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
