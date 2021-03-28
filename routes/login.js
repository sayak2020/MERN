require('dotenv').config();
const express = require('express');
const router = express.Router();
const Login = require('../models/login');

const bodyParser=require("body-parser");
const ejs=require("ejs");
const session = require('express-session');
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const findOrCreate = require('mongoose-findorcreate');
//const LocalStrategy = require('passport-local');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));
router.use(session({
    secret: 'Our secret',
    resave: false,
    saveUninitialized: false
  }));

  


  router.use(passport.initialize());
  router.use(passport.session());

passport.use(Login.createStrategy());



passport.serializeUser( function (Login, done) {
    return done(null, Login.id);
  });

passport.deserializeUser(function (id, done) {
   Login.findById(id, function(err, Login) {
    return done(err, Login);
   });
});

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(Login.authenticate()));


// router.post('/login', function(req, res) {
      
//     Users=new Login({email: req.body.email, username : req.body.username});
  
//           Login.register(Users, req.body.password, function(err, user) {
//             if (err) {
//               res.json({success:false, message:"Your account could not be saved. Error: ", err}) 
//             }else{
//               res.json({success: true, message: "Your account has been saved"});
//             }
//           });
// });



        // passport.authenticate('local', function (err, user, info) { 
        //    if(err){
        //      res.json({success: false, message: err})
        //    } else{
        //     if (! user) {
        //       res.json({success: false, message: 'username or password incorrect'})
        //     } else{
        //       req.login(user, function(err){
        //         if(err){
        //           res.json({success: false, message: err})
        //         }else{
        //           const token =  jwt.sign({userId : user._id, 
        //              username:user.username}, secretkey, 
        //                 {expiresIn: '24h'})
        //           res.json({success:true, message:"Authentication successful", token: token });
        //         }
        //       })
        //     }
        //    }
        // })
     







// router.post("/register",function(req,res){
//     Login.register({email: req.body.username,password:req.body.password}, function(err, user) {
//         if(err)
//         {
//             console.log(err);
//             res.redirect("/register");
//         }else
//         {
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/secrets");
//             });
//         }
//     });
// });



passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/login/auth/google/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    Login.findOrCreate({ googleId: profile.id, username: profile.emails[0].value }, function (err, user) {
      return cb(err, user);
    });
  }
));
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);
router.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users');
});




router.post("/register",function(req,res){
    Login.register({username:req.body.username},req.body.password, function(err, user) {
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }else
        {
            passport.authenticate("local")(req,res,function(){
                res.send('Registered');
                res.redirect("/user");
            });
        }
    });
});

router.post("/login",function(req,res){
    const user=new Login({
        username:req.body.username,
        password:req.body.password
    });
    req.login(user,function(err){
        if(err)
        {
            console.log(err);
        }
        else
        {
            passport.authenticate("local")(req,res,function(){
                res.send('Logged in');
                res.redirect("/user");
                console.log('Loggedin');
                
            });
        }
    });
});

router.get('/logout', function(req, res){
    req.logout();
    res.send('LoggedOut');
    res.redirect('/');
  });


// router.post("/register", function(req,res){
//     const user=new Login({
//         email:req.body.username,
//         password:req.body.password
//     });
//     req.login(user,function(err){
//         if(err)
//         {
//             console.log(err);
//         }
//         else
//         {
//             passport.authenticate("local")(req,res,function(){
//                 res.redirect("/user");
//             });
//         }
//     });
// });







// user is your result from userschema using mongoose id
//  user.setPassword(req.body.password, function(err, user){ ..
// For changePassword

// // user is your result from userschema using mongoose id
//   user.changePassword(req.body.oldpassword, req.body.newpassword, function(err) ...





//Getting all
// router.get('/', async (req, res) => {
//     try{
//         const login = await Login.findOrCreate();
//         res.json(login);

//     } catch (err) {
//         res.status(500).json({message: err.message});
//     }

// });

//Create one
// router.post('/', async (req, res) => {
    
//     const login = new Login({
//        // _id: req.body.id,
//         email: req.body.email,
//         password: req.body.password
//     });
//     try{
//         const newLogin = await login.save();
//         res.status(201).json(newLogin);

//     } catch (err) {
//         res.status(400).json({message: err.message});
            
//     }


// });

module.exports = router;