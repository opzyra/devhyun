import Sequelize from 'sequelize';

export default class Comment extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        idx: {
          type: Sequelize.INTEGER(11),
          autoIncrement: true,
          primaryKey: true,
        },
        contents: { type: Sequelize.TEXT('medium') },
      },
      {
        sequelize,
      },
    );
  }

  static associate(models) {
    this.belongsTo(models.Member, {
      as: 'member',
    });

    this.belongsTo(models.Member, {
      as: 'target',
    });

    this.belongsToMany(models.Post, { through: 'post_comment' });
  }

  static countGroupPost(posts) {
    return async transaction => {
      return await this.sequelize.query(
        `SELECT 
          post_idx, 
          COUNT(post_idx) as count 
        FROM 
          post_comment
        WHERE 
          post_idx 
        IN 
          (:posts)
        GROUP BY 
          post_idx`,
        {
          replacements: { posts },
          type: Sequelize.QueryTypes.SELECT,
          raw: true,
          transaction,
        },
      );
    };
  }
}
