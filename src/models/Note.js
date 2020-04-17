import Sequelize, { Op } from 'sequelize';
import sequelize from '@/models';

import { pagination } from '@/lib/utils';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING(100) },
  contents: { type: Sequelize.TEXT('medium') },
};

export const options = {
  tableName: 'note',
};

const Note = sequelize.define('Note', schema, options);

Note.associate = models => {
  Note.belongsTo(models.NoteGroup, { as: 'noteGroup' });
};

Note.selectPaginated = (query, group, page = 1, limit = 20) => {
  return async transaction => {
    let offset = (parseInt(page) - 1) * limit;
    let option = {
      limit,
      offset,
      order: [['noteGroupIdx', 'asc']],
      raw: true,
      transaction,
    };

    if (group) {
      option.where = {
        ...option.where,
        noteGroupIdx: group,
      };
    }

    if (query) {
      option.where = {
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

    let { count, rows } = await Note.findAndCountAll({
      ...option,
      include: null,
    });
    let notePage = pagination(count, limit, page);

    return { notes: rows, notePage };
  };
};

Note.selectOne = idx => {
  return async transaction => {
    return await Note.findOne({ where: { idx }, transaction });
  };
};

Note.countRelatedGroup = idx => {
  return async transaction => {
    return await Note.count({ where: { note_group_idx: idx }, transaction });
  };
};

Note.insertOne = model => {
  return async transaction => {
    return await Note.create(model, { transaction });
  };
};

Note.updateOne = (model, idx) => {
  return async transaction => {
    return await Note.update(model, { where: { idx }, transaction });
  };
};

Note.deleteOne = idx => {
  return async transaction => {
    return await Note.destroy({ where: { idx }, transaction });
  };
};

export default Note;
