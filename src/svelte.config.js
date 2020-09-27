const svPreprocess = require('svelte-preprocess');

module.exports = {
    preprocess: svPreprocess({
        postcss: {
            plugins: [require('autoprefixer')],
        }
    })
};