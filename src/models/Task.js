import Sequelize, { Op } from 'sequelize';

import { pagination } from '@/lib/utils';

import sequelize from '@/models';

export const schema = {
  idx: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  title: { type: Sequelize.STRING(200) },
  contents: { type: Sequelize.TEXT('medium') },
  completed: { type: Sequelize.BOOLEAN },
  startAt: { type: Sequelize.DATE, field: 'start_at' },
  endAt: { type: Sequelize.DATE, field: 'end_at' },
};

export const options = {
  tableName: 'task',
};

const Task = sequelize.define('Task', schema, options);

Task.associate = models => {
  Task.belongsTo(models.TaskGroup, {
    as: 'TaskGroup',
  });
};

Task.selectPaginated = (query, group, page = 1, limit = 20) => {
  return async transaction => {
    let offset = (parseInt(page) - 1) * limit;
    let option = {
      limit,
      offset,
      order: [
        ['completed', 'asc'],
        ['TaskGroupIdx', 'asc'],
      ],
      raw: true,
      transaction,
    };

    if (group) {
      option.where = {
        ...option.where,
        TaskGroupIdx: group,
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

    let { count, rows } = await Task.findAndCountAll({
      ...option,
      include: null,
    });
    let taskPage = pagination(count, limit, page);

    return { tasks: rows, taskPage };
  };
};

Task.selectAllNotCompleted = () => {
  return async transaction => {
    return await Task.findAll({
      where: {
        completed: false,
      },
      order: [
        ['completed', 'ASC'],
        ['startAt', 'ASC'],
        ['endAt', 'ASC'],
      ],
      raw: true,
      transaction,
    });
  };
};

Task.selectOne = idx => {
  return async transaction => {
    return await Task.findOne({ where: { idx }, transaction });
  };
};

Task.countRelatedGroup = idx => {
  return async transaction => {
    return await Task.sequelize.query(
      `
        SELECT 
          count(*) AS rowCount
        FROM 
          task
        WHERE 
          task_group_idx = :idx
    `,
      {
        replacements: { idx },
        type: Sequelize.QueryTypes.SELECT,
        raw: true,
        transaction,
      },
    );
  };
};

Task.insertOne = model => {
  return async transaction => {
    return await Task.create(model, { transaction });
  };
};

Task.updateOne = (model, idx) => {
  return async transaction => {
    return await Task.update(model, { where: { idx }, transaction });
  };
};

Task.deleteOne = idx => {
  return async transaction => {
    return await Task.destroy({ where: { idx }, transaction });
  };
};

export default Task;
