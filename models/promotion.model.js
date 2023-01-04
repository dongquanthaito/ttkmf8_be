const date = require('../const/date')

module.exports = {
    kmvcd: (response, rule) => {
      let bonus = rule.bonus
      let limit = rule.limit
      let base = rule.conditionValue
      let minLength = rule.condition
      let promoName = rule.promoName
      let promotionTile = rule.promotionTile
      let playerid = response.data.data[0].playerid
      let turnover = rule.turnovervalue
      let startTime = date[rule.startTime]
      let endTime = date[rule.endTime]
      let validbet = response.data.data[0].validbet
      let winBetPlayer = response.data.data[0].winloss
      let betaMount = response.data.data[0].betamount
      let baseValue = base.toString()
      let ticketId = "ticketId: " + response.data.data[0].txnid;
      
      let finalize = []
      let validBetHandling

      let statePromoName = true
      if(promoName == "CSN01" && validbet < 300) {
        statePromoName = false
      } else if(promoName == "CSN01" && validbet >= 300){
        statePromoName = true
      }
      if(promoName == "NH03" && validbet < 1) {
        statePromoName = false
      } else if(promoName == "NH03" && validbet >= 1) {
        statePromoName = true
      }

      console.log(statePromoName)

      if(validbet != 0) {
        if(winBetPlayer > betaMount || winBetPlayer < 0) {
          validBetHandling = betaMount
        } else {
          validBetHandling = validbet
        }
      } else {
        validBetHandling = validbet
      }
      
      if(validBetHandling == 0 && winBetPlayer == 0 || statePromoName == false) {
        console.log('promotion fail')
        return {
          statusCode: 503,
          valid: false,
          mess: "Quý khách chưa đủ điều kiện nhận khuyến mãi.",
          promoName: promoName,
          playerid: playerid
        }
      } else {
        if(ticketId.slice(-minLength) == baseValue.slice(-minLength)) {
            for(let i = minLength; i < baseValue.length; i++) {
                if(ticketId.slice(-i) == baseValue.slice(-i)) {
                  finalize[0] = baseValue.slice(-i)
                }
              }
              console.log(finalize[0])
            let bonusValue = ()=>{
              console.log ("Bonus: "+bonus[finalize[0].length-minLength]+" - Limit ne:"+limit[finalize[0].length-minLength])
              if((validBetHandling*bonus[finalize[0].length-minLength])<=limit[finalize[0].length-minLength]){
                console.log("Bonus kmvcd: ")
                return validBetHandling*bonus[finalize[0].length-minLength]
              }else{
                console.log("Limit kmvcd: ")
                return limit[finalize[0].length-minLength]
              }
            }
            console.log("Turnover kmvcd: "+turnover)
            return {
              valid: true,
              promoName: promoName,
              promotionTile: promotionTile,
              playerid: playerid,
              score: validBetHandling,
              bonus: bonusValue(),
              limit: limit[finalize[0].length-minLength],
              turnover: turnover,
              startTime: startTime,
              endTime: endTime,
              subject: rule.subject,
              content: rule.content
            }
        } else {
          console.log('kmvcd không tính được')
          return {
            statusCode: 503,
            valid: false,
            mess: "Quý khách chưa đủ điều kiện nhận khuyến mãi.",
            promoName: promoName,
            playerid: playerid
          }
        }
      }
    },

    nohulon: (response, rule) => {
      let conditionValue = rule.conditionValue
      let bonus = rule.bonus
      let promoName = rule.promoName
      let promotionTile = rule.promotionTile
      let playerid = response.data.data[0].playerid
      let turnover = rule.turnovervalue
      let startTime = date[rule.startTime]
      let endTime = date[rule.endTime]
      let winBetPlayer = response.data.data[0].winloss
      console.log(winBetPlayer)
      console.log(conditionValue)
      let result = {}
      let i = -1
      conditionValue.forEach((e)=>{
          i++
          if(e<=winBetPlayer){
              result["bonus"] = bonus[i]
          }
      })
      console.log(result)
        if(result["bonus"]==null){
          console.log('bonus falil')
          return {
            statusCode: 503,
            valid: false,
            mess: "Quý khách chưa đủ điều kiện nhận khuyến mãi.",
            promoName: promoName,
            promotionTile: promotionTile,
            playerid: playerid,
            score: winBetPlayer,
            bonus: 0,
            turnover: turnover,
            startTime: startTime,
            endTime: endTime
          }
        }else{
          console.log('bonnus true')
          return {
            valid: true,
            promoName: promoName,
            promotionTile: promotionTile,
            playerid: playerid,
            score: winBetPlayer,
            bonus: result["bonus"],
            turnover: turnover,
            startTime: startTime,
            endTime: endTime,
            subject: rule.subject,
            content: rule.content
          }
        }
    },

    calculateMethod: {
      multiply: (a,b)=> b*a
    }
}