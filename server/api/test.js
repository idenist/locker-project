require("dotenv").config();

const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY;
const BASE_URL = "https://apis.data.go.kr/B551982/psl_v2/locker_detail_info_v2";

async function testApi() {
  if (!SERVICE_KEY) {
    console.log("실패: PUBLIC_DATA_SERVICE_KEY가 없습니다.");
    return;
  }

  const url =
    `${BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}` +
    `&pageNo=1&numOfRows=1&type=json`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      console.log("성공");
    } else {
      console.log(`실패: 상태코드 ${response.status}`);
    }
  } catch (error) {
    console.log(`실패: ${error.message}`);
  }
}

testApi();