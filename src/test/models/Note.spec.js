import { expect } from 'chai';
import { spy } from 'sinon';
import proxyquire from 'proxyquire';
import Sequelize from 'sequelize';
import { sequelize } from 'sequelize-test-helpers';

describe('[Model] Note', () => {
  const Note = proxyquire('../../models/Note', {
    '@/models': sequelize,
  });

  context('- Options', () => {
    const { schema, options } = Note;

    describe('# TABLE', () => {
      it('테이블명은 note 이다.', () => {
        expect(options.tableName).to.eql('note');
      });
      it('모델명은 Note 이다.', () => {
        expect(options.modelName).to.eql('Note');
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
      const instance = Note.default;

      const NoteGroup = proxyquire('../../models/NoteGroup', {
        '@/models': sequelize,
      }).default;

      spy(instance, 'belongsTo');
      instance.associate({ NoteGroup });

      it('NoteGroup 모델과 belongsTo 관계를 맺고 있다. ', () => {
        const belongsToSpy = instance.belongsTo.getCall(0);

        // 관계 정의 함수 호출 체크
        expect(belongsToSpy.calledWith(NoteGroup)).to.be.ok;
      });
    });
  });
});
