import { CampArea } from "../models/campInfo.ts";

const siteInfo = {
  "camp_munsoo": {
    "name": "문수골 힐링캠핑장 D-2 존",
    "desc": "바로 앞에 큰 저수지가 보이는 아름다운 뷰",
    "addr": "경기 김포시 월곶면 문수산로 104-107",
    "lat": 37.74063541219178,
    "lon": 126.53530959779854,
    "area": CampArea.gyeonggi,
    "homepage_url": "https://munsugolcamping.com/",
    "reservation_url": "https://forcamper.co.kr/campgrounds/1758",
    "reservation_open": "매일 3개월 후",
  },
  "camp_tree": {
    "name": "트리캠핑장 B & C 존",
    "desc": "높은 곳에서 바다가 훤히 보이는 뷰",
    "addr": "인천 옹진군 영흥면 선재리 산13",
    "lat": 37.25661682633075,
    "lon": 126.51554736936953,
    "area": CampArea.inchoen,
    "homepage_url": "http://www.treecamping.net/",
    "reservation_url":
      "https://www.ddnayo.com/RsvSys/Calendar.aspx?id_hotel=1997",
    "reservation_open": "매일 2개월 후",
  },
  "camp_munsoosan": {
    "name": "문수산 오토캠핑장",
    "desc": "안가봤음",
    "addr": "경기도 용인시 처인구 이동읍 묵리 이원로 637",
    "lat": 37.16282198115892,
    "lon": 127.2530929982586,
    "area": CampArea.gyeonggi,
    "homepage_url": "https://cafe.naver.com/moonsusan",
    "reservation_url":
      "http://r.camperstory.com/resMain.hbb?reserve_path=RP&campseq=625",
    "reservation_open": "매주 일요일10시",
  },
  "camp_metro": {
    "name": "수도권매립지 캠핑장",
    "desc": "안가봤음",
    "addr": "인천광역시 서구 검암동 정서진로 500",
    "lat": 37.57089059817622,
    "lon": 126.65512678901418,
    "area": CampArea.inchoen,
    "homepage_url": "https://tickets.interpark.com/goods/20003504",
    "reservation_url": "https://tickets.interpark.com/goods/20003504",
    "reservation_open": "매월 15일 14시",
  },
  "camp_5emotion": {
    "name": "파이브이모션",
    "desc": "안가봤음",
    "addr": "경기도 가평군 설악면 자잠로282번길 72-123",
    "lat": 37.69904,
    "lon": 127.50237,
    "area": CampArea.gyeonggi,
    "homepage_url": "http://www.5emotion.com",
    "reservation_url": "http://www.5emotion.com/views/booking/?gn=3",
    "reservation_open": "매일 1개월 후",
  },
  "camp_5emotion_king": {
    "name": "파이브이모션 킹사이즈",
    "desc": "안가봤음",
    "addr": "경기도 가평군 설악면 자잠로282번길 72-123",
    "lat": 37.69904,
    "lon": 127.50237,
    "area": CampArea.gyeonggi,
    "homepage_url": "http://www.5emotion.com",
    "reservation_url": "http://www.5emotion.com/views/booking/?gn=3",
    "reservation_open": "매일 1개월 후",
  },

  "camp_greenway": {
    "name": "강동그린웨이 가족캠핑장",
    "desc": "안가봤음",
    "addr": "서울특별시 강동구 둔촌2동 천호대로206길 87",
    "lat": 37.53604957894551,
    "lon": 127.15405404054026,
    "area": CampArea.seoul,
    "homepage_url": "https://www.igangdong.or.kr/page/ce/ce_0201.asp",
    "reservation_url": "https://camp.xticket.kr/web/main?shopEncode=5f9422e223671b122a7f2c94f4e15c6f71cd1a49141314cf19adccb98162b5b0",
    "reservation_open": "매월 5일 10시",
  },
  "camp_noeul": {
    "name": "노을캠핑장",
    "desc": "안가봤음",
    "addr": "서울특별시 마포구 상암동 478-1",
    "lat": 37.57344547477589,
    "lon": 126.873771354034,
    "area": CampArea.seoul,
    "homepage_url": "https://tickets.interpark.com/goods/20003580",
    "reservation_url": "https://tickets.interpark.com/goods/20003580",
    "reservation_open": "매월 15일 14시",
  },
  "camp_choansan": {
    "name": "초안산 캠핑장",
    "desc": "안가봤음",
    "addr": "서울특별시 노원구 월계2동 749-1",
    "lat": 37.643147606522795,
    "lon": 127.05013725588555,
    "area": CampArea.seoul,
    "homepage_url": "https://www.seoul.go.kr/storyw/campingjang/choan.do",
    "reservation_url": "https://reservation.nowonsc.kr/leisure/camping_date?cate1=2",
    "reservation_open": "매월 9일 11시",
  },
  "camp_cheonwangsan": {
    "name": "천왕산 가족캠핑장",
    "desc": "안가봤음",
    "addr": "서울특별시 구로구 항동 산39-4",
    "lat": 37.479211990840405,
    "lon": 126.83167419636042,
    "area": CampArea.seoul,
    "homepage_url": "https://tickets.interpark.com/goods/20006668",
    "reservation_url": "https://tickets.interpark.com/goods/20006668",
    "reservation_open": "매월 6일 10시",
  },
  "camp_jungnang": {
    "name": "중랑캠핑숲",
    "desc": "안가봤음",
    "addr": "서울특별시 중랑구 망우본동 망우로87길 110",
    "lat": 37.604672575882226,
    "lon": 127.10962262704896,
    "area": CampArea.seoul,
    "homepage_url": "http://joongrangsoop.com/?skip=intro",
    "reservation_url": "https://camp.xticket.kr/web/main?shopEncode=3ca13d7e35f571dd445d29950216553a5ece8a50aa56784c7a287e2f4f438131",
    "reservation_open": "매월 5일 9시",
  },
  "camp_chungjuho_normal": {
    "name": "충주호 캠핑월드 일반",
    "desc": "안가봤음",
    "addr": "충북 충주시 동량면 호반로 696-1",
    "lat": 37.02770184190392,
    "lon": 128.04159762175996,
    "area": CampArea.chungbuk,
    "homepage_url": "http://xn--hy1bt45akrb1yhl9ax3wfrb.com",
    "reservation_url": "http://cjcampingworld.bit-plus.com/bbs/board.php?bo_table=b4x2&sca=%EC%9D%BC%EB%B0%98",
    "reservation_open": "매년",
  },
  "camp_chungjuho_single": {
    "name": "충주호 캠핑월드 단독",
    "desc": "안가봤음",
    "addr": "충북 충주시 동량면 호반로 696-1",
    "lat": 37.02770184190392,
    "lon": 128.04159762175996,
    "area": CampArea.chungbuk,
    "homepage_url": "http://xn--hy1bt45akrb1yhl9ax3wfrb.com",
    "reservation_url": "http://cjcampingworld.bit-plus.com/bbs/board.php?bo_table=b4x2&sca=%EC%9D%BC%EB%B0%98",
    "reservation_open": "매년",
  },
};

const campSiteKeys = {
  [CampArea.seoul]: <string[]> ["camp_greenway", "camp_noeul", "camp_choansan", "camp_cheonwangsan", "camp_jungnang"],
  [CampArea.gyeonggi]: ["camp_munsoo", "camp_munsoosan", "camp_5emotion", "camp_5emotion_king"],
  [CampArea.inchoen]: ["camp_tree", "camp_metro"],
  [CampArea.chungnam]: <string[]> [],
  [CampArea.chungbuk]: <string[]> ["camp_chungjuho_normal", "camp_chungjuho_single"],
  [CampArea.gangwon]: <string[]> [],
  [CampArea.etc]: <string[]> [],
};

export { campSiteKeys, siteInfo };
