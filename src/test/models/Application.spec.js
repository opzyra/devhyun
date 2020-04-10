import { expect } from 'chai';
import { spy, assert } from 'sinon';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists,
} from 'sequelize-test-helpers';

describe('[Model] Application', () => {
  spy(sequelize, 'define');

  const Application = proxyquire('../../models/Application', {
    '@/models': sequelize,
  });
  const modelDefineSpy = sequelize.define.getCall(0);

  context('- Model Options', () => {
    describe('# TABLE', () => {
      it('테이블명은 application 이다.', () => {});
    });

    describe('# SCHEMA', () => {
      it('INTEGER(11) 형태의 AUTO INCREMENT PK인 "idx" 필드가 존재한다.', () => {
        const { schema } = Application;

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
        const { schema } = Application;

        // 필드 체크
        expect(schema.name.field).to.eql('name');

        // 타입 체크
        expect(schema.name.type).to.eql(Sequelize.STRING(50));
      });
    });
  });
});
