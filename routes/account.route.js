const express = require('express')

const Router = express.Router() 

const {
    accounts,
    registerAccount,
    loginAccount,
    updateAccount,
    deleteAccount
} = require('../controllers/account.controller')

const auth = require('../middelwares/auth.middleware')
const role = require('../middelwares/role.middleware')
const roleType = require('../const/role')

Router.route('/').get(auth, role([roleType.admin]), accounts)
Router.route('/register').post(registerAccount)
Router.route('/login').get(loginAccount)
Router.route('/update').post(updateAccount)
Router.route('/delete').delete(deleteAccount)


module.exports = Router