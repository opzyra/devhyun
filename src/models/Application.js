import Sequelize from 'sequelize';

export default class Application extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING(50) },
        domain: { type: Sequelize.STRING(50) },
        own: { type: Sequelize.STRING(50) },
        price: { type: Sequelize.INTEGER(11) },
        expiredServer: { type: Sequelize.DATE, field: 'expired_server' },
        expiredDomain: { type: Sequelize.DATE, field: 'expired_domain' },
      },
      {
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}
}
