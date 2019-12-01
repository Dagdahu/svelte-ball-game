<script>
	import socketIOClient from 'socket.io-client';
	import { onMount } from 'svelte';

	// Store
	import { playerStore, playersStore, ballsStore } from './ballGameStore.js';

	// Style 
	import { Container, Row, Col } from 'sveltestrap';
	import Header from './UI/Header.svelte';

	// Components
	import Player from './Component/Player.svelte';
	import GameBoard from './Component/GameBoard.svelte';
	import ScoreList from './Component/ScoreList.svelte';

	// Constants
	import serverUrl from './const';

	// Variables
	let socket = null;

	// Life Cycle
	onMount(() => {
		// Connect to webSocket
		socket = socketIOClient(serverUrl);

		// Update player on server notification
		socket.on('updatePlayer', (newPlayer) => {
			playerStore.update(() => newPlayer);
		});
		// Update players on server notification
		socket.on('updatePlayers', (newPlayers) => {
			console.log({newPlayers})
			playersStore.update(() => newPlayers.sort((a, b) => b.score - a.score));
		});
		// Update balls on server notification
		socket.on('updateBalls', (newBalls) => {
			ballsStore.update(() => newBalls);
		});

		socket.on('disconnect', () => {
			playerStore.update(() => ({
				name: '',
				id: null,
			}));
			playersStore.update(() => []);
			ballsStore.update(() => []);
		});
	});
</script>

<Header>Ball Game</Header>
<Container>
	<Row>
	<Col>
		<Player />
		<GameBoard socket={socket}/>
	</Col>
	<Col md="4">
		<ScoreList />
	</Col>
	</Row>
</Container>
