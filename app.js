// Requires
var express = require('express');
var mongoose = require('mongoose');


// Initialize variables
var app = express();


// Connection to DataBase
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {

if (err) throw err;

console.log('database: \x1b[32m%s\x1b[0m','online!')

})

//Routes
app.get('/', ( request, response, next ) => {
    response.status(200).json({
        ok: true,
        message: 'Request done successfully'
    });
});

// Listen petitions
app.listen(3000, ()=> {
    console.log('Express server running in port 3000: \x1b[32m%s\x1b[0m','online!')
});