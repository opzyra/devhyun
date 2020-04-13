import Sequelize from 'sequelize';
import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  name: { type: Sequelize.STRING(50) },
  domain: { type: Sequelize.STRING(50) },
  own: { type: Sequelize.STRING(50) },
  price: { type: Sequelize.INTEGER(11) },
  expiredServer: {
    type: Sequelize.DATE(),
    field: 'expired_server',
  },
  expiredDomain: {
    type: Sequelize.DATE(),
    field: 'expired_domain',
  },
};

export const options = {
  tableName: 'application',
};

const Application = sequelize.define('Application', schema, options);

// eslint-disable-next-line no-unused-vars
Application.associate = models => {};

Application.selectOne = () => {
  return async transaction => {
    return await Application.findByPk(1, { transaction });
  };
};

export default Application;
