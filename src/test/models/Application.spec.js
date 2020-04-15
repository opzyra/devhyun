import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Application', () => {
  const Application = proxyquire('../../models/Application', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Application;

    describe('# TABLE', () => {
      it('테이블명은 application 이다.', () => {
        expect(options.tableName).to.eql('application');
      });
      it('모델명은 Application 이다.', () => {
        expect(options.modelName).to.eql('Application');
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

      it('STRING(50) 형태의 "name" 필드가 존재한다.', () => {
        const { name } = schema;

        // 필드 체크
        expect(name.field).to.eql('name');

        // 타입 체크
        expect(name.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(50) 형태의 "domain" 필드가 존재한다.', () => {
        const { domain } = schema;

        // 필드 체크
        expect(domain.field).to.eql('domain');

        // 타입 체크
        expect(domain.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(50) 형태의 "own" 필드가 존재한다.', () => {
        const { own } = schema;

        // 필드 체크
        expect(own.field).to.eql('own');

        // 타입 체크
        expect(own.type).to.eql(Sequelize.STRING(50));
      });

      it('INT(11) 형태의 "price" 필드가 존재한다.', () => {
        const { price } = schema;

        // 필드 체크
        expect(price.field).to.eql('price');

        // 타입 체크
        expect(price.type).to.eql(Sequelize.INTEGER(11));
      });

      it('DATE() 형태의 "expiredServer" 필드가 존재한다.', () => {
        const { expiredServer } = schema;

        // 필드 체크
        expect(expiredServer.field).to.eql('expired_server');

        // 타입 체크
        expect(expiredServer.type).to.eql(Sequelize.DATE());
      });

      it('DATE() 형태의 "expiredDomain" 필드가 존재한다.', () => {
        const { expiredDomain } = schema;

        // 필드 체크
        expect(expiredDomain.field).to.eql('expired_domain');

        // 타입 체크
        expect(expiredDomain.type).to.eql(Sequelize.DATE());
      });
    });
  });
});
