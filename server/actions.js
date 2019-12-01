const faker = require('faker');

// Action types
const ADD_PLAYER = 'ADD_PLAYER';
const DELETE_PLAYER = 'DELETE_PLAYER';
const ADD_BALL = 'ADD_BALL';
const DELETE_BALL = 'DELETE_BALL';

// Action Creators
// --- Players
const addPlayer = socketId => ({
    type: ADD_PLAYER,
    id: socketId,
    name: faker.name.firstName(),
});

const deletePlayer = (socketId) => ({
    type: DELETE_PLAYER,
    id: socketId
});

// --- Balls
const addBall = (socketId, color) => ({
    type: ADD_BALL,
    playerId: socketId,
    color: color,
});

const deleteBall = (socketId, ballId) => ({
    type: DELETE_BALL,
    playerId: socketId,
    ballId,
});

// Exports
module.exports = {
    ADD_PLAYER,
    DELETE_PLAYER,
    ADD_BALL,
    DELETE_BALL,
    addPlayer,
    deletePlayer,
    addBall,
    deleteBall,
};
