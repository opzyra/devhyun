import { BROWSER, COMMON, ALERT, AJAX } from '../common';
import { validate } from 'revalidator';

export const post = {
  namespace: 'post',
  query() {
    let qstr = BROWSER.queryString();
    if (qstr.query) {
      $('#query').val(qstr.query);
      $('#inQuery').text(qstr.query);
      $('.search').addClass('focus');
    }
  },
  init() {
    COMMON.pagination('#page', STATE.postPage.totalPages, STATE.postPage.page);
    this.query();
  },
};

export const postDetail = {
  namespace: 'postDetail',
  toolTip() {
    tippy('.icon img', {
      placement: 'bottom',
      theme: 'devhyun',
      distance: 2,
    });
  },
  aside() {
    $('aside').stick_in_parent({ offset_top: 80 });
    let tocs = $('#toc a')
      .map(function(i, e) {
        let item = $(e).attr('href');
        return $(item)[0].offsetTop + 50;
      })
      .toArray();

    let scroll = _.throttle(function() {
      let top = $(document).scrollTop();
      for (let i = 0; i < tocs.length; i++) {
        let item = tocs[i];
        let item_next = tocs[i + 1] ? tocs[i + 1] : $(document).innerHeight();
        if (top >= item && top < item_next) {
          $('#toc a').removeClass('on');
          $('#toc a')
            .eq(i)
            .addClass('on');
          break;
        }
      }
    }, 250);

    $(document).scroll(scroll);
  },
  seriesSlide() {
    $('.swiper-slide.this').each(function(i, e) {
      let init = parseInt($(e).attr('data-idx'));
      new Swiper('.series-swiper' + i, {
        slidesPerView: 1,
        initialSlide: init,
        simulateTouch: false,
        speed: 500,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        },
      });
    });
  },
  initCommentForm() {
    const form = $('#commentForm');
    const list = $('.comments ul li');
    list.removeClass('selected');

    form.children('textarea').val('');
    form.find('select').val('');
    form.removeClass('update');
    form.find('.btn_submit').text('작성');
    form.attr('onsubmit', 'APP.createComment()');
  },
  reply(idx) {
    this.initCommentForm();
    const form = $('#commentForm');
    form
      .children('textarea')
      .val('')
      .focus();
    form.find('select').val(idx);
  },
  updateModeCommentCancel() {
    this.initCommentForm();
  },
  async updateModeComment(idx) {
    const target = event.target;
    const comment = await AJAX.get(`/comment/${idx}`);
    const form = $('#commentForm');
    const item = $(target).parents('li');
    form
      .children('textarea')
      .val(comment.contents)
      .focus();
    form.find('select').val(comment.target_idx);
    form.addClass('update');
    form.find('.btn_submit').text('수정');
    form.attr('onsubmit', `APP.updateComment(${idx})`);

    item.addClass('selected');
  },
  async createComment() {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        board: {
          requried: true,
          allowEmpty: false,
          message: '잘못된 접근입니다',
        },
        postIdx: {
          requried: true,
          allowEmpty: false,
          message: '잘못된 접근입니다',
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: '내용을 입력해주세요',
        },
      },
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    const { idx } = await AJAX.post('/comment', form);
    if (idx) {
      location.reload();
    }
  },
  async updateComment(index) {
    event.preventDefault();

    const form = $(event.target).serializeObject();

    const schema = {
      properties: {
        board: {
          requried: true,
          allowEmpty: false,
          message: '잘못된 접근입니다',
        },
        postIdx: {
          requried: true,
          allowEmpty: false,
          message: '잘못된 접근입니다',
        },
        contents: {
          requried: true,
          allowEmpty: false,
          message: '내용을 입력해주세요',
        },
      },
    };

    const { valid, errors } = validate(form, schema);

    if (!valid) {
      ALERT.error(errors[0].message);
      return false;
    }

    const { idx } = await AJAX.put(`/comment/${index}`, form);
    if (idx) {
      location.reload();
    }
  },
  async deleteComment(idx) {
    const { value } = await ALERT.confirm('댓글을 삭제할까요?');
    if (value) {
      const result = await AJAX.delete(`/comment/${idx}`);
      if (result) location.reload();
    }
  },
  init() {
    this.aside();
    this.toolTip();
    this.seriesSlide();
    COMMON.anchorScroll();
  },
};

export const series = {
  namespace: 'series',
  query() {
    let qstr = BROWSER.queryString();
    if (qstr.query) {
      $('#query').val(qstr.query);
      $('#inQuery').text(qstr.query);
      $('.search').addClass('focus');
    }
  },
  init() {
    COMMON.pagination(
      '#page',
      STATE.seriesPage.totalPages,
      STATE.seriesPage.page,
    );
    this.query();
  },
};

export const seriesDetail = {
  namespace: 'seriesDetail',
  toolTip() {
    tippy('.icon img', {
      placement: 'bottom',
      theme: 'devhyun',
      distance: 2,
    });
  },
  aside() {
    $('aside').stick_in_parent({ offset_top: 80 });
    let tocs = $('#toc a')
      .map(function(i, e) {
        let item = $(e).attr('href');
        if (!item.includes('#')) return $('#postList')[0].offsetTop + 50;
        return $(item)[0].offsetTop + 50;
      })
      .toArray();

    let scroll = _.throttle(function() {
      let top = $(document).scrollTop();
      for (let i = 0; i < tocs.length; i++) {
        let item = tocs[i];
        let item_next = tocs[i + 1] ? tocs[i + 1] : $(document).innerHeight();
        if (top >= item && top < item_next) {
          $('#toc a').removeClass('on');
          $('#toc a')
            .eq(i)
            .addClass('on');
          break;
        }
      }
    }, 250);

    $(document).scroll(scroll);
  },
  seriesSlide() {
    $('.swiper-slide.this').each(function(i, e) {
      let init = parseInt($(e).attr('data-idx'));
      new Swiper('.series-swiper' + i, {
        slidesPerView: 1,
        initialSlide: init,
        simulateTouch: false,
        speed: 500,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'fraction',
        },
        navigation: {
          nextEl: '.swiper-next',
          prevEl: '.swiper-prev',
        },
      });
    });
  },
  init() {
    this.aside();
    this.toolTip();
    this.seriesSlide();
    COMMON.anchorScroll();
  },
};

export const tag = {
  namespace: 'tag',
  searchTag() {
    event.preventDefault();
    var form = $(event.target).serializeObject();
    location.href = '/blog/tag/' + form.query;
    return false;
  },
  init() {},
};

export const tagDetail = {
  namespace: 'tagDetail',
  searchTag() {
    event.preventDefault();
    var form = $(event.target).serializeObject();
    location.href = '/blog/tag/' + form.query;
    return false;
  },
  query() {
    $('#query').val(STATE.query);
  },
  init() {
    this.query();
    COMMON.pagination('#page', STATE.tagPage.totalPages, STATE.tagPage.page);
  },
};
