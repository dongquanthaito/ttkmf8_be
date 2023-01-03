const account = require('../models/account.model')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')

module.exports = {
    registerAccount: async(req, res, next) => {
        let {...body} = req.body
        if(!req.body.user){
            res.json({
                statusCode: 401,
                valid: false,
                mess: "Vui lòng điền thông tin đăng ký"
            })
        } else {
            try {
                let register = await account.create(body)
                res.json({
                    statusCode: 200,
                    valid: true,
                    mess: "Đã đăng ký thành công",
                    detail: register
                })
            } catch (error) {
                res.json({
                    statusCode: 403,
                    valid: false,
                    mess: "Error",
                    error: error
                })
            }
        }
    },
    loginAccount: async(req, res, next) => {
        let {...body} = req.body
        try {
            let getAccount = await account.findOne({user: body.user})
            if(getAccount){
                if(bcryptjs.compareSync(body.password, getAccount.password) == true) {
                    let token = jwt.sign({
                        _id: getAccount._id,
                        user: body.user,
                        role: body.role,
                        site: body.site
                    }, "11921293119", {expiresIn: "1h"})
                    res.json({
                        statusCode: 200,
                        valid: true,
                        mess: "Đăng nhập thành công!",
                        data: getAccount,
                        token:token
                    })
                } else {
                    res.json({
                        statusCode: 503,
                        valid: false,
                        mess: "Mật khẩu không hợp lệ",
                    })
                }
            }else{
                res.json({
                    statusCode: 404,
                    valid: false,
                    mess: "Không tìm thấy tài khoản",
                })
            }
        }catch(error) {
            res.json({
                statusCode: 404,
                valid: false,
                mess: "Có lỗi trong quá trình truy cập!",
                error: error
            })
        }
    },
    accounts: async(req, res, next) => {
        try {
            let getAccount = await account.find()
            res.json(getAccount)
        } catch (error) {
            res.json(error)
        }
    },
    updateAccount: async(req, res, next) => {
        let {...body} = req.body
        try {
            let update = await account.findOneAndUpdate({user: body.user}, body, {new: true})
            res.json({
                statusCode: 200,
                valid: true,
                mess: "Tài khoản đã được cập nhật thành công"
            })
        } catch (error) {
            res.json({
                statusCode: 501,
                valid: false,
                mess: "Tài khoản cập nhật thất bại",
                error: error
            })
        }
    },
    deleteAccount: async(req, res, next) => {
        let {...body} = req.body
        try {
            let del = await account.deleteMany(body)
            if(del.deletedCount != 0){
                res.json({
                    statusCode: 200,
                    valid: true,
                    mess: "Tài khoản đã được xóa"
                })
            } else {
                res.json({
                    statusCode: 404,
                    valid: false,
                    mess: "Không tìm thấy tài khoản",
                })
            }
        } catch (error) {
            res.json({
                statusCode: 501,
                valid: false,
                mess: "Có lỗi trong quá trình thực hiện",
                error: error
            })
        }
    }

}