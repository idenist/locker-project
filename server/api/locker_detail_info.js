const mysql = require("mysql2/promise");
require("dotenv").config();

const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY;
const BASE_URL = "https://apis.data.go.kr/B551982/psl_v2/locker_detail_info_v2";
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

function normalizeItem(item) {
  return {
    totCrtrYmd: item.totCrtrYmd || null,
    stdgCd: item.stdgCd || null,
    stlckId: item.stlckId || null,
    stlckDtlId: item.stlckDtlId || null,
    stlckKndNm: item.stlckKndNm || null,
    stlckNm: item.stlckNm || null,
    stlckWdthLenExpln: item.stlckWdthLenExpln || null,
    stlckDpthExpln: item.stlckDpthExpln || null,
    stlckHgtExpln: item.stlckHgtExpln || null,
    utztnCrgExpln: item.utztnCrgExpln || null,
    stlmMnsNm: item.stlmMnsNm || null,
    addCrgUnitHr: item.addCrgUnitHr || null,
    addCrgExpln: item.addCrgExpln || null,
    cntrlMthSeNm: item.cntrlMthSeNm || null,
    useMthdExpln: item.useMthdExpln || null,
    kpngLmtCmdtyExpln: item.kpngLmtCmdtyExpln || null,
  };
}

async function upsertLocker(connection, row) {
  const sql = `
    INSERT INTO locker_detail_info (
      totCrtrYmd,
      stdgCd,
      stlckId,
      stlckDtlId,
      stlckKndNm,
      stlckNm,
      stlckWdthLenExpln,
      stlckDpthExpln,
      stlckHgtExpln,
      utztnCrgExpln,
      stlmMnsNm,
      addCrgUnitHr,
      addCrgExpln,
      cntrlMthSeNm,
      useMthdExpln,
      kpngLmtCmdtyExpln
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      totCrtrYmd = VALUES(totCrtrYmd),
      stdgCd = VALUES(stdgCd),
      stlckId = VALUES(stlckId),
      stlckKndNm = VALUES(stlckKndNm),
      stlckNm = VALUES(stlckNm),
      stlckWdthLenExpln = VALUES(stlckWdthLenExpln),
      stlckDpthExpln = VALUES(stlckDpthExpln),
      stlckHgtExpln = VALUES(stlckHgtExpln),
      utztnCrgExpln = VALUES(utztnCrgExpln),
      stlmMnsNm = VALUES(stlmMnsNm),
      addCrgUnitHr = VALUES(addCrgUnitHr),
      addCrgExpln = VALUES(addCrgExpln),
      cntrlMthSeNm = VALUES(cntrlMthSeNm),
      useMthdExpln = VALUES(useMthdExpln),
      kpngLmtCmdtyExpln = VALUES(kpngLmtCmdtyExpln)
  `;

  const params = [
    row.totCrtrYmd,
    row.stdgCd,
    row.stlckId,
    row.stlckDtlId,
    row.stlckKndNm,
    row.stlckNm,
    row.stlckWdthLenExpln,
    row.stlckDpthExpln,
    row.stlckHgtExpln,
    row.utztnCrgExpln,
    row.stlmMnsNm,
    row.addCrgUnitHr,
    row.addCrgExpln,
    row.cntrlMthSeNm,
    row.useMthdExpln,
    row.kpngLmtCmdtyExpln,
  ];

  await connection.execute(sql, params);
}

async function saveLockers(connection, items) {
  let savedCount = 0;

  for (const item of items) {
    const row = normalizeItem(item);
    await upsertLocker(connection, row);
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