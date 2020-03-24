import Sequelize, { Op } from 'sequelize';

export default class Hit extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        ip: { type: Sequelize.STRING(30) },
        type: { type: Sequelize.STRING(30) },
        key: { type: Sequelize.INTEGER(11) },
      },
      {
        tableName: 'hit',
        indexes: [
          {
            unique: true,
            fields: ['ip', 'type', 'key'],
          },
        ],
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  // 게시글 조회 정도 조회
  static selectOne(hit) {
    return async transaction => {
      return await this.findOne({
        where: hit,
        transaction,
      });
    };
  }

  // 게시글 조회 정보 등록
  static insertIgonre(hit) {
    return async transaction => {
      return await this.create(hit, {
        ignoreDuplicates: true,
        transaction,
        isNewRecord: true,
      });
    };
  }

  static deleteExpired(date) {
    return async transaction => {
      return await this.destroy({
        where: { createdAt: { [Op.lte]: `${date} 23:59:59` } },
        transaction,
      });
    };
  }
}
