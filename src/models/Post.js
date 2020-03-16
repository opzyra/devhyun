import Sequelize, { Op } from 'sequelize';

import { pagination } from '@/lib/utils';

import Comment from '@/models/Comment';
import Series from '@/models/Series';
import Tag from '@/models/Tag';

import SeriesPost from '@/models/SeriesPost';
import PostTag from '@/models/PostTag';

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
        tableName: 'post',
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {
    this.belongsToMany(models.Comment, {
      through: 'post_comment',
      timestamps: false,
      onDelete: 'CASCADE',
      hooks: true,
    });

    this.belongsToMany(models.Tag, {
      through: {
        model: PostTag,
      },
      timestamps: false,
      onDelete: 'CASCADE',
      hooks: true,
    });

    this.belongsToMany(models.Series, {
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
        include: [
          {
            model: Comment,
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

      let { count, rows } = await this.findAndCountAll({
        ...option,
        include: null,
      });

      let postPage = pagination(count, limit, page);

      return { posts: rows, postPage };
    };
  }

  // 태그와 연관있는 포스트 조회
  static selectPaginatedRelatedTag(query, page = 1, limit = 9) {
    return async transaction => {
      let offset = (parseInt(page) - 1) * limit;

      let { count, rows } = await this.findAndCountAll({
        limit,
        offset,
        order: [['idx', 'desc']],
        include: [
          {
            model: Comment,
            through: {
              attributes: [],
            },
          },
          {
            model: Tag,
            where: {
              tag: query,
            },
            require: true,
            through: {
              attributes: [],
            },
          },
        ],
        raw: true,
        nest: true,
        transaction,
      });
      let postPage = pagination(count, limit, page);

      return { posts: rows, postPage };
    };
  }

  // 하나의 포스트 조회
  static selectOne(idx) {
    return async transaction => {
      return await this.findOne({
        where: { idx },
        transaction,
        include: [
          {
            model: Comment,
            through: {
              attributes: [],
            },
          },
          {
            model: Tag,
            through: {
              attributes: [],
            },
          },
          {
            model: Series,
            through: {
              attributes: [],
            },
            include: [
              {
                model: Post,
                through: {
                  attributes: [],
                },
              },
            ],
          },
        ],
        nest: true,
      });
    };
  }

  static selectAll() {
    return async transaction => {
      return await this.findAll({ transaction });
    };
  }

  // 메인화면에 제공하는 최신글 조회
  static selectLatest(limit = 5) {
    return async transaction => {
      return await this.findAll({
        order: [['idx', 'desc']],
        limit,
        transaction,
      });
    };
  }

  // 포스트 전체 갯수 조회
  static countAll() {
    return async transaction => {
      return await this.count({ transaction });
    };
  }

  // 태그에 대한 연관 포스트 (기본값 5개)
  static selectRelatedTagPost(tags = []) {
    return async transaction => {
      return await this.findAll({
        include: [
          {
            model: Tag,
            where: {
              idx: {
                [Sequelize.Op.in]: tags,
              },
            },
            through: {
              attributes: [],
            },
          },
        ],
        limit: 5,
        transaction,
      });
    };
  }

  // 조회수가 많은 포스트 조회 (기본값 5개)
  static selectPopularPost(limit = 5) {
    return async transaction => {
      return await this.findAll({
        order: [['idx', 'desc']],
        limit,
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
      return await this.destroy({
        where: { idx },
        cascade: true,
        hooks: true,
        transaction,
      });
    };
  }
}
