import Sequelize, { Op } from 'sequelize';
import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  ip: { type: Sequelize.STRING(30) },
  type: { type: Sequelize.STRING(30) },
  key: { type: Sequelize.INTEGER(11) },
};

export const options = {
  tableName: 'hit',
  indexes: [
    {
      unique: true,
      fields: ['ip', 'type', 'key'],
    },
  ],
};

const Hit = sequelize.define('Hit', schema, options);

// eslint-disable-next-line no-unused-vars
Hit.associate = models => {};

Hit.selectOne = hit => {
  return async transaction => {
    return await Hit.findOne({
      where: hit,
      transaction,
    });
  };
};

// 게시글 조회 정보 등록
Hit.insertIgonre = hit => {
  return async transaction => {
    return await Hit.create(hit, {
      ignoreDuplicates: true,
      transaction,
      isNewRecord: true,
    });
  };
};

Hit.deleteExpired = date => {
  return async transaction => {
    return await Hit.destroy({
      where: { createdAt: { [Op.lte]: `${date} 23:59:59` } },
      transaction,
    });
  };
};

export default Hit;
