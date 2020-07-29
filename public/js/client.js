$(document).ready(function(){
  $(window).on('scroll', function(e){ // 메뉴 스크롤 처리
    var distanceY = window.pageYOffset || document.documentElement.scrollTop,
        shrinkOn = 100,
        header = $('header');
    
    if(!header) return;

    if (distanceY > shrinkOn) {
        header.addClass('scroll');
    } else if (header.hasClass('scroll')) {
      header.removeClass('scroll');
    }
  });

  $('a').click(function(){ // 앵커 오프셋
    var href = $.attr(this, 'href');
    
    if(href.indexOf('#') == -1 || href == '#contents') return;

    var headerHeight = 100; //header 의 높이 만큼 조절 하면 됨
    $('html, body').animate({
        scrollTop: $(href).offset().top - headerHeight
    }, 500);

    return false;
  });

  $('#burger').click(function(){ // 햄버거 메뉴 처리
    $('header .lnb').toggleClass('collapse');
  });

  $('#overlay').click(function(){
    $('header .lnb').removeClass('collapse');
  });

  $('#searchFilter').click(function(){ // 검색창 열기
    var search = $('#searchFilter').next();
    var icon = $('#searchFilter > i');
    if(search.hasClass('show')) {
      icon.removeClass().addClass('mdi mdi-filter');
    } else {
      icon.removeClass().addClass('mdi mdi-close');
    }
    search.toggleClass('show');
  });

});