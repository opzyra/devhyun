import Sequelize from 'sequelize';

import Post from '@/models/Post';

export default class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        tag: { type: Sequelize.STRING(100) },
      },
      {
        tableName: 'tag',
        timestamps: false,
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Post);
  }

  // 중복제외된 태그의 수 조회
  static countDistinct() {
    return async transaction => {
      return await this.count({ distinct: true, col: 'tag', transaction });
    };
  }

  // 중복제외된 태그와 태그별 갯수 조회
  static selectDistinctTagGroupCount() {
    return async transaction => {
      return await this.findAll({
        attributes: {
          include: ['Tag.*', [Sequelize.fn('COUNT', '*'), 'count']],
        },
        include: [
          {
            model: Post,
            attributes: {
              include: ['idx'],
            },
          },
        ],
        group: ['idx'],
        order: [[Sequelize.literal('count'), 'desc']],
        raw: true,
        nest: true,
        transaction,
      });
    };
  }

  static insertAll(models) {
    return async transaction => {
      return await this.bulkCreate(models, {
        transaction,
      });
    };
  }
}
