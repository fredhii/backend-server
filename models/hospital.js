// Require
var mongoose = require('mongoose');

//Define Schema
var Schema = mongoose.Schema;

var hospitalSchema = new Schema ({

    // Define columns
    name: {type: String, required: [true, 'Name is required!'] },
    image: {type: String, required: false },
    user: {type: Schema.Types.ObjectId, ref: 'User'}    
}, {collection:'hospital'});

// Export 
module.exports = mongoose.model('Hospital', hospitalSchema);