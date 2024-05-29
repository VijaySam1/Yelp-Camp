const User = require('../models/user');

module.exports.register=(req,res)=>{
    res.render('users/register');
}

module.exports.regpost=async(req,res)=>{
    try{const {email,username,password}=req.body;
    const user =new User({email,username});
    const registerdUser=await User.register(user,password);
    req.login(registerdUser,err=>{
      if(err)return next(err)
      req.flash('success','welcome to yelp camp!');
    res.redirect('/campground');
    })
    
}catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
    }

module.exports.login=(req,res)=>{
    res.render('users/login');
}

module.exports.loginpost=(req,res)=>{
    req.flash('success','welcome back')
    const redirecturl=req.session.returnTo ||'/campground';
    delete req.session.returnTo ;
    res.redirect(redirecturl);
}

module.exports.logout=(req, res, next)=>{
    req.logout(function(err) {
      if (err) { return next(err); }
    req.flash('success','goodbye');
      res.redirect('/campground');
    });
  }