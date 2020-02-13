import Sequelize from 'sequelize';

export default class Hit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        ip: { type: Sequelize.STRING(30) },
        type: { type: Sequelize.STRING(30) },
        key: { type: Sequelize.INTEGER(11) },
      },
      {
        indexes: [
          {
            unique: true,
            fields: ['ip', 'type', 'key'],
          },
        ],
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}
}
