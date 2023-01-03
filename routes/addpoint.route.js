const express = require('express')
const Router = express.Router()
const {
    addPoint
} = require('../controllers/addpoint.controller')

Router.route('/').post(addPoint)

module.exports = Router