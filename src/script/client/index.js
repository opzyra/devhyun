import * as main from "./main";
import * as about from "./about";
import * as project from "./project";
import * as blog from "./blog";
import * as login from "./login";

const modules = Object.assign(main, about, project, blog, login);

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

  // 헤더 스크롤 처리
  $(window).on("scroll", function(e) {
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
      shrinkOn = 100,
      header = $("header");

    if (!header) return;

    if (distanceY > shrinkOn) {
      header.addClass("scroll");
    } else if (header.hasClass("scroll")) {
      header.removeClass("scroll");
    }
  });

  // 햄버거 메뉴 처리
  $("#burger").click(function() {
    $("header .lnb").toggleClass("collapse");
  });

  $("#overlay").click(function() {
    $("header .lnb").removeClass("collapse");
  });

  // 검색창 열기
  $("#searchFilter").click(function() {
    var search = $("#searchFilter").next();
    var icon = $("#searchFilter > i");
    if (search.hasClass("show")) {
      icon.removeClass().addClass("mdi mdi-filter");
    } else {
      icon.removeClass().addClass("mdi mdi-close");
    }
    search.toggleClass("show");
  });

  // 검색창 포커싱
  $(".search input").focus(function() {
    $(".search").addClass("focus");
  });

  $(".search input").blur(function(event) {
    let value = event.target.value;
    if (value == "") {
      $(".search").removeClass("focus");
    } else {
      $(".search").addClass("focus");
    }
  });

  return set;
};
