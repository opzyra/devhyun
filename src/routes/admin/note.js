import express from "express";
import { go, filter } from "fxjs";
import htmlToc from "html-toc";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";
import store from "../../core/store";

import validator, { Joi } from "../../lib/validator";

import Note from "../../sql/Note";
import NoteGroup from "../../sql/NoteGroup";
import Temp from "../../sql/Temp";

const router = express.Router();

router.get(
  "/note",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { group, query, page } = req.query;

    const NOTE = Note(conn);
    const NOTE_GROUP = NoteGroup(conn);

    let noteGroups = await NOTE_GROUP.selectAll();

    const [ctxGroup] = go(noteGroups, filter(e => e.idx == group));

    if (group && !ctxGroup) {
      throw new Error("잘못된 접근입니다");
    }

    let noteGroup = ctxGroup;

    let notes = await NOTE.selectPage(query, group, page);
    let notePage = await NOTE.selectPageInfo(query, group, page);

    store(res).setState({
      notePage
    });

    res.render("admin/note", {
      query,
      notes,
      notePage,
      noteGroup,
      noteGroups,
      layout: false
    });
  })
);

router.get(
  "/note/edit",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { group } = req.query;

    const NOTE_GROUP = NoteGroup(conn);

    let noteGroups = await NOTE_GROUP.selectAll();
    res.render("admin/note/edit", {
      group,
      noteGroups,
      layout: false
    });
  })
);

router.get(
  "/note/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const NOTE = Note(conn);
    const NOTE_GROUP = NoteGroup(conn);

    let noteGroups = await NOTE_GROUP.selectAll();
    let note = await NOTE.selectOne(idx);

    let contents = htmlToc(`<div id="toc"></div>${note.contents}`, {
      selectors: "h1, h2, h3, h4, h5",
      anchors: false,
      slugger: function(text) {
        const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
        return decodeURI(text)
          .toLowerCase()
          .trim()
          .replace(re, "")
          .replace(/\s/g, "_");
      }
    });

    let [toc, ...rest] = contents.match(
      /(<div id="toc")(.|\r\n|\r|\n)*(<\/div>)/
    );
    note.contents = contents.replace(toc, "");

    res.render("admin/note/detail", {
      note,
      noteGroups,
      toc,
      layout: false
    });
  })
);

router.get(
  "/note/edit/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const NOTE = Note(conn);
    const NOTE_GROUP = NoteGroup(conn);
    const TEMP = Temp(conn);

    let note = await NOTE.selectOne(idx);

    if (!note) {
      throw new Error("잘못된 접근입니다");
    }

    const temp = await TEMP.selectByTitle(note.title);

    let group = note.note_group_idx;
    let noteGroups = await NOTE_GROUP.selectAll();

    res.render("admin/note/edit", {
      temp: temp && temp.idx,
      note,
      group,
      noteGroups,
      layout: false
    });
  })
);

export default router;
