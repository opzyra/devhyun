import Knex from 'knex';

import { pagination } from '../lib/utils';

/**
 * board_series 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class BoardSeries
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = 'board_series';
  return {
    /**
     * boardSeries 테이블 생성
     * @method BoardSeries.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            title VARCHAR(100) NOT NULL,
            thumbnail VARCHAR(200) NOT NULL,
            contents MEDIUMTEXT NOT NULL,
            hit INT(11) NOT NULL DEFAULT '0',
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx)
          )
          `,
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * idx값을 가지고 하나의 시리즈 조회
     * @method BoardSeries.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Series} 해당 시리즈 데이터
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where({ idx })
        .select();
      return item;
    },
    /**
     * 페이지 처리된 시리즈와 해당 포스트 갯수 조회
     * @method BoardSeries.selectPage
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {Pagination} 페이징 정보가 포함된 시리즈 + 해당 포스트의 갯수 데이터
     */
    async selectPage(query = '', page = 1, limit = 9) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn({ bs: 'board_series', sp: 'series_post' })
        .orderBy('idx', 'desc')
        .count({
          post_count: ['idx'],
        })
        .whereRaw('?? = ??', ['bs.idx', 'sp.series_idx'])
        .groupBy('bs.idx')
        .limit(limit)
        .offset(offset);

      if (query) {
        sql.andWhere(builder => {
          builder
            .where('title', 'like', `%${query}%`)
            .orWhere('contents', 'like', `%${query}%`);
        });
      }

      const items = await sql.select('bs.*');

      return items;
    },
    /**
     * 페이지 처리 정보 조회
     * @method BoardSeries.selectPageInfo
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {Pagination} 페이징 정보가 포함된 시리즈 + 해당 포스트의 갯수 데이터
     */
    async selectPageInfo(query = '', page = 1, limit = 9) {
      const sql = conn(table);

      if (query) {
        sql.andWhere(builder => {
          builder
            .where('title', 'like', `%${query}%`)
            .orWhere('contents', 'like', `%${query}%`);
        });
      }

      const [{ rowCount }] = await sql.count({ rowCount: '*' });

      return pagination(rowCount, limit, page);
    },
    /**
     * 연관된 시리즈와 그 시리즈의 포스트 정보
     * @method BoardSeries.selectRelatedSeriesPost
     * @param {int} idx 포스트 idx
     * @return {Array<Object>} 시리즈와 해당하는 모든 포스트 정보
     */
    async selectRelatedSeriesPost(idx) {
      const [data, ...info] = await conn.raw(
        `
        SELECT 
          sp1.*, sb.title AS sb_title, sb.thumbnail AS sb_thumbnail, pb.title AS pb_title, pb.thumbnail AS pb_thumbnail, pb.contents AS pb_contents
        FROM series_post AS sp1, board_series AS sb, board_post AS pb 
        WHERE 
          sp1.series_idx = sb.idx
        AND
          sp1.post_idx = pb.idx
        AND 
        EXISTS (SELECT * FROM series_post AS sp2 WHERE sp1.series_idx = sp2.series_idx AND sp2.post_idx = ?)
      `,
        [idx],
      );
      return data;
    },
    /**
     * 시리즈에 속해있는 포스트 정보
     * @method BoardSeries.selectRelatedPost
     * @param {int} idx 시리즈 idx
     * @return {Array<Post>} 시리즈에 속해있는 모든 포스트 정보
     */
    async selectRelatedPost(idx) {
      return await conn({ sp: 'series_post', bp: 'board_post' })
        .whereRaw('??=??', ['sp.post_idx', 'bp.idx'])
        .andWhere('sp.series_idx', idx)
        .orderBy('sp.odr')
        .select('bp.*');
    },
    /**
     * 시리즈 등록
     * @method BoardSeries.insertOne
     * @param {Post} item 등록할 데이터
     * @return {Post} 등록된 객체 정보
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 시리즈 업데이트
     * @method BoardSeries.updateOne
     * @param {Post} item 포스트 데이터
     * @param {int} idx 테이블의 idx값
     * @return {int} 업데이트된 포스트 데이터
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where('idx', idx)
        .returning()
        .update(item);
    },
    /**
     * 조회수 업데이트
     * @method BoardSeries.updateHit
     * @param {int} idx 테이블의 idx값
     * @return {boolean} 업데이트 완료 여부
     */
    async updateHit(idx) {
      const [{ changedRows }, data] = await conn.raw(
        `
          UPDATE board_series set hit = hit + 1 where idx = ?
        `,
        [idx],
      );
      return changedRows == 1;
    },
    /**
     * 시리즈 삭제
     * @method BoardSeries.deleteOne
     * @param {int} idx 테이블의 idx값
     */
    async deleteOne(idx) {
      await conn(table)
        .where('idx', idx)
        .delete();
    },
  };
}
