import { expect } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Comment', () => {
  const Comment = proxyquire('../../models/Comment', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Comment;

    describe('# TABLE', () => {
      it('테이블명은 comment 이다.', () => {
        expect(options.tableName).to.eql('comment');
      });
      it('모델명은 Comment 이다.', () => {
        expect(options.modelName).to.eql('Comment');
      });
    });

    describe('# FIELD', () => {
      it('INTEGER(11) 형태의 AUTO INCREMENT PK인 "idx" 필드가 존재한다.', () => {
        const { idx } = schema;

        // 필드 체크
        expect(idx.field).to.eql('idx');

        // 타입 체크
        expect(idx.type).to.eql(Sequelize.INTEGER(11));

        // AUTO INCREMENT 체크
        expect(idx.autoIncrement).to.true;

        // PK 체크
        expect(idx.primaryKey).to.true;
      });

      it('TEXT("medium") 형태의 "contents" 필드가 존재한다.', () => {
        const { contents } = schema;

        // 필드 체크
        expect(contents.field).to.eql('contents');

        // 타입 체크
        expect(contents.type).to.eql(Sequelize.TEXT('medium'));
      });
    });
  });

  context('- Methods', () => {
    describe('# ASSOCIATE', () => {
      const instance = Comment.default;

      const Member = proxyquire('../../models/Member', {
        '@/models': sequelize,
      }).default;

      const Post = proxyquire('../../models/Post', {
        '@/models': sequelize,
      }).default;

      spy(instance, 'belongsTo');
      instance.associate({ Member, Post });

      it('Member 모델(작성자)과 belongsTo 관계를 맺고 있다. ', () => {
        const belongsToSpy = instance.belongsTo.getCall(0);
        const options = belongsToSpy.args[1];

        // 관계 정의 함수 호출 체크
        expect(belongsToSpy.calledWith(Member)).to.be.ok;

        // 옵션 체크
        expect(options.as).to.eql('member');
      });

      it('Member 모델(대상)과 belongsTo 관계를 맺고 있다. ', () => {
        const belongsToSpy = instance.belongsTo.getCall(1);
        const options = belongsToSpy.args[1];

        // 관계 정의 함수 호출 체크
        expect(belongsToSpy.calledWith(Member)).to.be.ok;

        // 옵션 체크
        expect(options.as).to.eql('target');
      });

      it('Post 모델과 belongsTo 관계를 맺고 있다. ', () => {
        const belongsToSpy = instance.belongsTo.getCall(2);

        // 관계 정의 함수 호출 체크
        expect(belongsToSpy.calledWith(Post)).to.be.ok;
      });
    });
  });
});
