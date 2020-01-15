// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Initialize variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS")
    next();
  });

// Bidy Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Import routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var doctorRoutes = require('./routes/doctor');
var searchRoutes = require('./routes/search');
var uploadRoutes = require('./routes/upload');
var imageRoutes = require('./routes/images');

// Connection to DataBase
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (err, res) => {

if (err) throw err;

console.log('database: \x1b[32m%s\x1b[0m','online!')

});

//Server Index Config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'))
// app.use('/upload', serveIndex(__dirname + '/upload')); 


// Use Routes
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/user', userRoutes);
app.use('/login', loginRoutes);
app.use('/search', searchRoutes);
app.use('/search/collection', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/image', imageRoutes);
app.use('/', appRoutes);


// Listen petitions
app.listen(3000, ()=> {
    console.log('Express server running in port 3000: \x1b[32m%s\x1b[0m','online!')
});