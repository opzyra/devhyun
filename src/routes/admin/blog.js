import express from "express";
import { go, map } from "fxjs";
import htmlToc from "html-toc";

import sessionCtx from "../../core/session";
import { rtfn, txrtfn } from "../../core/tx";
import store from "../../core/store";

import validator, { Joi } from "../../lib/validator";

import PostTag from "../../sql/PostTag";
import BoardPost from "../../sql/BoardPost";
import BoardSeries from "../../sql/BoardSeries";
import Comment from "../../sql/Comment";
import Temp from "../../sql/Temp";

const router = express.Router();

router.get(
  "/blog/post",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { query, page } = req.query;

    const BOARD_POST = BoardPost(conn);
    const COMMENT = Comment(conn);

    let posts = await BOARD_POST.selectPage(query, page);
    let postPage = await BOARD_POST.selectPageInfo(query, page);

    const comments = await COMMENT.countGroupBoard(
      "post",
      posts.map(post => post.idx)
    );

    posts = go(
      posts,
      map(post => {
        const comment = comments.find(
          comment => comment.board_idx === post.idx
        ) || { count: 0 };
        return {
          ...post,
          comment: comment.count
        };
      })
    );

    store(res).setState({
      postPage
    });

    res.render("admin/blog/post", {
      query,
      posts,
      postPage,
      layout: false
    });
  })
);

router.get(
  "/blog/post/edit",
  sessionCtx.isAdmin(),
  rtfn(async (req, res, next) => {
    res.render("admin/blog/post/edit", {
      layout: false
    });
  })
);

router.get(
  "/blog/post/edit/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_POST = BoardPost(conn);
    const POST_TAG = PostTag(conn);
    const TEMP = Temp(conn);

    let post = await BOARD_POST.selectOne(idx);

    if (!post) {
      throw new Error("잘못된 접근입니다");
    }

    const temp = await TEMP.selectByTitle(post.title);

    // 태그
    const tags = await go(
      POST_TAG.selectReletedPost(idx),
      map(e => `${e.tag}`)
    );

    store(res).setState({
      tags
    });

    res.render("admin/blog/post/edit", {
      temp: temp && temp.idx,
      post,
      tags,
      layout: false
    });
  })
);

router.get(
  "/blog/post/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_POST = BoardPost(conn);
    const POST_TAG = PostTag(conn);

    let post = await BOARD_POST.selectOne(idx);

    if (!post) {
      throw new Error("잘못된 접근입니다");
    }

    let contents = htmlToc(`<div id="toc"></div>${post.contents}`, {
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
    post.contents = contents.replace(toc, "");

    // 태그
    const tags = await go(
      POST_TAG.selectReletedPost(idx),
      map(e => `${e.tag}`)
    );

    res.render("admin/blog/post/detail", {
      post,
      toc,
      tags,
      layout: false
    });
  })
);

router.get(
  "/blog/series",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { query, page } = req.query;

    const BOARD_SERIES = BoardSeries(conn);

    let series = await BOARD_SERIES.selectPage(query, page);
    let seriesPage = await BOARD_SERIES.selectPageInfo(query, page);

    store(res).setState({
      seriesPage
    });

    res.render("admin/blog/series", {
      query,
      series,
      seriesPage,
      layout: false
    });
  })
);

router.get(
  "/blog/series/edit",
  sessionCtx.isAdmin(),
  rtfn(async (req, res, next) => {
    res.render("admin/blog/series/edit", {
      layout: false
    });
  })
);

router.get(
  "/blog/series/edit/:idx",
  sessionCtx.isAdmin(),
  validator.params({
    idx: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_SERIES = BoardSeries(conn);
    const TEMP = Temp(conn);

    let series = await BOARD_SERIES.selectOne(idx);

    if (!series) {
      throw new Error("잘못된 접근입니다");
    }

    const temp = await TEMP.selectByTitle(series.title);

    const posts = await go(
      BOARD_SERIES.selectRelatedPost(idx),
      map(e => {
        return {
          idx: e.idx,
          title: e.title
        };
      })
    );

    store(res).setState({
      posts: map(e => e.idx, posts)
    });

    res.render("admin/blog/series/edit", {
      temp: temp && temp.idx,
      series,
      posts,
      layout: false
    });
  })
);

router.get(
  "/blog/series/:idx",
  validator.params({
    idx: Joi.number().required()
  }),
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_SERIES = BoardSeries(conn);

    let series = await BOARD_SERIES.selectOne(idx);

    let contents = htmlToc(`<div id="toc"></div>${series.contents}`, {
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
    series.contents = contents.replace(toc, "");

    // 관련 포스트
    const posts = await BOARD_SERIES.selectRelatedPost(idx);

    // 포스트 네비바 처리
    let tocPostItems = "";
    posts.forEach((e, i) => {
      tocPostItems += `<li><a href="/admin/blog/post/${e.idx}">${e.title}</a></li>`;
    });

    let tocPost = `<li><a href="#postList">관련 포스트</a><ul class="nav">${tocPostItems}</ul></li>`;

    if (toc == '<div id="toc"></div>') {
      toc = '<div id="toc"><ul class="nav sidenav"></ul></div>';
    }

    toc = toc.replace("</ul></div>", tocPost + "</ul></div>");

    res.render("admin/blog/series/detail", {
      series,
      toc,
      posts,
      layout: false
    });
  })
);

router.get(
  "/blog/tag",
  sessionCtx.isAdmin(),
  txrtfn(async (req, res, next, conn) => {
    const POST_TAG = PostTag(conn);

    const tags = await POST_TAG.selectDistinctTagGroupCount();

    res.render("admin/blog/tag", {
      tags,
      layout: false
    });
  })
);

export default router;
