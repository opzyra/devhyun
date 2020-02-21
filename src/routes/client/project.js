import asyncify from '@/lib/asyncify';

const controller = asyncify();

export const project = controller.get('/project', (req, res) => {
  res.render('client/project', {
    layout: false,
  });
});

export const aboutperiod = controller.get(
  '/project/aboutperiod',
  (req, res) => {
    res.render('client/project/aboutperiod', {
      layout: false,
    });
  },
);

export const codepresso = controller.get('/project/codepresso', (req, res) => {
  res.render('client/project/codepresso', {
    layout: false,
  });
});

export const jabis = controller.get('/project/jabis', (req, res) => {
  res.render('client/project/jabis', {
    layout: false,
  });
});

export default controller.router;
