import { go, map, filter, uniqueBy } from 'fxjs';

import asyncify from '@/lib/asyncify';
import store from '@/lib/store';
import validator, { Joi } from '@/middleware/validator';
import { parseToc } from '@/lib/utils';

import Member from '@/models/Member';
import Post from '@/models/Post';
import Series from '@/models/Series';
import Tag from '@/models/Tag';
import Hit from '@/models/Hit';

const controller = asyncify();

export const posts = controller.get(
  '/blog/post',
  async (req, res, transaction) => {
    const { query, page } = req.query;
    let { posts, postPage } = await Post.selectPaginated(query, page)(
      transaction,
    );

    const postCount = await Post.countAll()(transaction);
    const tagCount = await Tag.countDistinct()(transaction);

    store(res).setState({
      postPage,
    });

    res.render('client/blog/post', {
      posts,
      postPage,
      queryRow: query ? postPage.rowCount : null,
      countPostTag: {
        postCount,
        tagCount,
      },
      layout: false,
    });
  },
);

export const postDetail = controller.get(
  '/blog/post/:idx',
  validator.params({ idx: Joi.number().required() }),
  async (req, res, transaction) => {
    const { idx } = req.params;

    let post = await Post.selectOne(idx)(transaction);

    if (!post) {
      throw new Error('잘못된 접근입니다.');
    }

    post = post.toJSON();

    const [content, toc] = parseToc(post.contents);
    post.contents = content.replace(toc, '');

    // 연관 포스트
    let relation =
      post.Tags.length !== 0
        ? await Post.selectRelatedTagPost(post.Tags.map(item => item.idx))(
            transaction,
          )
        : await Post.selectPopularPost()(transaction);

    // 조회수 처리
    if (!req.info.robot && req.info.device !== 'undefined') {
      const hit = {
        ip: req.info.ip,
        type: 'post',
        key: post.idx,
      };

      const hitLog = await Hit.selectOne(hit)(transaction);

      if (!hitLog) {
        await Hit.insertIgonre(hit)(transaction);
        await Post.updateHit(post.idx)(transaction);
      }
    }

    // 댓글 처리
    const members = await Member.selectAll()(transaction);

    const comments = await go(
      post.Comments,
      map(comment => {
        let member = members.find(member => member.idx == comment.memberIdx);

        let targetMember = members.find(
          member => member.idx == comment.targetIdx,
        );
        return {
          ...comment,
          thumbnail: member.thumbnail,
          name: member.name,
          targetName: targetMember ? targetMember.name : '',
        };
      }),
    );

    const commentsMember = go(
      comments,
      filter(comment => {
        if (req.session.member) {
          return comment.memberIdx !== req.session.member.idx;
        }
        return true;
      }),
      uniqueBy(u => u.memberIdx),
      map(comment => ({
        idx: comment.memberIdx,
        name: comment.name,
      })),
    );

    res.render('client/blog/post/detail', {
      post,
      toc,
      tags: post.Tags,
      series: post.Series,
      relation,
      comments,
      commentsMember,
      layout: false,
    });
  },
);

export const series = controller.get(
  '/blog/series',
  async (req, res, transaction) => {
    const { query, page } = req.query;

    let { series, seriesPage } = await Series.selectPaginated(query, page)(
      transaction,
    );

    const postCount = await Post.countAll()(transaction);
    const tagCount = await Tag.countDistinct()(transaction);

    store(res).setState({
      seriesPage,
    });

    res.render('client/blog/series', {
      series,
      seriesPage,
      queryRow: query ? seriesPage.rowCount : null,
      countPostTag: {
        postCount,
        tagCount,
      },
      layout: false,
    });
  },
);

export const seriesDetail = controller.get(
  '/blog/series/:idx',
  validator.params({ idx: Joi.number().required() }),
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

    // 조회수 처리
    if (!req.info.robot && req.info.device !== 'undefined') {
      const hit = {
        ip: req.info.ip,
        type: 'series',
        key: series.idx,
      };

      const hitLog = await Hit.selectOne(hit)(transaction);

      if (!hitLog) {
        await Hit.insertIgonre(hit)(transaction);
        await Series.updateHit(series.idx)(transaction);
      }
    }

    res.render('client/blog/series/detail', {
      series,
      toc,
      layout: false,
    });
  },
);

export const tag = controller.get(
  '/blog/tag',
  async (req, res, transaction) => {
    const tags = await Tag.selectDistinctTagGroupCount()(transaction);

    const postCount = await Post.countAll()(transaction);
    const tagCount = await Tag.countDistinct()(transaction);

    res.render('client/blog/tag', {
      countPostTag: {
        postCount,
        tagCount,
      },
      tags,
      layout: false,
    });
  },
);

export const tagDetail = controller.get(
  '/blog/tag/:query',
  validator.params({ query: Joi.required() }),
  async (req, res, transaction) => {
    const { query } = req.params;
    const { page } = req.query;

    let { posts, postPage } = await Post.selectPaginatedRelatedTag(query, page)(
      transaction,
    );

    const postCount = await Post.countAll()(transaction);
    const tagCount = await Tag.countDistinct()(transaction);

    store(res).setState({
      postPage,
    });

    res.render('client/blog/tag/detail', {
      posts,
      postPage,
      countPostTag: {
        postCount,
        tagCount,
      },
      query,
      queryRow: query ? postPage.rowCount : null,
      layout: false,
    });
  },
);

export default controller.router;
