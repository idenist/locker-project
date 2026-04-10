const express = require("express");
const router = express.Router();
const lockerController = require("../controllers/lockerController");

// 목록 조회
router.get("/", lockerController.getLockers);

// 상세 조회
router.get("/:stdgCd/:stlckId", lockerController.getLockerDetail);

module.exports = router;