const token = require('../models/authorization.model')
module.exports = async() => {
    try {
        let tokenauth = await token.findOne({user: "f8bet09"})
        return tokenauth.authorization
    } catch (error) {
        res.json({
            statusCode: 404,
            valid: false,
            mess: "Not Found",
            error: error
        })
    }
}

