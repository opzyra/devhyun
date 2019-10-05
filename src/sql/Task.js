import Knex from "knex";

import { pagination } from "../lib/pagination";
/**
 * task 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Task
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "task";
  return {
    /**
     * task 테이블 생성
     * @method Task.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            task_group_idx INT(11) NOT NULL,
            title VARCHAR(200) NOT NULL,
            location VARCHAR(200) NOT NULL,
            state VARCHAR(50) NOT NULL,
            all_day TINYINT(1) NOT NULL,
            start DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            end DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx),
            INDEX FK_task_task_group (task_group_idx),
            CONSTRAINT FK_task_task_group FOREIGN KEY (task_group_idx) REFERENCES task_group (idx) ON UPDATE CASCADE ON DELETE CASCADE
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 태스크 조회
     * @method Task.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Task} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn({ t: "task", tg: "task_group" })
        .whereRaw("??=??", ["t.task_group_idx", "tg.idx"])
        .where("t.idx", idx)
        .select("t.*", "tg.color");
      return item;
    },
    /**
     * 전체 태스크 조회
     * @method Task.selectAll
     * @return {Array<Task>} 해당 리스트
     */
    async selectAll() {
      return await conn({ t: "task", tg: "task_group" })
        .whereRaw("??=??", ["t.task_group_idx", "tg.idx"])
        .orderBy([{ column: "completed" }, { column: "odr" }, { column: "end" }])
        .select("t.*", "tg.color");
    },
    /**
     * 페이지 처리된 태스크 조회
     * @method Task.selectPage
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @param {int} group 태스크 그룹
     * @return {Array<Task>} 해당 리스트
     */
    async selectPage(query = "", group = "", page = 1, limit = 20) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn({ t: "task", tg: "task_group" })
        .whereRaw("??=??", ["t.task_group_idx", "tg.idx"])
        .orderBy([{ column: "completed" }, { column: "odr" }, { column: "end" }])
        .limit(limit)
        .offset(offset);

      if (group) {
        sql.andWhere("t.task_group_idx", group);
      }

      if (query) {
        sql.andWhere(builder => {
          builder
            .where("title", "like", `%${query}%`)
            .orWhere("contents", "like", `%${query}%`);
        });
      }

      return await sql.select("t.*", "tg.color");
    },
    /**
     * 페이지 처리 정보 조회
     * @method Task.selectPageInfo
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @param {int} group 태스크 그룹
     * @return {int} 해당 게시글 갯수
     */
    async selectPageInfo(query = "", group = "", page = 1, limit = 20) {
      const sql = conn(table);

      if (group) {
        sql.andWhere("task_group_idx", group);
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
     * 완료되지 않은 태스크 조회
     * @method Task.selectAllNotCompleted
     * @return {Array<Task>} 해당 리스트
     */
    async selectAllNotCompleted() {
      return await conn({ t: "task", tg: "task_group" })
        .whereRaw("??=??", ["t.task_group_idx", "tg.idx"])
        .where("t.completed", false)
        .orderBy([{ column: "completed" }, { column: "end" }])
        .select("t.*", "tg.color");
    },
    /**
     * 특정 그룹 태스크 조회
     * @method Task.selectAll
     * @return {Array<Task>} 해당 리스트
     */
    async selectAllGroup(idx) {
      return await conn({ t: "task", tg: "task_group" })
        .whereRaw("??=??", ["t.task_group_idx", "tg.idx"])
        .where("task_group_idx", idx)
        .orderBy([{ column: "completed" }, { column: "end" }])
        .select("t.*", "tg.color");
    },
    /**
     * 연관된 그룹의 태스크 갯수
     * @method Task.countRelatedGroup
     * @return {int} 해당 갯수
     */
    async countRelatedGroup(idx) {
      const [{ rowCount }] = await conn(table)
        .where("task_group_idx", idx)
        .count({ rowCount: "*" });
      return rowCount;
    },
    /**
     * 태스크 등록
     * @method Task.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {Task} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 태스크 수정
     * @method Task.updateOne
     * @param {Task} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Task} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    },
    /**
     * 태스크 삭제
     * @method Task.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
