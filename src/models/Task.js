import Sequelize, { Op } from 'sequelize';

import { pagination } from '@/lib/utils';

export default class Task extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(200) },
        contents: { type: Sequelize.TEXT('medium') },
        completed: { type: Sequelize.BOOLEAN },
        startAt: { type: Sequelize.DATE, field: 'start_at' },
        endAt: { type: Sequelize.DATE, field: 'end_at' },
      },
      {
        tableName: 'task',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.TaskGroup, {
      as: 'TaskGroup',
    });
  }

  // 페이지 처리된 태스크 조회
  static selectPaginated(query, group, page = 1, limit = 20) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;
      let option = {
        limit,
        offset,
        order: [
          ['completed', 'asc'],
          ['TaskGroupIdx', 'asc'],
        ],
        raw: true,
        transaction,
      };

      if (group) {
        option.where = {
          ...option.where,
          TaskGroupIdx: group,
        };
      }

      if (query) {
        option.where = {
          [Op.or]: [
            {
              title: {
                [Op.like]: `%${query}%`,
              },
            },
            {
              contents: {
                [Op.like]: `%${query}%`,
              },
            },
          ],
        };
      }

      let { count, rows } = await this.findAndCountAll({
        ...option,
        include: null,
      });
      let taskPage = pagination(count, limit, page);

      return { tasks: rows, taskPage };
    };
  }

  // 완료되지 않은 태스크 조회
  static selectAllNotCompleted() {
    return async transaction => {
      return await this.findAll({
        where: {
          completed: false,
        },
        order: [
          ['completed', 'ASC'],
          ['startAt', 'ASC'],
          ['endAt', 'ASC'],
        ],
        raw: true,
        transaction,
      });
    };
  }

  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({ where: { idx }, transaction });
    };
  }

  static countRelatedGroup(idx) {
    return async transaction => {
      return await this.sequelize.query(
        `
          SELECT 
            count(*) AS rowCount
          FROM 
            task
          WHERE 
            task_group_idx = :idx
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
