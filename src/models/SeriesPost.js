import Sequelize from 'sequelize';

import sequelize from '@/models';

export const schema = {
  odr: { type: Sequelize.INTEGER(11) },
};

export const options = {
  tableName: 'series_post',
  timestamps: false,
};

const SeriesPost = sequelize.define('SeriesPost', schema, options);

// eslint-disable-next-line no-unused-vars
SeriesPost.associate = models => {};

export default SeriesPost;
