import Sequelize, { Op } from 'sequelize';
import sequelize from '@/models';

import { pagination } from '@/lib/utils';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  id: { type: Sequelize.STRING(50) },
  social: { type: Sequelize.STRING(200) },
  name: { type: Sequelize.STRING(50) },
  role: { type: Sequelize.STRING(50), defaultValue: 'USER' },
  thumbnail: {
    type: Sequelize.STRING(500),
    defaultValue: '/images/default_thumbnail.png',
  },
  email: { type: Sequelize.STRING(500) },
  marketing: { type: Sequelize.BOOLEAN(), defaultValue: false },
  withdraw: { type: Sequelize.BOOLEAN(), defaultValue: false },
  active: { type: Sequelize.BOOLEAN(), defaultValue: true },
  loginAt: { type: Sequelize.DATE(), field: 'login_at' },
};

export const options = {
  tableName: 'member',
};

const Member = sequelize.define('Member', schema, options);

// eslint-disable-next-line no-unused-vars
Member.associate = models => {};

Member.selectAll = () => {
  return async transaction => {
    return await Member.findAll({ raw: true, transaction });
  };
};

// 페이지 처리된 포스트 조회
Member.selectPaginated = (query, category, page = 1, limit = 20) => {
  return async transaction => {
    let offset = (parseInt(page) - 1) * limit;
    let option = {
      limit,
      offset,
      order: [['idx', 'desc']],
      raw: true,
      transaction,
    };

    if (category === 'active' || category === 'disabled') {
      const value = category === 'active' ? 1 : 0;
      option.where = {
        active: value,
        withdraw: 0,
      };
    }

    if (category === 'withdraw') {
      option.where = {
        withdraw: 1,
      };
    }

    if (query) {
      option.where = {
        ...option.where,
        [Op.or]: [
          {
            title: {
              [Op.like]: `%${query}%`,
            },
          },
          {
            contents: {
              [Op.like]: `%${query}%`,
            },
          },
        ],
      };
    }

    let { count, rows } = await Member.findAndCountAll({
      ...option,
      include: null,
    });
    let memberPage = pagination(count, limit, page);

    return { members: rows, memberPage };
  };
};

Member.selectById = id => {
  return async transaction => {
    return await Member.findOne({ where: { id }, raw: true, transaction });
  };
};

Member.insertOne = member => {
  return async transaction => {
    return await Member.create(member, { raw: true, transaction });
  };
};

Member.updateOne = (member, idx) => {
  return async transaction => {
    return await Member.update(member, {
      where: { idx },
      transaction,
    });
  };
};

export default Member;
