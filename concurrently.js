const concurrently = require('concurrently');

concurrently([
    "npm run svelte-dev",
    "npm run start"
], {
    killOthers: (process.argv[2] == "-bg") ? [] : ['failure', 'success'],
    restartTries: 0,
});