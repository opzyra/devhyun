import Sequelize, { Op } from 'sequelize';

import sequelize from '@/models';
import { pagination } from '@/lib/utils';

import Comment from '@/models/Comment';
import Series from '@/models/Series';
import Tag from '@/models/Tag';

import SeriesPost from '@/models/SeriesPost';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING(100) },
  thumbnail: { type: Sequelize.STRING(200) },
  contents: { type: Sequelize.TEXT('medium') },
  hit: { type: Sequelize.INTEGER(11), defaultValue: 0 },
};

export const options = {
  tableName: 'post',
};

const Post = sequelize.define('Post', schema, options);

Post.associate = models => {
  Post.hasMany(models.Comment, {
    onDelete: 'CASCADE',
  });

  Post.hasMany(models.Tag, {
    onDelete: 'CASCADE',
  });

  Post.belongsToMany(models.Series, {
    through: {
      model: SeriesPost,
    },
    timestamps: false,
  });
};

Post.selectPaginated = (query, page = 1, limit = 9) => {
  return async transaction => {
    let offset = (parseInt(page) - 1) * limit;
    let option = {
      limit,
      offset,
      order: [['idx', 'desc']],
      include: [
        {
          model: Comment,
        },
      ],
      nest: true,
      distinct: true,
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

    let { count, rows } = await Post.findAndCountAll(option);

    let postPage = pagination(count, limit, page);

    return { posts: rows, postPage };
  };
};

Post.selectPaginatedRelatedTag = (query, page = 1, limit = 9) => {
  return async transaction => {
    let offset = (parseInt(page) - 1) * limit;

    let { count, rows } = await Post.findAndCountAll({
      limit,
      offset,
      order: [['idx', 'desc']],
      include: [
        {
          model: Comment,
        },
        {
          model: Tag,
          where: {
            tag: query,
          },
          require: true,
        },
      ],
      nest: true,
      transaction,
    });
    let postPage = pagination(count, limit, page);

    return { posts: rows, postPage };
  };
};

Post.selectOne = idx => {
  return async transaction => {
    return await Post.findOne({
      where: { idx },
      transaction,
      include: [
        {
          model: Comment,
        },
        {
          model: Tag,
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
};

Post.selectAll = () => {
  return async transaction => {
    return await Post.findAll({ transaction });
  };
};

Post.selectLatest = (limit = 5) => {
  return async transaction => {
    return await Post.findAll({
      order: [['idx', 'desc']],
      limit,
      transaction,
    });
  };
};

Post.selectRssAll = () => {
  return async transaction => {
    return await Post.findAll({ order: [['idx', 'desc']], transaction });
  };
};

Post.countAll = () => {
  return async transaction => {
    return await Post.count({ transaction });
  };
};

Post.selectRelatedTagPost = (tags = []) => {
  return async transaction => {
    return await Post.findAll({
      include: [
        {
          model: Tag,
          where: {
            idx: {
              [Sequelize.Op.in]: tags,
            },
          },
        },
      ],
      limit: 5,
      transaction,
    });
  };
};

Post.selectPopularPost = (limit = 5) => {
  return async transaction => {
    return await Post.findAll({
      order: [['idx', 'desc']],
      limit,
      transaction,
    });
  };
};

Post.insertOne = model => {
  return async transaction => {
    return await Post.create(model, { transaction });
  };
};

Post.updateOne = (model, idx) => {
  return async transaction => {
    return await Post.update(model, { where: { idx }, transaction });
  };
};

Post.updateHit = idx => {
  return async transaction => {
    return await Post.update(
      { hit: Sequelize.literal('hit + 1') },
      { where: { idx }, transaction, silent: true },
    );
  };
};

Post.deleteOne = idx => {
  return async transaction => {
    return await Post.destroy({
      where: { idx },
      cascade: true,
      hooks: true,
      transaction,
    });
  };
};

export default Post;
