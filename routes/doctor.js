// Require
var express = require('express');
var mdAuthentication = require('../middlewares/authentication');
var Doctor = require('../models/doctor');

var app = express();

// =============================================
// Get all Doctos
// =============================================

app.get('/', (request, response) => {

    // Create Paguination
    var from = request.query.from || 0;
    from = Number(from);

    var from = request.query.from || 0;
    from = Number(from);

    // Display only selected data
    Doctor.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital')
        .exec( 
            (err, doctor) => {
                // Throw error
                if ( err ) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Error loading doctors database!!',
                        errors: err
                    });
                }

                Doctor.countDocuments({}, (err, count) => {
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
                        doctor: doctor,
                        total: count
                    });
                });
        });
});


// =============================================
// Update Doctor
// =============================================
app.put('/:id', mdAuthentication.verifyToken, (request, response) =>{

    var id = request.params.id;
    var body = request.body;
        
    
    Doctor.findById( id, (err, doctor) => {
        
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error searching doctor!!',
                errors: err
            });
        }
        
        if ( !doctor ) {
            return response.status(400).json({
                ok: false,
                message: 'Doctor does not exist!!',
                errors: { message: "Do not exist a doctor with that ID"}
            });
        }

        doctor.name = body.name;
        doctor.user = request.user._id;
        doctor.hospital = body.hospital;

        doctor.save( (err, doctorUpdated) =>{
            if ( err ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Error updating doctor!!',
                    errors: err
                });
            }
          response.status(200).json({
                ok: true,
                doctor: doctorUpdated
            });

        })
        
    });

});

// =============================================
// Create new Doctor
// =============================================
app.post('/', mdAuthentication.verifyToken, (request, response) => {

    // Using body parser node library
    var  body = request.body;

    // Create reference to user data
    var doctor = new Doctor({
        name: body.name,
        user: request.user._id,
        hospital: body.hospital
    });

    // Save data
    doctor.save( ( err, doctorSaved ) => {
        // Throw error
        if ( err ) {
            return response.status(400).json({
                ok: false,
                message: 'Error creating doctor!!',
                errors: err
            });
        }
        // Save Successful
        response.status(201).json({
            ok: true,
            doctor: doctorSaved
        });
    });

});

// =============================================
// Delete Doctor
// =============================================
app.delete('/:id', mdAuthentication.verifyToken, (request, response) =>{

    var id = request.params.id;

    Doctor.findByIdAndRemove(id, (err, doctorDeleted) =>{
                // Throw error
                if ( err ) {
                    return response.status(500).json({
                        ok: false,
                        message: 'Error deleting doctor!!',
                        errors: err
                    });
                }
                // Validation
                if ( !doctorDeleted ) {
                    return response.status(400).json({
                        ok: false,
                        message: 'Do not exist a doctor with that ID!!',
                        errors: { message: "Do not exist a doctor with that ID"}
                    });
                }
                // Deleted Successful
                response.status(200).json({
                    ok: true,
                    message: "Doctor deleted sucsessfully",
                    doctor: doctorDeleted
                });
    });
});


module.exports = app;