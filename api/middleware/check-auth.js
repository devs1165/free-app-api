const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, 'secret')
        req.userData = decode;

        if(decode.exp < new Date().getTime()){
            res.status(401).json({
                message:'uh... oh... it seems your token is expired',
                
            })
        }
        else{
            next();
        }
    }
    catch (error) {
        return res.status(401).json({
            message:'token verification failed',
        })
    }
    
};