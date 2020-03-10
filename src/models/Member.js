import Sequelize, { Op } from 'sequelize';

import { pagination } from '@/lib/utils';

export default class Member extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
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
        marketing: { type: Sequelize.BOOLEAN, defaultValue: false },
        withdraw: { type: Sequelize.BOOLEAN, defaultValue: false },
        active: { type: Sequelize.BOOLEAN, defaultValue: true },
        loginAt: { type: Sequelize.DATE, field: 'login_at' },
      },
      {
        tableName: 'member',
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  // 전체 회원 조회
  static selectAll() {
    return async transaction => {
      return await this.findAll({ raw: true, transaction });
    };
  }

  // 페이지 처리된 포스트 조회
  static selectPaginated(query, category, page = 1, limit = 20) {
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

      let { count, rows } = await this.findAndCountAll(option);
      let memberPage = pagination(count, limit, page);

      return { members: rows, memberPage };
    };
  }

  static selectById(id) {
    return async transaction => {
      return await this.findOne({ where: { id }, raw: true, transaction });
    };
  }

  static insertOne(member) {
    return async transaction => {
      return await this.create(member, { raw: true, transaction });
    };
  }

  static updateOne(member) {
    return async transaction => {
      return await this.update(member, {
        where: { idx: member.idx },
        transaction,
      });
    };
  }
}
