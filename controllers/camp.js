
const Campground = require('../models/campground.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxtoken=process.env.mapbox;
const geocoder=mbxGeocoding({accessToken:mapboxtoken})
const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}

module.exports.newcamp = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.postcamp = async (req, res) => {
    const geodata=await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    console.log(geodata.body.features[0].geometry.coordinates)
    const campground = await Campground(req.body.campground)
    campground.geometry=geodata.body.features[0].geometry;
    campground.image = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'sucessfully made a new campground' )
    res.redirect(`/campground/${campground._id}`);
}

module.exports.showcamp = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campgrounds) {
        req.flash('error', 'Campground not found')

        return res.redirect('/campground');
    }
    console.log(campgrounds)

    res.render('campgrounds/show', { campgrounds })
}

module.exports.editcamp = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findById(id)
    req.flash('error', 'Campground not found')

    res.render('campgrounds/edit', { campgrounds })
}

module.exports.updatecamp = async (req, res) => {
    const { id } = req.params;
    console.log(req.body)
    const campgrounds = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { runValidators: true, new: true })
    const imgs = await req.files.map(f => ({ url: f.path, filename: f.filename }))
    campgrounds.image.push(...imgs);
    await campgrounds.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            console.log(filename)
            await cloudinary.uploader.destroy(filename, (err) => {
                console.log(err);
                console.log(filename, ' deleted');
                const f = (filename)
                let imgary = campgrounds.image;
                const getimg = imgary.map(item => {
                    return item.filename
                }).indexOf(f);
                imgary.splice(getimg, 1)
                campgrounds.image = imgary;
console.log(campgrounds)
            });
        }
        await campgrounds.save();
       await campgrounds.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })

    }


    req.flash('success', 'sucessfully UPDATED  campground')

    res.redirect(`/campground/${campgrounds._id}`)
}

module.exports.delcamp = async (req, res) => {
    const { id } = req.params;
    const campgrounds = await Campground.findByIdAndDelete(id)
    req.flash('success', 'sucessfully DELETED campground')

    res.redirect('/campground')
}