import Sequelize from 'sequelize';

export default class Upload extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        mimetype: { type: Sequelize.STRING(200) },
        ext: { type: Sequelize.STRING(50) },
        name: { type: Sequelize.STRING(200) },
        size: { type: Sequelize.INTEGER(11) },
        src: { type: Sequelize.STRING(300) },
      },
      {
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}
}
