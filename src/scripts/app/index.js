'use strict';

var moment = require('moment'),
    angular = require('angular'),
    ngRoute = require('angular-route'),
    ngAnimate = require('angular-animate');

require('angular-loading-bar');

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

//Dictionary to translate icon names to resurce names
var iconDefinitions = {
    '01d' : 'wi wi-day-sunny',
    '01n' : 'wi wi-night-clear',
    '02d' : 'wi wi-day-sunny-overcast',
    '02n' : 'wi wi-night-cloudy',
    '03d' : 'wi wi-cloud',
    '03n' : 'wi wi-cloud',
    '04d' : 'wi wi-cloudy',
    '04n' : 'wi wi-cloudy',
    '09d' : 'wi wi-sprinkle',
    '09n' : 'wi wi-sprinkle',
    '10d' : 'wi wi-day-showers',
    '10n' : 'wi wi-night-showers'
}

module.exports = function init() {
    var app = angular.module('sunshine', [ngRoute, ngAnimate, 'angular-loading-bar']);

    app.controller('WeatherController', ['$window', 'WeatherService', function ($window, weatherService) {
        this.location = $window.localStorage.getItem('sunshine.settings.location');

        this.forecasts = [];
        this.selectedForecast = null;
        this.selectedForecastIdx = 0;

        weatherService
            .fetchWeeklyForecastFor(this.location)
            .then(response => {
                this.forecasts = response.data.list;
                this.selectedForecast = this.forecasts[0];
            });


        this.isLocationSet = () => !!$window.localStorage.getItem('sunshine.settings.location');
        this.selectForecast = (idx) => {
            this.selectedForecast = this.forecasts[idx];
            this.selectedForecastIdx = idx;
        };
        this.isForecastSelected = (idx) => {
            return this.selectedForecastIdx === idx;
        };

        this.sunshineIconFor = (icon) => {
            //If the icon is not in the dict, default to '' (no icon)
            return iconDefinitions[icon] || '';
        };
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

    app.config(['cfpLoadingBarProvider', function (LoadingBarProvider) {
        LoadingBarProvider.includeSpinner = false;
    }]);

    return app;
};
