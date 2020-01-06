var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED

// =============================================
// Check token
// =============================================
exports.verifyToken = function(request, response, next) {

    var token = request.query.token;

    jwt.verify( token, SEED, (err, decoded) =>{
        if ( err ) {
            return response.status(401).json({
                ok: false,
                message: 'Unauthorized!!',
                errors: err
            });
        }

        request.user = decoded.user;

        next();
        // response.status(200).json({
        //     ok: true,
        //     decoded: decoded
        // });
    });
};