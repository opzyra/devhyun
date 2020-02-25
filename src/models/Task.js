import Sequelize from 'sequelize';

export default class Task extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(200) },
        contents: { type: Sequelize.TEXT('medium') },
        completed: { type: Sequelize.BOOLEAN },
        startAt: { type: Sequelize.DATE, field: 'start_at' },
        endAt: { type: Sequelize.DATE, field: 'end_at' },
      },
      {
        tableName: 'task',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.TaskGroup);
  }
}
