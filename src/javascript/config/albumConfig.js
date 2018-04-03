requirejs.config({
    baseUrl: './src/javascript/component',
    paths: {
        'jquery': '../lib/jquery-3.3.1.min',
        'lib': '../lib'
    }
})
requirejs(['../album'])