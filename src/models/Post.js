import Sequelize from 'sequelize';

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
        contents: { type: Sequelize.TEXT },
        hit: { type: Sequelize.INTEGER(11) },
      },
      { sequelize },
    );
  }

  static associate(models) {
    // models.User.hasMany(models);
  }
}
