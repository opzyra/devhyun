/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

DROP DATABASE IF EXISTS `devhyun`;
CREATE DATABASE
IF NOT EXISTS `devhyun` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `devhyun`;

DROP TABLE IF EXISTS `activity_log`;
CREATE TABLE
IF NOT EXISTS `activity_log`
(
  `device` varchar
(50) NOT NULL DEFAULT '',
  `ip` varchar
(100) NOT NULL,
  `id` varchar
(50) NOT NULL,
  `name` varchar
(50) NOT NULL,
  `role` varchar
(50) NOT NULL,
  `contents` varchar
(200) NOT NULL DEFAULT '',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `reg_date`
(`reg_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `activity_log`;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
INSERT INTO `activity_log` (`
device`,
`ip
`, `id`, `name`, `role`, `contents`, `reg_date`) VALUES
('Chrome', '0.0.0.0', 'loranz', '테스트', 'MASTER_ADMIN', '시스템 로그인', '2019-07-19 16:17:05'),
('Chrome', '0.0.0.0', 'loranz', '테스트', 'MASTER_ADMIN', '일정 수정 (등록테스트)', '2019-07-19 16:17:20'),
('Chrome', '0.0.0.0', 'loranz', '테스트', 'MASTER_ADMIN', '공지사항 수정 (테스트 등록)', '2019-07-19 17:19:37');
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;

DROP TABLE IF EXISTS `banner`;
CREATE TABLE
IF NOT EXISTS `banner`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `odr` int
(11) NOT NULL DEFAULT '0',
  `name` varchar
(200) NOT NULL,
  `img` varchar
(200) NOT NULL,
  `url` varchar
(500) NOT NULL,
  `target` tinyint
(1) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `banner`;
/*!40000 ALTER TABLE `banner` DISABLE KEYS */;
/*!40000 ALTER TABLE `banner` ENABLE KEYS */;

DROP TABLE IF EXISTS `domain_stat`;
CREATE TABLE
IF NOT EXISTS `domain_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `domain` varchar
(200) NOT NULL,
  `rcount` int
(11) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `domain_stat`;
/*!40000 ALTER TABLE `domain_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `domain_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `dt_stat`;
CREATE TABLE
IF NOT EXISTS `dt_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `dow` int
(11) NOT NULL,
  `hour` varchar
(10) NOT NULL,
  `rcount` int
(11) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `dt_stat`;
/*!40000 ALTER TABLE `dt_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `dt_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `editor_temp`;
CREATE TABLE
IF NOT EXISTS `editor_temp`
(
  `save_key` varchar
(100) NOT NULL,
  `title` varchar
(100) NOT NULL,
  `thumbnail` varchar
(200) NOT NULL,
  `contents` longtext NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `key`
(`save_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `editor_temp`;
/*!40000 ALTER TABLE `editor_temp` DISABLE KEYS */;
INSERT INTO `editor_temp` (`
save_key`,
`title
`, `thumbnail`, `contents`, `reg_date`) VALUES
('h6Nxwl2VKoPNNgflYQoe', '임시 저장', 'http://localhost:3002/uploads/20190810/th_1CP719J05Gs0BzroO8MQS2k0a1dv.jpeg', '<h1>임시 저장 기능 테스트</h1>\n<p>잘되겠쥬?? ㅎㅎㅎ</p>\n<p>안녕하세요 그다음에 작업할 것은 1분 마다 자동으로 저장되는 기능입니다!</p>\n', '2019-08-10 22:25:15'),
('R171Fn35kd2RqF7hZfDN', '안녕하세요', '', '<h1>임시 저장 기능을 테스트합니다 ㅎ</h1>\n<p>잘 작동할까요?😄</p>\n', '2019-08-10 22:13:03'),
('RX6zkjqvNAZn01dxFJQL', '임시 저장', 'http://localhost:3002/uploads/20190810/th_ZKB2mycT01mx0X1L879he019HHyr.jpeg', '<h1>임시 저장 기능을 테스트해봅니다</h1>\n<p>썸네일도 같이 저장해봅시다! ㅋㅋ</p>\n', '2019-08-10 22:21:50');
/*!40000 ALTER TABLE `editor_temp` ENABLE KEYS */;

DROP TABLE IF EXISTS `gallery_board`;
CREATE TABLE
IF NOT EXISTS `gallery_board`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL,
  `thumbnail` varchar
(500) NOT NULL DEFAULT '',
  `title` varchar
(100) NOT NULL,
  `contents` mediumtext NOT NULL,
  `hit` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `gallery_board`;
/*!40000 ALTER TABLE `gallery_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `gallery_board` ENABLE KEYS */;

DROP TABLE IF EXISTS `history`;
CREATE TABLE
IF NOT EXISTS `history`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `odr` int
(11) NOT NULL DEFAULT '0',
  `contents` varchar
(200) NOT NULL,
  `year` varchar
(10) NOT NULL,
  `month` varchar
(10) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `history`;
/*!40000 ALTER TABLE `history` DISABLE KEYS */;
INSERT INTO `history` (`
idx`,
`odr
`, `contents`, `year`, `month`, `reg_date`) VALUES
(1, 7, '사회적기업가 육성사업 창업팀 추가 선정', '2018', '07', '2019-07-11 16:35:45'),
(2, 6, '소셜캠퍼스 온 대전 입주기업 선정', '2018', '10', '2019-07-11 16:35:54'),
(3, 5, '주식회사 어바웃 피리어드 법인 설립', '2018', '11', '2019-07-11 16:36:03'),
(4, 4, '월경상자 온·오프라인 출시', '2019', '02', '2019-07-11 16:36:10'),
(5, 3, '지역형 예비사회적기업 지정', '2019', '05', '2019-07-11 16:36:20'),
(7, 2, '테스트', '2019', '07', '2019-07-18 17:03:31'),
(8, 1, '뉴테스트', '2019', '07', '2019-07-19 15:57:29');
/*!40000 ALTER TABLE `history` ENABLE KEYS */;

DROP TABLE IF EXISTS `hit_log`;
CREATE TABLE
IF NOT EXISTS `hit_log`
(
  `ip` varchar
(30) NOT NULL,
  `board` varchar
(30) NOT NULL,
  `board_idx` tinyint
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ip_board_idx`
(`ip`,`board`,`board_idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `hit_log`;
/*!40000 ALTER TABLE `hit_log` DISABLE KEYS */;
INSERT INTO `hit_log` (`
ip`,
`board
`, `board_idx`, `reg_date`) VALUES
('0.0.0.0', 'post', 4, '2019-08-06 22:05:56'),
('0.0.0.0', 'post', 5, '2019-08-06 22:06:03'),
('0.0.0.0', 'post', 3, '2019-08-06 22:12:25'),
('0.0.0.0', 'post', 1, '2019-08-07 15:24:16'),
('127.0.0.1', 'post', 3, '2019-08-07 20:23:12'),
('127.0.0.1', 'post', 5, '2019-08-07 20:23:21'),
('127.0.0.1', 'post', 4, '2019-08-07 20:23:24'),
('127.0.0.1', 'post', 1, '2019-08-07 20:28:38'),
('0.0.0.0', 'series', 3, '2019-08-10 16:12:45'),
('0.0.0.0', 'series', 2, '2019-08-10 16:17:44'),
('127.0.0.1', 'series', 3, '2019-08-10 16:42:21'),
('0.0.0.0', 'post', 6, '2019-08-10 20:43:50');
/*!40000 ALTER TABLE `hit_log` ENABLE KEYS */;

DROP TABLE IF EXISTS `inflow_stat`;
CREATE TABLE
IF NOT EXISTS `inflow_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `email` int
(11) NOT NULL DEFAULT '0',
  `search` int
(11) NOT NULL DEFAULT '0',
  `social` int
(11) NOT NULL DEFAULT '0',
  `url` int
(11) NOT NULL DEFAULT '0',
  `etc` int
(11) NOT NULL DEFAULT '0',
  `acount` int
(11) NOT NULL DEFAULT '0',
  `rcount` int
(11) NOT NULL DEFAULT '0',
  `desktop` int
(11) NOT NULL DEFAULT '0',
  `mobile` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `inflow_stat`;
/*!40000 ALTER TABLE `inflow_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `inflow_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `member`;
CREATE TABLE
IF NOT EXISTS `member`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `id` varchar
(50) NOT NULL,
  `password` varchar
(200) NOT NULL,
  `email` varchar
(200) NOT NULL,
  `name` varchar
(50) NOT NULL,
  `role` varchar
(50) NOT NULL,
  `thumbnail` varchar
(200) NOT NULL DEFAULT '/images/default_thumbnail.png',
  `position` varchar
(100) NOT NULL DEFAULT '',
  `phone` varchar
(50) NOT NULL DEFAULT '',
  `gender` tinyint
(1) NOT NULL DEFAULT '0',
  `birth` varchar
(50) NOT NULL DEFAULT '0',
  `zonecode` varchar
(50) NOT NULL DEFAULT '00000',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `road_address` varchar
(200) NOT NULL DEFAULT '',
  `more_address` varchar
(200) NOT NULL DEFAULT '',
  `division` varchar
(50) NOT NULL DEFAULT '관리자',
  `pass_temp` varchar
(100) NOT NULL DEFAULT '',
  `active` tinyint
(1) NOT NULL DEFAULT '1',
  `withdraw` tinyint
(1) NOT NULL DEFAULT '0',
  PRIMARY KEY
(`idx`),
  UNIQUE KEY `id`
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `member`;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` (`
idx`,
`id
`, `password`, `email`, `name`, `role`, `thumbnail`, `position`, `phone`, `gender`, `birth`, `zonecode`, `reg_date`, `road_address`, `more_address`, `division`, `pass_temp`, `active`, `withdraw`) VALUES
(1, 'opzyra', '$2b$10$DPxsOQusFO5ABcd1OaBdHeKs3Htp5df4z1Em6tzIW5E7k8n/hBpSy', 'opzyra@gmail.com', '김현호', 'SUPER_ADMIN', '/images/default_thumbnail.png', '개발자', '010-3477-5510', 0, '19900619', '00000', '2019-07-10 16:44:59', '', '', '관리자', '', 1, 0),
(2, 'loranz', '$2b$10$9SywXpR.Cz9TklPTu/n2hu1Y7B9LBVdU7SGzYCB8AHryCv/J1uy9S', 'loranz@naver.com', '테스트', 'MASTER_ADMIN', 'http://localhost:3001/uploads/20190719/th_o1a7uvvpn0T9Jn2dOPhVf9001Xf9.jpeg', '', '010-3477-5510', 0, '0', '00000', '2019-07-18 17:39:49', '', '', '관리자', '', 1, 0),
(3, 'test123', '$2b$10$sPWEmSZZh/kQoQrduDAcrebetjegdDxS/mHesiC.jqm2LEly0XCCG', 'opzsd2@naver.com', '테스터', 'MANAGER_ADMIN', '/images/default_thumbnail.png', '', '010-9985-9985', 0, '0', '00000', '2019-07-18 17:50:39', '', '', '관리자', '', 1, 0);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;

DROP TABLE IF EXISTS `member_stat`;
CREATE TABLE
IF NOT EXISTS `member_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `year` varchar
(10) NOT NULL,
  `month` varchar
(10) NOT NULL,
  `man` int
(11) NOT NULL DEFAULT '0',
  `woman` int
(11) NOT NULL DEFAULT '0',
  `uteens` int
(11) NOT NULL DEFAULT '0',
  `teens` int
(11) NOT NULL DEFAULT '0',
  `twenties` int
(11) NOT NULL DEFAULT '0',
  `thirties` int
(11) NOT NULL DEFAULT '0',
  `forties` int
(11) NOT NULL DEFAULT '0',
  `fifties` int
(11) NOT NULL DEFAULT '0',
  `sixties` int
(11) NOT NULL DEFAULT '0',
  `seventies` int
(11) NOT NULL DEFAULT '0',
  `eighties` int
(11) NOT NULL DEFAULT '0',
  `nineties` int
(11) NOT NULL DEFAULT '0',
  `onineties` int
(11) NOT NULL DEFAULT '0',
  `busan` int
(11) NOT NULL DEFAULT '0',
  `chungbuk` int
(11) NOT NULL DEFAULT '0',
  `chungnam` int
(11) NOT NULL DEFAULT '0',
  `daegu` int
(11) NOT NULL DEFAULT '0',
  `daejeon` int
(11) NOT NULL DEFAULT '0',
  `gangwon` int
(11) NOT NULL DEFAULT '0',
  `gwangju` int
(11) NOT NULL DEFAULT '0',
  `gyeongbuk` int
(11) NOT NULL DEFAULT '0',
  `gyeonggi` int
(11) NOT NULL DEFAULT '0',
  `gyeongnam` int
(11) NOT NULL DEFAULT '0',
  `incheon` int
(11) NOT NULL DEFAULT '0',
  `jeju` int
(11) NOT NULL DEFAULT '0',
  `jeonbuk` int
(11) NOT NULL DEFAULT '0',
  `jeonnam` int
(11) NOT NULL DEFAULT '0',
  `sejong` int
(11) NOT NULL DEFAULT '0',
  `seoul` int
(11) NOT NULL DEFAULT '0',
  `ulsan` int
(11) NOT NULL DEFAULT '0',
  `rcount` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `member_stat`;
/*!40000 ALTER TABLE `member_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `member_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `page_stat`;
CREATE TABLE
IF NOT EXISTS `page_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `page` varchar
(200) NOT NULL,
  `rcount` int
(11) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `page_stat`;
/*!40000 ALTER TABLE `page_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `page_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `partner`;
CREATE TABLE
IF NOT EXISTS `partner`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `odr` int
(11) NOT NULL DEFAULT '0',
  `name` varchar
(200) NOT NULL,
  `logo` varchar
(200) NOT NULL,
  `description` varchar
(500) NOT NULL,
  `url` varchar
(500) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `partner`;
/*!40000 ALTER TABLE `partner` DISABLE KEYS */;
/*!40000 ALTER TABLE `partner` ENABLE KEYS */;

DROP TABLE IF EXISTS `post_board`;
CREATE TABLE
IF NOT EXISTS `post_board`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL,
  `title` varchar
(100) NOT NULL,
  `thumbnail` varchar
(200) NOT NULL,
  `contents` mediumtext NOT NULL,
  `tags` mediumtext NOT NULL,
  `hit` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `post_board`;
/*!40000 ALTER TABLE `post_board` DISABLE KEYS */;
INSERT INTO `post_board` (`
idx`,
`member_idx
`, `title`, `thumbnail`, `contents`, `tags`, `hit`, `reg_date`) VALUES
(1, 1, '테스트 등록', '/images/default_post.png', '<p>수정작업!</p>\n<p><img src="http://localhost:3001/uploads/20190719/cV10Yr9C29r0Bz127PcMccHT9gh8.png" alt="logo.png"></p>\n', 'java,javascript', 2, '2019-07-19 15:57:46'),
(3, 1, '테스트등록', 'http://localhost:3002/uploads/20190725/th_sF2V0AF0qp7O832b9t3Pr0G1529t.png', '<h3>수정해봅니다!</h3>\n<p>굳굳 잘되겠죵?!</p>\n', 'java,javascript,개발', 3, '2019-07-25 18:12:27'),
(4, 1, '테스트 마크다운!', 'http://localhost:3002/uploads/20190725/th_20QLKoi2B9W0c1i5fagEWh17yRRK.jpeg', '<p><img src="https://files.slack.com/files-pri/T25783BPY-F7V7K1V6H/dog_explained_3.png?pub_secret=d51a563d02" alt="LIME으로 개와 고양이 이미지 분류 모델의 예측 결과 설명하기"></p>\n<p>머신 러닝 모델에 대해서 예측의 이유를 설명하는 것은 어렵습니다. 모델이 복잡해질수록 예측의 정확도는 올라가지만, 결과의 해석은 어려워지죠. 그렇기 때문에 많은 머신 러닝 모델들이 블랙박스라고 불립니다.</p>\n<p>하지만 모델이 \'왜\' 그렇게 작동하는지 아는 것은 중요합니다. 의사가 "인공 지능이 이렇게 하래요"라고 말하면서 환자를 수술하지는 않겠죠. 은행에서 의심스러운 거래를 차단하는 경우에도 차단당한 이용자는 설명을 요구할 것입니다. 하물며 Netflix에서 볼 영화를 선택할 때도, 추천 영화에 시간을 투자하기 전에 어느 정도의 모델에 대한 신뢰감은 필요합니다.</p>\n<p>모델의 예측의 근거를 이해하는 것은 언제 모델을 신뢰할지 또는 신뢰하지 않을지 결정하는 데도 중요합니다. 아래 그림을 예를 들어볼까요. 아래 그림은 머신 러닝 모델이 특정 환자가 독감에 걸렸다고 예측하는 예입니다. 만약 예측을 하는 것만으로 끝나지 않고, \'Explainer\'가 있어서 이 예측을 내릴 때 모델에서 가장 중요했던 증상을 강조해주며 모델을 설명한다면, 아마 의사는 모델을 신뢰하거나 또는 신뢰하지 않기로 결정하기가 좀 더 쉬울 것입니다.</p>\n<p><img src="https://d3ansictanv2wj.cloudfront.net/figure1-a9533a3fb9bb9ace6ee96b4cdc9b6bcb.jpg" alt="사람에게 모델의 예측을 설명하기. 출처: Marco Tulio Ribeiro."></p>\n<p>모델의 예측을 얼마나 믿을 수 있는지는 보통 평가용 데이터셋에서 구한 정확도 등으로 검증합니다. 하지만, 머신 러닝 해보신 분들이라면 다 아시듯이 현실에서 이런 수치들은 흔히 믿을 수 없을 때가 많습니다. 때로는 평가용과 학습용 데이터셋을 잘못 나누어서 평가용 데이터셋의 정보가 학습용 데이터셋에 섞여 있기도 하죠. 때로는 평가용 데이터셋이 현실을 정확하게 반영하지 않을 때도 있습니다. 이럴 때 모델의 작동 방식을 이해하는 것은 모델의 성능을 평가하는 데 유용합니다. 사람은 보통 모델이 어떻게 행동해야 한다는 직관을 갖고 있습니다. 모델의 예측의 근거를 보여주고 사람의 직관을 이용하면 정확도 등의 지표로 잡아내기 어려운 모델의 신뢰도를 평가할 수 있죠.</p>\n<p>이번 포스팅에서는 어떤 예측 모델이든 그 모델이 \'왜\' 그렇게 예측했는지 설명해주는 모델, LIME (Local Interpretable Model-agnostic Explanations)에 대해서 알아보겠습니다. 그리고 Python과 Jupyter Notebook에서 쉽게 LIME을 사용하는 방법을 소개해드리겠습니다.</p>\n<h1>무엇을 할 수 있나요?</h1>\n<p>LIME은 뉴럴 네트워크, 랜덤 포레스트, SVM 등 어떤 머신 러닝 예측 모델에도 적용할 수 있습니다. 데이터 형식도 이미지, 텍스트, 수치형 데이터를 가리지 않습니다. 텍스트와 이미지 분류 문제에 LIME을 이용하는 예시를 통해 LIME이 어떤 알고리즘인지 알아보겠습니다.</p>\n<p>먼저, 텍스트 예시입니다. 20 newsgroups 데이터셋은 텍스트 분류 문제에서 유명한 데이터셋입니다. 여기서는 \'기독교\' 카테고리와 \'무신론\' 카테고리를 분류하는 모델을 살펴봅니다. 이 두 카테고리는 서로 많은 단어들을 공유하기 때문에 분류하기 어려운 문제로 알려져 있습니다.</p>\n<p>랜덤 포레스트를 의사 결정 나무 500개로 돌리면 92.4%의 평가용 데이터셋 정확도를 얻습니다. 굉장히 높은 수치죠. 만약 정확도가 유일한 신뢰의 지표였다면 분명 이 분류기를 믿었을 겁니다. 하지만, 무작위로 뽑은 데이터에 대한 LIME의 설명을 들여다보면 그 결과는 사뭇 다릅니다.</p>\n<p><img src="https://d3ansictanv2wj.cloudfront.net/figure5-cd7d3c5128549df1e957bf8f9f93bb2b.jpg" alt="20 newsgroups 데이터셋 중 한 예측에 대한 설명."></p>\n<p>이것은 모델이 예측은 정확하게 했지만 그 이유는 틀린 경우입니다. 이메일 상단에 있는 \'posting\'이란 단어는 학습 데이터셋에서는 21.6%의 데이터에서 나타나지만 \'기독교\' 카테고리에서는 두번밖에 나타나지 않습니다. 테스트셋에서도 마찬가지로 데이터 중 20%의 경우에 \'posting\'이 나오지만 \'기독교\'에는 두번밖에 나오지 않습니다. 하지만 실제 현실에서 이런 패턴이 나타날 것이라고 예상하기는 어렵습니다. 이처럼 모델이 대체 뭘 하는지 이해하고 있다면 모델이 얼마나 일반화 가능한지 인사이트를 얻기가 훨씬 쉽습니다.</p>\n<p>두번째 예로, 구글의 inception 네트워크의 이미지 분류 결과를 설명해봅시다. 이 경우에는, 아래 그림에서 볼 수 있듯이 분류기는 주어진 이미지가 개구리일 확률이 가장 높다고 예측했습니다. 그 다음으로는 당구대랑 풍선을 좀 더 낮은 확률로 예측했네요.</p>\n<p><img src="https://d3ansictanv2wj.cloudfront.net/Figure-6-c8db425eefec7cff5a3cf035a40d8841.jpg" alt="LIME으로 오답의 이유 이해하기. 출처: Marco Tulio Ribeiro."></p>\n<p>LIME은 inception 모델이 주어진 이미지를 개구리라고 예측한 데에는 개구리의 얼굴이 가장 중요한 역할을 했다고 설명합니다. 그런데 당구대와 풍선은 왜 나온 것일까요? 개구리의 손과 눈은 당구공을 닮았습니다. 초록색 배경에 당구공 같이 생긴 것들이 있으니 모델이 당구대라고 생각한 것입니다. 개구리가 들고 있는 하트는 빨간색 풍선을 닮았습니다. 이것이 모델이 풍선이라고 예측한 이유입니다. 이렇듯 LIME을 통해 왜 모델이 이런 예측들을 했는지 이해할 수 있습니다.</p>\n<h1>어떻게 사용하나요?</h1>\n<p>LIME은 파이썬 패키지로 공개되어 있습니다. 이제 LIME을 설치하고 사용하는 방법을 알아보겠습니다.</p>\n<h2>설치하기</h2>\n<p>pip으로 쉽게 설치할 수 있습니다.</p>\n<pre><code data-language="python" class="lang-python">pip install lime\n\n# for python3\npip3 install lime\n</code></pre>\n<h2>예측 함수 모양 맞춰주기</h2>\n<p>LIME에 예측 모델을 넣어주기 위해서 예측 모델을 함수 형태로 만들어주어야 합니다. 예측 모델을 scikit-learn로 만들었다면 모델의 <code data-backticks="1">predict_proba</code> 함수를 쓰는 것으로 충분합니다. 만약 예측 모델이 TensorFlow 모델이라면 다음과 같이 함수로 만들어줄 수 있습니다. 이 함수의 입력은 원본 데이터이고 출력은 각 카테고리의 확률입니다.</p>\n<pre><code data-language="python" class="lang-python">def predict_fn(images):\n	return session.run(probabilities, feed_dict={processed_images: images})\n</code></pre>\n<h2>Explainer 만들기</h2>\n<p>데이터의 형식에 따라 만들어줘야 하는 Explainer가 다릅니다. 각 경우를 나눠서 설명드리겠습니다.</p>\n<h3>이미지의 경우</h3>\n<p>다음과 같은 이미지에 대한 이미지 분류 모델의 예측값을 설명해봅시다.</p>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7UHLG85P/dog_and_cat.png?pub_secret=0b718fa371" alt="개와 고양이 사진"></p>\n<pre><code># 예측 결과\n286 Egyptian cat 0.000892741\n242 EntleBucher 0.0163564\n239 Greater Swiss Mountain dog 0.0171362\n241 Appenzeller 0.0393639\n240 Bernese mountain dog 0.829222\n</code></pre>\n<p>먼저, lime 패키지에서 이미지 모듈을 불러옵니다.</p>\n<pre><code data-language="pyrhon" class="lang-pyrhon">from lime.lime_image import LimeImageExplainer\n</code></pre>\n<p>이미지 모듈에서 Explainer를 생성합니다.</p>\n<pre><code data-language="python" class="lang-python"> explainer=LimeImageExplainer()\n</code></pre>\n<p>특정 이미지에 대한 설명을 생성합니다.</p>\n<pre><code data-language="python" class="lang-python"># image : 설명하고자 하는 이미지입니다.\n# predict_fn : 위에서 만든 예측 모델 함수입니다.\n# hide_color=0 : superpixel을 회색으로 가리겠다는 뜻입니다. 이 인자가 없을 경우 픽셀들 색깔의 평균으로 가려집니다.\n# 아래 코드를 실행시킬 때 시간이 다소 걸릴 수 있습니다. explanation=explainer.explain_instance(image, predict_fn, hide_color=0, top_labels=5, num_samples=1000)\n</code></pre>\n<p>이제 만들어진 설명을 이미지로 나타내봅시다.</p>\n<pre><code data-language="python" class="lang-python">from skimage.segmentation import mark_boundaries\n\ntemp, mask=explanation.get_image_and_mask(240, positive_only=True, num_features=5, hide_rest=True)\nplt.imshow(mark_boundaries(temp / 2 + 0.5, mask))\n</code></pre>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7UHLL2CR/dog_explained_1.png?pub_secret=d32467efb4" alt="모델이 사진을 개로 분류하는 데 가장 중요했던 요소만 뽑아볼 수 있습니다."></p>\n<p>이미지의 나머지 부분도 같이 보고 싶다면 다음과 같이 할 수 있습니다.</p>\n<pre><code data-language="python" class="lang-python">temp, mask=explanation.get_image_and_mask(240, positive_only=True, num_features=5, hide_rest=False)\nplt.imshow(mark_boundaries(temp / 2 + 0.5, mask))\n</code></pre>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7V15RCJX/dog_explained_2.png?pub_secret=bcac1a942a" alt="사진에서 노란색 선으로 표시된 영역이 개로 예측하는 데 가장 중요했던 부분입니다."></p>\n<p>어떤 부분이 개로 예측할 확률을 높이는 부분이었고 어떤 부분이 확률을 낮추는 부분이었는지 보기 위해서는 다음 코드를 씁니다.</p>\n<pre><code data-language="python" class="lang-python">temp, mask=explanation.get_image_and_mask(240, positive_only=False, num_features=10, hide_rest=False)\nplt.imshow(mark_boundaries(temp / 2 + 0.5, mask))\n</code></pre>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7V7K1V6H/dog_explained_3.png?pub_secret=d51a563d02" alt="사진을 개로 예측하는 확률을 높인 부분(초록색)과 낮춘 부분(빨간색)을 각각 볼 수 있습니다."></p>\n<blockquote>\n<p>설명을 위해서 코드의 많은 부분을 생략했습니다. Tensorflow에서 slim의 inception v3 모델을 LIME으로 설명하는 전체 코드는 <a href="https://marcotcr.github.io/lime/tutorials/Tutorial%20-%20images.html">여기</a>에서 볼 수 있습니다.</p>\n</blockquote>\n<h3>텍스트의 경우</h3>\n<p>lime 패키지에서 텍스트 모듈을 불러옵니다.</p>\n<pre><code data-language="python" class="lang-python">from lime.lime_text import LimeTextExplainer\n</code></pre>\n<p>텍스트 모듈에서 Explainer를 생성합니다.</p>\n<pre><code data-language="python" class="lang-python"># class_names : 각 카테고리들의 이름을 줄 수 있습니다. (없는 경우 0, 1 같은 index로 보여집니다.) explainer=LimeTextExplainer(class_names=class_names)\n</code></pre>\n<p>특정 텍스트에 대한 설명을 생성합니다.</p>\n<pre><code data-language="python" class="lang-python"># text : 설명하고자 하는 텍스트입니다.\n# predict_fn : 예측 모델 함수입니다. explanation=explainer.explain_instance(text, predict_fn, num_features=6)\n</code></pre>\n<p>이제 만들어진 설명을 확인해봅시다. LIME은 시각적으로 한 눈에 들어오도록 설명을 html로 생성하는 기능도 갖고 있습니다. 그리고 이 설명을 Jupyter Notebook에서 보기도 쉽게 되어 있습니다.</p>\n<pre><code data-language="python" class="lang-python">explanation.show_in_notebook( text=True)\n</code></pre>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7V4WD8P6/screenshot.png?pub_secret=afa0fc19b1" alt="텍스트에 대한 예측을 LIME으로 설명할 수 있습니다."></p>\n<blockquote>\n<p>전체 코드는 <a href="https://marcotcr.github.io/lime/tutorials/Lime%20-%20basic%20usage%2C%20two%20class%20case.html">여기</a>에서 볼 수 있습니다.</p>\n</blockquote>\n<p>이밖에도 <a href="https://marcotcr.github.io/lime/tutorials/Tutorial%20-%20continuous%20and%20categorical%20features.html">수치형 테이블 데이터에 대해서</a>, 또는 <a href="https://marcotcr.github.io/lime/tutorials/Using%2Blime%2Bfor%2Bregression.html">회귀 문제에 대해서</a>도 LIME을 적용할 수 있습니다.</p>\n<h1>어떻게 작동하나요?</h1>\n<p>LIME의 핵심 아이디어는 이것입니다.</p>\n<p><strong>입력값을 조금 바꿨을 때 모델의 예측값이 크게 바뀌면, 그 변수는 중요한 변수이다.</strong></p>\n<p>이미지 분류 문제에 LIME을 적용하는 예시를 들어보겠습니다. 먼저 그림을 superpixel이라고 불리는 해석 가능한 요소로 쪼개는 전처리 과정을 거칩니다.</p>\n<p><img src="https://d3ansictanv2wj.cloudfront.net/figure3-2cea505fe733a4713eeff3b90f696507.jpg" alt="이미지를 해석 가능한 요소로 쪼개기. 출처: Marco Tulio Ribeiro, Pixabay."></p>\n<p>그리고 나서 변수에 약간의 변화(perturbation)를 줍니다. 이미지의 경우에는 superpixel 몇개를 찝어서 회색으로 가립니다. 그리고 모델에 넣고 예측값을 구합니다. 만약 예측값이 많이 변하면 가렸던 부분이 중요했다는 것을 알 수 있겠죠. 반대로 예측값이 많이 달라지지 않았으면 가렸던 부분이 별로 중요하지 않았나보다, 라고 알게 되겠죠.</p>\n<p><img src="https://d3ansictanv2wj.cloudfront.net/figure4-99d9ea184dd35876e0dbae81f6fce038.jpg" alt="LIME으로 예측 설명하기. 출처: Marco Tulio Ribeiro."></p>\n<p>위 예시에서 원본 사진은 0.54 확률로 개구리로 예측됩니다. 이 사진을 첫번째 변형(perturbed instance)처럼 가렸더니 개구리일 확률이 0.85로 높아졌습니다. 사진에서 남은 부분이 개구리라고 예측하는 데 중요한 요소라는 것을 알 수 있죠. 두번째 변형처럼 가렸더니 개구리일 확률이 0.00001로 매우 낮아졌습니다. 그러면 방금 가린 부분이 개구리라고 판단하는 데 중요한 요소였다는 것을 알 수 있겠죠. 세번째 변형처럼 가리면 개구리일 확률이 별로 변하지 않습니다. 이때 가린 부분은 개구리라고 판단하는 데 별로 중요하지 않았다는 것을 알 수 있죠. 이렇게 여러번의 과정을 거친 뒤 결국 어떤 superpixel이 개구리라고 판단하는 데 가장 중요했는지 찾는 것이 LIME의 핵심입니다.</p>\n<p>이 방법은 두가지 점에서 장점이 있습니다. 첫째, 이 방법은 어떤 모델이든 상관 없이(model-agnostic) 적용할 수 있는 방법입니다. 둘째, 이 방법은 해석가능성의 측면에서 굉장한 이점을 갖고 있는데요, 입력은 모델 내부의 변수보다 인간이 이해하기 훨씬 쉽기 때문입니다. 예를 들어 모델이 내부적으로는 word embedding 같이 복잡한 속성을 쓰고 있더라도, 모델의 입력인 단어는 인간이 이해할 수 있는 방식으로 살짝 바꿔보기가 훨씬 쉽죠.</p>\n<p>LIME은 한번에 하나의 데이터에 대해서만 모델의 예측 결과를 설명합니다. 그리고 그 데이터를 예측하는 데 중요했던 변수만을 뽑아줍니다. 예를 들어, 어떤 환자가 독감이 걸렸다고 진단할 때 중요했던 증상들은 아마도 위염을 가진 환자를 진단할 때 중요하지 않을 수도 있겠죠.</p>\n<p>수학적으로 LIME이 블랙 박스 모델을 설명하는 방법은 모델을 해석 가능한 간단한 선형 모델로 근사하는 것입니다. 복잡한 모델 전체를 근사하는 것은 어렵지만, 우리가 설명하고 싶은 예측 주변에 대해서만 간단한 모델로 근사하는 것은 매우 쉽습니다.</p>\n<p>이해를 돕기 위해서 아래 그림처럼 어떤 모델의 변수가 두 개만 있고 데이터를 두 변수를 이용해 파란색과 붉은색 두 클래스로 분류한다고 생각해 봅시다. 모델의 decision boundary(빨간색과 파란색이 나뉘는 경계)는 매우 복잡합니다. 하지만 아래 그림처럼 우리가 설명하려는 데이터(굵은 빨간 십자가)의 살짝 옆에만 본다면, 그 주변만 근사한 선형 함수를 만들어낼 수 있습니다. 이 선형 함수는 전체적으로 보면 원래 모델과는 전혀 다르지만, 특정 예시 주위에서는 원래 모델과 비슷하게 행동합니다. 이렇게 만든 간단한 선형 함수를 보면 이 예시에서 어떤 변수가 중요한 역할을 하는지 알 수 있죠. 이것이 LIME에 Local이라는 말이 붙는 이유입니다.</p>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F6ENRVASX/lime.png?pub_secret=197fda2c73" alt="LIME이 선형 근사 함수를 만드는 방법. 출처: Marco Tulio Ribeiro."></p>\n<p>좀 더 구체적으로 들어가면 선형 함수로의 근사는 다음과 같은 방법으로 구현됩니다. 먼저 원본 데이터를 살짝 변형시켜서(이미지의 일부를 가리거나 단어를 제거해서) 데이터셋을 만듭니다. 각각의 변형된 데이터를 모델에 넣어서 예측값을 구합니다. 그 다음 이 데이터셋에 간단한 선형 모델을 학습시키는데, 이 때 변형된 데이터와 원본 데이터 간의 유사성만큼 가중치를 줍니다. 이렇게 하면 주로 원본 데이터와 가까운 영역에서 블랙 박스 모델과 비슷하게 행동하는 선형 모델을 만들 수 있습니다. 이 방식으로 LIME은 원본 데이터에 대한 예측의 설명을 만들어냅니다.</p>\n<h1>마치며</h1>\n<p>블랙 박스 모델을 열어 그 속을 들여다볼 수 있다는 것은 큰 이점이죠. 이 점에서 LIME은 머신 러닝을 사용하는 사람들에게 매우 유용한 도구입니다.</p>\n<p>저는 LIME을 사용하다가 한글이 깨지는 문제를 발견하고 이를 해결하는 pull request로 LIME의 contributor가 되었습니다. 이처럼 LIME은 빠르게 발전하는 모델이고 지금도 기능 추가와 개선이 꾸준히 일어나는 프로젝트입니다.</p>\n<p><img src="https://files.slack.com/files-pri/T25783BPY-F7W5Y815M/screenshot.png?pub_secret=f2823100e3" alt="pull request가 merge된 모습."></p>\n<p>지금까지 거의 모든 머신 러닝 프로젝트는 "데이터 수집 -> 전처리 -> 모델링 -> 결론"으로 끝났습니다. 앞으로는 여기에서 끝나지 않고 LIME과 같은 도구를 이용해 모델을 설명하는 단계가 필수적이 될 것이라고 생각합니다.</p>\n<p>LIME을 요약하는 3분짜리 짧은 동영상으로 이 글을 마치겠습니다.</p>\n<p><a href="http://www.youtube.com/watch?v=hUnRCxnydCc" title="\'Why Should I Trust You?\': Explaining the Predictions of Any Classifier">![LIME](http://img.youtube.com/vi/hUnRCxnydCc/0.jpg)</a></p>\n<h1>참고 자료</h1>\n<p>이 글은 다음 자료들을 바탕으로 쓰여졌습니다.</p>\n<ul>\n<li>논문 : <a href="https://arxiv.org/abs/1602.04938">"Why Should I Trust You?": Explaining the Predictions of Any Classifier</a></li>\n<li>Article : <a href="https://www.oreilly.com/learning/introduction-to-local-interpretable-model-agnostic-explanations-lime">Introduction to Local Interpretable Model-Agnostic Explanations (LIME)</a></li>\n<li><a href="https://github.com/marcotcr/lime">Github</a></li>\n</ul>\n', 'Java', 3, '2019-08-06 19:54:33'),
(5, 1, 'html로 등록', '/images/default_post.png', '<pre><code data-language="js" class="lang-js">console.log(\'안뇽!\');\n</code></pre>\n<p><img src="http://localhost:3002/uploads/20190725/Yq9GV0s0OTpD5jt2u261DV187II5.png" alt="tui-editor.png"></p>\n<p>😁</p>\n', 'JAVA', 2, '2019-08-07 20:06:38'),
(6, 1, 'dd', '/images/default_post.png', '<h1>안녕하세요?</h1>\n<p>&#x1f604</p>\n', '', 1, '2019-08-10 20:02:51');
/*!40000 ALTER TABLE `post_board` ENABLE KEYS */;

DROP TABLE IF EXISTS `post_tag`;
CREATE TABLE
IF NOT EXISTS `post_tag`
(
  `post_idx` int
(11) NOT NULL,
  `tag` varchar
(100) NOT NULL,
  KEY `FK_feed_tag_feed_board`
(`post_idx`),
  KEY `tag`
(`tag`),
  CONSTRAINT `FK_feed_tag_feed_board` FOREIGN KEY
(`post_idx`) REFERENCES `post_board`
(`idx`) ON
DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `post_tag`;
/*!40000 ALTER TABLE `post_tag` DISABLE KEYS */;
INSERT INTO `post_tag` (`
post_idx`,
`tag
`) VALUES
(3, 'java'),
(3, 'javascript'),
(3, '개발'),
(4, 'java'),
(1, 'java'),
(1, 'javascript'),
(5, 'JAVA');
/*!40000 ALTER TABLE `post_tag` ENABLE KEYS */;

DROP TABLE IF EXISTS `project`;
CREATE TABLE
IF NOT EXISTS `project`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL DEFAULT '0',
  `title` varchar
(200) NOT NULL,
  `description` varchar
(500) NOT NULL,
  `important` int
(11) NOT NULL,
  `progress` int
(11) NOT NULL,
  `start` datetime NOT NULL,
  `
end` datetime NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`),
  KEY `start`
(`start`),
  KEY `
end`
(`
end`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `project`;
/*!40000 ALTER TABLE `project` DISABLE KEYS */;
/*!40000 ALTER TABLE `project` ENABLE KEYS */;

DROP TABLE IF EXISTS `project_board`;
CREATE TABLE
IF NOT EXISTS `project_board`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL,
  `category` varchar
(100) NOT NULL DEFAULT '',
  `title` varchar
(200) NOT NULL DEFAULT '',
  `description` varchar
(200) NOT NULL DEFAULT '',
  `thumbnail` varchar
(500) NOT NULL DEFAULT '',
  `contents` text NOT NULL,
  `hit` int
(11) NOT NULL DEFAULT '0',
  `start` datetime NOT NULL,
  `
end` datetime DEFAULT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `project_board`;
/*!40000 ALTER TABLE `project_board` DISABLE KEYS */;
INSERT INTO `project_board` (`
idx`,
`member_idx
`, `category`, `title`, `description`, `thumbnail`, `contents`, `hit`, `start`, `
end`, `reg_date`) VALUES
(1, 1, '협업 프로젝트', '뭔가했음', 'ㅇㅇㅇ', '', '<p>ㅇㅇ</p>', 0, '2019-07-02 00:00:00', '2019-07-10 00:00:00', '2019-07-11 13:55:39'),
(2, 1, '협업 프로젝트', '다시 하나 등록', 'ㅇㅇㅇㅇ', '', '<p>ㅇㅇ</p>', 0, '2019-07-01 00:00:00', NULL, '2019-07-11 13:59:23'),
(3, 1, '협업 프로젝트', '다시테스트', 'ㅇㅇ', 'http://localhost:3001/uploads/20190711/bn_0N089ulTbW711G6PN0Qr1b522Oey.gif', '<p>ㅇㅇ</p>', 0, '2019-07-01 00:00:00', NULL, '2019-07-11 14:01:04'),
(4, 1, '협업 프로젝트', '하나더 등록', 'ㅇㅇㅇ', 'http://localhost:3001/uploads/20190711/project_yk0a1e1z9P2LJQ71TQVER992B0F2.png', '<p>ㅎㅎ</p>', 0, '2019-07-12 00:00:00', NULL, '2019-07-11 14:04:17');
/*!40000 ALTER TABLE `project_board` ENABLE KEYS */;

DROP TABLE IF EXISTS `project_member`;
CREATE TABLE
IF NOT EXISTS `project_member`
(
  `project_idx` int
(11) NOT NULL,
  `member_idx` int
(11) NOT NULL,
  KEY `FK_project_member_member`
(`member_idx`),
  KEY `FK_project_member_project`
(`project_idx`),
  CONSTRAINT `FK_project_member_member` FOREIGN KEY
(`member_idx`) REFERENCES `member`
(`idx`),
  CONSTRAINT `FK_project_member_project` FOREIGN KEY
(`project_idx`) REFERENCES `project`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `project_member`;
/*!40000 ALTER TABLE `project_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `project_member` ENABLE KEYS */;

DROP TABLE IF EXISTS `query_stat`;
CREATE TABLE
IF NOT EXISTS `query_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `query` varchar
(200) NOT NULL,
  `rcount` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `query_stat`;
/*!40000 ALTER TABLE `query_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `query_stat` ENABLE KEYS */;

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE
IF NOT EXISTS `schedule`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL DEFAULT '0',
  `title` varchar
(200) NOT NULL,
  `location` varchar
(500) NOT NULL,
  `description` varchar
(500) NOT NULL,
  `color` varchar
(10) NOT NULL,
  `clear` tinyint
(1) NOT NULL DEFAULT '0',
  `start` datetime NOT NULL,
  `
end` datetime NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`),
  KEY `FK_schedule_member`
(`member_idx`),
  KEY `start`
(`start`),
  KEY `
end`
(`
end`),
  CONSTRAINT `FK_schedule_member` FOREIGN KEY
(`member_idx`) REFERENCES `member`
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `schedule`;
/*!40000 ALTER TABLE `schedule` DISABLE KEYS */;
INSERT INTO `schedule` (`
idx`,
`member_idx
`, `title`, `location`, `description`, `color`, `clear`, `start`, `
end`, `reg_date`) VALUES
(1, 1, '등록테스트', '', 'ㅇㅇ', '#8BC163', 0, '2019-07-17 00:00:00', '2019-07-17 23:59:00', '2019-07-18 16:58:58');
/*!40000 ALTER TABLE `schedule` ENABLE KEYS */;

DROP TABLE IF EXISTS `schedule_member`;
CREATE TABLE
IF NOT EXISTS `schedule_member`
(
  `schedule_idx` int
(11) NOT NULL,
  `member_idx` int
(11) NOT NULL,
  KEY `FK_schedule_member_schedule`
(`schedule_idx`),
  KEY `FK_schedule_member_member`
(`member_idx`),
  CONSTRAINT `FK_schedule_member_member` FOREIGN KEY
(`member_idx`) REFERENCES `member`
(`idx`),
  CONSTRAINT `FK_schedule_member_schedule` FOREIGN KEY
(`schedule_idx`) REFERENCES `schedule`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `schedule_member`;
/*!40000 ALTER TABLE `schedule_member` DISABLE KEYS */;
/*!40000 ALTER TABLE `schedule_member` ENABLE KEYS */;

DROP TABLE IF EXISTS `series_board`;
CREATE TABLE
IF NOT EXISTS `series_board`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL,
  `title` varchar
(100) NOT NULL,
  `thumbnail` varchar
(200) NOT NULL,
  `contents` mediumtext NOT NULL,
  `hit` int
(11) NOT NULL DEFAULT '0',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELETE FROM `series_board`;
/*!40000 ALTER TABLE `series_board` DISABLE KEYS */;
INSERT INTO `series_board` (`
idx`,
`member_idx
`, `title`, `thumbnail`, `contents`, `hit`, `reg_date`) VALUES
(2, 1, '포스트를 엮어봅시다', '/images/default_series.png', '<h1>그러게 잘해봅니다!</h1>\n<h2>내용을 좀더 길게 써야 뭔가 나오지 않을까요</h2>\n<h2>요즘은 이런저런 이야기가 많아서 쓸말이 많기는 한데요 ㅋㅋ 아나 이거쓴느것도 쉽지않네요</h2>\n<p>자바스크립트는 엄청 재미있습니다 !</p>\n<p>그러게 잘해봅니다! 내용을 좀더 길게 써야 뭔가 나오지 않을까요 요즘은 이런저런 이야기가 많아서 쓸말이 많기는 한데요 ㅋㅋ 아나 이거쓴느것도 쉽지않네요 자바스크립트는 엄청 재미있습니다 !</p>\n', 1, '2019-08-09 18:02:50'),
(3, 1, '하나더 등록', '/images/default_series.png', '<p>ㅇㅇ</p>\n', 2, '2019-08-09 19:08:49');
/*!40000 ALTER TABLE `series_board` ENABLE KEYS */;

DROP TABLE IF EXISTS `series_post`;
CREATE TABLE
IF NOT EXISTS `series_post`
(
  `series_idx` int
(11) NOT NULL,
  `post_idx` int
(11) NOT NULL,
  `odr` int
(11) NOT NULL,
  KEY `FK_series_post_post_board`
(`post_idx`),
  KEY `FK_series_post_series_board`
(`series_idx`),
  CONSTRAINT `FK_series_post_post_board` FOREIGN KEY
(`post_idx`) REFERENCES `post_board`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE,
  CONSTRAINT `FK_series_post_series_board` FOREIGN KEY
(`series_idx`) REFERENCES `series_board`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `series_post`;
/*!40000 ALTER TABLE `series_post` DISABLE KEYS */;
INSERT INTO `series_post` (`
series_idx`,
`post_idx
`, `odr`) VALUES
(3, 4, 1),
(3, 5, 2),
(3, 1, 3),
(2, 3, 1),
(2, 4, 2);
/*!40000 ALTER TABLE `series_post` ENABLE KEYS */;

DROP TABLE IF EXISTS `session_log`;
CREATE TABLE
IF NOT EXISTS `session_log`
(
  `device` varchar
(50) NOT NULL DEFAULT '',
  `id` varchar
(50) NOT NULL DEFAULT '',
  `domain` varchar
(100) NOT NULL DEFAULT '',
  `ip` varchar
(50) NOT NULL DEFAULT '',
  `page` varchar
(100) NOT NULL DEFAULT '',
  `query` varchar
(500) NOT NULL DEFAULT '',
  `referer` varchar
(500) NOT NULL DEFAULT '',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `reg_ymd` varchar
(10) NOT NULL DEFAULT '',
  `reg_hh` varchar
(10) NOT NULL DEFAULT '',
  `reg_mm` varchar
(10) NOT NULL DEFAULT '',
  `reg_dow` int
(11) NOT NULL DEFAULT '0',
  KEY `reg_ymd_reg_hh_reg_mm`
(`reg_ymd`,`reg_hh`,`reg_mm`),
  KEY `reg_date`
(`reg_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `session_log`;
/*!40000 ALTER TABLE `session_log` DISABLE KEYS */;
INSERT INTO `session_log` (`
device`,
`id
`, `domain`, `ip`, `page`, `query`, `referer`, `reg_date`, `reg_ymd`, `reg_hh`, `reg_mm`, `reg_dow`) VALUES
('Chrome', 'ChUOaTypv5MXExzuzkiYy8_kxls7r2On', '', '0.0.0.0', '/', '', '', '2019-07-11 11:10:13', '20190711', '11', '10', 4),
('Chrome', 'VvBou0cGttoXhUOTNc-_aBRYzkegG-42', '', '0.0.0.0', '/', '', '', '2019-07-12 12:34:47', '20190712', '12', '34', 5),
('Chrome', 'QOM660DcXVBZ8T77ZF74olTu9A4MCnaX', '', '0.0.0.0', '/', '', '', '2019-07-17 17:54:34', '20190717', '17', '54', 3),
('Chrome', '7yyuoOCWJwU8DsLOHD6Z0H3XAAPsxH69', '', '0.0.0.0', '/', '', '', '2019-07-18 16:53:05', '20190718', '16', '53', 4),
('Chrome', 'F2m-r2LNsJOlvXlAHK01zDqwBMWwzMe_', '', '0.0.0.0', '/', '', '', '2019-07-19 11:19:31', '20190719', '11', '19', 5),
('Chrome', 'Ry96LO890XSxjdRcqMGQVJ2Ge3iiEkJY', '', '0.0.0.0', '/', '', '', '2019-07-19 15:37:01', '20190719', '15', '37', 5),
('Chrome', 'ZqGhPloK1kuFs5ga0b4bb7ewj8CTrobj', '', '0.0.0.0', '/', '', '', '2019-07-19 17:56:43', '20190719', '17', '56', 5),
('Chrome', 'N0XkREpdwDJopGQBr4suICSbIVFVMuCQ', '', '0.0.0.0', '/', '', '', '2019-07-26 10:54:39', '20190726', '10', '54', 5),
('Chrome', 'wQNtVQ6xQ2Wr_JTKrH1vEtfM_XzhVuUH', '', '0.0.0.0', '/', '', '', '2019-07-29 10:14:41', '20190729', '10', '14', 1),
('Chrome', 'GuDtSsPPWfnfdPPI4fFSSfNIc_fRoojt', '', '0.0.0.0', '/', '', '', '2019-07-29 11:14:46', '20190729', '11', '14', 1),
('Chrome', 'idxhnS7ych_hr9xh674J1ii8Wr_3zOB6', '', '0.0.0.0', '/', '', '', '2019-07-29 12:15:29', '20190729', '12', '15', 1),
('Chrome', 'r9cH2DXamdxbeydHGx30IwFHJPB_3oI9', '', '0.0.0.0', '/', '', '', '2019-07-29 14:11:58', '20190729', '14', '11', 1),
('Chrome', 'X2GHvW0FEZNfZRE0Ksx_8TrB5l5w5ArR', '', '0.0.0.0', '/', '', '', '2019-07-29 19:47:04', '20190729', '19', '47', 1),
('Chrome', 'LF0GYSNNPcmfNp8HuEKdiUno4AT9raA4', '', '0.0.0.0', '/', '', '', '2019-07-30 11:00:50', '20190730', '11', '00', 2),
('Chrome', 'BW8ZaG9N_s9BH38ayQom-4-kR8wmvR7R', '', '0.0.0.0', '/', '', '', '2019-07-30 12:01:08', '20190730', '12', '01', 2),
('Chrome', 'zJrkubv37I_8cKrSmhAFgkgY_IEIvkqe', '', '0.0.0.0', '/', '', '', '2019-07-30 13:58:17', '20190730', '13', '58', 2),
('Chrome', 'IPB3aT8FVBvZjhPJZW0PGcOzhHwKnzG3', '', '0.0.0.0', '/', '', '', '2019-07-31 14:10:44', '20190731', '14', '10', 3),
('Chrome', 'F31q8_ikefbUSEjBbfBGseQalJY2OQCK', '', '0.0.0.0', '/', '', '', '2019-08-01 10:15:01', '20190801', '10', '15', 4),
('Chrome', 'Ccy2hnytvrM-Elu2hJNgvI-Im1eNHV5M', '', '0.0.0.0', '/about', '', '', '2019-08-01 13:22:23', '20190801', '13', '22', 4),
('MSIE', '4aja9UUc5cHcMt8c2-v9n36SFDWUJNGC', '', '0.0.0.0', '/project', '', '', '2019-08-01 15:48:55', '20190801', '15', '48', 4),
('Chrome', 'hn35S9y9CDx_k-gmbsTTmwXYjNxDy2zv', '', '0.0.0.0', '/', '', '', '2019-08-02 15:00:36', '20190802', '15', '00', 5),
('Chrome', 'ECcoJ3jkvQ4Y4rZPE6DXzMqsotW0k-eg', '', '0.0.0.0', '/project', '', '', '2019-08-02 18:22:06', '20190802', '18', '22', 5),
('Chrome', 'zMvyeOMMILMy7-4f9p4Qn3I9ZLlRi65C', '', '0.0.0.0', '/', '', '', '2019-08-03 14:43:23', '20190803', '14', '43', 6),
('Chrome', 'srCEMMrFIYIF-kmWMuiZ6dCSsHR7fWs7', '', '0.0.0.0', '/', '', '', '2019-08-05 14:43:36', '20190805', '14', '43', 1),
('Chrome', 'BgsT_25xyk_5t9nPOFFcrq2zFV_86oP6', '', '0.0.0.0', '/project', '', '', '2019-08-05 19:57:53', '20190805', '19', '57', 1),
('Chrome', '05StDlipXGzzjjLCAvHynw_0si4nrg_r', '', '0.0.0.0', '/', '', '', '2019-08-06 09:24:57', '20190806', '09', '24', 2),
('Chrome', 'JoXtBuejFgiZhvzyr-pr-YAsXiZFKbBf', '', '0.0.0.0', '/blog/post/4', '', '', '2019-08-06 14:30:54', '20190806', '14', '30', 2),
('Chrome', 'bMFwkKPF8cW1u_WzcMKn2iBOgYuuoFYU', '', '0.0.0.0', '/blog/post/4', '', '', '2019-08-06 17:57:11', '20190806', '17', '57', 2),
('Chrome', 'utEX2F-vKXwAe8DDqn1iMB0FgY5OIomp', '', '0.0.0.0', '/', '', '', '2019-08-07 10:29:17', '20190807', '10', '29', 3),
('Chrome', 'chxA5Qx5YKhQsHB8SvrHkDJ1w6LqsiTE', '', '0.0.0.0', '/blog/post/4', '', '', '2019-08-07 11:15:08', '20190807', '11', '15', 3),
('Chrome', 'RCiAwMQKn3_nFS-Kp6EA5ihQNjrLkSsn', '', '0.0.0.0', '/', '', '', '2019-08-07 13:39:41', '20190807', '13', '39', 3),
('MSIE', 'OJMaR99HgzKzONpr2EuKRVjkkPy1l-lx', '', '0.0.0.0', '/', '', '', '2019-08-07 20:21:47', '20190807', '20', '21', 3),
('Chrome', 'c6DgZt9Hxv8xUaoIl6WCSKCESjEuqVnw', '', '0.0.0.0', '/', '', '', '2019-08-08 13:09:47', '20190808', '13', '09', 4),
('Chrome', 'y659y2_-gXa1Kt0q_SYMGjb7oDZplr7W', '', '0.0.0.0', '/', '', '', '2019-08-09 11:28:21', '20190809', '11', '28', 5),
('MSIE', 'CfCgH9FozeSfAaGFjcce74_hAEUZiBvn', '', '0.0.0.0', '/blog/post', '', '', '2019-08-09 11:56:01', '20190809', '11', '56', 5),
('Chrome', '9MOpOwxvshywgRbyTwZ3QMNtzO5mLqxL', '', '0.0.0.0', '/blog/post/1', '', '', '2019-08-09 11:58:30', '20190809', '11', '58', 5),
('Chrome', 'f6rl51YBRSLSJ14aks8FKv0NSQkc_TBY', '', '0.0.0.0', '/', '', '', '2019-08-09 20:45:05', '20190809', '20', '45', 5),
('MSIE', 'g8wYKUnw9e57HKTKmE-BH-gb_tOeu9u0', '', '0.0.0.0', '/blog/post/4', '', '', '2019-08-09 22:02:05', '20190809', '22', '02', 5),
('Chrome', 'FZoRNgCbLhe0nVyqAxfoC1zqMNzqyl-D', '', '0.0.0.0', '/', '', '', '2019-08-10 12:23:30', '20190810', '12', '23', 6),
('Chrome', 'KBcgzr5w6WJVr6za_nUvn7iizJPVTxmD', '', '0.0.0.0', '/blog/series', '', '', '2019-08-10 15:19:25', '20190810', '15', '19', 6);
/*!40000 ALTER TABLE `session_log` ENABLE KEYS */;

DROP TABLE IF EXISTS `task`;
CREATE TABLE
IF NOT EXISTS `task`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `project_idx` int
(11) NOT NULL DEFAULT '0',
  `member_idx` int
(11) NOT NULL DEFAULT '0',
  `category` varchar
(200) NOT NULL,
  `title` varchar
(200) NOT NULL,
  `contents` text NOT NULL,
  `progress` int
(11) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`),
  KEY `FK_task_project`
(`project_idx`),
  KEY `FK_task_member`
(`member_idx`),
  KEY `category`
(`category`),
  CONSTRAINT `FK_task_member` FOREIGN KEY
(`member_idx`) REFERENCES `member`
(`idx`),
  CONSTRAINT `FK_task_project` FOREIGN KEY
(`project_idx`) REFERENCES `project`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `task`;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
/*!40000 ALTER TABLE `task` ENABLE KEYS */;

DROP TABLE IF EXISTS `upload`;
CREATE TABLE
IF NOT EXISTS `upload`
(
  `idx` int
(11) NOT NULL AUTO_INCREMENT,
  `member_idx` int
(11) NOT NULL DEFAULT '0',
  `mimetype` varchar
(200) NOT NULL DEFAULT '',
  `ext` varchar
(50) NOT NULL DEFAULT '',
  `name` varchar
(200) NOT NULL DEFAULT '',
  `size` int
(11) NOT NULL DEFAULT '0',
  `src` varchar
(300) NOT NULL DEFAULT '',
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY
(`idx`),
  KEY `reg_date`
(`reg_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `upload`;
/*!40000 ALTER TABLE `upload` DISABLE KEYS */;
INSERT INTO `upload` (`
idx`,
`member_idx
`, `mimetype`, `ext`, `name`, `size`, `src`, `reg_date`) VALUES
(1, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3000/uploads/20190711/bn_71s90qwh02kM1V9oBEm21fmm47j9.gif', '2019-07-11 13:38:58'),
(2, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3001/uploads/20190711/bn_L7W3sc097drBa2hm120F1U1PGa91.gif', '2019-07-11 13:39:15'),
(3, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3001/uploads/20190711/bn_AZW1vr2WUNgt0lB1qz15lR0gz79l.gif', '2019-07-11 13:53:31'),
(4, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3001/uploads/20190711/bn_hwYI1KiIP209fuah1jFgh170mOlL.gif', '2019-07-11 13:54:16'),
(5, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3001/uploads/20190711/bn_2C3GdV0K0vxO91Gee0TwKlF1jN71.gif', '2019-07-11 13:59:21'),
(6, 1, 'image/gif', 'gif', 'bn_moon.gif', 4059, 'http://localhost:3001/uploads/20190711/bn_0N089ulTbW711G6PN0Qr1b522Oey.gif', '2019-07-11 14:00:55'),
(7, 1, 'image/png', 'png', 'project_moon-transparent-artsy-2-transparent.png', 1209, 'http://localhost:3001/uploads/20190711/project_yk0a1e1z9P2LJQ71TQVER992B0F2.png', '2019-07-11 14:04:14'),
(8, 1, 'image/jpeg', 'jpeg', '3e5d7245395643d2a6f2367fa3014a0c.jpg', 15856, 'http://localhost:3001/uploads/20190711/1of0w1VZE1409m4J2QgGe66Ml117.jpeg', '2019-07-11 14:57:28'),
(9, 1, 'image/jpeg', 'jpeg', 'aroma.jpg', 641901, 'http://localhost:3001/uploads/20190711/09s1CRp2SJZ1jbKyS7zC04fT12f1.jpeg', '2019-07-11 15:30:59'),
(10, 2, 'image/jpeg', 'jpeg', 'th_KakaoTalk_20190406_140322096.jpg', 5119, 'http://localhost:3001/uploads/20190719/th_o1a7uvvpn0T9Jn2dOPhVf9001Xf9.jpeg', '2019-07-19 17:19:15'),
(11, 2, 'image/png', 'png', 'logo.png', 7087, 'http://localhost:3001/uploads/20190719/cV10Yr9C29r0Bz127PcMccHT9gh8.png', '2019-07-19 17:19:36'),
(12, 1, 'image/png', 'png', 'b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/861qvQ42EvNHZUbRgqhG020Y7K59.png', '2019-07-25 16:32:04'),
(13, 1, 'image/jpeg', 'jpeg', 'card2.jpg', 93852, 'http://localhost:3002/uploads/20190725/4zYztgE00Qy7I2RW5NL2c9g1bC9g.jpeg', '2019-07-25 16:33:16'),
(14, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_7DsC1Ya09cY52I730eo3N1W94N2n.png', '2019-07-25 16:58:48'),
(15, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_FGVGiMbU0iF77XFK9q2750c12L1o.png', '2019-07-25 17:18:29'),
(16, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_9FWHrp11PY0a9k6ou226RMn5730d.png', '2019-07-25 17:18:47'),
(17, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_15t1VxSY92U2KZ37U8er95Z110r0.png', '2019-07-25 17:20:37'),
(18, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_7W8262MOYfEb5Q0x1dId029VCZyF.png', '2019-07-25 17:21:48'),
(19, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_M0o2G92nIY7Fi5s01imiC1yu03I0.png', '2019-07-25 17:22:18'),
(20, 1, 'image/png', 'png', 'th_b2bae6a8355bd398b71a00c884beb412_1563510586_0395.png', 120163, 'http://localhost:3002/uploads/20190725/th_sF2V0AF0qp7O832b9t3Pr0G1529t.png', '2019-07-25 18:09:51'),
(21, 1, 'image/jpeg', 'jpeg', 'card4.jpg', 125744, 'http://localhost:3002/uploads/20190725/Y7DA8du21FxAfwc0b73014h9o2a5.jpeg', '2019-07-25 19:54:00'),
(22, 1, 'image/jpeg', 'jpeg', 'th_card2.jpg', 93852, 'http://localhost:3002/uploads/20190725/th_20QLKoi2B9W0c1i5fagEWh17yRRK.jpeg', '2019-07-25 19:54:31'),
(23, 1, 'image/png', 'png', 'tui-editor.png', 10885, 'http://localhost:3002/uploads/20190725/Yq9GV0s0OTpD5jt2u261DV187II5.png', '2019-07-25 20:06:34'),
(24, 1, 'image/png', 'png', 'arrow-right.png', 237, 'http://localhost:3002/uploads/20190807/j0o089xonXM5ii90iDzL27nW17v0.png', '2019-08-07 20:01:41'),
(25, 1, 'image/jpeg', 'jpeg', 'th_card4.jpg', 125744, 'http://localhost:3002/uploads/20190810/th_ZKB2mycT01mx0X1L879he019HHyr.jpeg', '2019-08-10 22:21:47'),
(26, 1, 'image/jpeg', 'jpeg', 'th_card2.jpg', 93852, 'http://localhost:3002/uploads/20190810/th_1CP719J05Gs0BzroO8MQS2k0a1dv.jpeg', '2019-08-10 22:23:27');
/*!40000 ALTER TABLE `upload` ENABLE KEYS */;

DROP TABLE IF EXISTS `upload_board`;
CREATE TABLE
IF NOT EXISTS `upload_board`
(
  `board` varchar
(50) NOT NULL,
  `board_idx` int
(11) NOT NULL,
  `upload_idx` int
(11) NOT NULL,
  KEY `board_board_idx`
(`board`,`board_idx`),
  KEY `FK_upload_board_upload`
(`upload_idx`),
  CONSTRAINT `FK_upload_board_upload` FOREIGN KEY
(`upload_idx`) REFERENCES `upload`
(`idx`) ON
DELETE NO ACTION ON
UPDATE NO ACTION
) ENGINE=InnoDB
DEFAULT CHARSET=utf8;

DELETE FROM `upload_board`;
/*!40000 ALTER TABLE `upload_board` DISABLE KEYS */;
/*!40000 ALTER TABLE `upload_board` ENABLE KEYS */;

DROP TABLE IF EXISTS `upload_task`;
CREATE TABLE
IF NOT EXISTS `upload_task`
(
  `task_idx` int
(11) NOT NULL,
  `upload_idx` int
(11) NOT NULL,
  KEY `FK_task_board_task`
(`task_idx`),
  KEY `FK_task_board_upload`
(`upload_idx`),
  CONSTRAINT `FK_task_board_task` FOREIGN KEY
(`task_idx`) REFERENCES `task`
(`idx`) ON
DELETE CASCADE ON
UPDATE CASCADE,
  CONSTRAINT `FK_task_board_upload` FOREIGN KEY
(`upload_idx`) REFERENCES `upload`
(`idx`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `upload_task`;
/*!40000 ALTER TABLE `upload_task` DISABLE KEYS */;
/*!40000 ALTER TABLE `upload_task` ENABLE KEYS */;

DROP TABLE IF EXISTS `ym_stat`;
CREATE TABLE
IF NOT EXISTS `ym_stat`
(
  `ymd` varchar
(10) NOT NULL,
  `year` varchar
(10) NOT NULL,
  `month` varchar
(10) NOT NULL,
  `day` varchar
(10) NOT NULL,
  `rcount` int
(11) NOT NULL,
  `reg_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `ymd`
(`ymd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DELETE FROM `ym_stat`;
/*!40000 ALTER TABLE `ym_stat` DISABLE KEYS */;
/*!40000 ALTER TABLE `ym_stat` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
