const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name:process.env.cloudName,
    api_key:process.env.cloudKey,
    api_secret:process.env.cloudSecret
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
         folder: 'YELP',
    allowedFormats:['jpeg','jpg','png']
}
   
  });

  module.exports={
 cloudinary,storage
  }