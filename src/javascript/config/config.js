requirejs.config({
    baseUrl: './src/JavaScript/component',
    paths: {
        'jquery': '../lib/jquery-3.3.1.min',
        'lib': '../lib'
    }
})
requirejs(['./src/JavaScript/component/index.js'])
