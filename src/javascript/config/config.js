requirejs.config({
    baseUrl: './src/Javascript/component',
    paths: {
        'jquery': '../lib/jquery-3.3.1.min',
        'lib': '../lib'
    }
})
requirejs(['../index.js'])
