import { expect } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Post', () => {
  const Post = proxyquire('../../models/Post', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Post;

    describe('# TABLE', () => {
      it('테이블명은 post 이다.', () => {
        expect(options.tableName).to.eql('post');
      });
      it('모델명은 Post 이다.', () => {
        expect(options.modelName).to.eql('Post');
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

      it('STRING(100) 형태의 "title" 필드가 존재한다.', () => {
        const { title } = schema;

        // 필드 체크
        expect(title.field).to.eql('title');

        // 타입 체크
        expect(title.type).to.eql(Sequelize.STRING(100));
      });

      it('STRING(200) 형태의 "thumbnail" 필드가 존재한다.', () => {
        const { thumbnail } = schema;

        // 필드 체크
        expect(thumbnail.field).to.eql('thumbnail');

        // 타입 체크
        expect(thumbnail.type).to.eql(Sequelize.STRING(200));
      });

      it('TEXT("medium") 형태의 "contents" 필드가 존재한다.', () => {
        const { contents } = schema;

        // 필드 체크
        expect(contents.field).to.eql('contents');

        // 타입 체크
        expect(contents.type).to.eql(Sequelize.TEXT('medium'));
      });

      it('INTEGER(11) 형태의 "hit" 필드가 존재한다.', () => {
        const { hit } = schema;

        // 필드 체크
        expect(hit.field).to.eql('hit');

        // 타입 체크
        expect(hit.type).to.eql(Sequelize.INTEGER(11));
      });

      it('"hit" 필드는 0의 기본값으로 설정되어 있다.', () => {
        const { hit } = schema;

        // 필드 체크
        expect(hit.defaultValue).to.eql(0);
      });
    });
  });

  context('- Methods', () => {
    describe('# ASSOCIATE', () => {
      const instance = Post.default;

      const Comment = proxyquire('../../models/Comment', {
        '@/models': sequelize,
      }).default;

      const Tag = proxyquire('../../models/Tag', {
        '@/models': sequelize,
      }).default;

      const Series = proxyquire('../../models/Series', {
        '@/models': sequelize,
      }).default;

      const SeriesPost = proxyquire('../../models/SeriesPost', {
        '@/models': sequelize,
      }).default;

      spy(instance, 'hasMany');
      spy(instance, 'belongsToMany');
      instance.associate({ Comment, Tag, Series, SeriesPost });

      it('Comment 모델과 hasMany 관계를 맺고 있다. ', () => {
        const hasManyToSpy = instance.hasMany.getCall(0);
        const options = hasManyToSpy.args[1];

        // 관계 정의 함수 호출 체크
        expect(hasManyToSpy.calledWith(Comment)).to.be.ok;

        // 옵션 체크
        expect(options.onDelete).to.eql('CASCADE');
      });

      it('Tag 모델과 hasMany 관계를 맺고 있다. ', () => {
        const hasManyToSpy = instance.hasMany.getCall(1);
        const options = hasManyToSpy.args[1];

        // 관계 정의 함수 호출 체크
        expect(hasManyToSpy.calledWith(Tag)).to.be.ok;

        // 옵션 체크
        expect(options.onDelete).to.eql('CASCADE');
      });

      it('Series 모델과 belongsToMany 관계를 맺고 있다. ', () => {
        const belongsToManySpy = instance.belongsToMany.getCall(0);
        const options = belongsToManySpy.args[1];

        // 관계 정의 함수 호출 체크
        expect(belongsToManySpy.calledWith(Series)).to.be.ok;

        // 옵션 체크
        expect(options.through.model).to.eql(SeriesPost);
        expect(options.timestamps).to.false;
      });
    });
  });
});
