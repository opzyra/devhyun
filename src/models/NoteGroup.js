import Sequelize from 'sequelize';

export default class NoteGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        name: { type: Sequelize.STRING(100), unique: true },
        color: { type: Sequelize.STRING(10) },
        odr: { type: Sequelize.INTEGER(11) },
      },
      {
        tableName: 'note_group',
        timestamps: false,
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  static selectAll() {
    return async transaction => {
      return await this.findAll({ order: [['odr', 'ASC']], transaction });
    };
  }
}
