const { set, filter, flow } = require('lodash/fp');

const uuidv4 = require('uuid/v4');
const {
    ADD_PLAYER,
    DELETE_PLAYER,
    ADD_BALL,
    DELETE_BALL,
} = require('./actions');

const GREY = 2;
const delay = 5000; // Delay between two actions

// Return player with updated lastAction if he can play
const playerCanPlay = (players, playerId, delay) => {
    // Retrieve player
    const player = players.find(p => p.id === playerId);
    if (!player || Date.now() - player.lastAction < delay) {
        // Delay not respected, action is rejected
        return { player, canPlay: false };
    }
    // Player can play, set last action to now
    return { player: set('lastAction', Date.now())(player), canPlay: true };
}

// Return new array of players with updated player
const updatePlayers = (players, player) => players.map(p => {
    if (p.id === player.id) {
        return player;
    }
    return p;
})

// Return new balls array with updated ball color in case of 3 in a row
const addBallCheck = (balls, newBallColor) => {
    // Create new ball
    const newBall = {
        id: uuidv4(),
        color: newBallColor,
    }
    if (balls.length >= 2) {
        // At least 2 balls, check if the third is the same color
        const last2Balls = balls.slice(-2);
        if (last2Balls[0].color === newBall.color
            && last2Balls[1].color === newBall.color) {
                // 3 last balls in a row are the same color, turn them grey
                last2Balls[0].color = GREY;
                last2Balls[1].color = GREY;
                newBall.color = GREY;
                // Merge the 2 last balls and the new one at the end of balls
                return { balls: [...balls.slice(0, -2), ...last2Balls, newBall], found: true};
            }
    }
    return { balls: [...balls, newBall], found: false};
}

// Return new balls array with updated ball color in case of 3 in a row
const deleteBallCheck = (balls, ballId) => {
    const ballIndex = balls.findIndex(ball => ball.id === ballId);
    const firstPart = balls.slice(0, ballIndex);
    const secondPart = balls.slice(ballIndex + 1);
    let found = false;
    if (balls.length > 3 && firstPart.length && secondPart.length) {
        // Check for 3 balls in a row
        const colorToCheck = firstPart[firstPart.length - 1].color;
        if (secondPart[0].color === colorToCheck && colorToCheck !== GREY) {
            if (firstPart.length > 1 && firstPart[firstPart.length -2].color === colorToCheck) {
                // 3 in a row : last two of firstPart and first of secondPart
                firstPart[firstPart.length - 2].color = GREY;
                firstPart[firstPart.length - 1].color = GREY;
                secondPart[0].color = GREY;
                found = true;
            }
            else if (secondPart.length > 1 && secondPart[1].color === colorToCheck) {
                // 3 in a row : last of firstPart and first two of secondPart
                firstPart[firstPart.length - 1].color = GREY;
                secondPart[0].color = GREY;
                secondPart[1].color = GREY;
                found = true;
            }
        }
    }
    return { balls: [...firstPart, ...secondPart], found };
}

// Reducer
const initialState = {
    players: [],
    balls: [],
}
const ballGameApp = (state=initialState, action={}) => {
    switch(action.type) {

        // Players
        case ADD_PLAYER:
            return set('players', 
                [...state.players, {
                    name: action.name,
                    id: action.id,
                    score: 0,
                    lastAction: 0,
                }],
            )(state);
        case DELETE_PLAYER:
            return set('players',
                filter(p => p.id != action.id)(state.players)
            )(state);
            
        // Balls
        case ADD_BALL: {
            // Retrieve player and check if he can play
            const { player, canPlay } = playerCanPlay(state.players, action.playerId, delay);
            if (!canPlay) return state;
            // Add ball and check for 3 of the same color in a row
            const { balls, found } = addBallCheck(state.balls, action.color);
            if (found) player.score += 1;
            // Return new updated state
            return flow(
                set('players', updatePlayers(state.players, player)),
                set('balls', balls)
            )(state);
        }
        case DELETE_BALL: {
            // Retrieve player and check if he can play
            const { player, canPlay } = playerCanPlay(state.players, action.playerId, delay);
            if (!canPlay) return state;
            // Delete ball and check for 3 of the same color in a row
            const { balls, found } = deleteBallCheck(state.balls, action.ballId);
            if (found) player.score += 1;
            // Return new updated state
            return flow(
                set('players', updatePlayers(state.players, player)),
                set('balls', balls)
            )(state);
        }
        default :
            return state;
    }
}

module.exports = ballGameApp;
