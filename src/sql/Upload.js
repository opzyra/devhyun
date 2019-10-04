import Knex from "knex";

/**
 * upload 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Upload
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "upload";
  return {
    /**
     * upload 테이블 생성
     * @method Upload.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            mimetype VARCHAR(200) NOT NULL,
            ext VARCHAR(50) NOT NULL,
            name VARCHAR(200) NOT NULL,
            size INT(11) NOT NULL DEFAULT '0',
            src VARCHAR(300) NOT NULL,
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 업로드 등록
     * @method Upload.insertOne
     * @param {Upload} item 업로드 데이터 객체
     * @return {Upload} 등록된 객체 정보
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    }
  };
}
