import { BROWSER } from "../common";

export const project = {
  namespace: "project",
  scroll() {
    var query = BROWSER.queryString();
    if (query.scroll == "private") {
      $("html").scrollTop(BROWSER.isMobile() ? 1000 : 735);
    }
  },
  init() {
    this.scroll();
  }
};

export const projectDetail = {
  namespace: "projectDetail",
  toolTip: function() {
    tippy(".icon img", {
      placement: "bottom",
      theme: "devhyun",
      distance: 2
    });
  },
  init() {
    this.toolTip();
  }
};
