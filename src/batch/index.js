import cron from 'node-cron';
import moment from 'moment';

import wrap from '../core/wrap';
import { batchLogger } from '../core/logger';
import db from '../db';

cron.schedule(
  '0 0 0 * * *', // 조회수 쿼리
  wrap.batch(async conn => {
    const ymd = moment()
      .subtract(1, 'day')
      .format('YYYYMMDD');

    await db.query(conn, 'HitLog', 'deleteYmd', { ymd });
    batchLogger.info(`Batch HitLog ${ymd}`);
  }),
);

cron.schedule(
  '0 15 0 * * *', // 통계 쿼리
  wrap.batch(async conn => {
    const ymd = moment()
      .subtract(1, 'day')
      .format('YYYYMMDD');

    // 전체 카운트 통계
    let [[inflow]] = await db.query(conn, 'InflowStat', 'selectBatch', { ymd });

    // 기타 채널 계산
    let etc =
      inflow.ctall - inflow.search - inflow.social - inflow.email - inflow.url;
    inflow.etc = etc < 0 ? 0 : etc || 0;

    await db.query(conn, 'InflowStat', 'insertOne', inflow);

    // 쿼리별 통계
    const [querys] = await db.query(conn, 'QueryStat', 'selectBatch', { ymd });

    for (let i = 0; i < querys.length; i++) {
      await db.query(conn, 'QueryStat', 'insertOne', querys[i]);
    }

    // 도메인별 통계
    const [domains] = await db.query(conn, 'DomainStat', 'selectBatch', {
      ymd,
    });
    for (let i = 0; i < domains.length; i++) {
      await db.query(conn, 'DomainStat', 'insertOne', domains[i]);
    }

    // 페이지별 통계
    const [pages] = await db.query(conn, 'PageStat', 'selectBatch', { ymd });
    for (let i = 0; i < pages.length; i++) {
      pages[i].page = decodeURI(pages[i].page);
      await db.query(conn, 'PageStat', 'insertOne', pages[i]);
    }

    // 연간 방문자 수 통계
    const [[year]] = await db.query(conn, 'YmStat', 'selectBatch', { ymd });
    await db.query(conn, 'YmStat', 'insertOne', year);

    // 시간대별 방문자 수 통계
    const [dts] = await db.query(conn, 'DtStat', 'selectBatch', { ymd });
    for (let i = 0; i < dts.length; i++) {
      await db.query(conn, 'DtStat', 'insertOne', dts[i]);
    }

    // 회원 현황 통계
    /*
    const [[mbs]] = await db.query(conn, 'MemberStat', 'selectBatch', { ymd });
    await db.query(conn, 'MemberStat', 'insertOne', mbs);
    */

    // 하루 전날 세션 로그 삭제
    await db.query(conn, 'SessionLog', 'deleteYmd', { ymd });

    batchLogger.info(`Batch Statistics ${ymd}`);
  }),
);
