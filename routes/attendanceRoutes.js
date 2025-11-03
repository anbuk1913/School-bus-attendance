const express = require("express")
const router = express.Router()
const attendanceRouter = require("../controllers/attendanceController")

router.post("/api/add", attendanceRouter.addAttendance)
router.get("/", attendanceRouter.home)
router.get("/login", attendanceRouter.logIn)
router.post("/login", attendanceRouter.loginPost)
router.post("/logout", attendanceRouter.logout)
router.delete("/api/attendance", attendanceRouter.clearAttendance)

module.exports = router
