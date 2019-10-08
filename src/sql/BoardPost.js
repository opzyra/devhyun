import Knex from "knex";

import { pagination } from "../lib/pagination";
/**
 * board_post 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class BoardPost
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "board_post";
  return {
    /**
     * boardPost 테이블 생성
     * @method BoardPost.createSchema
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
            hit INT(11) NOT NULL DEFAULT 0,
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * idx값을 가지고 하나의 포스트 조회
     * @method BoardPost.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Post} 해당 포스트 데이터
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where({ idx })
        .select();
      return item;
    },
    /**
     * 모든 포스트 조회
     * @method BoardPost.selectAll
     * @return {Array<Post>} 해당 포스트 데이터
     */
    async selectAll() {
      return await conn(table).select();
    },
    /**
     * 페이지 처리된 게시글 조회
     * @method BoardPost.selectPage
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {Array<Post>} 해당 게시글
     */
    async selectPage(query = "", page = 1, limit = 9) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn(table)
        .orderBy("idx", "desc")
        .limit(limit)
        .offset(offset);

      if (query) {
        sql.where(builder => {
          builder
            .where("title", "like", `%${query}%`)
            .orWhere("contents", "like", `%${query}%`);
        });
      }

      const items = await sql.select();

      return items;
    },
    /**
     * 페이지 처리 정보 조회
     * @method BoardPost.selectPageInfo
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {int} 해당 게시글 갯수
     */
    async selectPageInfo(query = "", page = 1, limit = 9) {
      const sql = conn(table);

      if (query) {
        sql.andWhere(builder => {
          builder
            .where("title", "like", `%${query}%`)
            .orWhere("contents", "like", `%${query}%`);
        });
      }

      const [{ rowCount }] = await sql.count({ rowCount: "*" });

      return pagination(rowCount, limit, page);
    },
    /**
     * 메인화면에 제공하는 최신글 조회
     * @method BoardPost.selectLatest
     * @param {int} limit 추출할 포스트의 수 (default = 5)
     * @return {Array<Post>} 해당 포스트 데이터
     */
    async selectLatest(limit = 5) {
      return await conn(table)
        .orderBy("idx", "desc")
        .limit(limit)
        .select();
    },
    /**
     * 태그에 대한 연관 포스트 (기본값 5개)
     * @method BoardPost.selectRelatedTagPost
     * @param {Array} tags 태그 배열
     * @return {Array<Post>} 해당 포스트
     */
    async selectRelatedTagPost(tags = []) {
      return await conn({ bp: "board_post", pt: "post_tag" })
        .distinct()
        .whereIn("pt.tag", tags)
        .andWhereRaw("?? = ??", ["bp.idx", "pt.post_idx"])
        .orderBy("bp.idx", "desc")
        .limit(5)
        .select("bp.*");
    },
    /**
     * 조회수가 많은 포스트 조회 (기본값 5개)
     * @method BoardPost.selectPopularPost
     * @param {int} limit 조회 갯수
     * @return {Array<Post>} 해당 포스트
     */
    async selectPopularPost(limit = 5) {
      return await conn(table)
        .orderBy([
          { column: "hit", order: "desc" },
          { column: "idx", order: "desc" }
        ])
        .limit(limit)
        .select();
    },
    /**
     * 태그와 연관있는 포스트 조회
     * @method BoardPost.selectPageRelatedTagPost
     * @param {string} query 태그
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {Object} 페이징 정보가 포함된 포스트 데이터
     */
    async selectPageRelatedTagPost(query = "", page = 1, limit = 9) {
      let offset = (parseInt(page) - 1) * limit;
      const items = await conn({ bp: "board_post", pt: "post_tag" })
        .whereRaw("?? = ??", ["bp.idx", "pt.post_idx"])
        .andWhere("pt.tag", query)
        .orderBy("bp.idx", "desc")
        .limit(limit)
        .offset(offset)
        .select("bp.*");

      return items;
    },
    /**
     * 태그와 연관있는 포스트 페이지 정보 조회
     * @method BoardPost.selectPageRelatedTagPostInfo
     * @param {string} query 태그
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 9)
     * @return {Object} 페이징 정보가 포함된 포스트 데이터
     */
    async selectPageRelatedTagPostInfo(query = "", page = 1, limit = 9) {
      const [{ rowCount }] = await conn({ bp: "board_post", pt: "post_tag" })
        .whereRaw("?? = ??", ["bp.idx", "pt.post_idx"])
        .andWhere("pt.tag", query)
        .count({ rowCount: "*" });

      return pagination(rowCount, limit, page);
    },
    /**
     * 포스트 전체 갯수 조회
     * @method BoardPost.countAll
     * @return {int} 포스트 전체 갯수
     */
    async countAll() {
      const [{ post_count }] = await conn(table).count({ post_count: ["*"] });
      return post_count;
    },
    /**
     * 포스트 등록
     * @method BoardPost.insertOne
     * @param {Post} item 등록할 데이터
     * @return {Post} 등록된 객체 정보
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 포스트 업데이트
     * @method BoardPost.updateOne
     * @param {Post} item 포스트 데이터
     * @param {int} idx 테이블의 idx값
     * @return {int} 업데이트된 포스트 데이터
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .returning()
        .update(item);
    },
    /**
     * 조회수 업데이트
     * @method BoardPost.updateHit
     * @param {int} idx 테이블의 idx값
     * @return {boolean} 업데이트 완료 여부
     */
    async updateHit(idx) {
      const [{ changedRows }, data] = await conn.raw(
        `
          UPDATE board_post set hit = hit + 1 where idx = ?
        `,
        [idx]
      );
      return changedRows == 1;
    },
    /**
     * 포스트 삭제
     * @method BoardPost.deleteOne
     * @param {int} idx 테이블의 idx값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
