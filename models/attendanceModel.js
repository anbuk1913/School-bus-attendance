const fs = require("fs")
const path = require("path")

const dataFile = path.join(__dirname, "../data/attendance.json")

function readData() {
  try {
    const data = fs.readFileSync(dataFile, "utf8")
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2))
}

module.exports = { readData, writeData }