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
      const postTags = await this.findAll({
        where: { postIdx: idx },
        transaction,
      });
      const TagsIdx = postTags.map(pt => pt.tagIdx);
      await this.sequelize.query(
        `
        DELETE 
        FROM 
          tag
        WHERE 
          idx 
        IN 
          (:TagsIdx)
        `,
        {
          replacements: { TagsIdx },
          type: Sequelize.QueryTypes.DELETE,
          raw: true,
          transaction,
        },
      );

      return await this.destroy({
        where: { postIdx: idx },
        transaction,
        cascade: true,
        hooks: true,
      });
    };
  }
}
