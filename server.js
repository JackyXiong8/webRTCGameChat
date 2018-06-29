//BUG FIX https://github.com/socketio/socket.io-client/issues/1166

var express = require('express')
var app = express()
var bodyParser = require('body-parser')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
var session = require('express-session')
app.use(session({
    secret: "fuck-flask",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

var server = require('http').Server(app)

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public/dist/public'));
app.use(express.static(__dirname + '/static'))
const path = require('path')


require('./server/config/mongoose.js')



require('./server/config/routes.js')(app)
app.all("*", (req, res, next) => {
    res.sendFile(path.resolve("./public/dist/public/index.html"))
});
// app.listen(8888, function(){
//     console.log('Listening on port 8888')
// })

map = {}

const io = require('socket.io')(server)



io.on('connection', (socket) => {


    socket.name = null

    console.log('new connection made:', socket.id);


    
    socket.join(1000)
    
    socket.broadcast.emit('sendName')

    socket.on('sentName', (data)=> {
        var players = []
        players.push(data)
        console.log(players)
        socket.broadcast.emit('names', players)
    })



    socket.on('start', () => {
        console.log('working')
        socket.broadcast.emit('go')

    })

    socket.on('send-message', (data) => {
        console.log(socket.name, 'send msg')
        console.log(Object.entries(socket.rooms)[0][1])
        console.log(data.text);

        socket.broadcast.to(Object.entries(socket.rooms)[0][1]).emit('message-received', data);
    });

    socket.on('newUser', (data) => {
        console.log(data)
        console.log(socket.name)
        socket.name = data



        socket.broadcast.to(Object.entries(socket.rooms)[0][1]).emit('newUserJoined', data)
    })

    socket.on('disconnect', (data) => {
        console.log(data, socket.name, 'when a player leaves')
        
        socket.broadcast.emit('user_left', socket.name)
    })

});

server.listen(8888, () => {
    console.log('listening on port 8888')

})