import asyncify from '@/lib/asyncify';

const controller = asyncify();

export const about = controller.get('/about', (req, res) => {
  res.render('client/about', {
    layout: false,
  });
});

export default controller.router;
