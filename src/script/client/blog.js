import { BROWSER, COMMON } from "../common";

export const post = {
  namespace: "post",
  query: function() {
    let qstr = BROWSER.queryString();
    if (qstr.query) {
      $("#query").val(qstr.query);
      $("#inQuery").text(qstr.query);
      $(".search").addClass("focus");
    }
  },
  init: function() {
    COMMON.pagination("#page", STATE.postPage.totalPages, STATE.postPage.page);
    this.query();
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
    $("aside").stick_in_parent({ offset_top: 80 });
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
  seriesSlide: function() {
    $(".swiper-slide.this").each(function(i, e) {
      let init = parseInt($(e).attr("data-idx"));
      new Swiper(".series-swiper" + i, {
        slidesPerView: 1,
        initialSlide: init,
        simulateTouch: false,
        speed: 500,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        navigation: {
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev"
        }
      });
    });
  },
  init: function() {
    this.aside();
    this.toolTip();
    this.seriesSlide();
    COMMON.anchorScroll();
  }
};

export const series = {
  namespace: "series",
  query: function() {
    let qstr = BROWSER.queryString();
    if (qstr.query) {
      $("#query").val(qstr.query);
      $("#inQuery").text(qstr.query);
      $(".search").addClass("focus");
    }
  },
  init: function() {
    COMMON.pagination(
      "#page",
      STATE.seriesPage.totalPages,
      STATE.seriesPage.page
    );
    this.query();
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
    $("aside").stick_in_parent({ offset_top: 80 });
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
  seriesSlide: function() {
    $(".swiper-slide.this").each(function(i, e) {
      let init = parseInt($(e).attr("data-idx"));
      new Swiper(".series-swiper" + i, {
        slidesPerView: 1,
        initialSlide: init,
        simulateTouch: false,
        speed: 500,
        spaceBetween: 30,
        loop: false,
        pagination: {
          el: ".swiper-pagination",
          type: "fraction"
        },
        navigation: {
          nextEl: ".swiper-next",
          prevEl: ".swiper-prev"
        }
      });
    });
  },
  init: function() {
    this.aside();
    this.toolTip();
    this.seriesSlide();
    COMMON.anchorScroll();
  }
};

export const tag = {
  namespace: "tag",
  searchTag() {
    event.preventDefault();
    var form = $(event.target).serializeObject();
    location.href = "/blog/tag/" + form.query;
    return false;
  },
  init() {}
};

export const tagDetail = {
  namespace: "tagDetail",
  searchTag() {
    event.preventDefault();
    var form = $(event.target).serializeObject();
    location.href = "/blog/tag/" + form.query;
    return false;
  },
  query() {
    $("#query").val(STATE.query);
  },
  init() {
    this.query();
    COMMON.pagination("#page", STATE.tagPage.totalPages, STATE.tagPage.page);
  }
};
