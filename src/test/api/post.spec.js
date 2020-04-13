import httpMocks from 'node-mocks-http';
import sinon from 'sinon';
import { expect } from 'chai';
import { compose } from 'compose-middleware';

import * as postApi from '@/routes/api/post';

import Post from '@/models/Post';

describe('[API] POST', () => {
  context('- GET /api/post', () => {
    const selectAll = compose(postApi.selectAll);

    before(() => {
      sinon.stub(Post, 'selectAll').returns(() => {
        return [
          {
            idx: 1,
            title: '첫번째 포스팅',
            thumbnail:
              'https://devhyun.com/uploads/20190812/th_1NqtvY0q10u9K29xbo1Wcg2N58xh.jpeg',
            contents: '포스팅 콘텐츠',
            hit: 0,
            reg: '2020-04-04T16:19:02.644Z',
          },
          {
            idx: 2,
            title: '두번째 포스팅',
            thumbnail:
              'https://devhyun.com/uploads/20190812/th_1NqtvY0q10u9K29xbo1Wcg2N58xh.jpeg',
            contents: '포스팅 콘텐츠',
            hit: 0,
            reg: '2020-04-04T16:19:02.644Z',
          },
        ];
      });
    });

    describe('# ERROR', () => {
      it('로그인 하지 않은 사용자의 요청은 401로 응답한다.', async () => {
        const req = httpMocks.createRequest({
          url: '/api/post',
          method: 'GET',
          session: { member: null },
        });
        const res = httpMocks.createResponse();

        await selectAll(req, res);

        // 세션 체크
        expect(req.session.member).to.null;
        expect(res.statusCode).to.eq(401);
      });

      it('USER 권한 사용자의 요청은 401로 응답한다.', async () => {
        const req = httpMocks.createRequest({
          url: '/api/post',
          method: 'GET',
          session: { member: { role: 'USER' } },
        });
        const res = httpMocks.createResponse();

        await selectAll(req, res);

        // 세션 체크
        expect(req.session.member.role).to.eq('USER');
        expect(res.statusCode).to.eq(401);
      });
    });

    describe('# SUCCESS', () => {
      it('POST 리스트를 반환한다.', async () => {
        const req = httpMocks.createRequest({
          url: '/api/post',
          method: 'GET',
          session: { member: { role: 'ADMIN' } },
        });
        const res = httpMocks.createResponse();

        await selectAll(req, res);

        const json = JSON.parse(res._getData());

        // 세션 체크
        expect(req.session.member.role).to.eq('ADMIN');

        // 결과값 체크
        expect(res.statusCode).to.eq(200);
        expect(json).to.eql([
          {
            idx: 1,
            title: '첫번째 포스팅',
            thumbnail:
              'https://devhyun.com/uploads/20190812/th_1NqtvY0q10u9K29xbo1Wcg2N58xh.jpeg',
            contents: '포스팅 콘텐츠',
            hit: 0,
            reg: '2020-04-04T16:19:02.644Z',
          },
          {
            idx: 2,
            title: '두번째 포스팅',
            thumbnail:
              'https://devhyun.com/uploads/20190812/th_1NqtvY0q10u9K29xbo1Wcg2N58xh.jpeg',
            contents: '포스팅 콘텐츠',
            hit: 0,
            reg: '2020-04-04T16:19:02.644Z',
          },
        ]);
      });
    });
  });
});
