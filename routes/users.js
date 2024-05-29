const express = require('express');
const router =express.Router();
const User = require('../models/user');
const catasync=require('../utility/catasync.js');
const exerror=require('../utility/exerror')
const passport=require('passport');
const{register,regpost,login,loginpost,logout}=require('../controllers/user')

router.route('/register')
.get(register)
.post(catasync(regpost))

router.route('/login')
.get(login)
.post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),loginpost)

router.post('/logout',logout);

module.exports=router; 