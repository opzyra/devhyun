import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

const controller = asyncify();

export const mypage = controller.get(
  '/mypage',
  session.isAuthenticated(),
  (req, res) => {
    res.render('client/mypage', {
      layout: false,
    });
  },
);

export default controller.router;
