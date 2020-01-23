import * as main from "./main";
import * as about from "./about";
import * as project from "./project";
import * as blog from "./blog";
import * as login from "./login";
import * as mypage from "./mypage";

const modules = Object.assign(main, about, project, blog, login, mypage);

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
    $(".member_menu").removeClass("on");
  });

  $("#overlay").click(function() {
    $("header .lnb").removeClass("collapse");
    $(".member_menu").removeClass("on");
  });

  // 드롭다운 처리
  $(".member_dropdown").click(function(e) {
    e.stopPropagation();
    $(".member_menu").toggleClass("on");
    $("header .lnb").removeClass("collapse");
  });

  $("html").click(function(e) {
    if (
      !$(e.target).hasClass("member_menu") &&
      !$(e.target).hasClass("menu_item") &&
      $(".member_menu").hasClass("on")
    ) {
      $(".member_menu").removeClass("on");
    }
  });

  // 검색창 열기
  $("#searchFilter").click(function() {
    let search = $("#searchFilter").next();
    let icon = $("#searchFilter > i");
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
