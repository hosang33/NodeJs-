const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const server = require('http').Server(express);
const SocketIo = require('socket.io')

const socketRouter = require('./router/socket');
const indexRouter = require('./router/index');
const loginRouter = require('./router/login');
const registerRouter = require('./router/register');
const roomRouter = require('./router/room');
const lobbyRouter = require('./router/lobby');

const useSession = app.use(session({
    secret : 'sangho',
    resave: true,
    saveUninitialized: true 
}));

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use('/',indexRouter);
app.use('/login',loginRouter);
app.use('/register', registerRouter);
app.use('/room', roomRouter);
app.use('/lobby', lobbyRouter);

app.listen(5000, (req, res) => {
    console.log("서버 실행됨");
});

const port = server.listen(90)
const io = SocketIo(port);
socketRouter(io,useSession);


const db = require("./config/keys").mongoURI;

mongoose
        .connect(db,{useNewUrlParser: true})
        .then(() => console.log("몽고 DB가 연결되었습니다"))
        .catch(err => console.log(err));



process.on('uncaughtException',(err)=>{
    console.error('uncaughtException',err);
});
   