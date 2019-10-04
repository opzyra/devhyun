import Knex from "knex";

/**
 * application 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Application
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "application";
  return {
    /**
     * application 테이블 생성
     * @method Application.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(50) NOT NULL,
            domain VARCHAR(50) NOT NULL,
            own VARCHAR(50) NOT NULL,
            price INT(11) NOT NULL DEFAULT '0',
            expired_server DATETIME NOT NULL,
            expired_domain DATETIME NOT NULL,
            PRIMARY KEY (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 앱정보 조회
     * @method Application.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Application} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 페이지 처리된 앱정보 조회
     * @method Application.selectPage
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @return {Array<Application>} 해당 리스트
     */
    async selectPage(query = "", page = 1, limit = 20) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn(table)
        .orderBy([{ column: "idx", order: "desc" }])
        .limit(limit)
        .offset(offset);

      if (query) {
        sql.andWhere(builder => {
          builder.where("name", "like", `%${query}%`);
        });
      }

      return await sql.select();
    },
    /**
     * 페이지 처리 정보 조회
     * @method Application.selectPageInfo
     * @param {string} query 검색어
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @return {int} 해당 게시글 갯수
     */
    async selectPageInfo(query = "", page = 1, limit = 20) {
      const sql = conn(table);

      if (query) {
        sql.andWhere(builder => {
          builder.where("name", "like", `%${query}%`);
        });
      }

      const [{ rowCount }] = await sql.count({ rowCount: "*" });

      return pagination(rowCount, limit, page);
    },
    /**
     * 앱정보 등록
     * @method Application.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {Application} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 앱정보 수정
     * @method Application.updateOne
     * @param {Application} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Application} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    },
    /**
     * 앱정보 삭제
     * @method Application.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
