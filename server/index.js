// -------
// Imports
// -------

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

// Redux
const { createStore, applyMiddleware } = require('redux');
const thunk = require('redux-thunk').default;
const ballGameApp = require('./reducers');
const {
  addPlayer,
  deletePlayer,
  addBall,
  deleteBall,
} = require('./actions');


const PORT = process.env.PORT ? process.env.PORT : 3001;

// ------------
// App creation
// ------------

// Create express App
const app = express();
app.use(cors());
const server = http.createServer(app);

// Create socket
const io = socketIo(server);

// Redux
// const store = createStore(ballGameApp, applyMiddleware(thunk));
const store = createStore(ballGameApp, applyMiddleware(thunk));

// ------------
// API Requests
// ------------
io.on('connection', (socket) => {
  // Connection
  store.dispatch(addPlayer(socket.id));
  // Send new playersList to each players
  let players = store.getState().players;
  io.emit('updatePlayers', players);
  // Send player info to new player
  const player = players.find(p => p.id === socket.id);
  io.to(player.id).emit('updatePlayer', player);
  io.to(player.id).emit('updateBalls', store.getState().balls);

  // Add ball
  socket.on('addBall', (color) => {
    store.dispatch(addBall(socket.id, color));
    io.emit('updateBalls', store.getState().balls);
    io.emit('updatePlayers', store.getState().players);
  })

  // Delete ball
  socket.on('deleteBall', (ballId) => {
    store.dispatch(deleteBall(socket.id, ballId));
    io.emit('updateBalls', store.getState().balls);
    io.emit('updatePlayers', store.getState().players);
  })

  // Disconnection
  socket.on('disconnect', () => {
    store.dispatch(deletePlayer(socket.id));
    // Send new playersList to each players
    io.emit('updatePlayers', store.getState().players);
  });
});

// ---------------------------------------
// Makes the App listen to the port [PORT]
// ---------------------------------------

server.listen(PORT, () => {
    console.log('App is running on port ' + PORT);
});

