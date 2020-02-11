import Sequelize from 'sequelize';

export default class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        contents: { type: Sequelize.TEXT },
      },
      { sequelize },
    );
  }

  static associate(models) {
    this.belongsTo(models.Member, {
      as: 'member',
    });

    this.belongsTo(models.Member, {
      as: 'target',
    });
  }
}
