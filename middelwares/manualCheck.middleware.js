const axios = require('axios')

module.exports = {
    cashsummary: (playerid, authorization) => {
        let config = {
            method: 'get',
            url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/players/' + playerid + '/cashsummary',
            headers: {
            'Authorization': authorization,
            }
        };
        return axios(config)
        .then(function (response) {
            if(response.data.totaldepositcount > 0) {
                return {
                    statusCode: 200,
                    valid: true
                }
            } else {
                return {
                    statusCode: 403,
                    valid: false,                    
                }
            }
        }).catch(function (error) {
            return error
        })

    },

    playerVipId: (playerid, authorization) => {
        let config = {
            method: 'get',
            url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/players/' + playerid,
            headers: {
            'Authorization': authorization,
            }
        };
        return axios(config)
        .then(function (response) {
            if(response.data.vipid != "f8173e7b-0819-42ea-b69d-797764a7d0ed") {
                return {
                    statusCode: 200,
                    valid: true
                }
            } else {
                return {
                    statusCode: 403,
                    valid: false                   
                }
            }
        }).catch(function (error) {
            return error
        })
    },

    remarkCheck: (playerid, authorization, startTime, endTime, getRemark) => {
        console.log("check Remark")
        let config = {
            method: 'get',
            url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/manualadjusts?starttime=' + startTime + '&endtime=' + endTime + '&playerid=' + playerid + '&zonetype=ASIA_SHANGHAI',
            headers: {
            'Authorization': authorization,
            }
        };
        return axios(config)
        .then(function (response) {
            let remark = getRemark.replace(/\s/g, '')
            console.log("remark " + remark)
            let numRemark = []
            response.data.data.forEach((item) => {
                numRemark.push(item.remarks.replace(/\s/g, ''))
            })
            console.log(numRemark)
            if(numRemark.includes(remark)){
                return {
                    statusCode: 403,
                    valid: false,
                }
            }else{
                return {
                    statusCode: 200,
                    valid: true
                }
            }
        }).catch(function (error) {
            console.log("Remark check lỗi")
            return error
        })
    },

    avoid: (response,rule) => {
        let result = response.data
        let avoidMethodFunc = eval(rule.avoidMethod)
        if(rule.avoidValue.includes(avoidMethodFunc)){
            return {
                statusCode: 403,
                valid: false
            }
        }else{
            return {
                statusCode: 200,
                valid: true
            }
        }
    },

    vegop: (rule,result,startTime,endTime,authorization)=>{
        let producttype = rule.producttype
        let roundid = result.data.data[0].roundid
        let url = rule.url
        let betamount = result.data.data[0].betamount
        var config = {
        method: 'get',
        url: 'https://boapi.f8bet.cc/f8bet-ims/api/v1/reports/betting?'
        +'&starttime='+startTime
        +'&endtime='+endTime
        +url
        +'&producttype='+producttype
        +"&zoneType=ASIA_SHANGHAI"
        +"&roundid="+roundid,
        headers: { 
            'accept': ' */*', 
            'accept-encoding': ' gzip, deflate, br', 
            'accept-language': ' en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7', 
            'authorization': authorization, 
            'origin': ' https://boapi.jun88.bet',  
            'referer': ' https://boapi.jun88.bet/', 
        }
        };
        return axios(config)
        .then( async(response)=> {
            console.log (config.url)

        if(response.data.total>1){
            if(response.data.summary.betamount==betamount){
                console.log("betamount " + betamount)
                if(betamount>=50){
                    return{
                        statusCode: 403,
                        valid: false
                    }
                }else{
                    return{
                        statusCode: 200,
                        valid: true
                    }
                }
            }else{
            return{
                statusCode: 200,
                valid: true
            }
            }
        }else{
            return{
                statusCode: 200,
                valid: true
            }
        }
        }).catch(function (error) {
            console.log("Check vé gộp lỗi")
            result.json(error)
        });
    } 
}