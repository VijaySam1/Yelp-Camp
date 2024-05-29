const {reviewSchema,campSchema}=require('./schemas.js');
const exerror=require('./utility/exerror')
const Campground = require('./models/campground.js');
const Review = require('./models/review.js');



module.exports.islogedin=(req,res,next)=>{
if(!req.isAuthenticated()){
    req.session.returnTo=req.originalUrl;
    console.log(req.session.returnTo);
    req.flash('error','you must signed in first!');
    return res.redirect('/login');
}
next();
}

module.exports.valrev=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new exerror(msg,400)
    }else{
        next();
    }
}

module.exports.valcamp=(req,res,next)=>{
    const {error}=campSchema.validate(req.body);
    if(error){
        const msg =error.details.map(el => el.message).join(',')
        throw new exerror(msg,400)
    }else{
        next();
    }
}

module.exports.isAuthor=async(req,res,next)=>{
    const { id } = req.params;
const campground=await Campground.findById(id);
if(!campground.author.equals(req.user._id)){
    req.flash('error','You dont have permission to edit this campground');
    
    return res.redirect(`/campground/${id}`);

}
next();
}

module.exports.isRevAuthor=async(req,res,next)=>{
    const { id,reviewId} = req.params;
const review=await Review.findById(reviewId);
if(!review.author.equals(req.user._id)){
    req.flash('error','You dont have permission to edit this campground');
     return res.redirect(`/campground/${id}`);

}
next();
}