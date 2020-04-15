import { expect } from 'chai';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Hit', () => {
  const Hit = proxyquire('../../models/Hit', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Hit;

    describe('# TABLE', () => {
      it('테이블명은 hit 이다.', () => {
        expect(options.tableName).to.eql('hit');
      });

      it('모델명은 Hit 이다.', () => {
        expect(options.modelName).to.eql('Hit');
      });

      it('ip, type, key 필드로 유니크키가 설정되어있다.', () => {
        const ipTypeKeyUnique = options.indexes[0];

        // 유니크 체크
        expect(ipTypeKeyUnique.unique).to.true;

        // 필드 체크
        expect(ipTypeKeyUnique.fields).to.eql(['ip', 'type', 'key']);
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

      it('STRING(30) 형태의 "ip" 필드가 존재한다.', () => {
        const { ip } = schema;

        // 필드 체크
        expect(ip.field).to.eql('ip');

        // 타입 체크
        expect(ip.type).to.eql(Sequelize.STRING(30));
      });

      it('STRING(30) 형태의 "type" 필드가 존재한다.', () => {
        const { type } = schema;

        // 필드 체크
        expect(type.field).to.eql('type');

        // 타입 체크
        expect(type.type).to.eql(Sequelize.STRING(30));
      });

      it('INTEGER(11) 형태의 "key" 필드가 존재한다.', () => {
        const { key } = schema;

        // 필드 체크
        expect(key.field).to.eql('key');

        // 타입 체크
        expect(key.type).to.eql(Sequelize.INTEGER(11));
      });
    });
  });
});
