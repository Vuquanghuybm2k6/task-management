const express = require('express')
const database = require("./config/database")
require("dotenv").config()
const app = express()
const port = process.env.PORT
database.connect()
var cors = require('cors')

const cookieParser = require('cookie-parser')
app.use(cookieParser())

const bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

app.use(cors())

const routesApiVer1 = require("./api/v1/routes/index.route")
// Routes Version 1
routesApiVer1(app)


app.listen(port, () => { 
  console.log(`Example app listening on port ${port}`)
})
