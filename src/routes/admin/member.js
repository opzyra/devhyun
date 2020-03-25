import { go, map } from 'fxjs';

import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import store from '@/lib/store';

import Member from '@/models/Member';

const controller = asyncify();

export const member = controller.get(
  '/member',
  session.isAdmin(),
  async (req, res, transaction) => {
    const { query, category, page } = req.query;

    let { members, memberPage } = await Member.selectPaginated(
      query,
      category,
      page,
    )(transaction);

    members = await go(
      members,
      map(member => {
        // eslint-disable-next-line no-unused-vars
        const [platform, ...rest] = member.id.split('_');
        return {
          ...member,
          platform,
        };
      }),
    );

    let title = (() => {
      switch (category) {
        case 'active':
          return '활성';
        case 'disabled':
          return '정지';
        case 'withdraw':
          return '탈퇴';
        default:
          return '전체';
      }
    })();

    store(res).setState({
      memberPage,
    });

    res.render('admin/member', {
      members,
      query,
      category,
      memberPage,
      title,
      layout: false,
    });
  },
);

export default controller.router;
