import { go, filter } from 'fxjs';
import asyncify from '@/lib/asyncify';

import session from '@/lib/session';
import store from '@/lib/store';

import validator, { Joi } from '@/middleware/validator';
import { parseToc } from '@/lib/utils';

import Note from '@/models/Note';
import NoteGroup from '@/models/NoteGroup';
import Temp from '@/models/Temp';

const controller = asyncify();

export const note = controller.get(
  '/note',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { group, query, page } = req.query;

    let noteGroups = await NoteGroup.selectAll()(transaction);

    const [ctxGroup] = go(noteGroups, filter(e => e.idx == group));

    if (group && !ctxGroup) {
      throw new Error('잘못된 접근입니다');
    }

    let noteGroup = ctxGroup;

    let { notes, notePage } = await Note.selectPaginated(query, group, page)(
      transaction,
    );

    store(res).setState({
      notePage,
    });

    res.render('admin/note', {
      query,
      notes,
      notePage,
      noteGroup,
      noteGroups,
      layout: false,
    });
  },
);

export const noteCreate = controller.get(
  '/note/edit',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { group } = req.query;

    let noteGroups = await NoteGroup.selectAll()(transaction);
    res.render('admin/note/edit', {
      group,
      noteGroups,
      layout: false,
    });
  },
);

export const noteDetail = controller.get(
  '/note/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    let noteGroups = await NoteGroup.selectAll()(transaction);
    let note = await Note.selectOne(idx)(transaction);

    let [content, toc] = parseToc(note.contents);
    note.contents = content.replace(toc, '');

    res.render('admin/note/detail', {
      note,
      noteGroups,
      toc,
      layout: false,
    });
  },
);

export const noteEdit = controller.get(
  '/note/edit/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    let note = await Note.selectOne(idx)(transaction);

    if (!note) {
      throw new Error('잘못된 접근입니다');
    }

    const temp = await Temp.selectByTitle(note.title)(transaction);

    let group = note.note_group_idx;
    let noteGroups = await NoteGroup.selectAll()(transaction);

    res.render('admin/note/edit', {
      temp: temp && temp.idx,
      note,
      group,
      noteGroups,
      layout: false,
    });
  },
);

export default controller.router;
