'use strict'; //will load js in strict mode

//declare required
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//user
var userSchema = new Schema({
    _id: { // email
        type: String
        ,lowercase: true
        ,trim: true
        ,match: [/.+\@.+\..+/, 'Please fill a valid mail address, it\'s used like a index']
    }
    ,firstName: {
        type: String
        ,trim: true
        ,required: [true, 'firstName is required']
    }
    ,lastName: {
        type: String
        ,trim: true
        ,required: [true, 'lastName is required']
    }
    ,password: {
        type: String
        ,required: [true, 'password is required']
    }
    ,tmpPassword: String
}, { strict: true });

//get name surname
userSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName;
});

//get mail
userSchema.virtual('mail').get(function () {
    return this._id;
});

//set mail, call with xxx.set('mail', 'pipppppooooo');
userSchema.virtual('mail').get(function () {
    return this.user;
}).set(function (mail) {
  this.set('_id', mail);
});

//check user password
userSchema.static.checkPassword = function (password) {
    if(this.password == password)
        return true;
    else
        return false;
}

//find user
userSchema.methods.findUser = function (mail) {
    return this.model('User').findOne({ _id: nale });
}

//export
module.exports = mongoose.model('User', userSchema);