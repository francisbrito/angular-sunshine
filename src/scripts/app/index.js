'use strict';

var angular = require('angular'),
    angularRoute = require('angular-route');

var SettingsController = require('./controllers/settings');

module.exports = function init() {
    console.log('Application initialized.');

    return angular.module('sunshine', [angularRoute])
    .config(($routeProvider) => {
        $routeProvider.when('/', {
            template: '<h1>It works!</h1>'
        })
        .when('/settings', {
            controller: SettingsController,
            templateUrl: '/templates/settings.html',
            controllerAs: 'settings'
        });
    });
};
