import Sequelize from 'sequelize';
import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  contents: { type: Sequelize.TEXT('medium') },
};

export const options = {
  tableName: 'comment',
};

const Comment = sequelize.define('Comment', schema, options);

Comment.associate = models => {
  Comment.belongsTo(models.Member, {
    as: 'member',
  });

  Comment.belongsTo(models.Member, {
    as: 'target',
  });

  Comment.belongsTo(models.Post, {
    as: 'post',
  });
};

Comment.countGroupPost = posts => {
  return async transaction => {
    return await Comment.sequelize.query(
      `SELECT 
        post_idx, 
        COUNT(post_idx) as count 
      FROM 
        comment
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
};

Comment.selectOne = idx => {
  return async transaction => {
    return await Comment.findByPk(idx, { transaction });
  };
};

Comment.insertOne = model => {
  return async transaction => {
    return await Comment.create(model, { transaction });
  };
};

Comment.updateOne = (model, idx) => {
  return async transaction => {
    return await Comment.update(model, { where: { idx }, transaction });
  };
};

Comment.deleteOne = idx => {
  return async transaction => {
    return await Comment.destroy({
      where: { idx },
      cascade: true,
      transaction,
    });
  };
};

export default Comment;
