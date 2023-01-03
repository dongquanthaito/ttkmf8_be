const rule = require('../models/rule.model')

module.exports = {
    postRule: async(req, res, next) => {
        let {...body} = req.body
        if(!req.body.promoName) {
            res.json({
                statusCode: 401,
                valid: false,
                mess: "Vui lòng điền thông tin khuyến mãi"
            })
        } else {
            try {
                let promo = await rule.create(body)
                res.json({
                    statusCode: 200,
                    valid: true,
                    mess: "Thêm thành công",
                    detail: promo
                })
            } catch (error) {
                res.json({
                    statusCode: 403,
                    valid: false,
                    mess: "Đã có dữ liệu",
                    error: error
                })
            }
        }
    },
    updateRule: async(req, res, next) => {
        let {...body} = req.body
        try {
            let update = await rule.findOneAndUpdate({promoName:req.body.promoName},body,{new:true})
            res.json(update)
        } catch (error) {
            res.json(error)
        }
    },
    getRule: async(req, res, next) => {
        let {...query} = req.query
        try {
            if(query.promotionid){
                let getRule = await rule.find({promoName:query.promotionid})
                if(getRule == "") {
                    res.json({
                        statusCode: 404,
                        valid: false,
                        mess: "Không có mã khuyến mãi này"
                    })
                } else {
                    res.json(getRule)
                }
                

            }else {
                let getRule = await rule.find() //Tìm tất cả
                res.json(getRule)
            }
        } catch (error) {
            res.json(error)
        }
    }
}