'use strict';

var moment = require('moment'),
    angular = require('angular'),
    ngRoute = require('angular-route');

moment.locale('en', {
    calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : '[last] dddd',
        nextWeek : 'dddd',
        sameElse : 'L'
    }
});

module.exports = function init() {
    var app = angular.module('sunshine', [ngRoute]);

    app.controller('WeatherController', ['$window', 'WeatherService', function ($window, weatherService) {
        this.location = $window.localStorage.getItem('sunshine.settings.location');

        this.forecasts = [];
        this.selectedForecast = {};

        weatherService
            .fetchWeeklyForecastFor(this.location)
            .then(response => {
                this.forecasts = response.data.list;
                this.selectedForecast = this.forecasts[0];
            });


        this.isLocationSet = () => !!$window.localStorage.getItem('sunshine.settings.location');
        this.selectForecast = (idx) => this.selectedForecast = this.forecasts[idx];
    }]);

    app.controller('SettingsController', function ($window) {
        this.location = '';

        this.updateLocation = () => {
            $window.localStorage.setItem('sunshine.settings.location', this.location);
        };

        this.isLocationSet = () => !!$window.localStorage.getItem('sunshine.settings.location');
    });

    app.service('WeatherService', function ($q, $http) {
        return {
            fetchWeeklyForecastFor: (location) => {
                return $q((resolve, reject) => {
                    var url = `http://api.openweathermap.org/data/2.5/forecast/daily?q=${location}&mode=json&units=metric&cnt=7`;

                    var request = $http.get(url);

                    request
                        .success((data, status, header, config) => {
                            resolve({data, status, header, config});
                        })
                        .error((data, status, header, config) => reject({data, status, header, config}));
                });
            }
        };
    });

    app.filter('fromNow', function () {
        return function (date) {
            return moment(date).calendar();
        };
    });

    return app;
};
