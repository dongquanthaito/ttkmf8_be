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
        console.log("checkRemark")
        console.log("checkRemark")
        console.log("checkRemark")
        console.log("checkRemark")
        console.log("--------------------------0START0--------------------------")
        let result = await promotionType[rule.promotiontype](response, rule)
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



        console.log(result)


        if(checkRemark.valid.status == false) {
          console.log("Đã nhận khuyến mãi")
          res.json({
            statusCode: 403,
            valid: {
              valid: {
                status: false,
                mess: "Quý khách đã nhận khuyến mãi này."
              }
            }
          })
        } else if(checkRemark.valid == true){
          console.log('Check vé')
          if(result.valid.valid.status != false) {
            if(checkCashSummary.valid == true && checkPlayerVipId.valid == true && checkRemark.valid == true && checkGameProvider.valid == true && checkVeGop.valid == true && result.valid == true) {
              console.log('Vé hợp lệ')
              res.json({
                statusCode: result.statusCode,
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
            } else {
              console.log('Vé không hợp lệ')
              
              console.log(checkCashSummary)
              console.log(checkPlayerVipId)
              console.log(checkRemark)
              console.log(checkVeGop)
              console.log(checkGameProvider)
              res.json({
                statusCode: 403,
                valid: {
                  valid: {
                    status: false,
                    mess: "Quý khách chưa đủ điều kiện nhận khuyến mãi."
                  }
                },
                promoName: result.promoName,
                promotionTile: result.promotionTile,
                playerid: result.playerid,
                score: result.score,
                bonus: result.bonus,
                turnover: result.turnover,
                checkCashSummary: checkCashSummary,
                checkPlayerVipId: checkPlayerVipId,
                checkRemark: checkRemark,
                checkVeGop: checkVeGop,
                checkGameProvider: checkGameProvider,
                validateTimeStart: date[rule.validateTimeStart],
                validateTimeEnd: date[rule.validateTimeEnd]
              });
            }
          } else {
            console.log('Vé không hợp rule')
            res.json({
              statusCode: 403,
              valid: {
                valid: {
                  status: false,
                  mess: "Quý khách chưa đủ điều kiện nhận khuyến mãi."
                }
              },
              promoName: result.promoName,
              promotionTile: result.promotionTile,
              playerid: result.playerid,
              score: result.score,
              bonus: result.bonus,
              turnover: result.turnover,
              checkCashSummary: checkCashSummary,
              checkPlayerVipId: checkPlayerVipId,
              checkRemark: checkRemark,
              checkVeGop: checkVeGop,
              checkGameProvider: checkGameProvider,
              validateTimeStart: date[rule.validateTimeStart],
              validateTimeEnd: date[rule.validateTimeEnd]
            });
          }
          
        }
      }).catch(function (error) {
        console.log('Lỗi fetch')
        res.json({
          valid: {
            valid: {
              status: false,
              mess: "Không tìm thấy tài khoản hoặc vé cược."
            }
          },
          promoName: rule.promoName,
          promotionTile: rule.promotionTile,
          score: 0,
          bonus: 0,
          turnover: 0,
          validateTimeStart: date[rule.validateTimeStart],
          validateTimeEnd: date[rule.validateTimeEnd],
          error_catch: error
        });
      });
    }
}
