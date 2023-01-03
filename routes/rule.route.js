const express = require('express')
const Router = express.Router()

const {
    postRule,
    getRule,
    updateRule
} = require('../controllers/rule.controller')

const auth = require('../middelwares/auth.middleware')
const role = require('../middelwares/role.middleware')
const roleType = require('../const/role')

Router.route('/').post(auth, role([roleType.admin]), postRule)
Router.route('/').get(getRule)
Router.route('/').patch(auth, role([roleType.admin]), updateRule)

module.exports = Router