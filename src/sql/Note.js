import Knex from "knex";

import { pagination } from "../lib/pagination";
/**
 * note 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Note
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "note";
  return {
    /**
     * note 테이블 생성
     * @method Note.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            note_group_idx INT(11) NOT NULL,
            title VARCHAR(100) NOT NULL,
            contents MEDIUMTEXT NOT NULL,
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 노트 조회
     * @method Note.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Note} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn({ n: "note", ng: "note_group" })
        .whereRaw("??=??", ["n.note_group_idx", "ng.idx"])
        .where("n.idx", idx)
        .select("n.*", "ng.color");
      return item;
    },
    /**
     * 전체 노트 조회
     * @method Note.selectAll
     * @return {Array<Note>} 해당 리스트
     */
    async selectAll() {
      return await conn({ n: "note", ng: "note_group" })
        .whereRaw("??=??", ["n.note_group_idx", "ng.idx"])
        .orderBy([{ column: "reg", order: "desc" }])
        .select("n.*", "ng.color");
    },
    /**
     * 특정 그룹 노트 조회
     * @method Note.selectAll
     * @return {Array<Note>} 해당 리스트
     */
    async selectAllGroup(idx) {
      return await conn({ n: "note", ng: "note_group" })
        .whereRaw("??=??", ["n.note_group_idx", "ng.idx"])
        .where("note_group_idx", idx)
        .orderBy([{ column: "reg", order: "desc" }])
        .select("n.*", "ng.color");
    },
    /**
     * 페이지 처리된 노트 조회
     * @method Note.selectPage
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @param {int} group 노트 그룹
     * @return {Array<Task>} 해당 리스트
     */
    async selectPage(query = "", group = "", page = 1, limit = 20) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn({ n: "note", ng: "note_group" })
        .whereRaw("??=??", ["n.note_group_idx", "ng.idx"])
        .orderBy([{ column: "odr" }, { column: "reg", order: "desc" }])
        .limit(limit)
        .offset(offset);

      if (group) {
        sql.andWhere("n.note_group_idx", group);
      }

      if (query) {
        sql.andWhere(builder => {
          builder
            .where("title", "like", `%${query}%`)
            .orWhere("contents", "like", `%${query}%`);
        });
      }

      return await sql.select("n.*", "ng.color");
    },
    /**
     * 페이지 처리 정보 조회
     * @method Note.selectPageInfo
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @param {int} group 노트 그룹
     * @return {int} 해당 게시글 갯수
     */
    async selectPageInfo(query = "", group = "", page = 1, limit = 20) {
      const sql = conn(table);

      if (group) {
        sql.andWhere("note_group_idx", group);
      }

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
     * 연관된 그룹의 노트 갯수
     * @method Note.countRelatedGroup
     * @return {int} 해당 갯수
     */
    async countRelatedGroup(idx) {
      const [{ rowCount }] = await conn(table)
        .where("note_group_idx", idx)
        .count({ rowCount: "*" });
      return rowCount;
    },
    /**
     * 노트 등록
     * @method Note.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {Note} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 노트 수정
     * @method Note.updateOne
     * @param {Note} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Note} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    },
    /**
     * 노트 삭제
     * @method Note.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
