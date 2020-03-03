import asyncify from '@/lib/asyncify';

import Post from '@/models/Post';

const controller = asyncify();

export const index = controller.get('/', async (req, res, transaction) => {
  const latestPosts = await Post.selectLatest(5)(transaction);

  res.render('client/index', {
    latestPosts,
    layout: false,
  });
});

export default controller.router;
