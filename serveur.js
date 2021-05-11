const express = require("express");
const serveur  = express();
const http = require('http');
const server = http.createServer(serveur);
const socketio = require("socket.io");
const io = socketio(server);
const {userJoin,getCurrentUser,getRoomUsers,userLeave} = require("./utils/users")
const morgan  = require("morgan");
const path = require('path');
const passport = require('passport');
const formatMessage = require("./utils/messages")
const routeurAdmin = require("./routeurs/admin.routeur");
const routeurFilm = require("./routeurs/film.routeur");
const routeurEvenement = require("./routeurs/evenement.routeur");
const routeurFilm_new = require("./routeurs/film_new.routeur");
const routeurGlobal = require("./routeurs/global.routeur");
const routeurActeur = require("./routeurs/acteur.routeur");
const routeurUser = require("./routeurs/users.routeur");
const routeurSalon = require("./routeurs/salon.routeur");
const routeurcategorie = require("./routeurs/categorie.routeur");
const routeurannee = require("./routeurs/annee.routeur");
const mongoose= require("mongoose");
const bodyParser=require("body-parser");
const session = require("express-session");
const flash = require('connect-flash');
const User = require('./models/user.model');


 serveur.use(require('cookie-parser')());
serveur.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 6000000 }
}))

//Run  user connect 

const botName= 'Cinema tchat '
// user.username

io.sockets.on('connection', socket => {


  socket.on('joinRoom',({username,room})=>{  
    const user = userJoin(socket.id, username,room);
    socket.join(user.room);

    if (socket.handshake.headers.referer != `http://localhost:3050/salon?username=${user.username}&&room=${user.room}`) {
      socket.disconnect();
      return;
    }
      ///bienvenue 
    socket.emit('message',formatMessage(botName,'Bienvenue dans le tchat!:)'));

    // quand le user ce connect 
  
    socket.broadcast
    .to(user.room)
    .emit('message',
    formatMessage(botName,`${user.username} c"est connecter!`));

    //utilisateur dans le tchat 
    io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    });

  });

  //message envoyer

  socket.on('chatMessage', (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message',formatMessage(user.username,msg))
  });

  // quand le user ce deconnect

  socket.on('disconnect', () => {
    const user = userLeave(socket.id)
    console.log(user);
    if (user) {
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} à quitté le chat`));

       //utilisateur dans le tchat 
     io.to(user.room).emit('roomUsers',{
      room: user.room,
      users: getRoomUsers(user.room)
    });
    }

    
  });


});


mongoose.connect("mongodb://localhost/cinematheque",{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>console.log("Connexion à MongoDB reussie"))

.catch(()=>console.log("Echec de la connexion a mongoDb"));


//view engine setup


serveur.set('views', path.join(__dirname, 'views'))
serveur.set('view engine','twig');

serveur.use(express.static("public"));
serveur.use(bodyParser.urlencoded({extended:true}))
serveur.set('trust proxy',1);




serveur.use(morgan("dev"));

serveur.use((requete, reponse, suite) => {
    reponse.locals.message = requete.session.message;
    delete requete.session.message;
    suite();
})

  //init flash
  serveur.use(flash());

  //init Passport

  serveur.use(passport.initialize());
  serveur.use(passport.session());

  //passport local mongoose

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


serveur.use((req, res, next)=>{
  if(req.user){
    res.locals.user = req.user;
  }
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  res.locals.errorForm = req.flash('errorForm');
  res.locals.errorForm1 = req.flash('errorForm1');
  next();

})
serveur.use("/",routeurSalon);
serveur.use("/",routeurFilm_new); 
serveur.use("/",routeurcategorie); 
serveur.use("/",routeurannee);
serveur.use("/",routeurActeur);
serveur.use("/",routeurAdmin);
serveur.use("/",routeurFilm);
serveur.use("/",routeurEvenement);
serveur.use("/users",routeurUser);

serveur.use("/",routeurGlobal);

server.listen(3050);

