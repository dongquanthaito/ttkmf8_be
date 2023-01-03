const express = require('express')
const Router = express.Router()
const {
    getHistory
} = require('../controllers/bettinghistory.controller')

Router.route('/').get(getHistory)
module.exports = Router