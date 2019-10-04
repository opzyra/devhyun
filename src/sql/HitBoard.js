import Knex from "knex";

/**
 * hit_board 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class HitBoard
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "hit_board";
  return {
    /**
     * hitBoard 테이블 생성
     * @method HitBoard.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            ip VARCHAR(30) NOT NULL,
            board VARCHAR(30) NOT NULL,
            board_idx TINYINT(11) NOT NULL DEFAULT '0',
            reg_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE INDEX ip_board_idx (ip, board, board_idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 게시글 조회 정보 등록
     * @method HitBoard.insertIgonre
     * @return {Array<Object>} 등록된 데이터
     */
    async insertIgonre(item) {
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
     * 게시글 조회 정보 삭제
     * @method HitBoard.insertIgonre
     * @param {string} date 삭제할 일시정보
     */
    async deleteExpired(date) {
      await conn(table)
        .where("reg", "<=", `${date} 23:59:59`)
        .delete();
    }
  };
}
