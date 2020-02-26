import Sequelize from 'sequelize';

import { pagination } from '@/lib/utils';

import Post from '@/models/Post';
import SeriesPost from '@/models/SeriesPost';

export default class Series extends Sequelize.Model {
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
        hit: { type: Sequelize.INTEGER(11) },
      },
      {
        tableName: 'series',
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {
    this.belongsToMany(models.Post, {
      through: {
        model: SeriesPost,
      },
      timestamps: false,
    });
  }

  // 페이지 처리된 포스트 조회
  static selectPaginated(query, page = 1, limit = 9) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;
      let option = {
        limit,
        offset,
        order: [['idx', 'desc']],
        group: ['idx'],
        include: [
          {
            model: Post,
            attributes: [['idx', 'post_idx']],
            through: {
              attributes: [],
            },
          },
        ],
        nest: true,
        transaction,
      };

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
      let seriesPage = pagination(count, limit, page);

      return { series: rows, seriesPage };
    };
  }
}
