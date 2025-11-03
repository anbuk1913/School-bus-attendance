const express = require("express")
const dotenv = require('dotenv')
const morgan = require('morgan')
const bodyParser = require("body-parser")
const session = require("express-session")
const path = require("path")
const attendanceRoutes = require("./routes/attendanceRoutes")

dotenv.config()
const app = express()

app.use(
  session({
    secret: "it's_secret_key",
    resave: false,
    saveUninitialized: true,
  })
)

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
  next()
})

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname, "public")))
app.use(morgan('dev'))
app.use(attendanceRoutes)

const PORT = 6009
app.listen(PORT, () => console.log(`Server Created`))