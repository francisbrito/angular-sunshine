'use strict';

var angular = require('angular'),
    angularRoute = require('angular-route');

module.exports = function init() {
    console.log('Application initialized.');

    return angular.module('sunshine', [angularRoute])
    .config(($routeProvider) => {
        $routeProvider.when('/', {
            template: '<h1>It works!</h1>'
        });
    });
};
