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
  tableName: 'task_group',
  timestamps: false,
};

const TaskGroup = sequelize.define('TaskGroup', schema, options);

// eslint-disable-next-line no-unused-vars
TaskGroup.associate = models => {};

TaskGroup.selectAll = () => {
  return async transaction => {
    return await TaskGroup.findAll({ order: [['odr', 'ASC']], transaction });
  };
};

TaskGroup.selectOne = idx => {
  return async transaction => {
    return await TaskGroup.findOne({ where: { idx }, transaction });
  };
};

TaskGroup.selectByName = name => {
  return async transaction => {
    return await TaskGroup.findOne({ where: { name }, transaction });
  };
};

TaskGroup.countAll = () => {
  return async transaction => {
    return await TaskGroup.count({ transaction });
  };
};

TaskGroup.insertOne = model => {
  return async transaction => {
    return await TaskGroup.create(model, { transaction });
  };
};

TaskGroup.updateOne = (model, idx) => {
  return async transaction => {
    return await TaskGroup.update(model, { where: { idx }, transaction });
  };
};

TaskGroup.deleteOne = idx => {
  return async transaction => {
    return await TaskGroup.destroy({ where: { idx }, transaction });
  };
};

export default TaskGroup;
