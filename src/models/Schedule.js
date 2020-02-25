import Sequelize from 'sequelize';

export default class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        title: { type: Sequelize.STRING(200) },
        location: { type: Sequelize.STRING(200) },
        state: { type: Sequelize.STRING(50) },
        allDay: { type: Sequelize.BOOLEAN, field: 'all_day' },
        startAt: { type: Sequelize.DATE, field: 'start_at' },
        endAt: { type: Sequelize.DATE, field: 'end_at' },
      },
      {
        tableName: 'schedule',
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.ScheduleGroup);
  }
}
