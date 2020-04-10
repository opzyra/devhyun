import Sequelize from 'sequelize';

import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING(100), unique: true },
  color: { type: Sequelize.STRING(10) },
  odr: { type: Sequelize.INTEGER(11) },
};

export const options = {
  tableName: 'schedule_group',
  timestamps: false,
};

const ScheduleGroup = sequelize.define('ScheduleGroup', schema, options);

ScheduleGroup.associate = models => {
  ScheduleGroup.hasMany(models.Schedule);
};

ScheduleGroup.selectAll = () => {
  return async transaction => {
    return await ScheduleGroup.findAll({
      order: [['odr', 'ASC']],
      transaction,
    });
  };
};

ScheduleGroup.selectOne = idx => {
  return async transaction => {
    return await ScheduleGroup.findOne({ where: { idx }, transaction });
  };
};

ScheduleGroup.selectByName = name => {
  return async transaction => {
    return await ScheduleGroup.findOne({ where: { name }, transaction });
  };
};

ScheduleGroup.countAll = () => {
  return async transaction => {
    return await ScheduleGroup.count({ transaction });
  };
};

ScheduleGroup.insertOne = model => {
  return async transaction => {
    return await ScheduleGroup.create(model, { transaction });
  };
};

ScheduleGroup.updateOne = (model, idx) => {
  return async transaction => {
    return await ScheduleGroup.update(model, { where: { idx }, transaction });
  };
};

ScheduleGroup.deleteOne = idx => {
  return async transaction => {
    return await ScheduleGroup.destroy({ where: { idx }, transaction });
  };
};

export default ScheduleGroup;
