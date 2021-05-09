
var express = require('express');
var router = express.Router();
const twig    = require("twig");
const usersControler = require('../controllers/users.controler');
const loginValidator = require('../validators/login.validator');
const userValidator = require('../validators/user.validator');
const sendResetMail = require('../services/email.service');
const resetValidator = require('../validators/reset.validator')
const multer    =require("multer");



const storage=multer.diskStorage({
    destination: (requete,file,cb)=>{
        cb(null,"./public/images/")
    },
    filename:(requete,file,cb)=>{
        var date = new Date().getMonth();
        cb(null,date+"-"+Math.round(Math.random()*10000)+"-"+file.originalname)
    }

});
const fileFilter=(requete,file,cb)=>{
    if(file.mimetype ==="image/jpeg"||file.mimetype=="image/png"){
        cb(null,true)
    }else{
        cb(new Error("l'image n'est pas acceptée"),false)
    }

}
const upload = multer({
    storage : storage,
    limits :{
        fileSize:1024*1024*5
    },
    fileFilter : fileFilter
})


/**
 * Login
 */
router.get('/login',(req,res)=>{
    res.render('login',  req.user);
   
})

router.post('/login', loginValidator, usersControler.login);

/**
 * Signup
 */

router.get('/signup',(req,res)=>{
    res.render('signup');
})


router.post('/signup',upload.single("image"), userValidator, usersControler.signup);


/**
 * Logout
 */
 router.get('/logout',(req,res)=>{
     req.logOut();
     req.flash('success','vous êtes déconectée' );
    res.redirect('/');
})
/**
 * reset motdepasse User
 */

 router.get('/forgot-password',(req,res)=>{
    res.render('forgot-password'); 
})

router.post('/forgot-password',usersControler.resetPassword,sendResetMail)
/**
 * reset motdepasse User token 
 */
router.get('/reset-passord/:token',usersControler.resetPasswordForm);
router.post('/reset-passord/:token',resetValidator,usersControler.postResetPassword);
/**
 * page User
 */

 router.get('/pageUser',(req,res)=>{
    res.render('pageUser',req.user);
    console.log(req.user)
   
})
//mise a jour infos user 
router.post('/save-profile',usersControler.saveProfile);

router.post('/updateImage',upload.single("image"),usersControler.update_image);

router.post('/', usersControler.login);






module.exports =router;


