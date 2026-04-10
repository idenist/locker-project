const lockerService = require("../services/lockerService");

/*
- 기본 정보 목록 조회
*/
async function getLockers(req, res) {
    try {
        const { stdgCd, sggNm, keyword, limit, offset } = req.query;

        const lockers = await lockerService.getLockers({
        stdgCd,
        sggNm,
        keyword,
        limit: limit || 100,
        offset: offset || 0,
        });

        res.status(200).json({
        success: true,
        count: lockers.length,
        data: lockers,
        });
    } catch (error) {
        console.error("[GET /lockers ERROR]", error);
        res.status(500).json({
        success: false,
        message: "보관함 목록 조회 중 오류가 발생했습니다.",
        });
    }
}

/*
- 상세 정보 조회
*/
async function getLockerDetail(req, res) {
    try {
        const { stdgCd, stlckId } = req.params;

        const locker = await lockerService.getLockerDetail(stdgCd, stlckId);

        if (!locker) {
        return res.status(404).json({
            success: false,
            message: "해당 보관함을 찾을 수 없습니다.",
        });
        }

        res.status(200).json({
        success: true,
        data: locker,
        });
    } catch (error) {
        console.error("[GET /lockers/:stdgCd/:stlckId ERROR]", error);
        res.status(500).json({
        success: false,
        message: "보관함 상세 조회 중 오류가 발생했습니다.",
        });
    }
}

module.exports = {
    getLockers,
    getLockerDetail,
};