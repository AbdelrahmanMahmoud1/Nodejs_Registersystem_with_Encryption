//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;


const app = express();



app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.connect("mongodb://127.0.0.1:27017/userDB");





const userSchema = new mongoose.Schema({
    email:String,
    password:String
});


const User = new mongoose.model('User', userSchema);






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


    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newuser = new User({

            email: req.body.username,
            password: hash
        })

         try {
    
                newuser.save();
                res.render("secrets");
            } catch (err) {
              console.error("An error occurred. Error message:" + err.message);
            }
    });
  
 
      }
  
);

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;



   
        User.findOne({ email: username})
        .then((user) => {
            if (user){
               

                                
                bcrypt.compare(password, user.password, function(err, result) {
                    // result == true
                    if (result){
     
                        res.render("secrets");
                    }else{
                        res.redirect("/");
                    }
                });
                  
             
         
                }})
        .catch((err) => {console.log(err);});


      
    

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

