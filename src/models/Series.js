import Sequelize, { Op } from 'sequelize';

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
      let seriesPage = pagination(count, limit, page);

      return { series: rows, seriesPage };
    };
  }

  // idx값을 가지고 하나의 시리즈 조회
  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({
        where: {
          idx,
        },
        order: [[Sequelize.col('Posts.seriesPost.odr'), 'ASC']],
        include: [
          {
            model: Post,
            through: {
              as: 'seriesPost',
              attributes: ['odr'],
            },
          },
        ],
        nest: true,
        transaction,
      });
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

  // 조회수 업데이트
  static updateHit(idx) {
    return async transaction => {
      return await this.update(
        { hit: Sequelize.literal('hit + 1') },
        { where: { idx }, transaction, silent: true },
      );
    };
  }

  static deleteOne(idx) {
    return async transaction => {
      return await this.destroy({ where: { idx }, transaction });
    };
  }
}
