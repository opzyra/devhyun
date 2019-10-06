import { AJAX, ALERT, COLOR, TOAST, BROWSER, CONVERT, COMMON } from "../common";
import { validate } from "revalidator";

export const task = {
  namespace: "task",
  templateTask(task) {
    return `
    <li class="${
      task.completed ? "completed" : ""
    }" style="border-left: 2px solid ${task.color}" data-idx="${task.idx}">
      <div class="header">
        <div class="title">
          ${task.title}
        </div>
        <div class="start_date">
          ${moment(task.start).format("YYYY.MM.DD")}
        </div>
        <div class="end_date">
          ${moment(task.end).format("YYYY.MM.DD")}
        </div>
        <div class="check">
          <input type="checkbox" id="checkTask${
            task.idx
          }" class="cbx" onchange="APP.updateTaskCompleted();" ${
      task.completed ? "checked=''" : ""
    }/>
          <label for="checkTask${task.idx}"></label>
        </div>
      </div>
      <div class="contents">
        ${CONVERT.lineBreak(task.contents)}
      </div>
    </li>
    `;
  },
  async templateEditTask(idx) {
    const { group } = BROWSER.queryString();
    let taskGroup = {};
    if (group) {
      taskGroup = await AJAX.fetch(`/api/group/task/${group}`);
    }

    let task = { title: "", contents: "", start: "", end: "", completed: "" };

    if (idx) {
      task = await AJAX.fetch(`/api/task/${idx}`);
      taskGroup = {
        idx: task.task_group_idx,
        color: task.color
      };
    }

    let template = `
    <div class="mode" style="border-left: 2px solid ${taskGroup.color};">
      <form method="POST" onsubmit="${
        idx ? `APP.updateTask(${idx});` : `APP.createTask();`
      }">
        <input type="hidden" name="task_group_idx" value="${taskGroup.idx}">
        <input type="hidden" name="color" value="${taskGroup.color}">
        <div class="header">
          <div class="title">
            <input type="text" name="title" placeholder="제목" value="${
              task.title
            }">
          </div>
          <div class="start_date">
            <div id="start_date" class="datepicker">
              <div class="tui-datepicker-input tui-datetime-input tui-has-focus">
                <input type="text" class="input" aria-label="Date-Time" name="start" value="${moment(
                  task.start
                )}">
              </div>
              <div class="warp"></div>
            </div>
          </div>
          <div class="end_date">
            <div id="end_date" class="datepicker">
              <div class="tui-datepicker-input tui-datetime-input tui-has-focus">
                <input type="text" class="input" aria-label="Date-Time" name="end" value="${moment(
                  task.end
                )}">
              </div>
              <div class="warp"></div>
            </div>
          </div>
        </div>
        <div class="contents">
          <textarea name="contents" rows="5" placeholder="내용">${
            task.contents
          }</textarea>
        </div>
        <div class="confirm">
            <button type="submit">${idx ? "수정" : "등록"}</button>
            <button onclick="APP.cancelModeTask();">취소</button>
          </div>
      </form>
    </div>
    `;
    $("#mode").html("");
    $("#mode").append(template);

    $(".datepicker").each((i, e) => {
      let id = $(e).attr("id");
      let date = $(e)
        .find(".input")
        .val();
      new tui.DatePicker(`#${id} .warp`, {
        date: date ? new Date(date) : new Date(),
        language: "ko",
        input: {
          element: `#${id} .input`,
          format: "yyyy.MM.dd"
        }
      });
    });
  },
  templateTaskGroup(idx, color, name) {
    return `
      <div class="item" data-idx="${idx}">
        <a href="/admin/task?group=${idx}">
        <span class="icon" style="border-color: ${color}; background-color: ${color};"></span>
        <span>
          ${name}
        </span>
        </a>
        <span class="move"><i class="mdi mdi-drag-variant"></i></span>
        <span class="edit" onclick="APP.modalTaskGroup(${idx})">
          <i class="mdi mdi-pen"></i>
          </span>
          <span class="delete" onclick="APP.deleteTaskGroup(${idx})">
          <i class="mdi mdi-window-close"></i>
          </span>
      </div>
    `;
  },
  templateChageTaskGroup(idx, group_idx, groups) {
    return `
    <div class="title">그룹 이동</div>
    <form method="POST" onsubmit="APP.moveTaskGroup(${idx})">
      <div class="form_group">
        <span>태스크 그룹</span>
        <select name="task_group_idx">
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
        APP.deleteTask(idx);
        break;
      case "move":
        APP.modalTaskGroupMove(idx);
        break;
      case "edit":
        APP.modeTask(idx);
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
  taskGroupSortable() {
    $("#taskGroup").sortable({
      handle: ".move",
      update: async (event, ui) => {
        let taskGroup = [];
        $("#taskGroup .item").each((i, e) => {
          const idx = $(e).attr("data-idx");
          taskGroup.push(parseInt(idx));
        });
        await AJAX.post("/group/task/odr", { taskGroup });
      }
    });
  },
  async createTaskGroup() {
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

    let rs = await AJAX.post("/group/task", form);

    if (rs) {
      let template = this.templateTaskGroup(rs.idx, form.color, form.name);
      $("#taskGroup").append(template);

      let modal = $("#remodal").remodal();
      modal.close();
      TOAST.success(rs.message);
      this.taskGroupSortable();
    }

    return false;
  },
  async updateTaskGroup(idx) {
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

    let rs = await AJAX.put(`/group/task/${idx}`, form);

    if (rs) {
      let template = this.templateTaskGroup(idx, form.color, form.name);
      $(`#taskGroup [data-idx=${idx}]`).replaceWith(template);

      location.reload();
      return;
    }

    return false;
  },
  async moveTaskGroup(idx) {
    event.preventDefault();
    const { group } = BROWSER.queryString();
    const form = $(event.target).serializeObject();

    if (group && group == form.task_group_idx) {
      ALERT.error("현재 태스크 그룹으로 변경할 수 없습니다");
      return false;
    }

    let rs = await AJAX.put(`/task/group/${idx}`, form);

    if (!rs) return;

    if (group) {
      $(`#list [data-idx="${idx}"]`).remove();
    } else {
      const { color } = await AJAX.fetch(
        `/api/group/task/${form.task_group_idx}`
      );
      $(`#list [data-idx="${idx}"]`).css("border-left", `2px solid ${color}`);
    }

    let modal = $("#remodal").remodal();
    modal.close();
    TOAST.success(rs.message);
  },
  async deleteTaskGroup(idx) {
    const { group } = BROWSER.queryString();
    const rowCount = await AJAX.get(`/task/count/${idx}`);
    const { value } = await ALERT.confirm(
      `선택하신 그룹을 삭제할까요?
      ${
        rowCount != 0
          ? `<br><span style="color:#ff4040;">※ 연관된 태스크 ${rowCount}개가 함께 삭제됩니다.</span>`
          : ""
      }
      `
    );
    if (value) {
      const { message } = await AJAX.delete(`/group/task/${idx}`);

      if (group == idx) {
        location.href = "/admin/task";
        return;
      }

      $(`#taskGroup [data-idx=${idx}]`).remove();

      TOAST.success(message);
    }
  },
  async createTask() {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        title: {
          requried: true,
          allowEmpty: false,
          message: "제목을 입력해주세요"
        },
        start: {
          requried: true,
          allowEmpty: false,
          message: "시작일을 선택해주세요"
        },
        end: {
          requried: true,
          allowEmpty: false,
          message: "마감일을 선택해주세요"
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: "내용을 입력해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    // 시작 마감일 체크
    const diff = moment(form.start).isAfter(form.end);

    if (diff) {
      ALERT.error("시작과 마감일을 확인해주세요");
      return false;
    }

    let rs = await AJAX.post(`/task`, form);

    if (rs) {
      let template = this.templateTask({
        idx: rs.idx,
        title: form.title,
        contents: form.contents,
        start: form.start,
        end: form.end,
        color: form.color
      });
      $(`#list ul`).prepend(template);
      this.registerCtxMenu(`#list ul li[data-idx="${rs.idx}"]`);
      $("#mode").html("");
      $("#mode").addClass("hidden");
      $(".not").css("display", "none");

      TOAST.success(rs.message);
    }

    return false;
  },
  async updateTask(idx) {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        title: {
          requried: true,
          allowEmpty: false,
          message: "제목을 입력해주세요"
        },
        start: {
          requried: true,
          allowEmpty: false,
          message: "시작일을 선택해주세요"
        },
        end: {
          requried: true,
          allowEmpty: false,
          message: "마감일을 선택해주세요"
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: "내용을 입력해주세요"
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    // 시작 마감일 체크
    const diff = moment(form.start).isAfter(form.end);

    if (diff) {
      ALERT.error("시작과 마감일을 확인해주세요");
      return false;
    }

    let rs = await AJAX.put(`/task/${idx}`, form);
    const task = await AJAX.get(`/task/${idx}`);

    if (rs) {
      let template = this.templateTask({
        idx: task.idx,
        title: task.title,
        contents: task.contents,
        start: form.start,
        end: form.end,
        color: task.color,
        completed: task.completed
      });
      $(`#list ul li[data-idx="${task.idx}"]`).replaceWith(template);
      this.registerCtxMenu(`#list ul li[data-idx="${rs.idx}"]`);
      $("#mode").html("");
      $("#mode").addClass("hidden");
      TOAST.success(rs.message);
    }

    return false;
  },
  async updateTaskCompleted() {
    let li = $(event.target).parents("li");
    const idx = li.attr("data-idx");
    const completed = li.hasClass("completed");

    await AJAX.put(`/task/complete/${idx}`, { completed: !completed });
    li.toggleClass("completed");
  },
  async deleteTask(idx) {
    const { value } = await ALERT.confirm(`선택하신 태스크를 삭제할까요?`);
    if (value) {
      const { message } = await AJAX.delete(`/task/${idx}`);
      $(`#list ul li[data-idx="${idx}"]`).remove();
      TOAST.success(message);
    }
  },
  async modalTaskGroup(idx = null) {
    let group = {
      name: "",
      background_color: ""
    };

    if (idx) {
      group = await AJAX.get(`/group/task/${idx}`);
    }

    let template = `
    <style>
      #remodal .confirm {margin-top: 64px;}
    </style>
    <div class="title">그룹 ${idx ? "수정" : "추가"}</div>
    <form method="POST" onsubmit="${
      idx ? `APP.updateTaskGroup(${idx})` : `APP.createTaskGroup()`
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
  async modalTaskGroupMove(idx) {
    let group = await AJAX.fetch(`/api/task/${idx}`);
    let groups = await AJAX.fetch(`/api/group/task`);

    let template = this.templateChageTaskGroup(
      idx,
      group.task_group_idx,
      groups
    );

    $("#remodal .contents_slot").html(template);

    let modal = $("#remodal").remodal();
    modal.open();
  },
  async modeTask(idx = null) {
    if (idx) {
      $(`#list ul li[data-idx="${idx}"]`).addClass("edit");
    }
    this.templateEditTask(idx);
    $("#mode").removeClass("hidden");
  },
  async cancelModeTask() {
    event.preventDefault();
    $("#mode").html("");
    $("#mode").addClass("hidden");
    $(`#list ul li`).removeClass("edit");
    // const { value } = await ALERT.confirm("작성한 모든 내용이 삭제됩니다");
    // if (value) { }
  },
  init() {
    $("#list ul li").each((i, e) => {
      const idx = $(e).attr("data-idx");
      this.registerCtxMenu(`#list ul li[data-idx="${idx}"]`);
    });
    COMMON.pagination("#page", STATE.taskPage.totalPages, STATE.taskPage.page);
    this.taskGroupSortable();
  }
};
