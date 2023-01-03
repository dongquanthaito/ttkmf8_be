const author = require('./authorize.route')
const history = require('./bettinghistory.route')
const registry = require('./account.route')
const rule = require('./rule.route')
const addPoint = require('./addpoint.route')

module.exports = (app) => {
    app.use('/autho', author)
    app.use('/history', history)
    app.use('/account', registry)
    app.use('/rule', rule)
    app.use('/addpoint', addPoint)
}