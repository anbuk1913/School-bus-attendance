const { readData, writeData } = require("../models/attendanceModel")

exports.logIn = (req,res)=>{
  try {
    if(req.session.login){
      return res.redirect("/")
    } else {
      let err = ""
      if(req.session.err){
        err = 'Invalid username or password'
      }
      return res.render("login", { err } )
    }
  } catch (error) {
    console.log(error)
  }
}

exports.loginPost = (req,res)=>{
  try {
    const username = process.env.ADMIN_USER
    const password = process.env.ADMIN_PASS
    if(req.body.username == username && req.body.password == password){
      req.session.err = false
      req.session.login = true
      return res.redirect("/")
    } else {
      req.session.err = true
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
}

exports.home = (req,res)=>{
  try {
    if(req.session.login){
      const attendanceList = readData()
      return res.render("attendance", { attendanceList })
    } else {
      return res.redirect("/login")
    }
  } catch (error) {
    console.log(error)
  }
}

exports.addAttendance = (req, res) => {
  const { rfid, name } = req.body
  if (!rfid || !name) {
    return res.status(400).json({ message: "RFID and name are required" })
  }
  const attendanceList = readData()
  const currentTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
  const existingRecord = attendanceList.find(record => record.rfid === rfid)
  if(existingRecord){
    existingRecord.entryTime = currentTime
    writeData(attendanceList)
    return res.status(200).json({
      message: "Attendance time updated",
      record: existingRecord
    })
  } else {
    const newRecord = {
      id: attendanceList.length + 1,
      rfid,
      name,
      entryTime: currentTime,
    }
    attendanceList.push(newRecord)
    writeData(attendanceList)
    return res.status(201).json({
      message: "New attendance recorded",
      record: newRecord
    })
  }
}

exports.getAllAttendance = (req, res) => {
  const attendanceList = readData()
  res.json(attendanceList)
}

exports.clearAttendance = (req, res) => {
  writeData([])
  res.json({ message: "All attendance records cleared" })
}

exports.logout = (req,res) => {
  try {
    req.session.login = false
    return res.redirect("/login")
  } catch (error) {
    console.log(error)
  }
}