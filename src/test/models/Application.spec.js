import { expect } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Application', () => {
  spy(sequelize, 'define');

  const Application = proxyquire('../../models/Application', {
    '@/models': sequelize,
  });

  context('- Model Options', () => {
    const { schema, options } = Application;

    describe('# TABLE', () => {
      it('테이블명은 application 이다.', () => {
        expect(options.tableName).to.eql('application');
      });
    });

    describe('# SCHEMA', () => {
      it('INTEGER(11) 형태의 AUTO INCREMENT PK인 "idx" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.idx.field).to.eql('idx');

        // 타입 체크
        expect(schema.idx.type).to.eql(Sequelize.INTEGER(11));

        // AUTO INCREMENT 체크
        expect(schema.idx.autoIncrement).to.true;

        // PK 체크
        expect(schema.idx.primaryKey).to.true;
      });

      it('STRING(50) 형태의 "name" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.name.field).to.eql('name');

        // 타입 체크
        expect(schema.name.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(50) 형태의 "domain" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.domain.field).to.eql('domain');

        // 타입 체크
        expect(schema.domain.type).to.eql(Sequelize.STRING(50));
      });

      it('STRING(50) 형태의 "own" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.own.field).to.eql('own');

        // 타입 체크
        expect(schema.own.type).to.eql(Sequelize.STRING(50));
      });

      it('INT(11) 형태의 "price" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.price.field).to.eql('price');

        // 타입 체크
        expect(schema.price.type).to.eql(Sequelize.INTEGER(11));
      });

      it('DATE() 형태의 "expiredServer" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.expiredServer.field).to.eql('expired_server');

        // 타입 체크
        expect(schema.expiredServer.type).to.eql(Sequelize.DATE());
      });

      it('DATE() 형태의 "expiredDomain" 필드가 존재한다.', () => {
        // 필드 체크
        expect(schema.expiredDomain.field).to.eql('expired_domain');

        // 타입 체크
        expect(schema.expiredDomain.type).to.eql(Sequelize.DATE());
      });
    });
  });
});
