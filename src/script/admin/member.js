import { COMMON, BROWSER, AJAX, ALERT } from "../common";

export const member = {
  namespace: "member",
  async updateActive(idx) {
    const { value } = await ALERT.confirm("계정 상태를 활성화로 변경할까요?");
    if (value) {
      const result = await AJAX.put(`/member/active/${idx}`, { active: true });
      if (result) location.reload();
    }
  },
  async updateDisabled(idx) {
    const { value } = await ALERT.confirm("계정 상태를 정지로 변경할까요?");
    if (value) {
      const result = await AJAX.put(`/member/active/${idx}`, {
        active: false
      });
      if (result) location.reload();
    }
  },
  toolTip() {
    tippy(".member .lib .right .list ul li .contents .name .email", {
      placement: "bottom",
      theme: "devhyun",
      trigger: "click",
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
