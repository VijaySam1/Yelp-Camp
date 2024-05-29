const express = require('express');
const router =express.Router();
const catasync=require('../utility/catasync.js');
const exerror=require('../utility/exerror')
const Campground = require('../models/campground.js');
const {islogedin,valcamp,isAuthor}=require('../middleware')
const {index,newcamp,postcamp,showcamp,editcamp,updatecamp,delcamp}=require('../controllers/camp')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage})


router.get('/', catasync(index))
//new
router.get('/new',islogedin, newcamp)

router.post('/',islogedin, upload.array('image'),catasync(postcamp),valcamp)

//show
router.get('/:id',catasync(showcamp))
//edit
router.get('/:id/edit',islogedin,isAuthor,catasync(editcamp))

router.put('/:id',islogedin, upload.array('image'),isAuthor,catasync(updatecamp), valcamp)

//delete

router.delete('/:id',islogedin,isAuthor,  catasync(delcamp))

module.exports=router;