var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED

var app = express();
var User = require('../models/user');

app.post('/', (request, response) => {

    var body = request.body;

    User.findOne({email: body.email}, (err, userDB) => {

        // Verify email
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error searching for user!!',
                errors: err
            });
        }
        // Validate email
        if ( !userDB ) {
            return response.status(400).json({
                ok: false,
                message: 'email invalid or does not exist!!',
                errors: err
            });
        }

        // Validate password
        if ( !bcrypt.compareSync( body.password, userDB.password ) ) {
            return response.status(400).json({
                ok: false,
                message: 'password invalid!!',
                errors: err
            });
        }

        //Create token
        userDB.password = 'c:'
        var token = jwt.sign({ user: userDB }, SEED,{ expiresIn: 7200 }) //2 Hours

        response.status(200).json({
            ok: true,
            user: userDB,
            token: token,
            id: userDB._id
        });
    });

});




module.exports = app;