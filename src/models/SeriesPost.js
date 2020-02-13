import Sequelize from 'sequelize';

export default class SeriesPost extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
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
  static associate(models) {
    this.belongsTo(models.Series);
    this.belongsTo(models.Post);
  }
}
