import Sequelize from 'sequelize';

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
    this.belongsTo(models.TaskGroup);
  }

  // 페이지 처리된 포스트 조회
  static selectPaginated(query, group, page = 1, limit = 20) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;
      let option = {
        limit,
        offset,
        order: [['completed', 'asc'], ['TaskGroupIdx', 'asc']],
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
          or: [
            {
              title: {
                like: `%${query}%`,
              },
            },
            {
              contents: {
                like: `%${query}%`,
              },
            },
          ],
        };
      }

      let { count, rows } = await this.findAndCountAll(option);
      let taskPage = pagination(count, limit, page);

      return { tasks: rows, taskPage };
    };
  }
}
