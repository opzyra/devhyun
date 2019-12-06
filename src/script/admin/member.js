import { COMMON, BROWSER, AJAX } from "../common";

export const member = {
  namespace: "member",

  init() {
    COMMON.pagination(
      "#page",
      STATE.memberPage.totalPages,
      STATE.memberPage.page
    );
  }
};
