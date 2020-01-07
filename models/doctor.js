// Require
var mongoose = require('mongoose');

//Define Schema
var Schema = mongoose.Schema;

var doctorSchema = new Schema ({

    // Define columns
    name: {type: String, required: [true, 'Name is required!'] },
    image: {type: String, required: false },
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    hospital: {type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, "Hospital is required field"]}
});

// Export 
module.exports = mongoose.model('Doctor', doctorSchema);