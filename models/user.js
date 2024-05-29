const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Userske = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

Userske.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', Userske);