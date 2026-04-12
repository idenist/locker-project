const mysql = require("mysql2/promise");
require("dotenv").config();

const SERVICE_KEY = process.env.PUBLIC_DATA_SERVICE_KEY;
const BASE_URL = "https://apis.data.go.kr/B551982/psl_v2/locker_info_v2";
const NUM_OF_ROWS = 100;
const REQUEST_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchLockerPage(pageNo) {
  const url =
    `${BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}` +
    `&pageNo=${pageNo}&numOfRows=${NUM_OF_ROWS}&type=json`;
  console.log(url)

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
    totCrtrYmd: item.totCrtrYmd || null,
    stdgCd: item.stdgCd || stdgCd || null,
    stlckId: item.stlckId || null,
    stlckRprsPstnNm: item.stlckRprsPstnNm || null,
    stlckDtlPstnNm: item.stlckDtlPstnNm || null,
    stlckCnt: item.stlckCnt || null,
    ctpvNm: item.ctpvNm || null,
    sggNm: item.sggNm || null,
    fcltRoadNmAddr: item.fcltRoadNmAddr || null,
    fcltLotnoAddr: item.fcltLotnoAddr || null,
    lat: item.lat || null,
    lot: item.lot || null,
    wkdyOperBgngTm: item.wkdyOperBgngTm || null,
    wkdyOperEndTm: item.wkdyOperEndTm || null,
    satOperBgngTm: item.satOperBgngTm || null,
    satOperEndTm: item.satOperEndTm || null,
    lhldyOperBgngTm: item.lhldyOperBgngTm || null,
    lhldyOperEndTm: item.lhldyOperEndTm || null,
    freeUtztnHr: item.freeUtztnHr || null,
    instlYmd: item.instlYmd || null,
    custCntrTelno: item.custCntrTelno || null,
    mngInstNm: item.mngInstNm || null,
    mngInstTelno: item.mngInstTelno || null,
  };
}

async function upsertLocker(connection, row) {
  const sql = `
    INSERT INTO locker_info (
      totCrtrYmd,
      stdgCd,
      stlckId,
      stlckRprsPstnNm,
      stlckDtlPstnNm,
      stlckCnt,
      ctpvNm,
      sggNm,
      fcltRoadNmAddr,
      fcltLotnoAddr,
      lat,
      lot,
      wkdyOperBgngTm,
      wkdyOperEndTm,
      satOperBgngTm,
      satOperEndTm,
      lhldyOperBgngTm,
      lhldyOperEndTm,
      freeUtztnHr,
      instlYmd,
      custCntrTelno,
      mngInstNm,
      mngInstTelno
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      totCrtrYmd = VALUES(totCrtrYmd),
      stlckRprsPstnNm = VALUES(stlckRprsPstnNm),
      stlckDtlPstnNm = VALUES(stlckDtlPstnNm),
      stlckCnt = VALUES(stlckCnt),
      ctpvNm = VALUES(ctpvNm),
      sggNm = VALUES(sggNm),
      fcltRoadNmAddr = VALUES(fcltRoadNmAddr),
      fcltLotnoAddr = VALUES(fcltLotnoAddr),
      lat = VALUES(lat),
      lot = VALUES(lot),
      wkdyOperBgngTm = VALUES(wkdyOperBgngTm),
      wkdyOperEndTm = VALUES(wkdyOperEndTm),
      satOperBgngTm = VALUES(satOperBgngTm),
      satOperEndTm = VALUES(satOperEndTm),
      lhldyOperBgngTm = VALUES(lhldyOperBgngTm),
      lhldyOperEndTm = VALUES(lhldyOperEndTm),
      freeUtztnHr = VALUES(freeUtztnHr),
      instlYmd = VALUES(instlYmd),
      custCntrTelno = VALUES(custCntrTelno),
      mngInstNm = VALUES(mngInstNm),
      mngInstTelno = VALUES(mngInstTelno)
  `;

  const params = [
    row.totCrtrYmd,
    row.stdgCd,
    row.stlckId,
    row.stlckRprsPstnNm,
    row.stlckDtlPstnNm,
    row.stlckCnt,
    row.ctpvNm,
    row.sggNm,
    row.fcltRoadNmAddr,
    row.fcltLotnoAddr,
    row.lat,
    row.lot,
    row.wkdyOperBgngTm,
    row.wkdyOperEndTm,
    row.satOperBgngTm,
    row.satOperEndTm,
    row.lhldyOperBgngTm,
    row.lhldyOperEndTm,
    row.freeUtztnHr,
    row.instlYmd,
    row.custCntrTelno,
    row.mngInstNm,
    row.mngInstTelno,
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