import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] NoteGroup', () => {
  const NoteGroup = proxyquire('../../models/NoteGroup', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = NoteGroup;

    describe('# TABLE', () => {
      it('테이블명은 noteGroup 이다.', () => {
        expect(options.tableName).to.eql('note_group');
      });
      it('모델명은 NoteGroup 이다.', () => {
        expect(options.modelName).to.eql('NoteGroup');
      });

      it('createdAt updateAt 필드를 생성하지 않는다.', () => {
        // 필드 체크
        expect(options.timestamps).to.false;
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

      it('STRING(100) 형태의 "name" 필드가 존재한다.', () => {
        const { name } = schema;

        // 필드 체크
        expect(name.field).to.eql('name');

        // 타입 체크
        expect(name.type).to.eql(Sequelize.STRING(100));
      });

      it('STRING(10) 형태의 "color" 필드가 존재한다.', () => {
        const { color } = schema;

        // 필드 체크
        expect(color.field).to.eql('color');

        // 타입 체크
        expect(color.type).to.eql(Sequelize.STRING(10));
      });

      it('INTEGER(11) 형태의 "odr" 필드가 존재한다.', () => {
        const { odr } = schema;

        // 필드 체크
        expect(odr.field).to.eql('odr');

        // 타입 체크
        expect(odr.type).to.eql(Sequelize.INTEGER(11));
      });
    });
  });
});
