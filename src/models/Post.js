import Sequelize from 'sequelize';

import { pagination } from '@/lib/utils';

export default class Post extends Sequelize.Model {
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
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  // 페이지 처리된 포스트 조회
  static selectPaginated(query, page = 1, limit = 9) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;
      let option = {
        limit,
        offset,
        order: [['idx', 'desc']],
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
      let postPage = pagination(count, limit, page);

      return { posts: rows, postPage };
    };
  }

  // 메인화면에 제공하는 최신글 조회
  static async selectLatest(limit = 5, transaction) {
    return await this.findAll({
      order: [['idx', 'desc']],
      limit,
      transaction,
    });
  }
}
