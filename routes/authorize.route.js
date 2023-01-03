const express = require('express')
const Router = express.Router()
const {
    createAuth,
    getAuth,
    updateAuth,
    delelteAuth
} = require('../controllers/authorize.controller')

Router.route('/').post(createAuth).get(getAuth).patch(updateAuth).delete(delelteAuth)
module.exports = Router