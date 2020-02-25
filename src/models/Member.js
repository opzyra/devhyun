import Sequelize from 'sequelize';

export default class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        id: { type: Sequelize.STRING(50) },
        social: { type: Sequelize.STRING(200) },
        name: { type: Sequelize.STRING(50) },
        role: { type: Sequelize.STRING(50), defaultValue: 'USER' },
        thumbnail: {
          type: Sequelize.STRING(500),
          defaultValue: '/images/default_thumbnail.png',
        },
        email: { type: Sequelize.STRING(500) },
        marketing: { type: Sequelize.BOOLEAN, defaultValue: false },
        withdraw: { type: Sequelize.BOOLEAN, defaultValue: false },
        active: { type: Sequelize.BOOLEAN, defaultValue: true },
        loginAt: { type: Sequelize.DATE, field: 'login_at' },
      },
      {
        tableName: 'member',
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  // 전체 회원 조회
  static selectAll() {
    return async transaction => {
      return await this.findAll({ raw: true, transaction });
    };
  }
}
