import Knex from "knex";

/**
 * series_post 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class SeriesPost
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "series_post";
  return {
    /**
     * seriesPost 테이블 생성
     * @method SeriesPost.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            series_idx INT(11) NOT NULL,
            post_idx INT(11) NOT NULL,
            odr INT(11) NOT NULL,
            INDEX FK_series_post_post_board (post_idx),
            INDEX FK_series_post_series_board (series_idx),
            CONSTRAINT FK_series_post_post_board FOREIGN KEY (post_idx) REFERENCES board_post (idx) ON UPDATE CASCADE ON DELETE CASCADE,
            CONSTRAINT FK_series_post_series_board FOREIGN KEY (series_idx) REFERENCES board_series (idx) ON UPDATE CASCADE ON DELETE CASCADE
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 연관 포스트 등록
     * @method SeriesPost.insertOne
     * @param {SeriesPost} item 등록할 데이터
     * @return {SeriesPost} 등록된 객체 정보
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 연관 포스트 제거
     * @method SeriesPost.deleteRelatedSeries
     * @param {int} idx 포스트 idx
     */
    async deleteRelatedSeries(idx) {
      await conn(table)
        .where("series_idx", idx)
        .delete();
    }
  };
}
