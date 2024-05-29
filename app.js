if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsmate = require('ejs-mate')
const session=require('express-session')
const flash=require('connect-flash');
const exerror=require('./utility/exerror')
const method = require('method-override');
const passport=require('passport');
const local=require('passport-local');
const User = require('./models/user'); 
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl=process.env.dburl||'mongodb://localhost:27017/yelp-camp';
const secret=process.env.secret ||'keepsecret';
const MongoStore = require('connect-mongo');

const campgrounds=require('./routes/camp');
const reviews=require('./routes/rev');

const userrouts=require('./routes/users');

main().catch(err => console.log('mongo' + err));

async function main() {
    await mongoose.connect(dbUrl);
}
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log(' mongo db connected');
})



app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }))
app.use(method('_method'))
app.engine('ejs', ejsmate)
app.use(express.static('public'))


const sessionconfig={
    store: MongoStore.create({ mongoUrl:dbUrl}),
    touchAfter:24*60*60,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
       // secure:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionconfig))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');

    next();
})
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  ); 

app.use('/campground',campgrounds)

app.use('/campground/:id/reviews', reviews)
app.use('/',userrouts)

app.get('/', (req, res) => {
    res.render('home')
})


//error
app.all('*',(req,res,next)=>{
    next(new exerror('page not found',404))
})

app.use((err,req,res,next)=>{
    const {satusCode=500}=err;
    if(!err.message)err.message='SOMTHING WENT WRONG!!!!!!!!!!!';
    res.status(satusCode).render('error',{err})
})
const port=process.env.PORT||3000
app.listen(port, () => {
    console.log(`hello peter${port}`);
})