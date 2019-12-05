import Knex from "knex";

/**
 * member 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Member
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "member";
  return {
    /**
     * postTag 테이블 생성
     * @method Member.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            id VARCHAR(50) NOT NULL,
            name VARCHAR(50) NOT NULL,
            role VARCHAR(50) NOT NULL DEFAULT 'USER',
            thumbnail VARCHAR(500) NOT NULL DEFAULT '/images/default_thumbnail.png',
            active TINYINT(1) NOT NULL DEFAULT '1',
            withdraw TINYINT(1) NOT NULL DEFAULT '0',
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx),
            UNIQUE INDEX id (id)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 전체 회원정보 조회
     * @method Member.selectAll
     * @return {Array<Member>} 회원 정보 배열
     */
    async selectAll() {
      return await conn(table).select();
    },
    /**
     * 페이지와 필터링 처리된 회원정보 조회
     * @method BoardPost.selectPage
     * @param {string} query 검색어
     * @param {string} category 카테고리
     * @param {int} page 페이지 (default = 1)
     * @param {int} offset 한 페이지당 게시글 수 (default = 20)
     * @return {Array<Member>} 해당 회원정보
     */
    async selectPage(query = "", category = "", page = 1, limit = 20) {
      let offset = (parseInt(page) - 1) * limit;
      const sql = conn(table)
        .orderBy("idx", "desc")
        .limit(limit)
        .offset(offset);

      if (query) {
        sql.where(builder => {
          builder.where("name", "like", `%${query}%`);
        });
      }

      if (category) {
        sql.where(builder => {
          builder.where("id", "like", `%${category}%`);
        });
      }

      const items = await sql.select();

      return items;
    },
    /**
     * 아이디로 회원정보 조회
     * @method Member.selectById
     * @param {string} id 사용자 계정 아이디
     * @return {Member} 회원 정보 객체
     */
    async selectById(id) {
      const [item] = await conn(table)
        .where("id", id)
        .select();
      return item;
    },
    /**
     * 사용자 등록
     * @method Member.upsert
     * @return {Array<Object>} 등록된 데이터
     */
    async insertOne(item) {
      const [data] = await conn.raw(
        conn(table)
          .returning()
          .insert(item)
          .toString()
          .replace("insert", "INSERT IGNORE")
      );
      return data;
    },
    /**
     * 사용자 수정
     * @method Member.updateOne
     * @param {Member} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Member} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    }
  };
}
