const mongoose = require('mongoose');
const cities = require('./cities.js');
const Campground = require('../models/campground.js');
const { places, descriptors } = require('./seedHelpers.js');

main().catch(err => console.log('mongo' + err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp');
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(' mongo db connected');
})

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const price = Math.floor(Math.random() * 200) + 2000;
        const random1 = Math.floor(Math.random() * 1000);

const camp = new Campground({
            author:'62cc4b1f00034801b9cae0ce',
            location: `${cities[random1].city},${cities[random1].state}`,
            title: `${sample(descriptors)}${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero voluptatem unde quidem minima delectus aspernatur doloremque dolor optio nesciunt hic explicabo, consequuntur qui mollitia magnam animi, rem sed. Modi, recusandae.',
            price,
            geometry: { type: 'Point', coordinates: [
              cities[random1].longitude,
              cities[random1].latitude,

             ] },
image:[  {
  url: 'https://res.cloudinary.com/vs15/image/upload/v1659246403/YELP/ydrw5esgo06sewjqj5vg.jpg',
  filename: 'YELP/ydrw5esgo06sewjqj5vg',
},
{
  url: 'https://res.cloudinary.com/vs15/image/upload/v1659246505/YELP/hhxifehfvaomfhxgooja.png',
  filename: 'YELP/hhxifehfvaomfhxgooja',
},
{
  url: 'https://res.cloudinary.com/vs15/image/upload/v1659246590/YELP/krfvgkgicpeeho0u9azn.jpg',
  filename: 'YELP/krfvgkgicpeeho0u9azn',
 }

 
]
        })
        await camp.save();
    }
}

seedDB().then(() => { mongoose.connection.close() })