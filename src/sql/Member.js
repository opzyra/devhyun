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
            password VARCHAR(200) NOT NULL,
            name VARCHAR(50) NOT NULL,
            role VARCHAR(50) NOT NULL,
            role_name VARCHAR(100) NOT NULL DEFAULT '',
            thumbnail VARCHAR(200) NOT NULL DEFAULT '/images/default_thumbnail.png',
            active TINYINT(1) NOT NULL DEFAULT '1',
            withdraw TINYINT(1) NOT NULL DEFAULT '0',
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            password_temp VARCHAR(100) NOT NULL DEFAULT '',
            PRIMARY KEY (idx),
            UNIQUE INDEX id (id)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
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
    }
  };
}
