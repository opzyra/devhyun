import Sequelize from 'sequelize';

import Post from '@/models/Post';
import Series from '@/models/Series';

export default class SeriesPost extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        odr: { type: Sequelize.INTEGER(11) },
      },
      {
        tableName: 'series_post',
        timestamps: false,
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}
}
