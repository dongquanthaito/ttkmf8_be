const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const accountSchema = mongoose.Schema({
    user: {
        type: String,
        unique: true,
        requireq: true
    },
    password: {
        type: String,
        requireq: true
    },
    role: {
        type: String,
        default: 'User'
    },
    site: {
        type: String,
        default: 'F8BET'
    }
})

accountSchema.pre("save", function(next){
    const account = this
    if(account.password){
        account.password= bcryptjs.hashSync(account.password, 10)
    }
    next()
})

accountSchema.pre("findOneAndUpdate", function(){
    const account = this
    if(account.password){
        account.password= bcryptjs.hashSync(account.password, 10)
    }
    this.setUpdate(account)
})

module.exports = mongoose.model('account', accountSchema)