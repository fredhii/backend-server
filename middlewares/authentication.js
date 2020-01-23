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

// =============================================
// Check Admin
// =============================================
exports.verifyAdminRole = function(request, response, next) {

    var user = request.user;

    if ( user.role === 'Admin') {
        next();
    } else {
        return response.status(401).json({
            ok: false,
            message: 'Role is not valid!!'
        });
    }
};

// =============================================
// Check Admin or Same User
// =============================================
exports.verifyAdminOrSameUser = function(request, response, next) {

    var user = request.user;
    var id = request.params.id;

    if ( user.role === 'Admin' || user._id === id) {
        next();
    } else {
        return response.status(401).json({
            ok: false,
            message: 'Role is not valid nor User is not this account account owner!!'
        });
    }
};