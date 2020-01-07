var express = require('express');
 
var app = express();

const path = require('path');
const fs = require('fs');

//Routes
app.get('/:type/:image', ( request, response, next ) => {

    var type = request.params.type;
    var image = request.params.image;

    var pathImage = path.resolve(__dirname, `../upload/${type}/${image}`);

    if (fs.existsSync(pathImage)){
        response.sendFile(pathImage);
    } else {
        var pathNoImage = path.resolve( __dirname, '../assets/no-img.jpg');
        response.sendFile(pathNoImage);
    }
});

module.exports = app;