const Campground = require('../models/campground.js');
const Review = require('../models/review.js');

module.exports.newrev=async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author=req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','sucessfully made a new REVIEW')

    res.redirect(`/campground/${campground._id}`);
 
}

module.exports.delrev=async (req, res) => {
    const{id,reviewId}=req.params;
    await Campground.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','sucessfully DELETED review')

res.redirect(`/campground/${id}`) 

}