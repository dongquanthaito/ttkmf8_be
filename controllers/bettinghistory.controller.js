const axios = require('axios')
const date = require('../const/date')
const promotionType = require('../models/promotion.model')
const promotionRule = require('../models/rule.model.js')
const token = require('../middelwares/token.middleware')
const manualCheck = require('../middelwares/manualCheck.middleware')

module.exports = {
    getHistory: async(req, res, next) => {
      let authorization = await token()
      let {...query} = req.query
      let rule = await promotionRule.findOne({promoName:query.promotionid})
      let config = {
        method: 'get',
        url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/reports/betting?starttime='+ date[rule.startTime] +'&endtime='+ date[rule.endTime] +'&producttype='+ rule.producttype + rule.url +'&searchtime=resulttime&zoneType=ASIA_SHANGHAI&'+ rule.method+req.query.id,
        headers: {
          'Authorization': authorization,
        }
      };
      console.log(config.url)
      axios(config)
      .then(async function (response) {
        console.log("--------------------------START--------------------------")
        console.log("Rule product: " +rule.producttype)
        let result = await promotionType[rule.promotiontype](response, rule)
        console.log(result)
        
        let checkCashSummary = await manualCheck.cashsummary(response.data.data[0].playerid, authorization)
        let checkPlayerVipId = await manualCheck.playerVipId(response.data.data[0].playerid, authorization)
        let checkRemark = await manualCheck.remarkCheck(response.data.data[0].playerid, authorization, date[rule.validateTimeStart], date[rule.validateTimeEnd], rule.remark)
        let checkGameProvider = manualCheck.avoid(response, rule)
        let checkVeGop = await manualCheck.vegop(rule, response, date[rule.startTime], date[rule.endTime], authorization)

        console.log(checkCashSummary)
        console.log(checkPlayerVipId)
        console.log(checkRemark)
        console.log(checkVeGop)
        console.log(checkGameProvider)

        let messShow

        if(checkCashSummary.valid == false) {
          messShow="Quý khách chưa có giao dịch - Chưa đủ điều kiện để nhận khuyến mãi này."
        } else if(checkPlayerVipId.valid == false) {
          messShow="Quý khách chưa đủ điều kiện nhận khuyến mãi này."
        } else if(checkRemark.valid == false) {
          messShow="Quý khách đã nhận khuyến mãi này."
        } else if(checkGameProvider.valid == false) {
          messShow="Quý khách chưa đủ điều kiện nhận khuyến mãi này."
        } else if(checkVeGop) {
          messShow="Vé cược miễn phí đặt cược jackpot, các vé cược hủy bỏ, vé gộp , vô hiệu đều không được tham gia khuyến mãi này"
        } else if(result.valid.status == false){
          console.log("Vé không hợp rule")
          messShow="Quý khách chưa đủ điều kiện nhận khuyến mãi này."
        } else {
          messShow="Quý khách chưa đủ điều kiện nhận khuyến mãi này."
        }

        if(checkCashSummary.valid == false || checkPlayerVipId.valid == false || checkRemark.valid == false || checkGameProvider.valid == false || checkVeGop.valid == false || result.valid.status == false) {
          console.log("Vé không hợp lệ")
          res.json({
            statusCode: 403,
            valid: false,
            mess: messShow
          })
          console.log("--------------------------FINISHED--------------------------")
        } else {
          console.log('Vé hợp lệ')
          res.json({
            valid: result.valid,
            mess: result.mess,
            promoName: result.promoName,
            promotionTile: result.promotionTile,
            playerid: result.playerid,
            score: result.score,
            bonus: result.bonus,
            turnover: result.turnover,
            subject: result.subject,
            content: result.content,
            validateTimeStart: date[rule.validateTimeStart],
            validateTimeEnd: date[rule.validateTimeEnd]
          })
          console.log("--------------------------FINISHED--------------------------")
        }
      }).catch(function (error) {
        console.log('Lỗi Axios')
        res.json({
          valid: false,
          mess: "Không tìm thấy tài khoản hoặc vé cược.",
          promoName: rule.promoName,
          promotionTile: rule.promotionTile,
          score: 0,
          bonus: 0,
          turnover: 0,
          validateTimeStart: date[rule.validateTimeStart],
          validateTimeEnd: date[rule.validateTimeEnd],
          error_catch: error
        });
        console.log("--------------------------FINISHED--------------------------")
      });
    }
}
