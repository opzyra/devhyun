import Sequelize, { Op } from 'sequelize';
import moment from 'moment';

export default class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(200) },
        location: { type: Sequelize.STRING(200) },
        state: { type: Sequelize.STRING(50) },
        allDay: { type: Sequelize.BOOLEAN, field: 'all_day' },
        startAt: { type: Sequelize.DATE, field: 'start_at' },
        endAt: { type: Sequelize.DATE, field: 'end_at' },
      },
      {
        tableName: 'schedule',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.ScheduleGroup, {
      as: 'ScheduleGroup',
    });
  }

  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({ where: { idx }, transaction });
    };
  }

  static selectBetweenToday() {
    const today = moment().format('YYYY-MM-DD');
    return async transaction => {
      return await this.findAll({
        where: {
          startAt: {
            [Op.lte]: Date.parse(`${today} 23:59:59`),
          },
          endAt: {
            [Op.gte]: Date.parse(`${today} 00:00:00`),
          },
        },
        transaction,
      });
    };
  }

  static selectAllPeriod(period) {
    return async transaction => {
      return await this.findAll({
        where: {
          startAt: {
            [Op.gte]: period.startAt,
          },
          endAt: {
            [Op.lte]: period.endAt,
          },
        },
        transaction,
      });
    };
  }

  static countRelatedGroup(idx) {
    return async transaction => {
      return await this.sequelize.query(
        `
          SELECT 
            count(*)
          FROM 
            schedule
          WHERE 
            schedule_group_idx = (:idx)
      `,
        {
          replacements: { idx },
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
          transaction,
        },
      );
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
