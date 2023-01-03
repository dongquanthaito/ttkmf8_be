const jwt = require('jsonwebtoken')
const accountModel = require('../models/account.model')

module.exports = async(req, res, next) => {
    try {
        let decoded = jwt.verify(req.headers.authorization, '11921293119')
        let account = await accountModel.findById(decoded._id)
        if(!account) {
            res.json({
                statusCode: 403,
                valid: false,
                mess: "Forbidden"
            })
        } else {
            req.account = account
            next()
        }
    } catch (error) {
        res.json({
            statusCode: 403,
            valid: false,
            mess: "Forbidden",
            error: error
        })
    }
}

