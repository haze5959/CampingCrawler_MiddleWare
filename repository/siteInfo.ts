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
    "reservation_open": "매일 3개월 전",
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
    "reservation_open": "매일 2개월 전",
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
};

const campSiteKeys = {
  [CampArea.seoul]: <string[]> [],
  [CampArea.gyeonggi]: ["camp_munsoo", "camp_munsoosan"],
  [CampArea.inchoen]: ["camp_tree", "camp_metro"],
  [CampArea.chungnam]: <string[]> [],
  [CampArea.chungbuk]: <string[]> [],
  [CampArea.gangwon]: <string[]> [],
  [CampArea.etc]: <string[]> [],
};

export { campSiteKeys, siteInfo };
