const express = require('express')
const app = express()
const port = 5000
var http = require('http').createServer(app)
const passport = require('passport');
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const io = require('socket.io')(http, { cors: true })


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    return next();
});

//re-enable this when live
//app.use(express.static('dist'))
// Load modules.

app.use(cors())
app.enable('trust proxy');
app.use(bodyParser.json())

app.use(cookieSession({
    name: 'hostmydb-session',
    keys: ['key1', 'key2']
}))

const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next()
    } else {
        res.sendStatus(401);
    }
}

////// matchmaking //////////

var usersSearching = [];
var filledGames = [];
io.on('connection', (socket) => {
    socket.send('Hello!');

    socket.to('room').emit('receiveMessage');

    socket.on('sendMessage', data => {


        //socket.join(socket.id);
        socket.broadcast.emit('receiveMessage', data.message);
        socket.emit('receiveMessage', data.message);
    });

    socket.on("joinRoom", data => {

        var totalUsersSearching = usersSearching.length



        if (totalUsersSearching === 0) {
            createRoom(socket.id, data.name)
            socket.join(socket.id);

            var roomId = socket.id;
            io.in(roomId).emit('player1Tag', 'player1');
        } else {
            var roomId = usersSearching[0].roomId;
            addToRoom(data.name);
            socket.join(roomId);
            io.in(roomId).emit('joinedRoom', filledGames.filter(room => room.roomId = roomId)[0]);
        }
    })

    socket.on('SELECT_BOX', data => {

        updateGame(data.roomId, 'SELECT_BOX', data.boxIndex)
    })

    socket.on('leaveRoom', function (data) {

        socket.leave(data.roomId);

        var roomNum = socket.rooms.length;
        for (var i = 0; i < roomNum; i++) {
            socket.leave(socket.rooms[i]);
        }


    })

    socket.on('updateGame', function (data) {
        var updatedGame = updateGame(data.roomId, data.action, data.other)
        io.in(data.roomId).emit('updatedGame', updatedGame)
        var usersInRoom = Object.keys(io.sockets.adapter.nsp.sockets)

        if (updatedGame.winner !== "") {
            // remove game from array if won
            filledGames.splice(filledGames.findIndex(room => room.roomId = data.roomId)[0], 1);
        }
    })
})

/////////// START UPDATE FUNCTION //////////////

function updateGame(roomId, updateAction, data = []) {
    var filledGamesCopy = [...filledGames];
    var gameIndex = filledGamesCopy.findIndex(game => {
        return game.roomId === roomId;
    })

    switch (updateAction) {
        case 'SELECT_BOX':
            // player 1 is always O 

            // fill box with X or O
            filledGamesCopy[gameIndex].gameState.boxes[data] = filledGamesCopy[gameIndex].gameState.whichPlayerTurn === 'player1' ? "O" : "X";

            //check win
            var gameWon = checkWinCondition(filledGamesCopy[gameIndex].gameState.boxes, filledGamesCopy[gameIndex].gameState.whichPlayerTurn);
            if (gameWon) {
                filledGamesCopy[gameIndex].winner = filledGamesCopy[gameIndex].gameState.whichPlayerTurn;
            } else {
                // change player
                filledGamesCopy[gameIndex].gameState.whichPlayerTurn = togglePlayer(filledGamesCopy[gameIndex].gameState.whichPlayerTurn);
                filledGamesCopy[gameIndex].currentTurn++;

                if (filledGamesCopy[gameIndex].currentTurn === 9 && filledGamesCopy[gameIndex].winner === "") {
                    filledGamesCopy[gameIndex].winner = 'draw';
                }
                filledGames = filledGamesCopy;
                //
            }
            break;
    }

    // return new copy
    return filledGamesCopy[gameIndex];
}

/////////// END UPDATE FUNCTION //////////////
function togglePlayer(currentPlayer) {
    return currentPlayer === 'player1' ? 'player2' : 'player1';
}

function checkWinCondition(boxArray, currentPlayer) {
    var symbol = currentPlayer === 'player1' ? 'O' : 'X';
    if (boxArray[0] == symbol && boxArray[1] === symbol && boxArray[2] === symbol ||
        boxArray[3] == symbol && boxArray[4] === symbol && boxArray[5] === symbol ||
        boxArray[6] == symbol && boxArray[7] === symbol && boxArray[8] === symbol ||
        boxArray[0] == symbol && boxArray[3] === symbol && boxArray[6] === symbol ||
        boxArray[1] == symbol && boxArray[4] === symbol && boxArray[7] === symbol ||
        boxArray[2] == symbol && boxArray[5] === symbol && boxArray[8] === symbol ||
        boxArray[0] == symbol && boxArray[4] === symbol && boxArray[8] === symbol ||
        boxArray[2] == symbol && boxArray[4] === symbol && boxArray[6] === symbol) {
        return true;
    } else {
        return false;
    }
}

function createRoom(roomId, player1Id) {
    var emptyRoom = {
        roomId: roomId,
        player1: player1Id,
        player2: '',
        winner: "",
        currentTurn: 0,
        gameState: {
            whichPlayerTurn: 'player1',
            boxes: ["", "", "", "", "", "", "", "", ""]
        }
    }
    usersSearching.push(emptyRoom)
}

function addToRoom(player2Id) {
    // select first object of usersSearching
    usersSearching[0].player2 = usersSearching[0].player1 === player2Id ? player2Id + '2' : player2Id;
    moveRoom();
}

function moveRoom(roomId) {
    filledGames.push(usersSearching[0]);
    usersSearching.shift();
}


const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // User.findById(id, function(err, user) {
    done(null, user);
    // });
});


app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: "removed",
    clientSecret: "removed",
    callbackURL: "http://hostmydb.com:5000/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        // this is where you pull from the database
        /*User.findOrCreate({ googleId: profile.id }, function (err, user) {
         return cb(err, user);
        }); */
        return done(null, profile);
    }
));


app.get('/failed', (req, res) => res.send('you failed to login'))
app.get('/good', isLoggedIn, (req, res) => res.json(req.user))

app.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/failed' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/good');
    });

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})


http.listen(port, () => {

})