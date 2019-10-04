import cron from "node-cron";
import moment from "moment";

import { batchLogger } from "../core/logger";
import { txfn } from "../core/tx";

import HitBoard from "../sql/HitBoard";

export default function() {
  cron.schedule(
    "0 0 0 * * *",
    txfn(async conn => {
      const date = moment()
        .subtract(1, "day")
        .format("YYYY-MM-DD");
      const HIT_BOARD = HitBoard(conn);
      await HIT_BOARD.deleteExpired(date);
      batchLogger.info(`${ymd} 이전에 등록된 조회수 정보가 초기화되었습니다.`);
    })
  );
}
