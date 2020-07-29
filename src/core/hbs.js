import moment from 'moment';
import htmlToText2 from 'html-to-text2';

const check = {
  isNull: function(v1) {
    return !!!v1;
  },
  ifNullDef: function(value, def) {
    if (value == null || value == undefined) return def;
    else return value;
  },
};

const math = {
  /**
   * 순번 넘버링
   * IN: 전체 수(INTEGER), 페이지 수(INTEGER), 페이지에 보여주는 갯수(INTEGER), 정렬 기준(desc || asc)
   * OUT: 정수(INTEGER)
   */
  numIdx: function(odr, option) {
    if (!option) {
      option = odr;
      odr = 'asc';
    }
    if (odr && odr.toLowerCase() == 'desc') {
      return value - option.data.index;
    }

    return option.data.index + 1;
  },
  /**
   * 페이지 순번 넘버링
   * IN: 전체 수(INTEGER), 페이지 수(INTEGER), 페이지에 보여주는 갯수(INTEGER), 정렬 기준(desc || asc)
   * OUT: 정수(INTEGER)
   */
  pageIdx: function(row, page, size, odr, option) {
    if (!option) {
      option = odr;
      odr = 'asc';
    }

    if (odr && odr.toLowerCase() == 'desc') {
      return row - size * page - option.data.index;
    }

    return size * page + option.data.index + 1;
  },
  /**
   * 퍼센트 계산
   * IN: 부분(INTEGER), 전체(INTEGER), 역계산(BOOLEAN=FALSE)
   * OUT: 정수(INTEGER)
   */
  percent: function(v1, v2, reverse, option) {
    if (!option) {
      option = reverse;
      reverse = false;
    }

    if (reverse) {
      return Math.floor((1 - v2 / v1) * 100);
    }

    return Math.floor((v2 / v1) * 100);
  },
};

const convert = {
  /**
   * 날짜를 문자열로 변환
   * IN: 날짜(DATE), 포멧(STRING)
   * OUT: 문자(STRING)
   */
  parseDate: function(value, format) {
    if (value == 0 || !value || value == '') return '-';
    return moment(value).format(format);
  },
  /**
   * 핸드폰 연락처 분할 처리
   * IN: 연락처(STRING), 자리수(INTEGER)
   * OUT: 문자(STRING)
   */
  parsePhone: function(phone, index) {
    if (
      !phone ||
      !phone.match(
        /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/,
      ) ||
      (!index && index != 0)
    ) {
      return '-';
    }
    return phone.split('-')[index];
  },
  /**
   * 관리자 권한을 텍스트로 변환
   * IN: 권한(STRING)
   * OUT: 권한 이름(STRING)
   */
  parseRole: function(role) {
    let res = '-';

    if (!role) return res;

    switch (role) {
      case 'SUPER_ADMIN':
        res = '개발자';
        break;
      case 'MASTER_ADMIN':
        res = '대표';
        break;
      case 'MANAGER_ADMIN':
        res = '매니저';
        break;
      case 'MEMBER_ADMIN':
        res = '직원';
        break;
      default:
        res = '회원';
        break;
    }

    return res;
  },
  /**
   * 활성화 상태를 텍스트로 변환
   * IN: 활성화 상태(BOOLEAN)
   * OUT: 활성화 상태 이름(STRING)
   */
  parseActive: function(v1) {
    let res = '-';
    if (!v1) return res;
    return v1 == 1 ? '활성화' : '정지';
  },
  /**
   * 계정 상태를 텍스트로 변환
   * IN: 계정 상태(BOOLEAN), 탈퇴 상태(BOOLEAN)
   * OUT: 활성화 상태 이름(STRING)
   */
  parseStatus: function(active, withdraw) {
    let res = '-';
    if (!active || !withdraw) return res;

    if (active == 0) {
      status = '정지';
    } else {
      status = '활성화';
    }

    if (withdraw == 1) {
      status = '탈퇴';
    }

    return status;
  },
  /**
   * 성별을 텍스트로 변환
   * IN: 성별 값(INTEGER)
   * OUT: 성별 텍스트(STRING)
   */
  parseGender: function(value) {
    return value == 0 ? '남성' : '여성';
  },
  /**
   * 나이 계산
   * IN: 날짜(DATE)
   * OUT: 나이(INTEGER)
   */
  parseAge: function(value) {
    if (value == 0) return '';
    let year = value.substring(0, 4);
    let now = moment().format('YYYY');

    return parseInt(now) - parseInt(year) + 1;
  },
  /**
   * 만 나이 계산
   * IN: 날짜(DATE)
   * OUT: 만 나이(INTEGER)
   */
  parseRealAge: function(birth) {
    if (birth == 0) return '';
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    if (month < 10) month = '0' + month;
    if (day < 10) day = '0' + day;

    let monthDay = month + day;
    birth = birth.replace('-', '').replace('-', '');

    let birthdayy = birth.substr(0, 4);
    let birthdaymd = birth.substr(4, 4);
    let age = monthDay < birthdaymd ? year - birthdayy - 1 : year - birthdayy;
    return age;
  },
  /**
   * 마크다운 처리
   * IN: 마크다운 태그(STRING)
   * OUT: 일반 문자열(STRING)
   */
  parseMarkdown: function(markdown, wordwrap) {
    markdown = markdown.replace(/(?:\r\n|\r|\n)/g, ' ');
    markdown = markdown.replace(/(<code data).*(<\/code>)/g, '');

    let text = htmlToText2.fromString(markdown, {
      ignoreHref: true,
      ignoreImage: true,
    });

    text = text.replace(/(?:\r\n|\r|\n)/g, ' ');
    return string.cutString(text, wordwrap).trim();
  },
};

const string = {
  /**
   * 통화 단위 콤마 삽입
   * IN: 정수(INTEGER)
   * OUT: 콤마가 삽입된 문자열(STRING)
   */
  decimal: function(value) {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },
  /**
   * 문자 사이에 문자 삽입
   * IN: 문자열 배열(ARRAY), 문자열(STRING)
   * OUT: 완성된 문자열(STRING)
   */
  unSplit: function(str, ...array) {
    return array.reduce((v1, v2) => v1 + str + v2);
  },
  /**
   * 문자열 축소 자르기
   * IN: 문자열(STRING), 최대 수(INTEGER)
   * OUT: 잘린 문자열(STRING)
   */
  cutString: function(value, max) {
    let isOver = true;
    if (max > value.length) {
      max = value.length;
      isOver = false;
    }
    return value.substring(0, max) + (isOver ? '...' : '');
  },
  /**
   * 문자열 자르기
   * IN: 문자열(STRING), 시작위치(INTEGER), 마지막위치(INTEGER)
   * OUT: 잘린 문자열(STRING)
   */
  subString: function(value, start, end) {
    if (!value) return '';
    return value.substring(start, end);
  },
};

const array = {
  /**
   * 반복문 제한
   * IN: 배열(ARRAY), 최대 수(INTEGER)
   * OUT: 배열(ARRAY)
   */
  eachLimit: function(ary, max, options) {
    if (!ary || ary.length == 0) return options.inverse(this);

    let result = [];
    for (let i = 0; i < max && i < ary.length; ++i)
      result.push(options.fn(ary[i]));

    return result.join('');
  },
};

const html = {
  /**
   * 체크박스 체크 처리
   * IN: 체크박스(BOOLEAN)
   * OUT: 문자열(STRING)
   */
  checkbox: function(value) {
    return value == 1 ? 'checked=""' : '';
  },
  lineBrTag: function(value, count) {
    if (!value || value == '') return '-';
    return value.replace(
      /(?:\r\n|\r|\n)/g,
      count
        ? (count => {
            let res = '';
            for (let i = 0; i < count; i++) {
              res += '<br/>';
            }
            return res;
          })(count)
        : '<br/>',
    );
  },
};

const condition = {
  ifPageNext: function(value, count, options) {
    if (value && value.length >= count) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  isNotNull: function(value, options) {
    if (value && value.length > 0) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  isHotPost: function(value, options) {
    if (value && value >= 20) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  isNewPost: function(value, options) {
    let target = moment(value);
    let max = moment().format('YYYY-MM-DD HH:mm:ss');
    let min = moment()
      .subtract(5, 'days')
      .format('YYYY-MM-DD HH:mm:ss');

    if (target.isBetween(min, max)) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  isGoodPost: function(value, options) {
    if (value.length >= 10000) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
};

const dependency = {
  /**
   * 관리자 통계 재방문 비율 계산
   * IN: 대상 인원(INTEGER), 전체 인원(INTEGER)
   * OUT: 비율(INTEGER)
   */
  reInflowPercent: function(acount, rcount) {
    return (acount - rcount) / acount;
  },
  visitSum: function(array) {
    let acount = 0;
    for (let i = 1; i < array.length; i++) {
      acount += parseInt(array[i]);
    }
    return acount;
  },
  visitAvg: function(array) {
    let acount = 0;
    for (let i = 1; i < array.length; i++) {
      acount += parseInt(array[i]);
    }
    let avg = acount / 12;
    return avg.toFixed(1);
  },
  projectImpt: function(value) {
    let html = '';
    switch (value) {
      case 1:
        html = '<span class="badge badge-pill badge-primary">높음</span>';
        break;
      case 2:
        html = '<span class="badge badge-pill badge-info">중간</span>';
        break;
      default:
        html = '<span class="badge badge-pill badge-secondary">낮음</span>';
    }
    return html;
  },
  projectProgress: function(value) {
    let rs = '';
    if (value == 100) {
      rs = '완료';
    } else {
      rs = value + '%';
    }
    return rs;
  },
  projectRestDay: function(value) {
    let day = moment.duration(moment(value).diff(moment())).asDays();
    return day < 0 ? 0 : Math.ceil(day);
  },
  taskProgress: function(value, opttions) {
    let html = '';
    /**
    if (value == 0) {
      html = `<span class="badge badge-danger">${value}%</span>`;
    } else if (value > 0 && value <= 30) {
      html = `<span class="badge badge-dark">${value}%</span>`;
    } else if (value > 30 && value <= 60) {
      html = `<span class="badge badge-info">${value}%</span>`;
    } else if (value > 60 && value <= 99) {
      html = `<span class="badge badge-primary">${value}%</span>`;
    } else {
      html = `<span class="badge badge-success">완료</span>`;
    }
    */
    if (value == 100) {
      html = `<span class="badge badge-success">완료</span>`;
    } else {
      html = `<span class="badge badge-dark">${value}%</span>`;
    }
    return html;
  },
  tagBox: function(value) {
    if (!value) return '<div class="pd-y-9">　</div>';
    let html = '';
    const tags = value.split(',');
    for (let i = 0; i < tags.length; i++) {
      let item = tags[i];
      html += `<span class="badge badge-info tag">${item}</span>`;
    }

    return html;
  },
  isActive: function(value) {
    return value == 1 ? '활성화' : '정지';
  },
};

export default Object.assign(
  check,
  math,
  convert,
  string,
  array,
  html,
  condition,
  dependency,
);
