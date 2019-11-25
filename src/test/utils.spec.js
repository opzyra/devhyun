import { expect } from "chai";
import * as utils from "../lib/utils";

describe("lib/utils 테스트", () => {
  describe("cutString - 문자열과 특정 길이를 받아 ellipses처리하는 함수", () => {
    it("n자 초과의 문자열은 자르고 ...을 붙인다", () => {
      const sample =
        "웹 브라우저를 통해 사람을 연결하고 현실 문제를 해결, 개선하는 매력에 푹 빠져 웹 개발을 길을 걷고 있습니다.Java로 프로그래밍을 시작하여 Javascript의 매력에 푹빠져있고 사회와 코딩을 조금씩 알아가고 있는 사회 초년생입니다. 문제의식과 해결의 과정으로 성장하고 있으며 항상 새로운 기술에 적극적으로 도전합니다. 다양한 개발 스코프를 공부하면서 웹 기획부터 배포·유지보수까지의 과정에 대해 경험해 보았습니다. 최근에는 프론트엔드에 관심을 가지고 뿌리깊은 개발자를 목표로 노력하고 있습니다. 반갑습니다, 신뢰를 가장 중요시하는 개발자 김현호입니다.";
      const result = utils.cutString(sample, 200);
      const expected =
        "웹 브라우저를 통해 사람을 연결하고 현실 문제를 해결, 개선하는 매력에 푹 빠져 웹 개발을 길을 걷고 있습니다.Java로 프로그래밍을 시작하여 Javascript의 매력에 푹빠져있고 사회와 코딩을 조금씩 알아가고 있는 사회 초년생입니다. 문제의식과 해결의 과정으로 성장하고 있으며 항상 새로운 기술에 적극적으로 도전합니다. 다양한 개발 스코프를 공부하면서 웹...";
      expect(sample.length).gte(200);
      expect(result).eq(expected);
    });

    it("n자 이하의 문자열은 그대로 리턴 한다", () => {
      const sample =
        "웹 브라우저를 통해 사람을 연결하고 현실 문제를 해결, 개선하는 매력에 푹 빠져 웹 개발을 길을 걷고 있습니다.Java로 프로그래밍을 시작하여 Javascript의 매력에 푹빠져있고 사회와 코딩을 조금씩 알아가고 있는 사회 초년생입니다. 문제의식과 해결의 과정으로 성장하고 있으며 항상 새로운 기술에 적극적으로 도전합니다. 다양한 개발 스코프를 공부하면서 웹";
      const result = utils.cutString(sample, 200);
      const expected =
        "웹 브라우저를 통해 사람을 연결하고 현실 문제를 해결, 개선하는 매력에 푹 빠져 웹 개발을 길을 걷고 있습니다.Java로 프로그래밍을 시작하여 Javascript의 매력에 푹빠져있고 사회와 코딩을 조금씩 알아가고 있는 사회 초년생입니다. 문제의식과 해결의 과정으로 성장하고 있으며 항상 새로운 기술에 적극적으로 도전합니다. 다양한 개발 스코프를 공부하면서 웹";
      expect(sample.length).eq(200);
      expect(result).eq(expected);
    });
  });

  describe("anchorConvert - 콘텐츠 내부에 앵커태그의 새창 열기 추가", () => {
    it("컨텐츠 내부에 있는 모든 a태그(http)", () => {
      const sample = `<div><a href="http://www.naver.com">링크</a>콘텐츠 내용<a href="http://www.google.com">링크2</a></div>`;
      const result = utils.anchorConvert(sample);
      const expected = `<div><a target="_blank" href="http://www.naver.com">링크</a>콘텐츠 내용<a target="_blank" href="http://www.google.com">링크2</a></div>`;
      expect(result).eq(expected);
    });

    it("컨텐츠 내부에 있는 모든 a태그(https)", () => {
      const sample = `<div><a href="https://www.naver.com">링크</a>콘텐츠 내용<a href="https://www.google.com">링크2</a></div>`;
      const result = utils.anchorConvert(sample);
      const expected = `<div><a target="_blank" href="https://www.naver.com">링크</a>콘텐츠 내용<a target="_blank" href="https://www.google.com">링크2</a></div>`;
      expect(result).eq(expected);
    });

    it("컨텐츠 내부에 있는 모든 a태그(devhyun 도메인)", () => {
      const sample = `<div><a href="https://devhyun.com/blog/post/1">포스트1</a>콘텐츠 내용<a href="https://devhyun.com/blog/post/2">포스트2</a></div>`;
      const result = utils.anchorConvert(sample);
      const expected = `<div><a href="https://devhyun.com/blog/post/1">포스트1</a>콘텐츠 내용<a href="https://devhyun.com/blog/post/2">포스트2</a></div>`;
      expect(result).eq(expected);
    });
  });

  describe("lineBreakConvert - 개행문자 <br>태그 치환", () => {
    it("Textarea에서 받은 문자열", () => {
      const sample = `주니어 개발자다 보니 많은 프로젝트 수행경험이 없어 틈틈이 개발한 프로젝트를 정리하였습니다.\r\n저 같은 경우 프로젝트들이 배포되어 운영하고 있기 때문에 URL을 담았는데,\r\n없다면 Github 저장소를 담아주세요.`;
      const result = utils.lineBreakConvert(sample);
      const expected = `주니어 개발자다 보니 많은 프로젝트 수행경험이 없어 틈틈이 개발한 프로젝트를 정리하였습니다.<br>저 같은 경우 프로젝트들이 배포되어 운영하고 있기 때문에 URL을 담았는데,<br>없다면 Github 저장소를 담아주세요.`;
      expect(result).eq(expected);
    });
  });
});
