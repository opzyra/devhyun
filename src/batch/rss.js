import cron from "node-cron";
import moment from "moment";
import { Feed } from "feed";
import fs from "fs-extra";

import { batchLogger } from "../core/logger";
import { txfn } from "../core/tx";
import { parseMarkdown } from "../lib/utils";

import BoardPost from "../sql/BoardPost";

export default function() {
  cron.schedule(
    "0 0 * * * *",
    txfn(async conn => {
      const BOARD_POST = BoardPost(conn);

      const date = moment().subtract(1, "day");

      const feed = new Feed({
        title: "블로그 - 데브현",
        description:
          "안녕하세요. 브라우저로 사람을 연결하는 웹 개발자 김현호의 개인 포트폴리오 사이트 입니다.",
        id: process.env.APP_DOMAIN,
        link: process.env.APP_DOMAIN,
        image: `${process.env.APP_DOMAIN}/images/og.png`,
        date: date.toDate()
      });

      const posts = await BOARD_POST.selectRssAll();

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
              name: "devhyun",
              link: `${process.env.APP_DOMAIN}/about`
            }
          ]
        };
      });

      feeds.forEach(f => feed.addItem(f));
      const rss = feed.atom1();

      await fs.writeFile(`${process.cwd()}/public/rss.xml`, rss, "utf-8");

      batchLogger.info(
        `${date.format("YYYY-MM-DD")}을 기준으로 RSS가 저장되었습니다.`
      );
    })
  );
}
