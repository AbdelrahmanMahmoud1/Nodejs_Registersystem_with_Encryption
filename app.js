//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session')
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose'); 

const saltRounds = 10;


const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));






app.use(session({
  secret: 'Our Little Secret',
  resave: false,
  saveUninitialized: true
}))


app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://127.0.0.1:27017/userDB");





const userSchema = new mongoose.Schema({
    email:String,
    password:String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.get('/', (req, res) => {
    res.render("home");
})
app.get('/login', (req, res) => {
    res.render("login");
})
app.get('/register', (req, res) => {
    res.render("register");
})


app.post("/register",function(req,res) {


    User.register({username:req.body.username},req.body.password,function(err,user){

        if (err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })

  
});


app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()){
        res.render("secrets")
    }else(
        res.redirect("/login")
    )
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;


    const user = new User ({
        username : username,
        password : password
    })

    req.logIn(user, (err)=>{
        if (err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })



app.get("/logout",function(req,res){
    req.logOut((err)=>{
        if ( err){
            console.log(err);
        }else{
            res.redirect('/')
        }
        })


    });
  
   
        // User.findOne({ email: username})
        // .then((user) => {
        //     if (user){
               

                                
        //         bcrypt.compare(password, user.password, function(err, result) {
        //             // result == true
        //             if (result){
     
        //                 res.render("secrets");
        //             }else{
        //                 res.redirect("/");
        //             }
        //         });
                  
             
         
        //         }})
        // .catch((err) => {console.log(err);
        
        // });


      
    

    // User.findOne({email: username}, function (err, user) {
    //     if (err) {
    //         log.error("An error occurred. Error message:" + err);
    //     }else{
    //         if (user){
    //             if (user.password === password){
    //                 res.render("secrets")
    //             }
    //         }
    //     }
    // })
})

app.listen(3000,function(){
    console.log("server listening on port 3000");
})

