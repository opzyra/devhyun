/**
 * @description 자바스크립트 / 제이쿼리 모듈
 * @author
 * 2019.04.04 KHH
 */

// 브라우저
window.BROWSER = {
  // URL의 쿼리스트링 추출
  getQueryString: function() {
    var a = window.location.search.substr(1).split('&');
    if (a == '') return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
      var p = a[i].split('=', 2);
      if (p.length == 1) b[p[0]] = '';
      else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
    }
    return b;
  },
  orderQueryString: function(data) {
    if (location.href.indexOf('sort') == -1) {
      var isQuery = location.href.indexOf('?') >= 0;
      location.href = location.href + (isQuery ? '&' : '?') + 'sort=' + data + '&order=desc';
    } else {
      var qrs = window.BROWSER.getQueryString();
      if(qrs.sort == data) {
        if(qrs.order && qrs.order != '') {
          location.href = location.href.replace(/order=desc/g, 'order=');
        } else {
          location.href = location.href.replace(/order=/g, 'order=desc');
        }
      } else {
        location.href = location.href.replace(/sort=.+(&)/g, 'sort=' + data).replace(/order=desc/g, '').replace(/order=/g, '') + '&order=desc';
      }
      
    }
  },
  // 모바일 체크
  isMobile: function() {
    var filter = 'win16|win32|win64|mac|macintel';
    var windowWidth = $(window).width();
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
  // 익스 체크
	isIE: function() {
		var agent = navigator.userAgent.toLowerCase();
		if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
			return true;
		}
		return false
	}
};

window.COOKIE = {
  // 저장된 쿠키를 가져온다.
  getCookie: function(name) {
    var Found = false;
    var start, end;
    var i = 0;
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
      end = document.cookie.indexOf(';', start);
      if (end < start) end = document.cookie.length;
      return document.cookie.substring(start, end);
    }
    return '';
  },
  // 쿠키를 저장한다.
  setCookie: function(name, value, expiredays) {
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + expiredays);
    document.cookie =
      name +
      '=' +
      escape(value) +
      '; path=/; expires=' +
      endDate.toGMTString() +
      ';';
  },
};

// 유효성 검사
window.CHECK = {
  // 널,공백,undefined 검사
  isNotNull: function(v) {
    if (typeof v == 'undefined' || v == null || v == '') {
      return false;
    } else {
      return true;
    }
  },
  isNull: function(v) {
    if (typeof v == 'undefined' || v == null || v == '') {
      return true;
    } else {
      return false;
    }
  },
  // 이메일 유효성 검사
  isEmail: function(e) {
    var regEmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return regEmail.test(e);
  },
  // 휴대전화 유효성 검사
  isCellPhone: function(p) {
    var regPhone = /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;
    return regPhone.test(p);
  },
  // 파일 사이즈 검사
  isFileSize: function(fs) {
    var maxSize = 5 * 1024 * 1024;

    for (var i = 0; i < fs.length; i++) {
      if (fs[i].size > maxSize) {
        return false;
      }
    }

    return true;
  },
  // 이미지 사이즈 검사
  isImageSize: function(fs) {
    var maxSize = 2 * 1024 * 1024;

    for (var i = 0; i < fs.length; i++) {
      if (fs[i].size > maxSize) {
        return false;
      }
    }

    return true;
  },
  // 유효한 날짜 체크
  isValidDate: function(iDate) {
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
};

// REST 콜
window.AJAX = {
  config: {
    baseURL: '/api',
    timeout: 8000,
    beforeSend: function() {
      $('a, :button, :input[type="submit"]').attr('disabled', 'disabled');
      // 상단 로딩바 표시
      window.progressbar = window.progressbar || false;

      // 이미 로딩중이라면 리턴
      if (window.progressbar) return;

      $('#progress').css('display', 'inherit');
      window.progress = $('#progress').progressTimer({
        timeLimit: 8,
        onFinish: function() {
          $('#progress').css('display', 'none');
        },
      });

      window.progressbar = true;
    },
    always: function() {
      $('a, :button, :input[type="submit"]').removeAttr('disabled');
      if (window.progressbar) {
        window.progress.progressTimer('complete');
      }

      window.progressbar = false;
    },
    graphqlAlways: function(res) {
      $('a, :button, :input[type="submit"]').removeAttr('disabled');
      if (window.progressbar) {
        window.progress.progressTimer('complete');
      }

      window.progressbar = false;

      if(res.errors) {
        
        Swal.fire({
          type: 'error',
          title: '에러',
          text: res.errors[0].message,
          confirmButtonColor: '#004abf',
          confirmButtonText: '확인',
          heightAuto: false,
        });
        return;
      }

    },
    fail: function(jqxhr) {
      var message = '데이터베이스 오류가 발생하였습니다.';
      var responseJSON = jqxhr.responseJSON;
      var status = jqxhr.status;

      if (responseJSON) message = responseJSON.message;
      if (status == 404) message = '잘못된 요청입니다.';
      Swal.fire({
        type: 'error',
        title: '에러',
        html: message,
        confirmButtonColor: '#004abf',
        confirmButtonText: '확인',
        heightAuto: false,
      });
    },
  },
  get: function(url, param) {
    return $.ajax({
      type: 'GET',
      url: this.config.baseURL + url,
      timeout: this.config.timeout,
      data: param || null,
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  post: function(url, param) {
    return $.ajax({
      type: 'POST',
      url: this.config.baseURL + url,
      timeout: this.config.timeout,
      data: JSON.stringify(param) || null,
      dataType: 'json',
      contentType: 'application/json',
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  put: function(url, param) {
    return $.ajax({
      type: 'PUT',
      url: this.config.baseURL + url,
      timeout: this.config.timeout,
      data: JSON.stringify(param) || null,
      dataType: 'json',
      contentType: 'application/json',
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  delete: function(url, param) {
    return $.ajax({
      type: 'DELETE',
      url: this.config.baseURL + url,
      timeout: this.config.timeout,
      data: JSON.stringify(param) || null,
      dataType: 'json',
      contentType: 'application/json',
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  file: function(url, param) {
    return $.ajax({
      type: 'POST',
      url: this.config.baseURL + url,
      timeout: this.config.timeout,
      data: param || null,
      processData: false,
      contentType: false,
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  thumbnail: function(url, option, param) {
    return $.ajax({
      type: 'POST',
      url: this.config.baseURL + url + '?width=' + option.width + '&height=' + option.height,
      timeout: this.config.timeout,
      data: param || null,
      processData: false,
      contentType: false,
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  download: function(url) {
    return $.ajax({
      type: 'GET',
      url: url,
      timeout: this.config.timeout,
      xhrFields: {
        responseType: 'blob',
      },
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.always)
      .fail(this.config.fail);
  },
  graphql: function(query) {
    return $.ajax({
      type: 'POST',
      url: '/graphql',
      timeout: this.config.timeout,
      data: JSON.stringify(query) || null,
      dataType: 'json',
      contentType: 'application/json',
      beforeSend: this.config.beforeSend,
    })
      .always(this.config.graphqlAlways);
  },
};

window.FETCH = {
	get: function(url, param) {
		return $.ajax({
			type: 'GET',
			url: url,
			timeout: 4000,
			data: param || null,
		})
	},
}

// 공통 함수들
window.COMMON = {
  randomString: function(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  },
  toast: function(title, type) {
    var Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    })

    Toast.fire({
      type: type || 'success',
      title: title
    });
  },
  fileDownload: function(fileSrc, fileName) {
    AJAX.download(fileSrc).then(function(data) {
      if (navigator.appVersion.toString().indexOf('.NET') > 0) {
        window.navigator.msSaveBlob(data, fileName);
      } else {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(data);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  },
  dateDiff: function(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

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

    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
  },
  graphqlForm: function(form) {
    var ps = JSON.stringify(form).replace(/"([^(")"]+)":/g, "$1:");
    return ps.substring(1, ps.length-1);
  },
  
  logout: function() {
    AJAX.post('/member/logout').then(function() {
      location.href = '/';
    });
  },
};
