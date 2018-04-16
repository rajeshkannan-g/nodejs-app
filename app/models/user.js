const mongoose = require('../db');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
    local: {
        username: {
            type: String,
            trim: true
        },
        password: {
            type: String
        },
        email: {
            type: String,
            trim: true
        },
        displayname: {
            type: String,
            trim: true
        }
    },
    facebook: {
		id: {
            type: String,
            trim: true
        },
		token: {
            type: String
        },
		email: {
            type: String,
            trim: true
        },
		displayname: {
            type: String,
            trim: true
        }
	},
    google: {
		id: {
            type: String,
            trim: true
        },
		token: {
            type: String
        },
		email: {
            type: String,
            trim: true
        },
		displayname: {
            type: String,
            trim: true
        }
	},
});


UserSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('User', UserSchema);