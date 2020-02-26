import { go, map, filter, uniqueBy } from 'fxjs';

import asyncify from '@/lib/asyncify';
import store from '@/lib/store';
import validator, { Joi } from '@/middleware/validator';
import { parseToc } from '@/lib/utils';

import Member from '@/models/Member';
import Post from '@/models/Post';
import Series from '@/models/Series';
import Tag from '@/models/Tag';
import Comment from '@/models/Comment';
import Hit from '@/models/Hit';

const controller = asyncify();

export const posts = controller.get('/blog/post', async (req, res) => {
  const { transaction } = req;
  const { query, page } = req.query;

  let { posts, postPage } = await Post.selectPaginated(query, page)(
    transaction,
  );

  const postCount = await Post.countAll()(transaction);
  const tagCount = await Tag.countDistinct()(transaction);

  const comments = await Comment.countGroupPost(posts.map(post => post.idx))(
    transaction,
  );

  posts = go(
    posts,
    map(post => {
      const comment = comments.find(
        comment => comment.post_idx === post.idx,
      ) || { count: 0 };
      return {
        ...post,
        comment: comment.count,
      };
    }),
  );

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
});

export const postDetail = controller.get(
  '/blog/post/:idx',
  validator.params({ idx: Joi.number().required() }),
  async (req, res) => {
    const { transaction } = req;
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
        let target_member = members.find(
          member => member.idx == comment.target_idx,
        );
        return {
          ...comment,
          target_name: target_member ? target_member.name : '',
        };
      }),
    );

    const commentsMember = go(
      post.Comments,
      filter(comment => {
        if (req.session.member) {
          return comment.member_idx !== req.session.member.idx;
        }
        return true;
      }),
      uniqueBy(u => u.member_idx),
      map(comment => ({
        idx: comment.member_idx,
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

export const series = controller.get('/blog/series', async (req, res) => {
  const { transaction } = req;
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
});

// router.get(
//   '/blog/series/:idx',
//   validator.params({ idx: Joi.number().required() }),
//   txrtfn(async (req, res, next, conn) => {
//     const { idx } = req.params;

//     const BOARD_SERIES = BoardSeries(conn);
//     const HIT_BOARD = HitBoard(conn);

//     const series = await BOARD_SERIES.selectOne(idx);
//     if (!series) {
//       throw new Error('잘못된 접근입니다.');
//     }

//     let contents = htmlToc(`<div id="toc"></div>${series.contents}`, {
//       selectors: 'h1, h2, h3, h4, h5',
//       anchors: false,
//       slugger: function(text) {
//         const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
//         return decodeURI(text)
//           .toLowerCase()
//           .trim()
//           .replace(re, '')
//           .replace(/\s/g, '_');
//       },
//     });

//     let [toc, ...rest] = contents.match(
//       /(<div id="toc")(.|\r\n|\r|\n)*(<\/div>)/,
//     );
//     series.contents = contents.replace(toc, '');

//     // 관련 포스트
//     const post = await BOARD_SERIES.selectRelatedPost(idx);

//     // 포스트 네비바 처리
//     let tocPostItems = '';
//     post.forEach((e, i) => {
//       tocPostItems += `<li><a href="/blog/post/${e.idx}">${e.title}</a></li>`;
//     });

//     let tocPost = `<li><a href="#postList">관련 포스트</a><ul class="nav">${tocPostItems}</ul></li>`;

//     if (toc == '<div id="toc"></div>') {
//       toc = '<div id="toc"><ul class="nav sidenav"></ul></div>';
//     }

//     toc = toc.replace('</ul></div>', tocPost + '</ul></div>');

//     // 조회수 처리
//     const client = clinfo(req);
//     if (!client.robot && client.device != 'undefined') {
//       const { affectedRows } = await HIT_BOARD.insertIgonre({
//         ip: client.ip,
//         board: 'series',
//         board_idx: idx,
//       });
//       if (affectedRows != 0) await BOARD_SERIES.updateHit(idx);
//     }

//     res.render('client/blog/series/detail', {
//       series,
//       toc,
//       post,
//       layout: false,
//     });
//   }),
// );

// router.get(
//   '/blog/tag',
//   txrtfn(async (req, res, next, conn) => {
//     const BOARD_POST = BoardPost(conn);
//     const POST_TAG = PostTag(conn);

//     const tags = await POST_TAG.selectDistinctTagGroupCount();

//     const post_count = await BOARD_POST.countAll();
//     const tag_count = await POST_TAG.countDistinct();

//     res.render('client/blog/tag', {
//       countPostTag: {
//         post_count,
//         tag_count,
//       },
//       tags,
//       layout: false,
//     });
//   }),
// );

// router.get(
//   '/blog/tag/:query',
//   validator.params({ query: Joi.required() }),
//   txrtfn(async (req, res, next, conn) => {
//     const { query } = req.params;
//     const { page } = req.query;

//     const BOARD_POST = BoardPost(conn);
//     const POST_TAG = PostTag(conn);
//     const COMMENT = Comment(conn);

//     let tags = await BOARD_POST.selectPageRelatedTagPost(query, page);
//     const tagPage = await BOARD_POST.selectPageRelatedTagPostInfo(query, page);

//     const post_count = await BOARD_POST.countAll();
//     const tag_count = await POST_TAG.countDistinct();

//     if (tags.length !== 0) {
//       const comments = await COMMENT.countGroupBoard(
//         'post',
//         tags.map(tag => tag.idx),
//       );

//       tags = go(
//         tags,
//         map(tag => {
//           const comment = comments.find(
//             comment => comment.board_idx === tag.idx,
//           ) || { count: 0 };
//           return {
//             ...tag,
//             comment: comment.count,
//           };
//         }),
//       );
//     }

//     store(res).setState({
//       tagPage,
//     });

//     res.render('client/blog/tag/detail', {
//       tags,
//       tagPage,
//       countPostTag: {
//         post_count,
//         tag_count,
//       },
//       query,
//       queryRow: query ? tagPage.rowCount : null,
//       layout: false,
//     });
//   }),
// );

export default controller.router;
