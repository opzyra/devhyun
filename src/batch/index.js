import cron from 'node-cron';
import moment from 'moment';

import { txWrap } from '@/lib/asyncify';
import logger from '@/lib/logger';

import Hit from '@/models/Hit';

const hitBatch = () => {
  cron.schedule(
    '0 0 0 * * *',
    txWrap(async transaction => {
      const date = moment()
        .subtract(1, 'day')
        .format('YYYY-MM-DD');
      await Hit.deleteExpired(date)(transaction);
      logger.info(`${date} 이전에 등록된 조회수 정보가 초기화되었습니다.`);
    }),
  );
};

export default {
  initialize: () => {
    hitBatch();
  },
};
