import { COMMON, BROWSER, AJAX } from "../common";

export const member = {
  namespace: "member",
  toolTip() {
    tippy(".member .lib .right .list ul li .contents .name .email", {
      placement: "bottom",
      theme: "devhyun",
      distance: 2
    });
  },
  init() {
    COMMON.pagination(
      "#page",
      STATE.memberPage.totalPages,
      STATE.memberPage.page
    );
    this.toolTip();
  }
};
