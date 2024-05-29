const express = require('express');
const router =express.Router({mergeParams:true});
const catasync=require('../utility/catasync.js');
const {islogedin,valrev,isRevAuthor}=require('../middleware')
const{newrev,delrev}=require('../controllers/rev')



//rewiew
router.post('/', valrev,islogedin,newrev)

router.delete('/:reviewId',islogedin,isRevAuthor,catasync (delrev))

module.exports=router;