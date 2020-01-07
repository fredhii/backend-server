var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
 
var app = express();

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


// default options middleware
app.use(fileUpload());


app.put('/:type/:id', ( request, response ) => {

    // Request routes
    var type = request.params.type;
    var id = request.params.id;

        // Validate route (type)
        var validCollection = ['user', 'doctor', 'hospital'];

        if(validCollection.indexOf(type) < 0) {
            return response.status(400).json({
                ok: false,
                message: 'No valid collection!!',
                errors: {message: 'valid collections are '+ validCollection.join(', ')}
            });
        };

    if (!request.files){
        return response.status(400).json({
            ok: false,
            message: 'Error uplaoding file!!',
            errors: err
        });
    };

    // Get file name
    var file = request.files.image;
    var nameShortened = file.name.split('.');
    var extensionFile = nameShortened [ nameShortened.length -1];

        // Validate file extensions
        var validExtension = ['png', 'jpg', 'gif', 'jpeg'];
        if(validExtension.indexOf(extensionFile) < 0) {
            return response.status(400).json({
                ok: false,
                message: 'No valid extension!!',
                errors: {message: 'valid extension are '+ validExtension.join(', ')}
            });
        };


    // Create and add new file name
    var fileName = `${ id }-${ new Date().getMilliseconds() }.${extensionFile}`;

    // Move file from temp to path
    var path = `./upload/${type}/${fileName}`;

    file.mv( path, err =>{
        if ( err ) {
            return response.status(500).json({
                ok: false,
                message: 'Error moving file!!',
                errors: err
            });
        }

        uploadByType(type, id, fileName, response);

    });
});

function uploadByType(type, id, fileName, response){

// =============================================
// Update User Image
// =============================================
    if (type === 'user'){
        User.findById(id, (err, user) => {

                    if ( err ) {
                        return response.status(400).json({
                            ok: false,
                            message: 'User not found!!',
                            errors: err
                        });
                    }

                    // Validate ID
                    if ( !user ) {
                        return response.status(400).json({
                            ok: false,
                            message: 'Invalid ID!!',
                            errors: { message: "please insert a valid ID"}
                        });
                    }

                    var oldPath = './upload/user/' + user.image;
        
                    // If it exists delete old image
                    if (fs.existsSync(oldPath)) {
                        fs.unlinkSync(oldPath);
                    }

                    user.image = fileName;

                    user.save( (err, userSaved) =>{

                        userSaved.password = 'c:'

                        if ( err ) {
                            return response.status(400).json({
                                ok: false,
                                message: 'Error saving file!!',
                                errors: err
                            });
                        }
                        return response.status(200).json({
                            ok: true,
                            message: 'Image updated!!',
                            user: userSaved

                        });
                    });


        });
    }
// =============================================
// Update Doctor Image
// =============================================
    if (type === 'doctor'){
        Doctor.findById(id, (err, doctor) => {

            if ( err ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Doctor not found!!',
                    errors: err
                });
            }

            // Validate ID
            if ( !doctor ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Invalid ID!!',
                    errors: { message: "please insert a valid ID"}
                });
            }

            var oldPath = './upload/doctor/' + doctor.image;

            // If it exists delete old image
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            doctor.image = fileName;

            doctor.save( (err, doctorSaved) =>{

                if ( err ) {
                    return response.status(400).json({
                        ok: false,
                        message: 'Error saving file!!',
                        errors: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    message: 'Image updated!!',
                    doctor: doctorSaved

                });
            });
        });    
    }
// =============================================
// Update Hospital Image
// =============================================
    if (type === 'hospital'){
        Hospital.findById(id, (err, hospital) => {

            if ( err ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Hospital not found!!',
                    errors: err
                });
            }

            // Validate ID
            if ( !hospital ) {
                return response.status(400).json({
                    ok: false,
                    message: 'Invalid ID!!',
                    errors: { message: "please insert a valid ID"}
                });
            }

            var oldPath = './upload/hospital/' + hospital.image;

            // If it exists delete old image
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            hospital.image = fileName;

            hospital.save( (err, hospitalSaved) =>{

                if ( err ) {
                    return response.status(400).json({
                        ok: false,
                        message: 'Error saving file!!',
                        errors: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    message: 'Image updated!!',
                    hospital: hospitalSaved

                });
            });
        });
    }

};

module.exports = app;