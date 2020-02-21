import { expect } from 'chai';
import { pagination } from '../lib/pagination';

describe('lib/pagination 테스트', () => {
  describe('pagination - 페이징 계산 처리', () => {
    it('페이지수가 남는 경우', () => {
      const sample = {
        rowCount: 15,
        limit: 10,
        page: 2,
      };
      const result = pagination(sample.rowCount, sample.limit, sample.page);
      const expected = {
        rowCount: 15,
        totalPages: 2,
        page: 2,
      };
      expect(result).to.eql(expected);
    });

    it('페이지수가 맞아 떨어지는 경우', () => {
      const sample = {
        rowCount: 20,
        limit: 10,
        page: 1,
      };
      const result = pagination(sample.rowCount, sample.limit, sample.page);
      const expected = {
        rowCount: 20,
        totalPages: 2,
        page: 1,
      };
      expect(result).to.eql(expected);
    });
  });
});
