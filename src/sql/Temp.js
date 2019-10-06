import Knex from "knex";

/**
 * temp 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Temp
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "temp";
  return {
    /**
     * temp 테이블 생성
     * @method Temp.createSchema
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
            contents LONGTEXT NOT NULL,
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 임시저장 조회
     * @method Temp.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Temp} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 타이틀로 임시저장 조회
     * @method Temp.selectByTitle
     * @param {string} title 타이틀 값
     * @return {Temp} 해당 객체
     */
    async selectByTitle(title) {
      const [item] = await conn(table)
        .where("title", title)
        .select();
      return item;
    },
    /**
     * 전체 임시저장 조회
     * @method Temp.selectAll
     * @return {Array<Temp>} 해당 리스트
     */
    async selectAll() {
      return await conn(table)
        .orderBy([{ column: "idx", order: "desc" }])
        .select();
    },
    /**
     * 임시저장 등록
     * @method Temp.insertOne
     * @param {Temp} item 등록할 객체
     * @return {Temp} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 임시저장 수정
     * @method Temp.updateOne
     * @param {Temp} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Temp} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    },
    /**
     * 임시저장 삭제
     * @method Temp.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
