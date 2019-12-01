import { writable } from 'svelte/store';

export const playerStore = writable({
    id: null,
    name: null,
    score: 0,
});

export const playersStore = writable([]);

export const ballsStore = writable([]);
