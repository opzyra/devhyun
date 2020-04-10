import Sequelize, { Op } from 'sequelize';

import sequelize from '@/models';
import { pagination } from '@/lib/utils';

import Post from '@/models/Post';
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
  hit: { type: Sequelize.INTEGER(11) },
};

export const options = {
  tableName: 'series',
};

const Series = sequelize.define('Series', schema, options);

Series.associate = models => {
  Series.belongsToMany(models.Post, {
    through: {
      model: SeriesPost,
    },
    timestamps: false,
  });
};

Series.selectPaginated = (query, page = 1, limit = 9) => {
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

    let { count, rows } = await Series.findAndCountAll(option);
    let seriesPage = pagination(count, limit, page);

    return { series: rows, seriesPage };
  };
};

Series.selectOne = idx => {
  return async transaction => {
    return await Series.findOne({
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
};

Series.insertOne = model => {
  return async transaction => {
    return await Series.create(model, { transaction });
  };
};

Series.updateOne = (model, idx) => {
  return async transaction => {
    return await Series.update(model, { where: { idx }, transaction });
  };
};

Series.updateHit = idx => {
  return async transaction => {
    return await Series.update(
      { hit: Sequelize.literal('hit + 1') },
      { where: { idx }, transaction, silent: true },
    );
  };
};

Series.deleteOne = idx => {
  return async transaction => {
    return await Series.destroy({ where: { idx }, transaction });
  };
};

export default Series;
