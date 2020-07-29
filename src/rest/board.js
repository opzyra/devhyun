import express from 'express';
import { createMarkdown } from 'safe-marked';

import CONFIG from '../config';
import sessionCtx from '../core/session';
import validateCtx from '../core/validate';
import adminCtx from '../core/admin';
import markdownCtx from '../core/markdown';
import wrap from '../core/wrap';

const router = express.Router();

router.get(
  '/post', // 포스트 가져오기
  sessionCtx.isAdmin(), // 관리자 권한
  wrap.query(async (req, res, next, mapper) => {
    const { query } = req.query;
    let post = [];

    if (query) {
      const [posts] = await mapper('PostBoard', 'selectAllQuery', { query });
      post = posts;
    } else {
      const [posts] = await mapper('PostBoard', 'selectLatest', { query });
      post = posts;
    }

    res.status(200).json({ post });
  }),
);

router.post(
  '/post', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    let { title, thumbnail, contents, tags } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true, headerIds: false },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    const [{ insertId }] = await mapper('PostBoard', 'insertOne', {
      member_idx: member.idx,
      title,
      contents,
      thumbnail: thumbnail || `${CONFIG.CTX.DOMAIN}/images/default_post.png`,
      tags,
    });

    if (tags) {
      const tagList = tags.split(',');
      for (let i = 0; i < tagList.length; i++) {
        await mapper('PostBoard', 'insertFkTag', {
          post_idx: insertId,
          tag: tagList[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `포스트 등록 (${title})`);

    res.status(200).json({ message: `포스트를 등록하였습니다.` });
  }),
);

router.put(
  '/post/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    let { title, thumbnail, contents, tags } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    const [[post]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != post.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    await mapper('PostBoard', 'updateOne', {
      idx,
      title,
      thumbnail,
      contents,
      tags,
    });

    // 태그 처리
    await mapper('PostBoard', 'deleteFkTag', {
      post_idx: idx,
    });

    if (tags) {
      const tagList = tags.split(',');
      for (let i = 0; i < tagList.length; i++) {
        await mapper('PostBoard', 'insertFkTag', {
          post_idx: idx,
          tag: tagList[i],
        });
      }
    }

    await adminCtx.log(req, mapper, `포스트 수정 (${title})`);

    res.status(200).json({ message: `포스트를 수정하였습니다.` });
  }),
);

router.delete(
  '/post/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    const [[post]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != post.member_idx) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }

    // 태그 처리
    await mapper('PostBoard', 'deleteFkTag', {
      post_idx: idx,
    });

    await mapper('PostBoard', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `포스트 삭제 (${post.title})`);

    res.status(200).json({ message: `포스트를 삭제하였습니다.` });
  }),
);

router.post(
  '/series', // 등록
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    let { title, thumbnail, contents, posts } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    const [{ insertId }] = await mapper('SeriesBoard', 'insertOne', {
      member_idx: member.idx,
      title,
      contents,
      thumbnail: thumbnail || `${CONFIG.CTX.DOMAIN}/images/default_series.png`,
    });

    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        await mapper('SeriesBoard', 'insertFkPost', {
          series_idx: insertId,
          post_idx: posts[i],
          odr: i + 1,
        });
      }
    }

    await adminCtx.log(req, mapper, `시리즈 등록 (${title})`);

    res.status(200).json({ message: `시리즈를 등록하였습니다.` });
  }),
);

router.put(
  '/series/:idx', // 수정
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  validateCtx.body({
    // 유효성 검사
    title: 'required',
    contents: 'required',
  }),
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;
    let { title, thumbnail, contents, posts } = req.body;

    // 시큐어 - XSS 방어
    const markdown = createMarkdown({
      marked: { breaks: true },
    });
    contents = markdown(contents);

    // 앵커 태그 처리
    contents = markdownCtx.anchorConvert(contents);

    const [[series]] = await mapper('PostBoard', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != series.member_idx) {
      res.status(401).json({ message: `수정 권한이 없습니다.` });
      return;
    }

    await mapper('SeriesBoard', 'updateOne', {
      idx,
      title,
      thumbnail,
      contents,
    });

    // 태그 처리
    await mapper('SeriesBoard', 'deleteFkPost', {
      series_idx: idx,
    });

    if (posts) {
      for (let i = 0; i < posts.length; i++) {
        await mapper('SeriesBoard', 'insertFkPost', {
          series_idx: idx,
          post_idx: posts[i],
          odr: i + 1,
        });
      }
    }

    await adminCtx.log(req, mapper, `시리즈 수정 (${title})`);

    res.status(200).json({ message: `시리즈를 수정하였습니다.` });
  }),
);

router.delete(
  '/series/:idx', // 삭제
  sessionCtx.isAdmin(), // 관리자 권한
  validateCtx.params('idx'), // 유효성 검사
  wrap.query(async (req, res, next, mapper) => {
    const member = req.session.member;
    const idx = req.params.idx;

    const [[series]] = await mapper('SeriesBoard', 'selectOne', {
      idx,
    });

    if (member.role == 'MEMBER_ADMIN' && member.idx != series.member_idx) {
      res.status(401).json({ message: `삭제 권한이 없습니다.` });
      return;
    }

    // 태그 처리
    await mapper('SeriesBoard', 'deleteFkPost', {
      series_idx: idx,
    });

    await mapper('SeriesBoard', 'deleteOne', {
      idx,
    });

    await adminCtx.log(req, mapper, `시리즈 삭제 (${series.title})`);

    res.status(200).json({ message: `시리즈를 삭제하였습니다.` });
  }),
);

export default router;
