<script>
  import { Table } from 'sveltestrap';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { playersStore } from '../ballGameStore';
</script>

<Table
  variant="light"
  striped
  borderless
  class="mt-2 text-center"
>
  <thead>
    <tr>
      <th scope='col'>Rank</th>
      <th scope='col' style="width: 50%">Name</th>
      <th scope='col'>Score</th>
    </tr>
  </thead>
  <tbody>
      {#each $playersStore as player, i (player.id)}
          <tr animate:flip>
            <th scope='row'>{ i + 1 }</th>
            <td>{ player.name }</td>
            <td>{ player.score }</td>
          </tr>
      {/each}
  </tbody>
</Table>
