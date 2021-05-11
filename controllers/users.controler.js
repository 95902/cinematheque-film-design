const User = require('../models/user.model');
const bcrypte = require('bcrypt');
const passport = require('passport');
const ramdomToken = require('random-token');
const Reset = require('../models/reset.modele');
const fs = require("fs");

module.exports = {


    page_user:( req, res,)=>{
        return res.redirect('/pageUser');

    },


    login: ( req, res, next )=>{

        const user = new User({
            username: req.body.username,
            password : req.body.password
        })

        req.login(user, (err)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/login');
            }

            passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Nom utilisteur ou mot de pass invalid.'})(req, res,(err,user)=>{
                if(err){
                    req.flash('error',err.message);
                    return res.redirect('/users/login');
                }
               
               if(req.user.role == "user"){
                req.flash('success', 'tu est connecté');
                return res.redirect('/');
              
               }

               if(req.user.role == "admin"){
                req.flash('success', 'tu est connecté');
                return res.redirect('/admin_film');
               }

            })
            console.log(user.role);
        })
      
    },

   
    signup: (req, res, next)=>{

        const newUser = User({
            username : req.body.username,
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email  : req.body.email , 
            image:req.file.path.substring(14)
        })
            User.register(newUser, req.body.password,(err,user)=>{
                if(err) {
                    req.flash('error', err.message);
                    return res.redirect('/users/signup');
                }               
                passport.authenticate("local")(req,res,(err,newUser)=>{
                    if(err) {
                        req.flash('error', err.message);
                        return res.redirect('/users/signup');
                    }
                    if(req.user.role == "admin"){
                        req.flash('success', 'Vous êtes connecté');
                        return res.redirect('/admin_film');
                    }
                    if(req.user.role == "user"){
                        req.flash('success', 'Vous êtes connecté');
                        return res.redirect('/');
                        
                    }
                })  
                    
                console.log(user)
                
            })
    },
    resetPassword:(req, res, next)=>{
        User.findOne({username:req.body.username}, (err,user)=>{
            console.log(user);
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
            if(!user){
                req.flash('error', 'Nom utilisateur non trouve!');
                return res.redirect('/users/forgot-password');
            }
            // création de token 
            const token=ramdomToken(32);
            const reset = new Reset({
                username:req.body.username,
                resetPasswordToken:token,
                resetExpire: Date.now()+ 3600000
            })
            reset.save((err,reset)=>{
                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/forgot-password');
                }

            })
            //email de réinitialisation

            req.body.email= user.email
            req.body.message ="<h3> Bonjour  "+user.username+"</h3><br>Cliquer sur le lien pour rénitialiser votre mot de passe : <br>"
            +req.protocol+"://"+req.get('host')+"/users/reset-passord/"+token;
            next();
        })
    },
    resetPasswordForm :(req, res, next)=>{
        const token = req.params.token;
        Reset.findOne({resetPasswordToken: token,resetExpire:{$gt: Date.now()}},(err,reset)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
            if(!reset){
                req.flash('error', 'Token invalide .Essayer encore ');
                return res.redirect('/users/forgot-password');
            }
            req.flash('success', 'Rénitialiser votre mot de passe ');
            return res.render('reset-passord');
        })
    },
    postResetPassword:(req, res, next)=>{
        const token = req.params.token;
        const password= req.body.password;

        Reset.findOne({resetPasswordToken: token,resetExpire:{$gt: Date.now()}},(err,reset)=>{
            if(err){
                req.flash('error', err.message);
                return res.redirect('/users/forgot-password');
            }
            if(!reset){
                req.flash('error', 'Token invalide .Essayer encore ');
                return res.redirect('/users/forgot-password');
            }

            User.findOne({username:reset.username},(err,user)=>{

                if(err){
                    req.flash('error', err.message);
                    return res.redirect('/users/forgot-password');
                }
                if(!user){
                    req.flash('error', 'Utilisateur invalide .Essayer encore ');
                    return res.redirect('/users/forgot-password');
                }
                user.setPassword(password,(err)=>{
                    if(err){
                        req.flash('error', 'mot de passe invalide .Essayer encore ');
                        return res.redirect('/users/forgot-password');
                    }
                    user.save();

                    Reset.deleteMany({username : user.username},(err,message)=>{
                        if(err){
                            console.log(err);
                        }
                        console.log(message);
                    })
                })
            })

            req.flash('success', 'Rénitialiser votre mot de passe réussie ');
            return res.redirect('/users/login');
        })

    },

    saveProfile:(req, res, next)=>{
        if(!req.user){
            req.flash('warning', 'Identifiez-vous');
            return res.redirect('/users/login');
        }
        if(req.user._id != req.body.userId){
            req.flash('warning', 'Identifiez-vous');
            return res.redirect('/users/login');
        }

        User.findOne({_id:req.body.userId},(err,user)=>{
            console.log(user);
            if(err){
               console.log(err);
            }

            const oldUsername = user.username;

            user.firstname = req.body.firstname ? req.body.firstname : user.firstname;
            user.lastname = req.body.lastname ? req.body.lastname : user.lastname;
            user.username = req.body.username ? req.body.username : user.username;
            user.email=req.body.email ? req.body.email: user.email;

            user.save((err,user)=>{
                if(err){
                    req.flash('error', 'Une erreur c"est produite.Recommencer');
                    return res.redirect('/users/pageUser');
                }
                if(oldUsername != user.username){
                    req.flash('error', 'Votre nom utilisateur à changer .Veuillez vous reconnecter avec votre nouveaux non utilisateur :'+req.body.username);
                    return res.redirect('/users/login');
                }
                req.flash('success', 'Modifications Réussites');
                return res.redirect('/users/pageUser');
            })
        })
    },
    update_image :(requete,reponse,next)=>{ 
        var user = User.findById(requete.body.identifiant)
        .select("image")
        .exec()
        .then(user => {
            console.log(user);
            fs.unlink("./public/images/"+user.image, error => {
                console.log(error);
                
            })
            const userUpdate = {
                image : requete.file.path.substring(14)
            }
            User.updateOne({_id:requete.body.identifiant}, userUpdate)
            .exec()
            .then(resultat => {
                reponse.redirect("/users/pageUser")
                console.log(resultat);
            })
            .catch(error => {
                console.log(error);
            })
        });
    },
    liste_user_affichage:(requete,reponse,next)=>{
        User.find()
        .exec()
        .then(users=>{
            reponse.render("admin/liste_user.html.twig",{ listeUser:users,});
        })
    .catch( error =>{
        console.log(error)
    });
    },
    admin_user_delet:(requete,reponse,next)=>{
        var user = User.findById(requete.params.id)
        .select("image")
        .exec()
        .then(user => {
            fs.unlink("./public/images/"+user.image, error => {
                console.log(error);
            })
            User.remove({_id:requete.params.id})
            .exec()
            .then(resultat => {
                requete.session.message = {
                    type : 'success',
                    contenu : 'Suppression effectuée'
                }
                reponse.redirect("/users/admin_user");
            })
            .catch(error => {
                console.log(error);
            })
        })
        .catch(error => {
            console.log(error);
        })    
    },
    page_user_modif:( req, res,)=>{
        User.findById(req.params.id)
        .exec()
        .then(user=>{
            res.render("admin/detail_users.html.twig",{
                users:user,
         })
        })
        .catch( error =>{
            console.log(error)
        });
    },
    page_user_modif_bdd:(requete,reponse)=>{
        const userUpdate ={
            firstname: requete.body.firstname,
            lastname :requete.body.lastname,
            username : requete.body.username,
            email : requete.body.email,
        }
        User.updateOne({_id:requete.body.identifiant},userUpdate)
        .exec()
        .then(resultat => {
            if(resultat.nModified < 1) throw new Error("Requete de modification échouée");
            requete.session.message = {
                type : 'success',
                contenu : 'modification effectuée'
            }
            reponse.redirect("/users/admin_user");
        }) 
        .catch(error => {
            console.log(error);
            requete.session.message = {
                type : 'danger',
                contenu : error.message
            }
            reponse.redirect("/users/admin_user");
        })
    }
    
    


}

