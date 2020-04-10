import Sequelize from 'sequelize';

import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING(100) },
  thumbnail: { type: Sequelize.STRING(200) },
  contents: { type: Sequelize.TEXT('medium') },
};

export const options = {
  tableName: 'temp',
};

const Temp = sequelize.define('Temp', schema, options);

// eslint-disable-next-line no-unused-vars
Temp.associate = models => {};

Temp.selectByTitle = title => {
  return async transaction => {
    return await Temp.findOne({ where: { title }, transaction });
  };
};

Temp.selectAll = () => {
  return async transaction => {
    return await Temp.findAll({ order: [['idx', 'desc']], transaction });
  };
};

Temp.selectOne = idx => {
  return async transaction => {
    return await Temp.findByPk(idx, { transaction });
  };
};

Temp.insertOne = model => {
  return async transaction => {
    return await Temp.create(model, { transaction });
  };
};

Temp.updateOne = (model, idx) => {
  return async transaction => {
    return await Temp.update(model, { where: { idx }, transaction });
  };
};

Temp.deleteOne = idx => {
  return async transaction => {
    return await Temp.destroy({ where: { idx }, transaction });
  };
};

export default Temp;
