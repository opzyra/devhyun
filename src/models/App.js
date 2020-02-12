import Sequelize from 'sequelize';

export default class App extends Sequelize.Model {
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
      { sequelize },
    );
  }

  static associate(models) {
    // models.User.hasMany(models);
  }
}
