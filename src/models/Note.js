import Sequelize from 'sequelize';

export default class Note extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(100) },
        contents: { type: Sequelize.TEXT('medium') },
      },
      {
        tableName: 'note',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.NoteGroup);
  }
}
