const axios = require('axios')
const manualCheck = require('../middelwares/manualCheck.middleware')
const token = require('../middelwares/token.middleware')


module.exports = {
  addPoint: async(req,res,next) => {
    let {...body} = req.body

    if(!req.body.user) {
      res.json({
        statusCode: 401,
        valid: false,
        mess: "Vui lòng điền thông tin người chơi"
    })
    } else {
      try {
        let playerid = body.user
        let adjustamt = body.adjustment
        let turnovervalue = body.turnover
        let ecremarks = body.ecremark
        let remarks = body.remark
        let subject = body.subject
        let content = body.content
        let validateTimeStart = body.validateTimeStart
        let validateTimeEnd = body.validateTimeEnd

        let authorization = await token()
        let checkRemark = await manualCheck.remarkCheck(playerid, authorization, validateTimeStart, validateTimeEnd, remarks)

        if(checkRemark.valid == false) {
          console.log("Add point - Duplicate")
          res.json({
            statusCode: 403,
            valid: false,
            recheck: true,
            mess: "Quý khách đã nhận khuyến mãi này."
          })
        } else {
          console.log("playerid " + playerid)
          console.log("adjustamt " + adjustamt)
          console.log("turnovervalue " + turnovervalue)
          console.log("ecremarks " + ecremarks)
          console.log("remarks " + remarks)
          console.log("subject " + subject)
          console.log("content " + content)
          console.log("playerid " + playerid)

          let data = JSON.stringify({
            "manualAdjustments": [
              {
                "playerid": playerid,
                "adjustamt": adjustamt,
                "turnovervalue": turnovervalue,
                "claim": true,
                "removegwc": false,
                "servicefee": "0",
                "adminfeeratio": "0",
                "turnovertype": "0",
                "ecremarks": ecremarks,
                "remarks": remarks,
                "reasontype": "2",
                "manualtype": "1",
                "walletid": "MAIN"
              }
            ],
            "sendmessage": true,
            "messages": {
              "msgtype": "2",
              "subject": subject,
              "content": content,
              "players": playerid
            }
          });
          
          let config = {
            method: 'post',
            url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/manualadjusts/batch',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': authorization,
            },
            data : data
          };            
          axios(config)
          .then(function (response) {
            console.log("Add point - Success")
            res.json({
              statusCode: 200,
              valid: true,
              mess: "Chúc mừng bạn đã cộng điểm thành công"
            })
            console.log("Success____________________________________________")
          }).catch(error=> {
            res.json(error)
            console.log("Error____________________________________________")
          });      
        }
    } catch (error) {
      console.log("Add point - Error")
      
        res.json({
            statusCode: 403,
            valid: false,
            mess: "Cộng điểm thất bại",
            error: error
        })
      console.log("_______________________________________________")
    }
    }
  }
}