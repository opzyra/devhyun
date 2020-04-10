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
  tableName: 'note_group',
  timestamps: false,
};

const NoteGroup = sequelize.define('NoteGroup', schema, options);

// eslint-disable-next-line no-unused-vars
NoteGroup.associate = models => {};

NoteGroup.selectAll = () => {
  return async transaction => {
    return await NoteGroup.findAll({ order: [['odr', 'ASC']], transaction });
  };
};

NoteGroup.selectOne = idx => {
  return async transaction => {
    return await NoteGroup.findOne({ where: { idx }, transaction });
  };
};

NoteGroup.selectByName = name => {
  return async transaction => {
    return await NoteGroup.findOne({ where: { name }, transaction });
  };
};

NoteGroup.countAll = () => {
  return async transaction => {
    return await NoteGroup.count({ transaction });
  };
};

NoteGroup.insertOne = model => {
  return async transaction => {
    return await NoteGroup.create(model, { transaction });
  };
};

NoteGroup.updateOne = (model, idx) => {
  return async transaction => {
    return await NoteGroup.update(model, { where: { idx }, transaction });
  };
};

NoteGroup.deleteOne = idx => {
  return async transaction => {
    return await NoteGroup.destroy({ where: { idx }, transaction });
  };
};

export default NoteGroup;
