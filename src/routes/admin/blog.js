import { go, map } from 'fxjs';
import asyncify from '@/lib/asyncify';

import session from '@/lib/session';
import store from '@/lib/store';

import validator, { Joi } from '@/middleware/validator';
import { parseToc } from '@/lib/utils';

import Member from '@/models/Member';
import Post from '@/models/Post';
import Series from '@/models/Series';
import Temp from '@/models/Temp';
import Tag from '@/models/Tag';

const controller = asyncify();

export const post = controller.get(
  '/blog/post',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { query, page } = req.query;
    let { posts, postPage } = await Post.selectPaginated(query, page)(
      transaction,
    );

    store(res).setState({
      postPage,
    });

    res.render('admin/blog/post', {
      query,
      posts,
      postPage,
      layout: false,
    });
  },
);

export const postCreate = controller.get(
  '/blog/post/edit',
  session.isAdmin(),
  async (req, res) => {
    res.render('admin/blog/post/edit', {
      layout: false,
    });
  },
);

export const postEdit = controller.get(
  '/blog/post/edit/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    let post = await Post.selectOne(idx)(transaction);

    if (!post) {
      throw new Error('잘못된 접근입니다');
    }

    const temp = await Temp.selectByTitle(post.title)(transaction);

    store(res).setState({
      tags: post.Tags,
    });

    res.render('admin/blog/post/edit', {
      temp: temp && temp.idx,
      post,
      tags: post.Tags,
      layout: false,
    });
  },
);

export const postDetail = controller.get(
  '/blog/post/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    let post = await Post.selectOne(idx)(transaction);

    if (!post) {
      throw new Error('잘못된 접근입니다.');
    }

    post = post.toJSON();

    const [content, toc] = parseToc(post.contents);
    post.contents = content.replace(toc, '');

    // 댓글 처리
    const members = await Member.selectAll()(transaction);

    // TODO 관리자 페이지 댓글 보기 기능
    // const comments = await go(
    //   post.Comments,
    //   map(comment => {
    //     let member = members.find(member => member.idx == comment.memberIdx);

    //     let targetMember = members.find(
    //       member => member.idx == comment.targetIdx,
    //     );
    //     return {
    //       ...comment,
    //       thumbnail: member.thumbnail,
    //       name: member.name,
    //       targetName: targetMember ? targetMember.name : '',
    //     };
    //   }),
    // );

    res.render('admin/blog/post/detail', {
      post,
      toc,
      tags: post.Tags,
      layout: false,
    });
  },
);

export const series = controller.get(
  '/blog/series',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { query, page } = req.query;

    let { series, seriesPage } = await Series.selectPaginated(query, page)(
      transaction,
    );

    store(res).setState({
      seriesPage,
    });

    res.render('admin/blog/series', {
      query,
      series,
      seriesPage,
      layout: false,
    });
  },
);

export const seriesCreate = controller.get(
  '/blog/series/edit',
  session.isAdmin(),
  async (req, res) => {
    res.render('admin/blog/series/edit', {
      layout: false,
    });
  },
);

export const seriesEdit = controller.get(
  '/blog/series/edit/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const series = await Series.selectOne(idx)(transaction);
    if (!series) {
      throw new Error('잘못된 접근입니다.');
    }

    const temp = await Temp.selectByTitle(series.title)(transaction);

    store(res).setState({
      posts: series.Posts,
    });

    res.render('admin/blog/series/edit', {
      temp: temp && temp.idx,
      series,
      posts: series.Posts,
      layout: false,
    });
  },
);

export const seriesDetail = controller.get(
  '/blog/series/:idx',
  validator.params({
    idx: Joi.number().required(),
  }),
  session.isAdmin(),
  async (req, res, transaction) => {
    const { idx } = req.params;

    const series = await Series.selectOne(idx)(transaction);
    if (!series) {
      throw new Error('잘못된 접근입니다.');
    }

    let [content, toc] = parseToc(series.contents);
    series.contents = content.replace(toc, '');

    // 포스트 네비바 처리
    let tocPostItems = '';
    series.Posts.forEach(post => {
      tocPostItems += `<li><a href="/blog/post/${post.idx}">${post.title}</a></li>`;
    });

    let tocPost = `<li><a href="#postList">관련 포스트</a><ul class="nav">${tocPostItems}</ul></li>`;

    if (toc == '<div id="toc"></div>') {
      toc = '<div id="toc"><ul class="nav sidenav"></ul></div>';
    }

    toc = toc.replace('</ul></div>', tocPost + '</ul></div>');

    res.render('admin/blog/series/detail', {
      series,
      toc,
      posts: series.Posts,
      layout: false,
    });
  },
);

export const tag = controller.get(
  '/blog/tag',
  session.isAdmin(),
  async (req, res, transaction) => {
    const tags = await Tag.selectDistinctTagGroupCount()(transaction);

    res.render('admin/blog/tag', {
      tags,
      layout: false,
    });
  },
);

export default controller.router;
