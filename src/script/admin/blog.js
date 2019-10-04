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

export const post = {
  namespace: "post",
  init() {
    COMMON.pagination("#page", STATE.postPage.totalPages, STATE.postPage.page);
  }
};

export const postDetail = {
  namespace: "postDetail",
  toolTip: function() {
    tippy(".icon img", {
      placement: "bottom",
      theme: "devhyun",
      distance: 2
    });
  },
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
  async deletePost(idx) {
    const { value } = await ALERT.confirm("해당 포스트를 삭제할까요?");
    if (value) {
      const result = await AJAX.delete(`/post/${idx}`);
      if (result) location.href = "/admin/blog/post";
    }
  },
  init() {
    this.aside();
    this.toolTip();
  }
};

export const postEdit = {
  namespace: "postEdit",
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
  templateTag(name) {
    return `
    <span class="tag_item" onclick="APP.deleteTag();">
      <span class="name">${name}</span>
      <span class="delete"><i class="mdi mdi-close"></i></span>
    </span>
    `;
  },
  async fetchTemp() {
    const temps = await fx.go(
      AJAX.fetch("/api/editor/temp"),
      fx.map(e => this.templateTemp(e))
    );
    $("#temps").html(temps);
  },
  thumbnailButton() {
    $("#thumbnailInpFile").val("");
    $("#thumbnailInpFile").trigger("click");
  },
  async thumbnailChange() {
    let target = event.target;
    let files = target.files;
    if (!COMMON.isFileSize(files)) {
      ALERT.error("이미지는 최대 5MB까지 업로드가 가능합니다.");
      return;
    }

    let multipart = new FormData();
    multipart.append("file", files[0]);

    const rs = await AJAX.thumbnail(
      "/upload/thumbnail",
      { width: 627, height: 414 },
      multipart
    );
    if (!rs) return;
    $("#thumbnailImg").attr("src", rs.src);
    $("#thumbnailImg").css("display", "block");
    $("#thumbnailBtn").css("display", "none");
    $("#thumbnailHdn").val(rs.src);
  },
  async insertPost() {
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

    form.tags = STATE.tags || [];

    const { idx } = await AJAX.post("/post", form);
    if (idx) {
      location.href = `/admin/blog/post/${idx}`;
    }
  },
  async updatePost(idx) {
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
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }
    form.tags = STATE.tags || [];

    const result = await AJAX.put(`/post/${idx}`, form);
    if (result) {
      location.href = `/admin/blog/post/${idx}`;
    }
  },
  insertTag(evt) {
    let event = evt ? evt : event;
    let keyCode = evt.which ? evt.which : event.keyCode;
    if (keyCode == 13) {
      event.preventDefault();
      let name = event.target.value;
      STATE.tags = STATE.tags || [];

      event.target.value = "";

      if (STATE.tags.includes(name)) return;

      STATE.tags.push(name);

      let template = this.templateTag(name);
      $("#tags").append(template);
    }
  },
  deleteTag() {
    let target = $(event.target).parents(".tag_item");
    let name = target.children(".name").text();

    STATE.tags = STATE.tags || [];
    STATE.tags = fx.go(STATE.tags, fx.filter(e => e != name));

    target.remove();
  },
  async setTemp(idx) {
    const { value } = await ALERT.confirm(
      "현재 작성된 데이터가 모두 삭제됩니다"
    );
    if (value) {
      const temp = await AJAX.get(`/editor/temp/${idx}`);
      $("#title").val(temp.title);
      $("#tempIdx").val(temp.idx);
      $("#thumbnailImg").attr("src", temp.thumbnail);
      $("#thumbnailHdn").val(temp.thumbnail);
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
      ALERT.error("내용을 입력해주세요.");
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

export const series = {
  namespace: "series",
  init() {
    COMMON.pagination(
      "#page",
      STATE.seriesPage.totalPages,
      STATE.seriesPage.page
    );
  }
};

export const seriesDetail = {
  namespace: "seriesDetail",
  toolTip: function() {
    tippy(".icon img", {
      placement: "bottom",
      theme: "devhyun",
      distance: 2
    });
  },
  aside: function() {
    $("#aside").stick_in_parent({
      offset_top: 0
    });
    let tocs = $("#toc a")
      .map(function(i, e) {
        let item = $(e).attr("href");
        if (!item.includes("#")) return $("#postList")[0].offsetTop + 50;
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
  async deleteSeries(idx) {
    const { value } = await ALERT.confirm("해당 시리즈를 삭제할까요?");
    if (value) {
      const result = await AJAX.delete(`/series/${idx}`);
      if (result) location.href = "/admin/blog/series";
    }
  },
  init() {
    this.aside();
    this.toolTip();
  }
};

export const seriesEdit = {
  namespace: "seriesEdit",
  templateRelatedPost(item) {
    return `
    <li class="post_item" data-idx="${item.idx}">
      <div data-tippy-content="${item.label}">
        <span class="name">${item.label}</span>
      </div>
      <span class="move"><i class="mdi mdi-drag-variant"></i></span>
      <span class="delete" onclick="APP.deleteRelatedPost(${item.idx});"><i class="mdi mdi-window-close"></i></span>
    </li>
    `;
  },
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
  async fetchAutocomplate() {
    const posts = await fx.go(
      AJAX.fetch("/api/post"),
      fx.map(e => {
        return {
          label: e.title,
          value: e.title,
          idx: e.idx
        };
      })
    );

    $("#searchPost").autocomplete({
      source: posts,
      minLength: 0,
      appendTo: "#searchPostList",
      select: (event, ui) => {
        event.preventDefault();
        const item = ui.item;

        STATE.posts = STATE.posts || [];

        if (STATE.posts.includes(item.idx)) {
          TOAST.error("이미 등록되어 있습니다");
          return;
        }

        STATE.posts.push(item.idx);

        const template = APP.templateRelatedPost(item);
        $("#posts").append(template);
        $("#searchPost").val("");

        APP.autocomplateSetting();
      }
    });
  },
  autocomplateSetting: function() {
    tippy("#posts li div", {
      placement: "bottom-start",
      theme: "devhyun",
      distance: 2
    });
    $("#posts").sortable({
      handle: ".move",
      update: (event, ui) => {
        let posts = [];
        $("#posts .post_item").each((i, e) => {
          let idx = $(e).attr("data-idx");
          posts.push(parseInt(idx));
        });
        STATE.posts = posts;
      }
    });
  },
  eventPosts(evt) {
    let event = evt ? evt : event;
    let keyCode = evt.which ? evt.which : event.keyCode;
    if (keyCode == 13) {
      event.preventDefault();
      event.target.value = "";
    }
  },
  deleteRelatedPost(idx) {
    let target = $(event.target).parents(".post_item");

    STATE.posts = STATE.posts || [];
    STATE.posts = fx.go(STATE.posts, fx.filter(e => e != idx));

    target.remove();
  },
  async fetchTemp() {
    const temps = await fx.go(
      AJAX.fetch("/api/editor/temp"),
      fx.map(e => this.templateTemp(e))
    );
    $("#temps").html(temps);
  },
  thumbnailButton() {
    $("#thumbnailInpFile").val("");
    $("#thumbnailInpFile").trigger("click");
  },
  async thumbnailChange() {
    let target = event.target;
    let files = target.files;
    if (!COMMON.isFileSize(files)) {
      ALERT.error("이미지는 최대 5MB까지 업로드가 가능합니다.");
      return;
    }

    let multipart = new FormData();
    multipart.append("file", files[0]);

    const rs = await AJAX.thumbnail(
      "/upload/thumbnail",
      { width: 627, height: 414 },
      multipart
    );
    if (!rs) return;
    $("#thumbnailImg").attr("src", rs.src);
    $("#thumbnailImg").css("display", "block");
    $("#thumbnailBtn").css("display", "none");
    $("#thumbnailHdn").val(rs.src);
  },
  async insertSeries() {
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

    form.posts = STATE.posts || [];

    if (form.posts.length == 0) {
      ALERT.error("연관 포스트를 등록해주세요");
      return false;
    }

    const { idx } = await AJAX.post("/series", form);
    if (idx) {
      location.href = `/admin/blog/series/${idx}`;
    }
  },
  async updateSeries(idx) {
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
        }
      }
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    form.posts = STATE.posts || [];

    if (form.posts.length == 0) {
      ALERT.error("연관 포스트를 등록해주세요");
      return false;
    }

    const result = await AJAX.put(`/series/${idx}`, form);
    if (result) {
      location.href = `/admin/blog/series/${idx}`;
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
      $("#thumbnailImg").attr("src", temp.thumbnail);
      $("#thumbnailHdn").val(temp.thumbnail);
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
      ALERT.error("내용을 입력해주세요.");
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
    this.fetchAutocomplate();
    this.autocomplateSetting();
  }
};

export const tag = {
  namespace: "tag",
  init() {}
};
