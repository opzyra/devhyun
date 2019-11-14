import { validate } from "revalidator";

export const BROWSER = {
  isMobile() {
    let filter = "win16|win32|win64|mac|macintel";
    let windowWidth = $(window).width();
    if (navigator.platform) {
      if (
        filter.indexOf(navigator.platform.toLowerCase()) < 0 ||
        windowWidth < 768
      ) {
        return true;
      } else {
        return false;
      }
    }

    return false;
  },
  queryString() {
    let a = window.location.search.substr(1).split("&");
    if (a == "") return {};
    let b = {};
    for (let i = 0; i < a.length; ++i) {
      let p = a[i].split("=", 2);
      if (p.length == 1) b[p[0]] = "";
      else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  }
};

export const ALERT = {
  async error(message) {
    return await Swal.fire({
      type: "error",
      title: "ERROR",
      html: message,
      confirmButtonText: "확인",
      allowOutsideClick: false,
      heightAuto: false
    });
  },
  async success(message) {
    return await Swal.fire({
      type: "success",
      title: "COMPLETE",
      html: message,
      confirmButtonText: "확인",
      allowOutsideClick: false,
      heightAuto: false
    });
  },
  async confirm(message) {
    return await Swal.fire({
      type: "warning",
      title: "CONFIRM",
      html: message,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
      showCancelButton: true,
      allowOutsideClick: false,
      heightAuto: false,
      reverseButton: true
    });
  }
};
export const CONVERT = {
  lineBreak(str) {
    return str.replace(/(\n|\r\n)/g, "<br>");
  },
  extractNumber(str) {
    return str.replace(/[^0-9]/g, "");
  }
};

export const TOAST = {
  success(title) {
    let Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000
    });

    Toast.fire({
      type: "success",
      title: title
    });
  },
  error(title) {
    let Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500
    });

    Toast.fire({
      type: "error",
      title: title
    });
  }
};

export const COLOR = {
  pallet: [
    "#004abf",
    "#9e5fff",
    "#00a9ff",
    "#ff5583",
    "#D870A9",
    "#03bd9e",
    "#8BC163",
    "#bbdc00",
    "#9d9d9d",
    "#34495E",
    "#ffbb3b",
    "#ff4040"
  ]
};

export const COOKIE = {
  getCookie(name) {
    let Found = false;
    let start, end;
    let i = 0;
    while (i <= document.cookie.length) {
      start = i;
      end = start + name.length;
      if (document.cookie.substring(start, end) == name) {
        Found = true;
        break;
      }
      i++;
    }
    if (Found == true) {
      start = end + 1;
      end = document.cookie.indexOf(";", start);
      if (end < start) end = document.cookie.length;
      return document.cookie.substring(start, end);
    }
    return "";
  },
  setCookie(name, value, expiredays) {
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + expiredays);
    document.cookie =
      name +
      "=" +
      escape(value) +
      "; path=/; expires=" +
      endDate.toGMTString() +
      ";";
  }
};

export const AJAX = {
  config: {
    baseURL: "/api",
    timeout: 8000,
    beforeSend() {
      $('a, :button, :input[type="submit"]').attr("disabled", "disabled");
      NProgress.start();
    },
    always() {
      $('a, :button, :input[type="submit"]').removeAttr("disabled");
      NProgress.done();
    },
    async fail(jqxhr) {
      let message = "데이터베이스 오류가 발생하였습니다.";
      let responseJSON = jqxhr.responseJSON;
      let statue = jqxhr.status;
      if (statue == 401) {
        const { value } = await ALERT.confirm(
          "세션이 만료되었습니다.<br/>로그인 화면으로 이동할까요?"
        );
        if (value) {
          location.href = "/login";
        }
        return;
      }

      if (responseJSON) message = responseJSON.message;
      if (!message) message = "잘못된 요청입니다.";

      ALERT.error(message);
    }
  },
  async get(url, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "GET",
        url: this.config.baseURL + url,
        timeout: this.config.timeout,
        data: param || null,
        contentType: "application/json"
      });

      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async post(url, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "POST",
        url: this.config.baseURL + url,
        timeout: this.config.timeout,
        data: JSON.stringify(param) || null,
        dataType: "json",
        contentType: "application/json"
      });

      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async put(url, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "PUT",
        url: this.config.baseURL + url,
        timeout: this.config.timeout,
        data: JSON.stringify(param) || null,
        dataType: "json",
        contentType: "application/json"
      });
      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async delete(url, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "DELETE",
        url: this.config.baseURL + url,
        timeout: this.config.timeout,
        data: JSON.stringify(param) || null,
        dataType: "json",
        contentType: "application/json"
      });
      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async file(url, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "POST",
        url: this.config.baseURL + url,
        timeout: this.config.timeout,
        data: param || null,
        processData: false,
        contentType: false
      });
      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async thumbnail(url, option, param) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "POST",
        url:
          this.config.baseURL +
          url +
          "?width=" +
          option.width +
          "&height=" +
          option.height,
        timeout: this.config.timeout,
        data: param || null,
        processData: false,
        contentType: false
      });
      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async download(url) {
    this.config.beforeSend();
    try {
      const data = await $.ajax({
        type: "GET",
        url: url,
        timeout: this.config.timeout,
        xhrFields: {
          responseType: "blob"
        }
      });
      return data;
    } catch (e) {
      this.config.fail(e);
    } finally {
      this.config.always();
    }
  },
  async fetch(url, param) {
    try {
      const data = await $.ajax({
        type: "GET",
        url: url,
        timeout: this.config.timeout,
        data: param || null
      });

      return data;
    } catch (e) {
      this.config.fail(e);
    }
  }
};

export const EDITOR = {
  EDITOR: null,
  set(el, height = "1000") {
    this.EDITOR = new tui.Editor({
      el: document.querySelector(el),
      initialEditType: "markdown",
      previewStyle: BROWSER.isMobile() ? "tab" : "vertical",
      height: BROWSER.isMobile() ? "600px" : height - 230 + "px",
      language: "ko_KR",
      previewDelayTime: 500,
      exts: ["scrollSync"],
      hooks: {
        addImageBlobHook: async (blob, callback) => {
          if (!COMMON.isFileSize(blob)) {
            ALERT.error("이미지는 최대 5MB까지 업로드가 가능합니다.");
            return;
          }
          if (!blob) return;
          const multipart = new FormData();
          multipart.append("file", blob);

          const res = await AJAX.file("/upload/image", multipart);
          if (res) {
            callback(res.src, res.name);
          }
        }
      }
    });

    const toolbar = this.EDITOR.getUI().getToolbar();

    toolbar.addButton(
      {
        name: "emoji",
        tooltip: "이모티콘",
        $el: $('<button class="emoji button"></button>')
      },
      14
    );
    toolbar.addButton(
      {
        name: "temp",
        tooltip: "임시저장",
        $el: $('<button class="temp button"></button>')
      },
      15
    );

    $(".emoji").emojiPicker({
      cb(emoji) {
        let value = window.EDITOR.getHtml();
        window.EDITOR.setHtml(value + emoji);
      }
    });

    window.EDITOR = this.EDITOR;
  },
  setTempCb(cb) {
    $(".temp.button").click(() => {
      this.tempSave(cb);
    });

    // ctrl + s 임시저장
    this.EDITOR.commandManager.keyMapCommand["CTRL+S"] = "Save";
    $("#markdown").keydown(e => {
      if (e.keyCode == 83 && e.ctrlKey) {
        this.tempSave(cb);
      }
    });
  },
  async tempSave(cb) {
    const tempIdx = $("#tempIdx").val();
    const title = $("#title").val();
    const thumbnail = $("#thumbnailHdn").val();
    const contents = window.EDITOR.getMarkdown();
    const form = { title, contents };

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

    form.thumbnail = thumbnail;

    let rs = null;
    if (tempIdx) {
      rs = await AJAX.put(`/editor/temp/${tempIdx}`, form);
    } else {
      rs = await AJAX.post("/editor/temp", form);
      $("#tempIdx").val(rs.idx);
    }

    TOAST.success(rs.message);
    cb();
  }
};

export const COMMON = {
  anchorScroll(height = 100) {
    // 앵커 오프셋
    $("a").click(function() {
      var href = $.attr(this, "href");
      if (href.indexOf("#") == -1 || href == "#contents") return;
      $("html, body").animate(
        {
          scrollTop: $(href).offset().top - height
        },
        500
      );
      return false;
    });
  },
  pagination(el, total, page) {
    let totalPages = parseInt(total) || 1;
    let startPage = parseInt(page) || 1;

    $(el).twbsPagination({
      totalPages: totalPages,
      startPage: totalPages >= startPage ? startPage : 1,
      visiblePages: 5,
      first: "처음페이지로 이동",
      last: "마지막페이지로 이동",
      prev: "이전페이지로 이동",
      next: "다음페이지로 이동",
      onPageClick: function(event, page) {
        if (startPage == page) return;
        if (location.href.indexOf("page") == -1) {
          let isQuery = location.href.indexOf("?") >= 0;
          location.href =
            location.href + (isQuery ? "&" : "?") + "page=" + page;
        } else {
          location.href = location.href.replace(/page=.+/g, "page=" + page);
        }
      }
    });
  },
  dateDiff(_date1, _date2) {
    let diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    let diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

    diffDate_1 = new Date(
      diffDate_1.getFullYear(),
      diffDate_1.getMonth() + 1,
      diffDate_1.getDate()
    );
    diffDate_2 = new Date(
      diffDate_2.getFullYear(),
      diffDate_2.getMonth() + 1,
      diffDate_2.getDate()
    );

    let diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
  },
  isFileSize(fs, size = 5) {
    var maxSize = size * 1024 * 1024;

    for (var i = 0; i < fs.length; i++) {
      if (fs[i].size > maxSize) {
        return false;
      }
    }

    return true;
  },
  isValidDate(iDate) {
    if (iDate.length != 8) {
      return false;
    }

    var oDate = new Date();
    oDate.setFullYear(iDate.substring(0, 4));
    oDate.setMonth(parseInt(iDate.substring(4, 6)) - 1);
    oDate.setDate(iDate.substring(6));

    if (
      oDate.getFullYear() != iDate.substring(0, 4) ||
      oDate.getMonth() + 1 != iDate.substring(4, 6) ||
      oDate.getDate() != iDate.substring(6)
    ) {
      return false;
    }

    return true;
  },
  fileDownload(fileSrc, fileName) {
    AJAX.download(fileSrc).then(function(data) {
      if (navigator.appVersion.toString().indexOf(".NET") > 0) {
        window.navigator.msSaveBlob(data, fileName);
      } else {
        var a = document.createElement("a");
        var url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }
};

window.COMMON = {
  async logout() {
    const rs = await AJAX.post("/member/logout");
    if (rs) location.href = "/";
  },
  error(message) {
    ALERT.error(message);
  }
};
