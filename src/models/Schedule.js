import Sequelize, { Op } from 'sequelize';
import moment from 'moment';

import sequelize from '@/models';

export const schema = {
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
};

export const options = {
  tableName: 'schedule',
};

const Schedule = sequelize.define('Schedule', schema, options);

Schedule.associate = models => {
  Schedule.belongsTo(models.ScheduleGroup, {
    as: 'scheduleGroup',
  });
};

Schedule.selectOne = idx => {
  return async transaction => {
    return await Schedule.findOne({ where: { idx }, transaction });
  };
};

Schedule.selectBetweenToday = () => {
  const today = moment().format('YYYY-MM-DD');
  return async transaction => {
    return await Schedule.findAll({
      where: {
        startAt: {
          [Op.lte]: Date.parse(`${today} 23:59:59`),
        },
        endAt: {
          [Op.gte]: Date.parse(`${today} 00:00:00`),
        },
      },
      transaction,
    });
  };
};

Schedule.selectAllPeriod = period => {
  return async transaction => {
    return await Schedule.findAll({
      where: {
        startAt: {
          [Op.gte]: period.startAt,
        },
        endAt: {
          [Op.lte]: period.endAt,
        },
      },
      transaction,
    });
  };
};

Schedule.countRelatedGroup = idx => {
  return async transaction => {
    return await Schedule.sequelize.query(
      `
        SELECT 
          count(*) AS rowCount
        FROM 
          schedule
        WHERE 
          schedule_group_idx = :idx
    `,
      {
        replacements: { idx },
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        transaction,
      },
    );
  };
};

Schedule.insertOne = model => {
  return async transaction => {
    return await Schedule.create(model, { transaction });
  };
};

Schedule.updateOne = (model, idx) => {
  return async transaction => {
    return await Schedule.update(model, { where: { idx }, transaction });
  };
};

Schedule.deleteOne = idx => {
  return async transaction => {
    return await Schedule.destroy({ where: { idx }, transaction });
  };
};

export default Schedule;
