const mongoose = require('mongoose')

const authorize = mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    authorization: String
})

module.exports = mongoose.model('authorization', authorize)