import Sequelize, { Op } from 'sequelize';

import { pagination } from '@/lib/utils';

export default class Note extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(100) },
        contents: { type: Sequelize.TEXT('medium') },
      },
      {
        tableName: 'note',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.NoteGroup);
  }

  // 페이지 처리된 태스크 조회
  static selectPaginated(query, group, page = 1, limit = 20) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;
      let option = {
        limit,
        offset,
        order: [['NoteGroupIdx', 'asc']],
        raw: true,
        transaction,
      };

      if (group) {
        option.where = {
          ...option.where,
          NoteGroupIdx: group,
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

      let { count, rows } = await this.findAndCountAll(option);
      let notePage = pagination(count, limit, page);

      return { notes: rows, notePage };
    };
  }

  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({ where: { idx }, transaction });
    };
  }
}
