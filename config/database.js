const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const connectDB = async()=>{
    try {
        await mongoose.connect('mongodb+srv://irisattapp:Rythermbk98@cluster0.1p1h1vm.mongodb.net/ttkmf8?retryWrites=true&w=majority')
        console.log('Connect MongoDB - Success')
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB