// Require
var mongoose = require('mongoose');
// mongose validator library
var uniqueValidator = require('mongoose-unique-validator');


//Define Schema
var Schema = mongoose.Schema;


// Rol Validator
var rolValidator = {
    values: ['Admin', 'USER_ROLE'],
    message: '{VALUE} is not valid!, use "Admin" or leave empty to load default role'
};

var userSchema = new Schema({
    
    // Define columns
    name: {type: String, required: [true, 'Name is required!'] },
    email: {type: String, unique:true, required: [true, 'Email is required!'] },
    password: {type: String, required: [true, 'Password is required!'] },
    image: {type: String, required: false },
    role: {type: String, required: true, default: 'USER_ROLE', enum: rolValidator },
    google: {type: Boolean, default: false}
});

userSchema.plugin( uniqueValidator, {message: "{PATH} should be unique!!"} )

module.exports = mongoose.model('User', userSchema);