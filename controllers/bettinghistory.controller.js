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
      
      axios(config)
      .then(async function (response) {
        console.log("--------------------------START--------------------------")
        console.log(config.url)
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
          messShow="Qu?? kh??ch ch??a c?? giao d???ch - Ch??a ????? ??i???u ki???n ????? nh???n khuy???n m??i n??y."
        } else if(checkPlayerVipId.valid == false) {
          messShow="Qu?? kh??ch ch??a ????? ??i???u ki???n nh???n khuy???n m??i n??y."
        } else if(checkRemark.valid == false) {
          messShow="Qu?? kh??ch ???? nh???n khuy???n m??i n??y."
        } else if(checkGameProvider.valid == false) {
          messShow="Qu?? kh??ch ch??a ????? ??i???u ki???n nh???n khuy???n m??i n??y."
        } else if(checkVeGop) {
          messShow="V?? c?????c mi???n ph?? ?????t c?????c jackpot, c??c v?? c?????c h???y b???, v?? g???p , v?? hi???u ?????u kh??ng ???????c tham gia khuy???n m??i n??y"
        } else if(result.valid.status == false){
          console.log("V?? kh??ng h???p rule")
          messShow="Qu?? kh??ch ch??a ????? ??i???u ki???n nh???n khuy???n m??i n??y."
        } else {
          messShow="Qu?? kh??ch ch??a ????? ??i???u ki???n nh???n khuy???n m??i n??y."
        }

        if(checkCashSummary.valid == false || checkPlayerVipId.valid == false || checkRemark.valid == false || checkGameProvider.valid == false || checkVeGop.valid == false || result.valid.status == false) {
          console.log("V?? kh??ng h???p l???")
          res.json({
            statusCode: 403,
            valid: false,
            mess: messShow
          })
          console.log("-------------------------FINISHED-------------------------")
        } else {
          console.log('V?? h???p l???')
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
          console.log("-------------------------FINISHED-------------------------")
        }
      }).catch(function (error) {
        console.log('L???i Axios')
        res.json({
          valid: false,
          mess: "Kh??ng t??m th???y t??i kho???n ho???c v?? c?????c.",
          promoName: rule.promoName,
          promotionTile: rule.promotionTile,
          score: 0,
          bonus: 0,
          turnover: 0,
          validateTimeStart: date[rule.validateTimeStart],
          validateTimeEnd: date[rule.validateTimeEnd],
          error_catch: error
        });
        console.log("-------------------------FINISHED-------------------------")
      });
    }
}
