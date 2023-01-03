module.exports = (role)=>{
    return async(req, res, next) => {
        console.log(role.includes(req.account.role))
        if(role.includes(req.account.role)) {
            next()
        } else {
            res.json({
                statusCode: 403,
                valid: false,
                mess: "Tài khoản không có quyền truy cập."
            })
        }
    }
}
