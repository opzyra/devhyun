import * as dashboard from "./dashboard";
import * as schedule from "./schedule";
import * as task from "./task";
import * as note from "./note";
import * as blog from "./blog";

const modules = Object.assign(dashboard, schedule, task, note, blog);

const set = namespace => {
  const app = fx.go(
    Object.values(modules),
    fx.filter(e => e.namespace == namespace),
    e => e[0]
  );
  app.init();
  window.APP = app;
};

export const init = () => {
  // 마크다운 하이라이트 처리
  hljs.initHighlightingOnLoad();

  // 앵커 오프셋
  $("a").click(function() {
    var href = $.attr(this, "href");

    if (href.indexOf("#") == -1 || href == "#contents") return;

    var headerHeight = 0; //header 의 높이 만큼 조절 하면 됨

    $("html").animate(
      {
        scrollTop: $(href).offset().top - headerHeight
      },
      500
    );

    return false;
  });

  return set;
};
