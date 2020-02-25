import Sequelize from 'sequelize';

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
}
