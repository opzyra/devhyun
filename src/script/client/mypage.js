import { AJAX, ALERT, COOKIE, BROWSER } from "../common";
import { validate } from "revalidator";

export const mypage = {
  namespace: "mypage",
  handleWithdrawAgree(target) {
    const checked = $(target).is(":checked");
    const withdrawBtn = $("#withdraw");
    checked
      ? withdrawBtn.removeAttr("disabled")
      : withdrawBtn.attr("disabled", "disabled");
  },
  async updateEmail() {
    event.preventDefault();
    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        email: {
          requried: true,
          allowEmpty: false,
          format: "email",
          messages: {
            requried: "이메일을 입력해주세요",
            format: "이메일 형식이 올바르지 않습니다"
          }
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    const data = await AJAX.post("/member/email", form);

    if (data) {
      ALERT.success(data.message);
    }

    return false;
  },
  async updateMarketing(target) {
    const marketing = $(target).is(":checked");
    const data = await AJAX.post("/member/marketing", { marketing });

    return false;
  },
  async withdraw() {
    const { value } = await ALERT.confirm("회원 탈퇴를 진행할까요?");
    if (value) {
      const result = await AJAX.delete(`/member`);
      result && ALERT.success(result.message).then(() => (location.href = "/"));
    }
  },
  init() {}
};
