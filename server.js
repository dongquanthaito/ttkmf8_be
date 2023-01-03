const express = require('express')
const connectDB = require('./config/database')
const app = express()
const Router = require('./routes')
const cors = require('cors')

app.use(cors())
app.use(express.urlencoded({
    extended: false
}))
app.use(express.json())
connectDB()
Router(app)


app.listen('3000', () => console.log("Connecting"))