const nodemailer = require('nodemailer');

const sendResetMail = (req,res,next)=>{
    var transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{
            user:'bragance.marshel@gmail.com',
            pass:'Badson1983'
        }
    });

    var message = "<br>Message:"+req.body.message;

    var mailOptions ={
        form: ' bragance.marshel@gmail.com',
        to: req.body.email,
        subject:"Rénitialisation de votre mot de passe",
        html: message
    };

    transporter.sendMail(mailOptions,(err,infos)=>{
        if(err){
            req.flash('error', err.message);
            return res.redirect('/users/forgot-password');
        }else{
            console.log(infos);
            req.flash('success','Un message de rénitialisation a été envoyer avotr adress mail:'+req.body.email+'.Vérifier votre boit Mail');
            return res.redirect('/users/forgot-password');
        }
    })
}

module.exports = sendResetMail;