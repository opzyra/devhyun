import Knex from "knex";

/**
 * comment 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class comment
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "comment";
  return {
    /**
     * comment 테이블 생성
     * @method comment.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            board VARCHAR(30) NOT NULL,
            board_idx INT(11) NOT NULL,
            member_idx INT(11) NOT NULL,
            target_idx INT(11) NULL DEFAULT NULL,
            contents MEDIUMTEXT NOT NULL,
            reg DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx),
            INDEX FK_comment_member (member_idx),
            INDEX FK_comment_member_2 (target_idx),
            CONSTRAINT FK_comment_member FOREIGN KEY (member_idx) REFERENCES member (idx),
            CONSTRAINT FK_comment_member_2 FOREIGN KEY (target_idx) REFERENCES member (idx)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 댓글 조회
     * @method comment.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {comment} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 전체 댓글 조회
     * @method comment.selectAll
     * @return {Array<comment>} 해당 리스트
     */
    async selectAll() {
      return await conn(table)
        .orderBy([{ column: "idx", order: "desc" }])
        .select();
    },
    /**
     * 해당 게시글 전체 댓글 조회
     * @method comment.selectBoardAll
     * @return {Array<comment>} 해당 리스트
     */
    async selectBoardAll(board, idx) {
      const [data, ...info] = await conn.raw(
        `
        SELECT 
          ct.idx, ct.contents, ct.target_idx, ct.reg, 
          mb.idx as member_idx, mb.thumbnail, mb.name 
        FROM 
          comment AS ct, 
          member AS mb 
        WHERE 
          ct.member_idx = mb.idx
        AND
          ct.board = ?
        AND
          ct.board_idx = ?
        ORDER BY
          reg
      `,
        [board, idx]
      );
      return data;
    },
    /**
     * 게시글 전체 댓글 수 조회
     * @method comment.countGroupBoard
     * @return {Array<Object>} 게시글별 댓글 수
     */
    async countGroupBoard(board, boards) {
      const [data, ...info] = await conn.raw(
        `
        SELECT 
          board_idx, 
          COUNT(board_idx) as count 
        FROM 
          comment 
        WHERE 
          board = ? 
        AND 
          board_idx 
        IN 
          (??)
        GROUP BY 
          board_idx
      `,
        [board, boards]
      );
      return data;
    },
    /**
     * 댓글 등록
     * @method comment.insertOne
     * @param {comment} item 등록할 객체
     * @return {comment} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 댓글 수정
     * @method comment.updateOne
     * @param {comment} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {comment} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .update(item);
    },
    /**
     * 댓글 삭제
     * @method comment.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
