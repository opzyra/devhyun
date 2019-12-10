import express from "express";
import htmlToc from "html-toc";
import { go, map, filter, uniqueBy } from "fxjs";

import store from "../../core/store";
import { txrtfn } from "../../core/tx";
import { clinfo } from "../../lib/utils";
import validator, { Joi } from "../../lib/validator";

import BoardPost from "../../sql/BoardPost";
import PostTag from "../../sql/PostTag";
import BoardSeries from "../../sql/BoardSeries";
import HitBoard from "../../sql/HitBoard";
import Comment from "../../sql/Comment";
import Member from "../../sql/Member";

const router = express.Router();

router.get(
  "/blog/post",
  txrtfn(async (req, res, next, conn) => {
    const { query, page } = req.query;

    const BOARD_POST = BoardPost(conn);
    const POST_TAG = PostTag(conn);
    const COMMENT = Comment(conn);

    let posts = await BOARD_POST.selectPage(query, page);
    const postPage = await BOARD_POST.selectPageInfo(query, page);

    const post_count = await BOARD_POST.countAll();
    const tag_count = await POST_TAG.countDistinct();

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

    res.render("client/blog/post", {
      posts,
      postPage,
      queryRow: query ? postPage.rowCount : null,
      countPostTag: {
        post_count,
        tag_count
      },
      layout: false
    });
  })
);

router.get(
  "/blog/post/:idx",
  validator.params({ idx: Joi.number().required() }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_POST = BoardPost(conn);
    const BOARD_SERIES = BoardSeries(conn);
    const HIT_BOARD = HitBoard(conn);
    const POST_TAG = PostTag(conn);

    const MEMBER = Member(conn);
    const COMMENT = Comment(conn);

    const post = await BOARD_POST.selectOne(idx);

    if (!post) {
      throw new Error("잘못된 접근입니다.");
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

    const seriesRs = await BOARD_SERIES.selectRelatedSeriesPost(idx);

    const series = Object.values(
      seriesRs.reduce((a, v) => {
        a[String(v.series_idx)] = a[String(v.series_idx)] || {};
        a[String(v.series_idx)].series_idx = v.series_idx;
        a[String(v.series_idx)].title = v.sb_title;
        a[String(v.series_idx)].thumbnail = v.sb_thumbnail;
        a[String(v.series_idx)].list = a[String(v.series_idx)].list || [];
        a[String(v.series_idx)].list.push({
          post_idx: v.post_idx,
          title: v.pb_title,
          thumbnail: v.pb_thumbnauil,
          contents: v.pb_contents
        });
        return a;
      }, Object.create(null))
    );

    // 연관 포스트
    let relation = tags
      ? await BOARD_POST.selectRelatedTagPost(tags)
      : await BOARD_POST.selectPopularPost();

    // 조회수 처리
    const client = clinfo(req);
    if (!client.robot && client.device != "undefined") {
      const { affectedRows } = await HIT_BOARD.insertIgonre({
        ip: client.ip,
        board: "post",
        board_idx: idx
      });

      if (affectedRows != 0) await BOARD_POST.updateHit(idx);
    }

    // 댓글 처리
    const members = await MEMBER.selectAll();
    const comments = await COMMENT.selectBoardAll("post", idx);

    const post_comments = await go(
      comments,
      map(comment => {
        let target_member = members.find(
          member => member.idx == comment.target_idx
        );
        return {
          ...comment,
          target_name: target_member ? target_member.name : ""
        };
      })
    );

    const comments_member = go(
      post_comments,
      filter(comment => {
        if (req.session.member) {
          return comment.member_idx !== req.session.member.idx;
        }
        return true;
      }),
      uniqueBy(u => u.member_idx),
      map(comment => ({
        idx: comment.member_idx,
        name: comment.name
      }))
    );

    res.render("client/blog/post/detail", {
      post,
      toc,
      tags,
      series,
      relation,
      comments: post_comments,
      comments_member,
      layout: false
    });
  })
);

router.get(
  "/blog/series",
  txrtfn(async (req, res, next, conn) => {
    const { query, page } = req.query;

    const BOARD_POST = BoardPost(conn);
    const BOARD_SERIES = BoardSeries(conn);
    const POST_TAG = PostTag(conn);

    const series = await BOARD_SERIES.selectPage(query, page);
    const seriesPage = await BOARD_SERIES.selectPageInfo(query, page);

    const post_count = await BOARD_POST.countAll();
    const tag_count = await POST_TAG.countDistinct();

    store(res).setState({
      seriesPage
    });

    res.render("client/blog/series", {
      series,
      seriesPage,
      queryRow: query ? seriesPage.rowCount : null,
      countPostTag: {
        post_count,
        tag_count
      },
      layout: false
    });
  })
);

router.get(
  "/blog/series/:idx",
  validator.params({ idx: Joi.number().required() }),
  txrtfn(async (req, res, next, conn) => {
    const { idx } = req.params;

    const BOARD_SERIES = BoardSeries(conn);
    const HIT_BOARD = HitBoard(conn);

    const series = await BOARD_SERIES.selectOne(idx);
    if (!series) {
      throw new Error("잘못된 접근입니다.");
    }

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
    const post = await BOARD_SERIES.selectRelatedPost(idx);

    // 포스트 네비바 처리
    let tocPostItems = "";
    post.forEach((e, i) => {
      tocPostItems += `<li><a href="/blog/post/${e.idx}">${e.title}</a></li>`;
    });

    let tocPost = `<li><a href="#postList">관련 포스트</a><ul class="nav">${tocPostItems}</ul></li>`;

    if (toc == '<div id="toc"></div>') {
      toc = '<div id="toc"><ul class="nav sidenav"></ul></div>';
    }

    toc = toc.replace("</ul></div>", tocPost + "</ul></div>");

    // 조회수 처리
    const client = clinfo(req);
    if (!client.robot && client.device != "undefined") {
      const { affectedRows } = await HIT_BOARD.insertIgonre({
        ip: client.ip,
        board: "series",
        board_idx: idx
      });
      if (affectedRows != 0) await BOARD_SERIES.updateHit(idx);
    }

    res.render("client/blog/series/detail", {
      series,
      toc,
      post,
      layout: false
    });
  })
);

router.get(
  "/blog/tag",
  txrtfn(async (req, res, next, conn) => {
    const BOARD_POST = BoardPost(conn);
    const POST_TAG = PostTag(conn);

    const tags = await POST_TAG.selectDistinctTagGroupCount();

    const post_count = await BOARD_POST.countAll();
    const tag_count = await POST_TAG.countDistinct();

    res.render("client/blog/tag", {
      countPostTag: {
        post_count,
        tag_count
      },
      tags,
      layout: false
    });
  })
);

router.get(
  "/blog/tag/:query",
  validator.params({ query: Joi.required() }),
  txrtfn(async (req, res, next, conn) => {
    const { query } = req.params;
    const { page } = req.query;

    const BOARD_POST = BoardPost(conn);
    const POST_TAG = PostTag(conn);
    const COMMENT = Comment(conn);

    let tags = await BOARD_POST.selectPageRelatedTagPost(query, page);
    const tagPage = await BOARD_POST.selectPageRelatedTagPostInfo(query, page);

    const post_count = await BOARD_POST.countAll();
    const tag_count = await POST_TAG.countDistinct();

    if (tags.length !== 0) {
      const comments = await COMMENT.countGroupBoard(
        "post",
        tags.map(tag => tag.idx)
      );

      tags = go(
        tags,
        map(tag => {
          const comment = comments.find(
            comment => comment.board_idx === tag.idx
          ) || { count: 0 };
          return {
            ...tag,
            comment: comment.count
          };
        })
      );
    }

    store(res).setState({
      tagPage
    });

    res.render("client/blog/tag/detail", {
      tags,
      tagPage,
      countPostTag: {
        post_count,
        tag_count
      },
      query,
      queryRow: query ? tagPage.rowCount : null,
      layout: false
    });
  })
);

export default router;
