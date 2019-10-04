import { AJAX, ALERT, COOKIE } from "../common";
import { validate } from "revalidator";

export const login = {
  namespace: "login",
  async login() {
    event.preventDefault();
    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        id: {
          requried: true,
          allowEmpty: false,
          message: "아이디를 입력해주세요"
        },
        password: {
          requried: true,
          allowEmpty: false,
          message: "비밀번호를 입력해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    let id = $("#id").val();
    let save = $("#save").is(":checked");
    if (save) {
      COOKIE.setCookie("loginId", id, 1);
    } else {
      COOKIE.setCookie("loginId", "", -1);
    }

    const data = await AJAX.post("/member/login", form);
    
    if(data) {
      location.href = "/admin";
    }

    return false;
  },
  setSavedId() {
    let id = COOKIE.getCookie("loginId");
    if (id) {
      $("#save").attr("checked", true);
      $("#id").val(id);
    }
  },
  init() {
    this.setSavedId();
  }
};
