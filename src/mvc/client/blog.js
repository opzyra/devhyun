import express from 'express';
import htmlToc from 'html-toc';

import wrap from '../../core/wrap';
import sessionCtx from '../../core/session';

const router = express.Router();

router.get(
  '/blog/post',
  wrap.query(async (req, res, next, mapper) => {
    const { query, page } = req.query;

    // 디폴트 파라미터
    const param = {
      query: query || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 9 || 0,
    };

    const [items] = await mapper('PostBoard', 'selectAllPageClient', param);
    const [[{ row }]] = await mapper('PostBoard', 'countAllPageClient', param);

    let totalPage = row / 9;

    if (row % 9 > 0) {
      totalPage++;
    }

    // 카운팅
    const [[count]] = await mapper('PostBoard', 'countAllPostFkTag');

    res.render('client/blog/post', {
      count,
      queryRow: query ? row : null,
      postList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

router.get(
  '/blog/post/:idx',
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.params;

    const [[post]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (!post) {
      throw new Error('잘못된 접근입니다.');
    }

    let contents = htmlToc(`<div id="toc"></div>${post.contents}`, {
      selectors: 'h1, h2, h3, h4, h5',
      anchors: false,
      slugger: function(text) {
        const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
        return decodeURI(text)
          .toLowerCase()
          .trim()
          .replace(re, '')
          .replace(/\s/g, '_');
      },
    });

    let [toc, ...rest] = contents.match(
      /(<div id="toc")(.|\r\n|\r|\n)*(<\/div>)/,
    );
    post.contents = contents.replace(toc, '');

    // 태그
    const tags = post.tags != '' ? post.tags.split(',') : [];

    // 시리즈 처리
    const [seriesRs] = await mapper('PostBoard', 'selectFkSeries', {
      post_idx: idx,
    });

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
          contents: v.pb_contents,
        });
        return a;
      }, Object.create(null)),
    );

    // 연관 포스트
    let relation = [];
    if (post.tags) {
      const [relationPosts] = await mapper('PostBoard', 'selectFkRelation', {
        idx,
        tags,
      });

      relation = relationPosts;
    } else {
      const [hitPosts] = await mapper('PostBoard', 'selectAllHit');

      relation = hitPosts;
    }

    // 조회수 처리
    const device = sessionCtx.getClientDevice(req);
    const ip = sessionCtx.getClientIp(req);

    if (device != 'undefined') {
      const [[hitLog]] = await mapper('HitLog', 'selectOne', {
        ip,
        board: 'post',
        board_idx: idx,
      });

      if (!hitLog) {
        await mapper('HitLog', 'insertOne', {
          ip,
          board: 'post',
          board_idx: idx,
        });
        await mapper('PostBoard', 'updateOneHit', { idx });
      }
    }

    res.render('client/blog/post/detail', {
      post,
      toc,
      tags,
      series,
      relation,
      layout: false,
    });
  }),
);

router.get(
  '/blog/series',
  wrap.query(async (req, res, next, mapper) => {
    const { query, page } = req.query;

    // 디폴트 파라미터
    const param = {
      query: query || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 9 || 0,
    };

    const [items] = await mapper('SeriesBoard', 'selectFkAllPagePost', param);
    const [[{ row }]] = await mapper(
      'SeriesBoard',
      'countAllPageClient',
      param,
    );

    let totalPage = row / 9;

    if (row % 9 > 0) {
      totalPage++;
    }

    // 카운팅
    const [[count]] = await mapper('PostBoard', 'countAllPostFkTag');

    res.render('client/blog/series', {
      count,
      queryRow: query ? row : null,
      seriesList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

router.get(
  '/blog/series/:idx',
  wrap.query(async (req, res, next, mapper) => {
    const { idx } = req.params;

    const [[series]] = await mapper('SeriesBoard', 'selectOne', {
      idx,
    });

    if (!series) {
      throw new Error('잘못된 접근입니다.');
    }

    let contents = htmlToc(`<div id="toc"></div>${series.contents}`, {
      selectors: 'h1, h2, h3, h4, h5',
      anchors: false,
      slugger: function(text) {
        const re = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g;
        return decodeURI(text)
          .toLowerCase()
          .trim()
          .replace(re, '')
          .replace(/\s/g, '_');
      },
    });

    let [toc, ...rest] = contents.match(
      /(<div id="toc")(.|\r\n|\r|\n)*(<\/div>)/,
    );
    series.contents = contents.replace(toc, '');

    // 관련 포스트
    const [post] = await mapper('SeriesBoard', 'selectAlFkPost', {
      series_idx: idx,
    });

    // 포스트 네비바 처리
    let tocPostItems = '';
    post.forEach((e, i) => {
      tocPostItems += `<li><a href="/blog/post/${e.idx}">${e.title}</a></li>`;
    });

    let tocPost = `<li><a href="#postList">관련 포스트</a><ul class="nav">${tocPostItems}</ul></li>`;

    if (toc == '<div id="toc"></div>') {
      toc = '<div id="toc"><ul class="nav sidenav"></ul></div>';
    }

    toc = toc.replace('</ul></div>', tocPost + '</ul></div>');

    // 조회수 처리
    const device = sessionCtx.getClientDevice(req);
    const ip = sessionCtx.getClientIp(req);

    if (device != 'undefined') {
      const [[hitLog]] = await mapper('HitLog', 'selectOne', {
        ip,
        board: 'series',
        board_idx: idx,
      });

      if (!hitLog) {
        await mapper('HitLog', 'insertOne', {
          ip,
          board: 'series',
          board_idx: idx,
        });
        await mapper('SeriesBoard', 'updateOneHit', { idx });
      }
    }

    res.render('client/blog/series/detail', {
      series,
      toc,
      post,
      layout: false,
    });
  }),
);

router.get(
  '/blog/tag',
  wrap.query(async (req, res, next, mapper) => {
    // 태그
    const [tags] = await mapper('PostBoard', 'selectAlFkTag');

    // 카운팅
    const [[count]] = await mapper('PostBoard', 'countAllPostFkTag');

    res.render('client/blog/tag', {
      count,
      tags,
      layout: false,
    });
  }),
);

router.get(
  '/blog/tag/:query',
  wrap.query(async (req, res, next, mapper) => {
    const { query, page } = req.params;

    if (!query) {
      throw new Error('잘못된 접근입니다.');
    }

    // 디폴트 파라미터
    const param = {
      query: query || '',
      page: parseInt(page) - 1 || 0,
      limit: (parseInt(page) - 1) * 9 || 0,
    };

    const [items] = await mapper('PostBoard', 'selectFkTagPost', param);
    const [[{ row }]] = await mapper('PostBoard', 'countFkTagPost', param);

    let totalPage = row / 9;

    if (row % 9 > 0) {
      totalPage++;
    }

    // 카운팅
    const [[count]] = await mapper('PostBoard', 'countAllPostFkTag');

    res.render('client/blog/tag/detail', {
      count,
      query,
      queryRow: query ? row : null,
      tagList: {
        items,
        row,
        totalPage: parseInt(totalPage),
        page: param.page,
      },
      layout: false,
    });
  }),
);

export default router;
