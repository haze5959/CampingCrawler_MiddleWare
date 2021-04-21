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
    "reservation_open": "3개월 전",
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
    "reservation_open": "2개월 전",
  },
};

export { siteInfo };
