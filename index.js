const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser())
app.use(fileUpload())

require("./routes/test")(app)

const PORT = process.env.PORT || 5000
app.listen(PORT)