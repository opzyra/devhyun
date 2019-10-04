import { BROWSER } from "../common";

export const about = {
  namespace: "about",
  toolTip() {
    tippy(".keyword img", {
      placement: "bottom",
      theme: "devhyun",
      distance: 15
    });
  },
  init() {
    if (BROWSER.isMobile()) this.toolTip();
  }
};
