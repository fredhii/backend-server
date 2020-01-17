
var express = require('express');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var mdAuthentication = require('../middlewares/authentication');
var app = express();
var User = require('../models/user');


// =============================================
// Get all Users
// =============================================
app.get('/', ( request, response, next ) => {

    // Create Paguination
    var from = request.query.from || 0;
    from = Number(from);

    // Display only selected data
    User.find({ }, 'name email image role google')
        .skip(from)
        .limit(5)
        .exec( 
            (err, users) => {
                // Throw error
                if ( err ) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Error loading users database!!',
                        errors: err
                    });
                }

                User.countDocuments({}, (err, count) => {
                    // Throw error
                    if ( err ) {
                        return response.status(500).json({
                            ok: false,
                            message: 'Error loading count !!',
                            errors: err
                        });
                    }

                    // Consult Successful
                    response.status(200).json({
                        ok: true,
                        users: users,
                        total: count
                    });

                });
        });
});

// =============================================
// Update User
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (request, response) =>{
    var id = request.params.id;
    var body = request.body;
        
    
    User.findById( id, (err, user) => {
        
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error searching user!!',
                errors: err
            });
        }
        
        if ( !user ) {
            return response.status(400).json({
                ok: false,
                message: 'User does not exist!!',
                errors: { message: "Do not exist an user with that ID"}
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save( (err, userSaved) =>{
            if ( err ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error updating user!!',
                    errors: err
                });
            }

            userSaved.password = 'c:';
            response.status(200).json({
                ok: true,
                user: userSaved
            });

        })
        
    });

});


// =============================================
// Create new User
// =============================================
app.post('/', (request, response) => {

    // Using body parser node library
    var  body = request.body;

    // Create reference to user data
    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    // Save data
    user.save( ( err, userSaved ) => {
        // Throw error
        if ( err ) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating user!!',
                errors: err
            });
        }
        // Save Successful
        response.status(201).json({
            ok: true,
            user: userSaved,
            usertoken: request.user
        });
    });

});

// =============================================
// Delete User
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (request, response) =>{
    var id = request.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) =>{
                // Throw error
                if ( err ) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Error deleting user!!',
                        errors: err
                    });
                }
                // Validation
                if ( !userDeleted ) {
                    return response.status(400).json({
                        ok: false,
                        message: 'Do not exist an user with that ID!!',
                        errors: { message: "Do not exist an user with that ID"}
                    });
                }
                // Deleted Successful
                response.status(200).json({
                    ok: true,
                    user: userDeleted
                });
    });
});


module.exports = app;