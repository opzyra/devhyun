import Knex from "knex";

/**
 * task_group 테이블의 SQL메서드에 접근하기 위한 인스턴스
 * @class TaskGroup
 * @param {Knex} conn tx에서 받은 트랜잭션이 설정된 connection
 * @return 하단의 메서드 오브젝트
 */
export default function(conn) {
  let table = "task_group";
  return {
    /**
     * task_group 테이블 생성
     * @method TaskGroup.createSchema
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
            PRIMARY KEY (idx),
            UNIQUE INDEX name (name)
          )
          `
        );
        console.log(`CREATED TABLE ${table}`);
      }
    },
    /**
     * 하나의 태스크그룹 조회
     * @method TaskGroup.selectOne
     * @param {int} idx 테이블의 idx 값
     * @return {TaskGroup} 해당 객체
     */
    async selectOne(idx) {
      const [item] = await conn(table)
        .where("idx", idx)
        .select();
      return item;
    },
    /**
     * 하나의 태스크그룹 이름으로 조회
     * @method TaskGroup.selectByName
     * @param {string} name 테이블의 name 값
     * @return {TaskGroup} 해당 객체
     */
    async selectByName(name) {
      const [item] = await conn(table)
        .where("name", name)
        .select();
      return item;
    },
    /**
     * 전체 태스크그룹 조회
     * @method TaskGroup.selectAll
     * @return {Array<TaskGroup>} 해당 리스트
     */
    async selectAll() {
      return await conn(table).select();
    },
    /**
     * 태스크그룹 등록
     * @method TaskGroup.insertOne
     * @param {int} idx 테이블의 idx 값
     * @return {TaskGroup} 등록된 객체
     */
    async insertOne(item) {
      const [data] = await conn(table).insert(item);
      return data;
    },
    /**
     * 태스크그룹 수정
     * @method TaskGroup.updateOne
     * @param {TaskGroup} item 수정할 객체
     * @param {int} idx 테이블의 idx 값
     * @return {TaskGroup} 수정된 객체
     */
    async updateOne(item, idx) {
      return await conn(table)
        .where("idx", idx)
        .returning()
        .update(item);
    },
    /**
     * 태스크그룹 삭제
     * @method TaskGroup.deleteOne
     * @param {int} idx 테이블의 idx 값
     */
    async deleteOne(idx) {
      await conn(table)
        .where("idx", idx)
        .delete();
    }
  };
}
