const autho = require('../models/authorization.model')

module.exports = {
    createAuth: async(req, res, next) => {
        let {...body} = req.body
        let check = await autho.findOneAndUpdate({user:body.user},body,{new:true})
        if(check){
            res.json(check)
        }else{
            try {
                let create = await autho.create(body)
                res.json(create)
            } catch (error) {
                res.json(error)
            }
        }
    },

    getAuth: async(req, res, next) => {
        let {...body} = req.query
        try {
            let find = await autho.find(body)
            res.json(find)
        } catch (error) {
            res.json(error)            
        }
    },
    updateAuth: async(req, res, next) => {
        let {...body} = req.body
        try {
            let update = await autho.findOneAndUpdate({user:body.user},body,{new:true})
            res.json(update)
        } catch (error) {
            res.json(error)
        }
    },
    delelteAuth: async(req, res, next) => {
        let {...body} = req.body
        try {
            let del = await autho.deleteOne({user:body.user})
            res.json(del)
        } catch (error) {
            res.json(error)
        }
    }
}