import asyncify from '@/lib/asyncify';

const controller = asyncify();

export const index = controller.get('/policy', (req, res) => {
  res.render('client/policy', {
    layout: false,
  });
});

export default controller.router;
