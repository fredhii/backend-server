// Require
var express = require('express');
 
var app = express();

// Require for searching
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');


// =============================================
// General Search
// =============================================
app.get('/collection/:table/:search', (request, response) =>{

    var table = request.params.table;
    var search = request.params.search;
    var regex = new RegExp( search, 'i');
    var promise

    // Table Validation
    switch( table ){
        case 'user':
            promise = searchUsers(search, regex);
        break;
        case 'doctor':
            promise = searchDoctor(search, regex);
        break;
        case 'hospital':
            promise = searchHospital(search, regex);
        break;
        default:
            return response.status(400).json({
                ok: false,
                message: 'Seacrh is only available for user, doctor and hospital',
                err: { message: 'Invalid table /collection '}
            });
    };

    promise.then(data => {
        response.status(200).json({
            ok: true,
            [table]: data
        });
    });

});



// =============================================
// General Search
// =============================================
app.get('/all/:search', ( request, response, next ) => {

    var search = request.params.search;
    var regex = new RegExp( search, 'i');

    Promise.all([
        searchHospital(search, regex),
        searchDoctor(search, regex),
        searchUsers( search, regex)
    ]).then( answers => {
        response.status(200).json({
            ok: true,
            hospital: answers[0],
            doctor: answers[1],
            user: answers[2]
        });
    });
});

function searchHospital( search, regex){
    
    return new Promise ((resolve, reject) => {
        Hospital.find({name: regex})
                .populate('user', 'name email')
                .exec((err, hospital) => {
            if (err){
                reject('Error looking for hospitals!', err);
            } else {
                resolve(hospital)
            }
        });
    });
};

function searchDoctor( search, regex){
    
    return new Promise ((resolve, reject) => {
        Doctor.find({name: regex})
                .populate('user', 'name email')
                .populate('hospital')
                .exec((err, doctor) => {
            if (err){
                reject('Error looking for doctors!', err);
            } else {
                resolve(doctor)
            }
        });
    });
};

function searchUsers( search, regex){
    
    return new Promise ((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{'name': regex}, {'email': regex}])
            .exec((err, user) =>{
                if (err){
                    reject('Error looking for user!', err);
                } else {
                    resolve(user);
                }
            })
    });
};




module.exports = app;