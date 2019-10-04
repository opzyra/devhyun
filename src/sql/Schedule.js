import Knex from "knex";

/**
 * schedule 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class Schedule
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "schedule";
  return {
    /**
     * schedule 테이블 생성
     * @method Schedule.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            schedule_group_idx INT(11) NOT NULL,
            title VARCHAR(200) NOT NULL,
            location VARCHAR(200) NOT NULL,
            state VARCHAR(50) NOT NULL,
            all_day TINYINT(1) NOT NULL,
            start DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            end DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (idx),
            INDEX FK_schedule_schedule_group (schedule_group_idx),
            CONSTRAINT FK_schedule_schedule_group FOREIGN KEY (schedule_group_idx) REFERENCES schedule_group (idx) ON UPDATE CASCADE ON DELETE CASCADE
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 스케줄 조회
     * @method Schedule.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {Schedule} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 전체 스케줄 조회
     * @method Schedule.selectAll
     * @return {Array<Schedule>} 해당 리스트
     */
    async selectAll() {
      return await conn(table).select();
    },
    /**
     * 일정 기간 스케줄 조회
     * @method Schedule.selectAll
     * @return {Array<Schedule>} 해당 리스트
     */
    async selectAllPeriod(date) {
      return await conn(table)
        .where("start", ">=", date.start)
        .andWhere("end", "<=", date.end)
        .select();
    },
    /**
     * 일정 기간 스케줄 조회
     * @method Schedule.selectAll
     * @return {Array<Schedule>} 해당 리스트
     */
    async selectBetweenToday(date) {
      return await conn({ s: "schedule", sg: "schedule_group" })
        .whereRaw("??=??", ["s.schedule_group_idx", "sg.idx"])
        .where("s.start", "<=", `${date} 23:59:59`)
        .andWhere("s.end", ">=", `${date} 00:00:00`)
        .select();
    },
    /**
     * 연관된 그룹의 스케줄 갯수
     * @method Schedule.countRelatedGroup
     * @return {int} 해당 갯수
     */
    async countRelatedGroup(idx) {
      const [{ rowCount }] = await conn(table)
        .where("schedule_group_idx", idx)
        .count({ rowCount: "*" });
      return rowCount;
    },
    /**
     * 스케줄 등록
     * @method Schedule.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {Schedule} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 스케줄 수정
     * @method Schedule.updateOne
     * @param {Schedule} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {Schedule} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .returning()
        .update(item);
    },
    /**
     * 스케줄 삭제
     * @method Schedule.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
