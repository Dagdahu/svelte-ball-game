<script>
    import { Container, Row, Col } from 'sveltestrap';
    import { playerStore, playersStore } from '../ballGameStore.js';
    
    let player; 
    let players;
	$: console.log({players})

    $: if (player.id && players.length) {
        const index = players.findIndex(p => p.id === player.id);
        player.rank = index + 1;
        player.score = players[index].score;
    }

    playerStore.subscribe(storedPlayer => {
        player = {...player, ...storedPlayer};
    });
	playersStore.subscribe(storedPlayers => {
        players = storedPlayers;
	});
</script>


<Container class="mt-3">
    <Row class="text-center">
        <Col>
            <h3>
                You
            </h3>
            <p>
                { player.name || '-' }
            </p>
        </Col>
        <Col>
            <h3>
                Score
            </h3>
            <p>
                { player.score === 1 ? player.score + " pt" : player.score + " pts" }
            </p>
        </Col>
        <Col>
            <h3>
                Rank
            </h3>
            <p>
                { !player.rank ? '-' : `${player.rank} / ${players.length}` }
            </p>
        </Col>
    </Row>
</Container>
