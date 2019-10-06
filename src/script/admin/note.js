import {
  AJAX,
  ALERT,
  COLOR,
  TOAST,
  BROWSER,
  CONVERT,
  COMMON,
  EDITOR
} from "../common";
import { validate } from "revalidator";

export const note = {
  namespace: "note",
  templateNoteGroup(idx, color, name) {
    return `
      <div class="item" data-idx="${idx}">
        <a href="/admin/note?group=${idx}">
        <span class="icon" style="border-color: ${color}; background-color: ${color};"></span>
        <span>
          ${name}
        </span>
        </a>
        <span class="move"><i class="mdi mdi-drag-variant"></i></span>
        <span class="edit" onclick="APP.modalNoteGroup(${idx})">
          <i class="mdi mdi-pen"></i>
          </span>
          <span class="delete" onclick="APP.deleteNoteGroup(${idx})">
          <i class="mdi mdi-window-close"></i>
          </span>
      </div>
    `;
  },
  templateChageNoteGroup(idx, group_idx, groups) {
    return `
    <div class="title">그룹 이동</div>
    <form method="POST" onsubmit="APP.moveNoteGroup(${idx})">
      <div class="form_group">
        <span>노트 그룹</span>
        <select name="note_group_idx">
          ${fx.go(
            groups,
            fx.map(
              e =>
                `<option value="${e.idx}" ${
                  group_idx == e.idx ? "selected" : ""
                }>${e.name}</option>`
            )
          )}
        </select>
      </div>
      <div class="confirm">
        <button type="submit" class="remodal-confirm">저장</button>
      </div>
    </form>
    `;
  },
  cbCtxMenu(key, options) {
    const idx = CONVERT.extractNumber(options.selector);
    switch (key) {
      case "delete":
        APP.deleteNote(idx);
        break;
      case "move":
        APP.modalNoteGroupMove(idx);
        break;
      case "edit":
        location.href = `/admin/note/edit/${idx}`;
        break;
    }
  },
  registerCtxMenu(el) {
    const callback = this.cbCtxMenu || APP.cbCtxMenu;
    $.contextMenu({
      selector: el,
      delay: 50,
      callback,
      items: {
        edit: {
          name: "수정",
          icon: function(opt, $itemElement, itemKey, item) {
            return "mdi mdi-pen";
          }
        },
        move: {
          name: "그룹 이동",
          icon: function(opt, $itemElement, itemKey, item) {
            return "mdi mdi-puzzle-outline";
          }
        },
        delete: {
          name: "삭제",
          icon: function(opt, $itemElement, itemKey, item) {
            return "mdi mdi-window-close";
          }
        }
      }
    });
  },
  noteGroupSortable() {
    $("#noteGroup").sortable({
      handle: ".move",
      update: async (event, ui) => {
        let noteGroup = [];
        $("#noteGroup .item").each((i, e) => {
          const idx = $(e).attr("data-idx");
          noteGroup.push(parseInt(idx));
        });
        await AJAX.post("/group/note/odr", { noteGroup });
      }
    });
  },
  async createNoteGroup() {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        name: {
          requried: true,
          allowEmpty: false,
          message: "이름을 입력해주세요"
        },
        color: {
          requried: true,
          allowEmpty: false,
          message: "색상을 선택해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    let rs = await AJAX.post("/group/note", form);

    if (rs) {
      let template = this.templateNoteGroup(rs.idx, form.color, form.name);
      $("#noteGroup").append(template);

      let modal = $("#remodal").remodal();
      modal.close();
      TOAST.success(rs.message);
      this.noteGroupSortable();
    }

    return false;
  },
  async updateNoteGroup(idx) {
    event.preventDefault();

    const { group } = BROWSER.queryString();
    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        name: {
          requried: true,
          allowEmpty: false,
          message: "이름을 입력해주세요"
        },
        color: {
          requried: true,
          allowEmpty: false,
          message: "색상을 선택해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    let rs = await AJAX.put(`/group/note/${idx}`, form);

    if (rs) {
      let template = this.templateNoteGroup(idx, form.color, form.name);
      $(`#noteGroup [data-idx=${idx}]`).replaceWith(template);

      location.reload();
      return;
    }

    return false;
  },
  async moveNoteGroup(idx) {
    event.preventDefault();
    const { group } = BROWSER.queryString();
    const form = $(event.target).serializeObject();

    if (group && group == form.note_group_idx) {
      ALERT.error("현재 노트 그룹으로 변경할 수 없습니다");
      return false;
    }

    let rs = await AJAX.put(`/note/group/${idx}`, form);

    if (!rs) return;

    if (group) {
      $(`#list [data-idx="${idx}"]`).remove();
    } else {
      location.reload();
      return;
    }

    let modal = $("#remodal").remodal();
    modal.close();
    TOAST.success(rs.message);
  },
  async deleteNoteGroup(idx) {
    const { group } = BROWSER.queryString();
    const rowCount = await AJAX.get(`/note/count/${idx}`);
    const { value } = await ALERT.confirm(
      `선택하신 그룹을 삭제할까요?
      ${
        rowCount != 0
          ? `<br><span style="color:#ff4040;">※ 연관된 노트 ${rowCount}개가 함께 삭제됩니다.</span>`
          : ""
      }
      `
    );
    if (value) {
      const { message } = await AJAX.delete(`/group/note/${idx}`);

      if (group == idx) {
        location.href = "/admin/note";
        return;
      }

      $(`#noteGroup [data-idx=${idx}]`).remove();

      TOAST.success(message);
    }
  },
  async modalNoteGroup(idx = null) {
    let group = {
      name: "",
      background_color: ""
    };

    if (idx) {
      group = await AJAX.get(`/group/note/${idx}`);
    }

    let template = `
    <style>
      #remodal .confirm {margin-top: 64px;}
    </style>
    <div class="title">그룹 ${idx ? "수정" : "추가"}</div>
    <form method="POST" onsubmit="${
      idx ? `APP.updateNoteGroup(${idx})` : `APP.createNoteGroup()`
    };">
      <div class="form_group">
        <span>이름</span>
        <input type="text" name="name" value="${group.name}">
      </div>
      <div class="form_group">
        <span>색상</span>
        <select id="colorSelect" class="color-select" name="color">
        ${(() =>
          fx.go(
            COLOR.pallet,
            fx.map(e => `<option value="${e}">${e}</option>`)
          ))()}
        </select>
      </div>
      <div class="confirm">
        <button type="submit" class="remodal-confirm">저장</button>
      </div>
    </form>
    `;

    $("#remodal .contents_slot").html(template);

    $("#remodal #colorSelect").colorSelect(`${group.color}`);

    let modal = $("#remodal").remodal();
    modal.open();
  },
  async modalNoteGroupMove(idx) {
    let group = await AJAX.fetch(`/api/note/${idx}`);
    let groups = await AJAX.fetch(`/api/group/note`);

    let template = this.templateChageNoteGroup(
      idx,
      group.note_group_idx,
      groups
    );

    $("#remodal .contents_slot").html(template);

    let modal = $("#remodal").remodal();
    modal.open();
  },
  async deleteNote(idx) {
    const { value } = await ALERT.confirm("해당 노트를 삭제할까요?");
    if (value) {
      const result = await AJAX.delete(`/note/${idx}`);
      if (result) {
        $(`#list ul a[data-idx="${idx}"]`).remove();
      }
    }
  },
  init() {
    COMMON.pagination("#page", STATE.notePage.totalPages, STATE.notePage.page);
    $("#list ul a").each((i, e) => {
      const idx = $(e).attr("data-idx");
      this.registerCtxMenu(`#list ul a[data-idx="${idx}"]`);
    });
    this.noteGroupSortable();
  }
};

export const nodeDetail = {
  namespace: "noteDetail",
  aside: function() {
    $("#aside").stick_in_parent({
      offset_top: 0
    });
    let tocs = $("#toc a")
      .map(function(i, e) {
        let item = $(e).attr("href");
        return $(item)[0].offsetTop + 50;
      })
      .toArray();

    let scroll = _.throttle(function() {
      let top = $(document).scrollTop();
      for (let i = 0; i < tocs.length; i++) {
        let item = tocs[i];
        let item_next = tocs[i + 1] ? tocs[i + 1] : $(document).innerHeight();
        if (top >= item && top < item_next) {
          $("#toc a").removeClass("on");
          $("#toc a")
            .eq(i)
            .addClass("on");
          break;
        }
      }
    }, 250);

    $(document).scroll(scroll);
  },
  async deleteNote(idx) {
    const { value } = await ALERT.confirm("해당 노트를 삭제할까요?");
    if (value) {
      const result = await AJAX.delete(`/note/${idx}`);
      if (result) location.href = "/admin/note";
    }
  },
  init() {
    this.aside();
  }
};

export const nodeEdit = {
  namespace: "noteEdit",
  templateTemp(item) {
    return `
    <li>
      <div data-tippy-content="${item.title}" onclick="APP.setTemp(${item.idx});">
        <span>${item.title}</span>
      </div>
      <span class="delete" onclick="APP.deleteTemp(${item.idx});"><i class="mdi mdi-window-close"></i></span>
    </li>
    `;
  },
  async fetchTemp() {
    const temps = await fx.go(
      AJAX.fetch("/api/editor/temp"),
      fx.map(e => this.templateTemp(e))
    );
    $("#temps").html(temps);
  },
  async insertNote() {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    form.contents = window.EDITOR.getMarkdown();

    const schema = {
      properties: {
        title: {
          requried: true,
          allowEmpty: false,
          message: "제목을 입력해주세요"
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: "내용을 입력해주세요"
        },
        note_group_idx: {
          requried: true,
          allowEmpty: false,
          message: "그룹을 선택해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    const { idx } = await AJAX.post("/note", form);
    if (idx) {
      location.href = `/admin/note/${idx}`;
    }
  },
  async updateNote(idx) {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    form.contents = window.EDITOR.getMarkdown();

    const schema = {
      properties: {
        title: {
          requried: true,
          allowEmpty: false,
          message: "제목을 입력해주세요"
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: "내용을 입력해주세요"
        },
        note_group_idx: {
          requried: true,
          allowEmpty: false,
          message: "그룹을 선택해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    const result = await AJAX.put(`/note/${idx}`, form);
    if (result) {
      location.href = `/admin/note/${idx}`;
    }
  },
  async setTemp(idx) {
    const { value } = await ALERT.confirm(
      "현재 작성된 데이터가 모두 삭제됩니다"
    );
    if (value) {
      const temp = await AJAX.get(`/editor/temp/${idx}`);
      $("#title").val(temp.title);
      $("#tempIdx").val(temp.idx);
      window.EDITOR.setHtml(temp.contents);
    }
  },
  async deleteTemp(idx) {
    const { value } = await ALERT.confirm("선택하신 임시저장글을 삭제할까요?");
    if (value) {
      const { message } = await AJAX.delete(`/editor/temp/${idx}`);
      TOAST.success(message);

      const tempIdx = $("#tempIdx").val();
      if (tempIdx == idx) $("#tempIdx").val("");

      this.fetchTemp();
    }
  },
  async cancel() {
    const { value } = await ALERT.confirm("작성한 내용은 반영되지 않아요");
    if (value) {
      history.back();
    }
  },
  async spell(platform) {
    const markdown = window.EDITOR.getMarkdown();

    if (markdown == "") {
      ALERT.error("내용을 입력해주세요");
      return;
    }

    const rs = await AJAX.post("/editor/markdown", { markdown });
    if (!rs) return;

    let tempElem = document.createElement("textarea");
    tempElem.value = rs;
    document.body.appendChild(tempElem);

    tempElem.select();
    document.execCommand("copy");
    document.body.removeChild(tempElem);

    switch (platform) {
      case "pusan":
        window.open(
          "https://speller.cs.pusan.ac.kr/",
          "_blank",
          "width=850, height=715, toolbar=no, menubar=no, scrollbars=no, resizable=no"
        );
        break;
      case "saramin":
        window.open(
          "http://www.saramin.co.kr/zf_user/tools/character-counter",
          "_blank",
          "toolbar=no, menubar=no, scrollbars=no, resizable=no"
        );
        break;
      case "jobkorea":
        window.open(
          "http://www.jobkorea.co.kr/service/user/Tool/SpellCheck",
          "_blank",
          "toolbar=no, menubar=no, scrollbars=no, resizable=no"
        );
        break;
    }
  },
  init() {
    const height = document.documentElement.clientHeight;
    EDITOR.set("#markdown", height);
    EDITOR.setTempCb(() => {
      this.fetchTemp();
    });
    this.fetchTemp();
  }
};
