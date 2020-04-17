import Sequelize from 'sequelize';

import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  tag: { type: Sequelize.STRING(100) },
};

export const options = {
  tableName: 'tag',
  timestamps: false,
  indexes: [
    {
      fields: ['tag'],
    },
  ],
};

const Tag = sequelize.define('Tag', schema, options);

Tag.associate = models => {
  Tag.belongsTo(models.Post, {
    as: 'post',
  });
};

Tag.countDistinct = () => {
  return async transaction => {
    return await Tag.count({ distinct: true, col: 'tag', transaction });
  };
};

Tag.selectDistinctTagGroupCount = () => {
  return async transaction => {
    return await Tag.findAll({
      attributes: {
        include: ['Tag.*', [Sequelize.fn('COUNT', '*'), 'count']],
      },
      group: ['tag'],
      order: [[Sequelize.literal('count'), 'desc']],
      raw: true,
      nest: true,
      transaction,
    });
  };
};

Tag.insertAll = models => {
  return async transaction => {
    return await Tag.bulkCreate(models, {
      transaction,
    });
  };
};

Tag.deleteRelatedPost = idx => {
  return async transaction => {
    return await Tag.sequelize.query(
      `
      DELETE 
      FROM 
        tag
      WHERE 
        post_idx = :idx
      `,
      {
        replacements: { idx },
        type: Sequelize.QueryTypes.DELETE,
        raw: true,
        transaction,
      },
    );
  };
};

export default Tag;
