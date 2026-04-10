const pool = require("../db/mysql");

/*
- 목록 조회용
- 카드 리스트에 사용
- 가져오는 정보:    지자체명, 물품보관함대표위치명, 물품보관함수, 시설도로명주소, 시설지번주소, 
평일/토요일/공휴일 운영 시작/종료 시간, 무료 이용 시간
*/
async function getLockers(filters = {}) {
  const { stdgCd, sggNm, keyword, limit = 100, offset = 0 } = filters;

  let sql = `
        SELECT
        ac.lclgvNm,
        li.stdgCd,
        li.stlckId,
        li.stlckRprsPstnNm,
        li.stlckCnt,
        li.fcltRoadNmAddr,
        li.fcltLotnoAddr,
        li.wkdyOperBgngTm,
        li.wkdyOperEndTm,
        li.satOperBgngTm,
        li.satOperEndTm,
        li.lhldyOperBgngTm,
        li.lhldyOperEndTm,
        li.freeUtztnHr,
        li.lat,
        li.lot,
        ru.usePsbltyLrgszStlckCnt,
        ru.usePsbltyMdmszStlckCnt,
        ru.usePsbltySmlszStlckCnt
        
        FROM locker_info li
        LEFT JOIN area_code ac
        ON li.stdgCd = ac.stdgCd
        LEFT JOIN locker_realtime_use ru
        ON li.stdgCd = ru.stdgCd
        AND li.stlckId = ru.stlckId

        WHERE 1=1
    `;

    const params = [];

    if (stdgCd) {
        sql += ` AND li.stdgCd = ?`;
        params.push(stdgCd);
    }

    if (sggNm) {
        sql += ` AND li.sggNm = ?`;
        params.push(sggNm);
    }

    if (keyword) {
        sql += ` AND (li.stlckRprsPstnNm LIKE ? OR li.fcltRoadNmAddr LIKE ? OR li.fcltLotnoAddr LIKE ?)`;
        params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // sql += ` ORDER BY li.ctpvNm, li.sggNm, li.stlckId LIMIT ? OFFSET ?`;
    // params.push(String(limit), String(offset));
    sql += ` ORDER BY li.ctpvNm, li.sggNm, li.stlckId` // 데이터가 많지 않으므로 굳이 OFFSET 나누지 않음

    const [rows] = await pool.execute(sql, params);
    return rows;
}

/*
- 상세 정보 조회
*/
async function getLockerDetail(stdgCd, stlckId) {
    const sql = `
        SELECT
        ac.lclgvNm,
        li.stdgCd,
        li.sggNm,
        li.ctpvNm,
        li.stlckId,
        li.stlckRprsPstnNm,
        li.stlckDtlPstnNm,
        li.stlckCnt,
        li.fcltRoadNmAddr,
        li.fcltLotnoAddr,
        li.lat,
        li.lot,
        li.wkdyOperBgngTm,
        li.wkdyOperEndTm,
        li.satOperBgngTm,
        li.satOperEndTm,
        li.lhldyOperBgngTm,
        li.lhldyOperEndTm,
        li.freeUtztnHr,
        li.custCntrTelno,
        li.mngInstNm,
        li.mngInstTelno,

        ld.stlckDtlId,
        ld.stlckKndNm,
        ld.stlckNm,
        ld.stlckWdthLenExpln,
        ld.stlckDpthExpln,
        ld.stlckHgtExpln,
        ld.utztnCrgExpln,
        ld.stlmMnsNm,
        ld.addCrgUnitHr,
        ld.addCrgExpln,
        ld.cntrlMthSeNm,
        ld.useMthdExpln,
        ld.kpngLmtCmdtyExpln,

        ru.totDt,
        ru.usePsbltyLrgszStlckCnt,
        ru.usePsbltyMdmszStlckCnt,
        ru.usePsbltySmlszStlckCnt

        FROM locker_detail_info ld
        LEFT JOIN locker_info li
        ON li.stdgCd = ld.stdgCd
        AND li.stlckId = ld.stlckId
        LEFT JOIN area_code ac
        ON li.stdgCd = ac.stdgCd
        LEFT JOIN locker_realtime_use ru
        ON ld.stdgCd = ru.stdgCd
        AND ld.stlckId = ru.stlckId
        WHERE ld.stdgCd = ? AND ld.stlckId = ?
    `;

    const [rows] = await pool.execute(sql, [stdgCd, stlckId]);
    return rows || null;
}

module.exports = { getLockers, getLockerDetail };