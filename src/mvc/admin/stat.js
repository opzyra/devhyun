import express from 'express';
import moment from 'moment';
import sessionCtx from '../../core/session';
import wrap from '../../core/wrap';

const router = express.Router();

/* 통계 */
router.get(
  '/stat/visit', // 방문자 통계
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    let ymd = moment().format('YYYYMMDD');
    let [[{ year }]] = await mapper('YmStat', 'selectMinYear');
    if (!year) {
      year = moment().format('YYYY');
    }

    // 연도별 방문자 통계
    const [yearData] = await mapper('YmStat', 'selectYearData', {
      year,
    });

    let yearArray = yearData.map(e => Object.values(e));

    // 월별 방문자 통계
    let ym = moment().format('YYYY-MM');
    const [monthData] = await mapper('YmStat', 'selectMonthData', {
      ym,
    });

    let monthArray = monthData.map(e => e.rcount);

    // 시간대별 방문자 통계
    const [dtData] = await mapper('DtStat', 'selectDtData', {
      ymd,
    });

    let dtArray = dtData.map(e => e.rcount);

    res.render('admin/stat/visit', {
      yearArray,
      yearChart: {
        data: JSON.stringify(yearArray),
      },
      monthArray: {
        data: JSON.stringify(monthArray),
      },
      dtArray: {
        data: JSON.stringify(dtArray),
      },
      layout: false,
    });
  }),
);

router.get(
  '/stat/inflow', // 유입 통계
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    let { start, end } = req.query;

    if (!start) {
      start = moment()
        .subtract('8', 'day')
        .format('YYYYMMDD');
    }

    if (!end) {
      end = moment()
        .subtract('1', 'day')
        .format('YYYYMMDD');
    }

    const [[inflowCount]] = await mapper('InflowStat', 'selectInflow', {
      start,
      end,
    });

    const [inflowChart] = await mapper('InflowStat', 'selectInflowChart', {
      start,
      end,
    });

    const [queryList] = await mapper('QueryStat', 'selectQueryList', {
      start,
      end,
    });

    let queryAcount = queryList.length == 1 ? queryList[0].rcount : 0;
    if (queryList.length > 1) {
      queryAcount = queryList.reduce(
        (prev, curr) =>
          parseInt(prev.rcount || prev) + parseInt(curr.rcount || 0),
      );
    }

    const [domainList] = await mapper('DomainStat', 'selectDomainList', {
      start,
      end,
    });

    let domainAcount = domainList.length == 1 ? domainList[0].rcount : 0;
    if (domainList.length > 1) {
      domainAcount = domainList.reduce(
        (prev, curr) =>
          parseInt(prev.rcount || prev) + parseInt(curr.rcount || 0),
      );
    }

    const [pageList] = await mapper('PageStat', 'selectPageList', {
      start,
      end,
    });

    let pageAcount = pageList.length == 1 ? pageList[0].rcount : 0;
    if (pageList.length > 1) {
      pageAcount = pageList.reduce(
        (prev, curr) =>
          parseInt(prev.rcount || prev) + parseInt(curr.rcount || 0),
      );
    }

    res.render('admin/stat/inflow', {
      inflowCount,
      inflowChart: {
        ymd: JSON.stringify(inflowChart.map(e => e.ymd)),
        acount: JSON.stringify(inflowChart.map(e => e.acount)),
        rcount: JSON.stringify(inflowChart.map(e => e.rcount)),
      },
      queryList,
      queryAcount,
      domainList,
      domainAcount,
      pageList,
      pageAcount,
      layout: false,
    });
  }),
);

router.get(
  '/stat/member', // 회원 통계
  sessionCtx.isGeMaster(),
  wrap.query(async (req, res, next, mapper) => {
    let ymd = moment().format('YYYYMMDD');

    // 15일간 회원수 현황
    const [memberCount] = await mapper('MemberStat', 'selectMemberCount', {
      ymd,
    });

    const [[memberData]] = await mapper('MemberStat', 'selectMemberData', {
      ymd,
    });

    res.render('admin/stat/member', {
      memberData,
      memberCount: {
        data: JSON.stringify(memberCount.map(e => e.rcount)),
      },
      layout: false,
    });
  }),
);

export default router;
