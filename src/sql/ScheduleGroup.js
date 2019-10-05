import Knex from "knex";

/**
 * schedule_group 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class ScheduleGroup
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "schedule_group";
  return {
    /**
     * schedule_group 테이블 생성
     * @method ScheduleGroup.createSchema
     */
    async createSchema() {
      const exists = await conn.schema.hasTable(table);
      if (!exists) {
        await conn.raw(
          `
          CREATE TABLE IF NOT EXISTS ${table} (
            idx INT(11) NOT NULL AUTO_INCREMENT,
            name VARCHAR(100) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            color VARCHAR(10) NOT NULL COLLATE 'utf8mb4_unicode_ci',
            odr INT(11) NOT NULL,
            PRIMARY KEY (idx),
            UNIQUE INDEX name (name)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 스케줄그룹 조회
     * @method ScheduleGroup.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {ScheduleGroup} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 하나의 스케줄그룹 이름으로 조회
     * @method ScheduleGroup.selectByName
     * @param {string} name 테이블의 name 값
     * @return {ScheduleGroup} 해당 객체
     */
    async selectByName(name) {
      const [item] = await conn(table)
        .where("name", name)
        .select();
      return item;
    },
    /**
     * 전체 스케줄그룹 조회
     * @method ScheduleGroup.selectAll
     * @return {Array<ScheduleGroup>} 해당 리스트
     */
    async selectAll() {
      return await conn(table).orderBy('odr').select();
    },
    /**
     * 스케줄그룹 갯수 조회
     * @method ScheduleGroup.countAll
     * @return {int} 갯수
     */
    async countAll() {
      const [{count}] = await conn(table)
        .count({ count: "*" });
      return count;
    },
    /**
     * 스케줄그룹 등록
     * @method ScheduleGroup.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {ScheduleGroup} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 스케줄그룹 수정
     * @method ScheduleGroup.updateOne
     * @param {ScheduleGroup} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {ScheduleGroup} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .returning()
        .update(item);
    },
    /**
     * 스케줄그룹 삭제
     * @method ScheduleGroup.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
