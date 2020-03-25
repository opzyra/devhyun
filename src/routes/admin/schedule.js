import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

const controller = asyncify();

export const schedule = controller.get(
  '/schedule',
  session.isAdmin(),
  (req, res) => {
    res.render('admin/schedule', {
      layout: false,
    });
  },
);

export default controller.router;
