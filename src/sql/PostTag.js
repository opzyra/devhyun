import Knex from "knex";

/**
 * post_tag 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class PostTag
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "post_tag";
  return {
    /**
     * postTag 테이블 생성
     * @method PostTag.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            post_idx INT(11) NOT NULL,
            tag VARCHAR(100) NOT NULL,
            INDEX FK_feed_tag_feed_board (post_idx),
            INDEX tag (tag),
            CONSTRAINT FK_feed_tag_feed_board FOREIGN KEY (post_idx) REFERENCES board_post (idx) ON DELETE CASCADE
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 중복제외된 태그와 태그별 갯수 조회
     * @method PostTag.selectDistinctTagGroupCount
     * @return {Object} 태그 이름과 해당 태그의 갯수가 담긴 객체
     */
    async selectDistinctTagGroupCount() {
      return await conn(table)
        .distinct("tag")
        .count({ count: "*" })
        .groupBy("tag")
        .orderBy("count", "desc")
        .select();
    },
    /**
     * 포스트에 해당하는 태그 조회
     * @method PostTag.selectReletedPost
     * @param {int} idx 포스트 idx 값
     * @return {Array<Tag>} 태그 배열
     */
    async selectReletedPost(idx) {
      return await conn(table)
        .where("post_idx", idx)
        .select("tag");
    },
    /**
     * 중복제외된 태그의 수 조회
     * @method PostTag.countDistinct
     * @return {int} 중복제외된 태그의 수
     */
    async countDistinct() {
      const [{ tag_count }] = await conn(table).countDistinct({
        tag_count: ["tag"]
      });
      return tag_count;
    },
    /**
     * 태그 등록
     * @method PostTag.insertOne
     * @param {Tag} item 등록할 데이터
     * @return {Tag} 등록된 객체 정보
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 태그 삭제
     * @method PostTag.deleteRelatedPost
     * @param {int} idx 포스트 idx
     */
    async deleteRelatedPost(idx) {
      await conn(table)
        .where("post_idx", idx)
        .delete();
    }
  };
}
