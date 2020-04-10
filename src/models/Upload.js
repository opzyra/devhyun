import Sequelize from 'sequelize';

import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  mimetype: { type: Sequelize.STRING(200) },
  ext: { type: Sequelize.STRING(50) },
  name: { type: Sequelize.STRING(200) },
  size: { type: Sequelize.INTEGER(11) },
  src: { type: Sequelize.STRING(300) },
};

export const options = {
  tableName: 'upload',
};

const Upload = sequelize.define('Upload', schema, options);

// eslint-disable-next-line no-unused-vars
Upload.associate = models => {};

Upload.insertOne = model => {
  return async transaction => {
    return await Upload.create(model, { transaction });
  };
};

export default Upload;
