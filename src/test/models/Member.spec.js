import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Member', () => {
  const Member = proxyquire('../../models/Member', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Member;

    describe('# TABLE', () => {
      it('테이블명은 member 이다.', () => {
        expect(options.tableName).to.eql('member');
      });

      it('모델명은 Member 이다.', () => {
        expect(options.modelName).to.eql('Member');
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

      it('STRING(50) 형태의 "id" 필드가 존재한다.', () => {
        const { id } = schema;

        // 필드 체크
        expect(id.field).to.eql('id');

        // 타입 체크
        expect(id.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(200) 형태의 "social" 필드가 존재한다.', () => {
        const { social } = schema;

        // 필드 체크
        expect(social.field).to.eql('social');

        // 타입 체크
        expect(social.type).to.eql(Sequelize.STRING(200));
      });

      it('STRING(50) 형태의 "name" 필드가 존재한다.', () => {
        const { name } = schema;

        // 필드 체크
        expect(name.field).to.eql('name');

        // 타입 체크
        expect(name.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(50) 형태의 "role" 필드가 존재한다.', () => {
        const { role } = schema;

        // 필드 체크
        expect(role.field).to.eql('role');

        // 타입 체크
        expect(role.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(500) 형태의 "thumbnail" 필드가 존재한다.', () => {
        const { thumbnail } = schema;

        // 필드 체크
        expect(thumbnail.field).to.eql('thumbnail');

        // 타입 체크
        expect(thumbnail.type).to.eql(Sequelize.STRING(500));
      });

      it('STRING(500) 형태의 "email" 필드가 존재한다.', () => {
        const { email } = schema;

        // 필드 체크
        expect(email.field).to.eql('email');

        // 타입 체크
        expect(email.type).to.eql(Sequelize.STRING(500));
      });

      it('BOOLEAN() 형태의 "marketing" 필드가 존재한다.', () => {
        const { marketing } = schema;

        // 필드 체크
        expect(marketing.field).to.eql('marketing');

        // 타입 체크
        expect(marketing.type).to.eql(Sequelize.BOOLEAN());
      });

      it('BOOLEAN() 형태의 "withdraw" 필드가 존재한다.', () => {
        const { withdraw } = schema;

        // 필드 체크
        expect(withdraw.field).to.eql('withdraw');

        // 타입 체크
        expect(withdraw.type).to.eql(Sequelize.BOOLEAN());
      });

      it('BOOLEAN() 형태의 "active" 필드가 존재한다.', () => {
        const { active } = schema;

        // 필드 체크
        expect(active.field).to.eql('active');

        // 타입 체크
        expect(active.type).to.eql(Sequelize.BOOLEAN());
      });

      it('DATE() 형태의 "loginAt" 필드가 존재한다.', () => {
        const { loginAt } = schema;

        // 필드 체크
        expect(loginAt.field).to.eql('login_at');

        // 타입 체크
        expect(loginAt.type).to.eql(Sequelize.DATE());
      });

      it('"role" 필드는 "USER"의 기본값으로 설정되어 있다.', () => {
        const { role } = schema;

        // 필드 체크
        expect(role.defaultValue).to.eql('USER');
      });

      it('"thumbnail" 필드는 "/images/default_thumbnail.png"의 기본값으로 설정되어 있다.', () => {
        const { thumbnail } = schema;

        // 필드 체크
        expect(thumbnail.defaultValue).to.eql('/images/default_thumbnail.png');
      });

      it('"marketing" 필드는 FALSE의 기본값으로 설정되어 있다.', () => {
        const { marketing } = schema;

        // 필드 체크
        expect(marketing.defaultValue).to.false;
      });

      it('"withdraw" 필드는 FALSE의 기본값으로 설정되어 있다.', () => {
        const { withdraw } = schema;

        // 필드 체크
        expect(withdraw.defaultValue).to.false;
      });

      it('"active" 필드는 TRUE의 기본값으로 설정되어 있다.', () => {
        const { active } = schema;

        // 필드 체크
        expect(active.defaultValue).to.true;
      });
    });
  });
});
