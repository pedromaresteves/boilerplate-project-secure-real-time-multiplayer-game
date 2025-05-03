require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expect = require('chai');
const socket = require('socket.io');
const cors = require('cors');
const Col = require("./public/Collectible.mjs")

const fccTestingRoutes = require('./routes/fcctesting.js');
const runner = require('./test-runner.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use('/assets', express.static(process.cwd() + '/assets'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//For FCC testing purposes and enables user to connect from outside the hosting platform
app.use(cors({origin: '*'})); 

// Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  }); 

//For FCC testing purposes
fccTestingRoutes(app);
    
// 404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

const portNum = process.env.PORT || 3000;

// Set up server and tests
const server = app.listen(portNum, () => {
  console.log(`Listening on port ${portNum}`);
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

let buiscuitPosition;
buiscuitPosition = Col.findPosition();

const io = socket(server);
let liveUsers = [];
io.on('connection', (socket) => {

  socket.emit("client_id", socket.id);

  liveUsers.push({id: socket.id});

  io.emit("buiscuit_position", buiscuitPosition)

  socket.on("created_player", player => {
    liveUsers.forEach(user => {
      if(user.id === player.id){
        user.position = player.position;
      }
    });
    io.emit("new_players", liveUsers);
  });

  socket.on("player_moved", player =>{
    liveUsers.forEach(user => {
      if(user.id === player.id){
        user.position = player.position;
      }
    });
    io.emit("all_players", liveUsers);
  });

  socket.on("update_score", playerWhoScored => {
    liveUsers.forEach(user => {
      if(user.id === playerWhoScored.id){
        user.points = playerWhoScored.points;
      }
    });
    buiscuitPosition = Col.findPosition();
    io.emit("buiscuit_position", buiscuitPosition);
    io.emit("all_players", liveUsers);
  });

  socket.on('disconnect', () => {
    liveUsers = liveUsers.filter(item => {
      return item.id !== socket.id;
    });
    io.emit('player_left', socket.id)
  });

});

module.exports = app; // For testing
