import moment from 'moment';
import { Feed } from 'feed';

import asyncify from '@/lib/asyncify';
import { parseMarkdown } from '@/lib/utils';

import Post from '@/models/Post';

const controller = asyncify();

controller.get('/rss', async (req, res, transaction) => {
  const date = moment().subtract(1, 'day');

  const feed = new Feed({
    title: '블로그 - 데브현',
    description:
      '안녕하세요. 브라우저로 사람을 연결하는 웹 개발자 김현호의 개인 포트폴리오 사이트 입니다.',
    id: process.env.APP_DOMAIN,
    link: process.env.APP_DOMAIN,
    image: `${process.env.APP_DOMAIN}/images/og.png`,
    date: date.toDate(),
  });

  const posts = await Post.selectRssAll()(transaction);

  const feeds = posts.map(post => {
    const link = `${process.env.APP_DOMAIN}/blog/post/${post.idx}`;
    return {
      link,
      title: post.title,
      description: parseMarkdown(post.contents, 150),
      id: link,
      image: post.thumbnail,
      date: moment(post.reg).toDate(),
      author: [
        {
          name: 'devhyun',
          link: `${process.env.APP_DOMAIN}/about`,
        },
      ],
    };
  });

  feeds.forEach(f => feed.addItem(f));
  const rss = feed.atom1();

  res.type('application/xml').send(rss);
});

export default controller.router;
