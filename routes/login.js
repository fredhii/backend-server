var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED

var app = express();
var User = require('../models/user');

// Google
var CLIENT_ID = require('../config/config').CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);


// =============================================
// Google Validation
// =============================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
  }
  verify().catch(console.error);

app.post('/google', async(request, response) =>{

    var token = request.body.token;

    var googleUser = await verify(token)
        .catch(e =>{
            return response.status(403).json({
                ok: false,
                message: 'Invalid Token!!',
            });
        });

    User.findOne( {email:googleUser.email}, (err,userDB) =>{
        // Verify email
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error searching for user!!',
                errors: err
            });
        }
        // Verify email
        if ( userDB ) {
            if (userDB.google === false) {
                return response.status(400).json({
                    ok: false,
                    message: 'You have an account with different email!!',
                });
            } else {
                userDB.password = 'c:'
                var token = jwt.sign({ user: userDB }, SEED,{ expiresIn: 7200 }) //2 Hours

                response.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id,
                    menu: getMenu( userDB.role )
                });
            }
        } else {
            // If user doesn't exist...
            var user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.google = true;
            user.password = 'c:';


            user.save((err, userDB) =>{
                var token = jwt.sign({ user: userDB }, SEED,{ expiresIn: 7200 }) //2 Hours

                response.status(200).json({
                    ok: true,
                    user: userDB,
                    token: token,
                    id: userDB._id,
                    menu: getMenu( userDB.role )
                });
            });

        }
    });
});



// =============================================
// Validation
// =============================================
app.post('/', (request, response) => {

    var body = request.body;

    User.findOne({email: body.email}, (err, userDB) => {

        // Verify email
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error looking for user!!',
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
                message: 'invalid password!!',
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
            id: userDB._id,
            menu: getMenu( userDB.role )
        });
    });

});


function getMenu( role ) {

    var menu = [
        {
          title: 'Main',
          icon: 'mdi mdi-gauge',
          submenu: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Progress Bar', url: '/progress' },
            { title: 'Graphics', url: '/graphic1' },
            { title: 'Promises', url: '/promesas' },
            { title: 'Rxjs', url: '/rxjs' }
          ]
        },
        {
          title: 'Maintenance',
          icon: 'mdi mdi-folder-lock-open',
          submenu: [
            // { title: 'Users', url: '/user' },
            { title: 'Doctors', url: '/doctor' },
            { title: 'Hospitals', url: '/hospital' }
          ]
        }
      ];

    if (role === 'Admin') {
        menu[1].submenu.unshift({ title: 'Users', url: '/user' });
    }

    return menu;
}




module.exports = app;