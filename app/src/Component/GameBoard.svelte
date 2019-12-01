<script>
  import { ballsStore } from '../ballGameStore.js';
  import { scale, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';

  import { 
      Card,
      CardHeader,
      CardBody,
      ButtonToolbar, 
      Button 
  } from 'sveltestrap';

  export let socket;
  let balls = [];

  const bgColor = ['bg-primary', 'bg-danger', 'bg-secondary'];
  const BLUE = 0;
  const RED = 1;

  let wait = false;
  let delay = 5000; // Delay in ms

  let chronoTick = 1000; // Tick in ms
  let chrono = 0;
  $: timer = Math.trunc(chrono / 1000);

  // Animations parameters
  let dx = 50;
  let duration = 0;

  const launchChrono = (newChrono) => {
    chrono = newChrono;
    if(chrono <= 0) {
      wait = false;
      return;
    }
    else {
      wait = true;
      setTimeout(() => {
        launchChrono(newChrono - chronoTick);
      }, chronoTick);
    }
  }

  const addBall = (color) => {
    if (socket && !wait) {
      socket.emit('addBall', color);
      launchChrono(delay);
    }
  }

  const removeBall = (event) => {
    if (socket && !wait) {
      socket.emit('deleteBall', event.target.attributes.key.value);
      launchChrono(delay);
    }
  }

  ballsStore.subscribe(storedBalls => {
    balls = storedBalls;
  })
</script>

<style>
  .tran {
    transition: all .5s ease-in-out;
  }

  .ball {
      display: block;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-bottom: .5rem;
  }

  h2 {
    margin: auto;
    color: gray;
    width: 3rem;
  }
</style>

<Card>
  <CardHeader>
    <ButtonToolbar class="tran">
      <Button color="primary" class="m-auto tran" disabled={wait} on:click={() => addBall(BLUE)}>
        Add a blue ball
      </Button>
        <h2 class="align-middle text-center" key={timer}>
          {timer || 'Go'}
        </h2>
      <Button color="danger" class="m-auto tran" disabled={wait} on:click={() => addBall(RED)}>
        Add a red ball
      </Button>
    </ButtonToolbar>
  </CardHeader>
  <CardBody>
    <h3 class="text-secondary text-center mb-4">
      Delete a ball
    </h3>
    <ul class="list-inline" on:click={removeBall}>
      {#each balls as ball (ball.id)}
          <li
            animate:flip={{duration: 400}}
            transition:fly={{x: 50}}
            class={`${bgColor[ball.color]} float-left list-inline-item ball tran`}
            key={ball.id}
          />
      {/each}
    </ul>
  </CardBody>
</Card>
