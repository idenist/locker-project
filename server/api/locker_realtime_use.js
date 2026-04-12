const mysql = require("mysql2/promise");
require("dotenv").config();

const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY;
const BASE_URL = "https://apis.data.go.kr/B551982/psl_v2/locker_realtime_use_v2";
const NUM_OF_ROWS = 100;
const REQUEST_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLockerPage(pageNo) {
  const url =
    `${BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}` +
    `&pageNo=${pageNo}&numOfRows=${NUM_OF_ROWS}&type=json`;

  const response = await fetch(url);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API 요청 실패: pageNo=${pageNo}, status=${response.status}, body=${text}`
    );
  }

  const data = await response.json();
  const body = data?.response?.body || data?.body || {};

  const rawItems = body?.item || [];
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];
  const totalCount = Number(body?.totalCount || items.length || 0);

  return { items, totalCount };
}

async function fetchAllLockers() {
  let pageNo = 1;
  let totalPages = 1;
  let allItems = [];

  while (pageNo <= totalPages) {
    const { items, totalCount } = await fetchLockerPage(pageNo);

    allItems = allItems.concat(items);
    totalPages = Math.max(1, Math.ceil(totalCount / NUM_OF_ROWS));

    console.log(
      `[FETCH] page=${pageNo}/${totalPages}, items=${items.length}, totalCount=${totalCount}`
    );

    pageNo += 1;

    if (pageNo <= totalPages) {
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return allItems;
}

function normalizeItem(item, stdgCd) {
  return {
    totDt: item.totDt || null,
    stdgCd: item.stdgCd || stdgCd || null,
    stlckId: item.stlckId || null,
    usePsbltyLrgszStlckCnt: item.usePsbltyLrgszStlckCnt || null,
    usePsbltyMdmszStlckCnt: item.usePsbltyMdmszStlckCnt || null,
    usePsbltySmlszStlckCnt: item.usePsbltySmlszStlckCnt || null,
  };
}

async function upsertLockerRealtimeUse(connection, row) {
  const sql = `
    INSERT INTO locker_realtime_use (
      totDt,
      stdgCd,
      stlckId,
      usePsbltyLrgszStlckCnt,
      usePsbltyMdmszStlckCnt,
      usePsbltySmlszStlckCnt
    ) VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      totDt = VALUES(totDt),
      usePsbltyLrgszStlckCnt = VALUES(usePsbltyLrgszStlckCnt),
      usePsbltyMdmszStlckCnt = VALUES(usePsbltyMdmszStlckCnt),
      usePsbltySmlszStlckCnt = VALUES(usePsbltySmlszStlckCnt)
  `;

  const params = [
    row.totDt,
    row.stdgCd,
    row.stlckId,
    row.usePsbltyLrgszStlckCnt,
    row.usePsbltyMdmszStlckCnt,
    row.usePsbltySmlszStlckCnt,
  ];

  await connection.execute(sql, params);
}

async function saveLockers(connection, items) {
  let savedCount = 0;

  for (const item of items) {
    const row = normalizeItem(item);
    await upsertLockerRealtimeUse(connection, row);
    savedCount += 1;

    if (savedCount % 100 === 0) {
      console.log(`[SAVE] ${savedCount}개 저장 완료`);
    }
  }

  return savedCount;
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

  try {
    const items = await fetchAllLockers();

    if (!items.length) {
      console.log("저장할 데이터가 없습니다.");
      return;
    }

    console.log(`전체 ${items.length}개 조회 완료`);
    const savedCount = await saveLockers(connection, items);
    console.log(`최종 ${savedCount}개 저장 완료`);
  } catch (error) {
    console.error("[FATAL ERROR]", error.message);
  } finally {
    await connection.end();
  }
}

main();