export const main = {
  namespace: "main",
  visualAnimate() {
    $(".code").each(function animate() {
      $(this)
        .animate({ top: 55 }, 1000)
        .animate({ top: 80 }, 1000, animate);
    });
  },
  visualText() {
    var elements = document.getElementsByClassName("text-effect");
    for (var i = 0; i < elements.length; i++) {
      var toRotate = [
        "SpringBoot & NodeJS로 웹 애플리케이션을 구축합니다.",
        "뿌리깊은 프론트엔드 개발자를 목표로 노력합니다.",
        "항상 새로운 기술에 적극적으로 도전합니다.",
        "신뢰를 가장 중요하게 생각합니다."
      ];
      var period = 2000;
      if (toRotate) {
        new TextEffect(elements[i], toRotate, period);
      }
    }
  },
  blogSlide() {
    new Swiper(".blog-swiper", {
      slidesPerView: 3,
      autoplay: {
        delay: 5000
      },
      speed: 1000,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: ".swiper-next",
        prevEl: ".swiper-prev"
      },
      breakpoints: {
        1000: {
          slidesPerView: 1,
          spaceBetween: 30
        }
      }
    });
  },
  init() {
    this.visualAnimate();
    this.visualText();
    this.blogSlide();
  }
};
