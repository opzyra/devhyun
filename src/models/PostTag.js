import Sequelize from 'sequelize';

export default class PostTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        postIdx: { type: Sequelize.INTEGER(11), field: 'post_idx' },
        tagIdx: { type: Sequelize.INTEGER(11), field: 'tag_idx' },
      },
      {
        tableName: 'post_tag',
        timestamps: false,
        sequelize,
      },
    );
  }

  // eslint-disable-next-line no-unused-vars
  static associate(models) {}

  static deleteRelatedPost(idx) {
    return async transaction => {
      return await this.destroy({
        where: { postIdx: idx },
        transaction,
      });
    };
  }
}
