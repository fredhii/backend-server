// Require
var express = require('express');
var mdAuthentication = require('../middlewares/authentication');
var Hospital = require('../models/hospital');

var app = express();

// =============================================
// Get all Hospitals
// =============================================

app.get('/', (request, response) => {

    // Create Paguination
    var from = request.query.from || 0;
    from = Number(from);

    // Display only selected data
    Hospital.find({})
            .skip(from)
            .limit(5)
            .populate('user', 'name, email')
            .exec( 
                (err, hospital) => {
                    // Throw error
                    if ( err ) {
                        return response.status(500).json({
                            ok: false,
                            message: 'Error loading hospital database!!',
                            errors: err
                        });
                    }

                    Hospital.count({}, (err, count) => {
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
                            hospital: hospital,
                            total: count
                        });

                    });

            });
});


// =============================================
// Update Hospital
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (request, response) =>{

    var id = request.params.id;
    var body = request.body;
        
    
    Hospital.findById( id, (err, hospital) => {
        
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error searching hospital!!',
                errors: err
            });
        }
        
        if ( !hospital ) {
            return response.status(400).json({
                ok: false,
                message: 'Hospital does not exist!!',
                errors: { message: "Do not exist a hospital with that ID"}
            });
        }

        hospital.name = body.name;
        hospital.user = request.user._id;

        hospital.save( (err, hospitalUpdated) =>{
            if ( err ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error updating hospital!!',
                    errors: err
                });
            }
          response.status(200).json({
                ok: true,
                hospital: hospitalUpdated
            });

        })
        
    });

});

// =============================================
// Create new Hospital
// =============================================
app.post('/', mdAuthentication.verifyToken, (request, response) => {

    // Using body parser node library
    var  body = request.body;

    // Create reference to user data
    var hospital = new Hospital({
        name: body.name,
        user: request.user._id
    });

    // Save data
    hospital.save( ( err, hospitalSaved ) => {
        // Throw error
        if ( err ) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating hospital!!',
                errors: err
            });
        }
        // Save Successful
        response.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });
    });

});

// =============================================
// Delete Hospital
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (request, response) =>{

    var id = request.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalDeleted) =>{
                // Throw error
                if ( err ) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Error deleting hospital!!',
                        errors: err
                    });
                }
                // Validation
                if ( !hospitalDeleted ) {
                    return response.status(400).json({
                        ok: false,
                        message: 'Do not exist a hospital with that ID!!',
                        errors: { message: "Do not exist a hospital with that ID"}
                    });
                }
                // Deleted Successful
                response.status(200).json({
                    ok: true,
                    message: "Hospital deleted sucsessfully",
                    hospital: hospitalDeleted
                });
    });
});

module.exports = app;