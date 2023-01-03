const mongoose = require('mongoose')

const rule = mongoose.Schema({
    url: String,
    promoName: {
        type:String,
        unique:true
    },
    promotiontype:String,
    startTime: String,
    endTime: String,
    validateTimeStart: String,
    validateTimeEnd: String,
    producttype: String,
    remark: String,
    limit: Array,
    method:String,
    condition:String,
    conditionValue: Array,
    calculateMethod: String,
    calculateValue: String,
    avoidMethod:String,
    avoidValue:Array,
    date:Array,
    bonus:Array,
    turnovervalue:Number,
    promotionTile:String,
    subject:String,
    content:String,
})

module.exports = mongoose.model('rule',rule)