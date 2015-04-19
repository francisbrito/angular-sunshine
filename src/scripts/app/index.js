'use strict';

var moment = require('moment'),
    angular = require('angular'),
    ngRoute = require('angular-route'),
    ngAnimate = require('angular-animate');

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
    var app = angular.module('sunshine', [ngRoute, ngAnimate]);

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
            var ret  = 'wi wi-umbrella';

            switch (icon) {
                case '01d':
                    ret = 'wi wi-day-sunny';
                    break;
                case '01n':
                    ret = 'wi wi-night-clear';
                    break;
                case '02d':
                    ret = 'wi wi-day-sunny-overcast';
                    break;
                case '02n':
                    ret = 'wi wi-night-cloudy';
                    break;
                case '03d':
                    ret = 'wi wi-cloud';
                    break;
                case '03n':
                    ret = 'wi wi-cloud';
                    break;
                case '04d':
                    ret = 'wi wi-cloudy';
                    break;
                case '04n':
                    ret = 'wi wi-cloudy';
                    break;
                case '09d':
                    ret = 'wi wi-sprinkle';
                    break;
                case '09n':
                    ret = 'wi wi-sprinkle';
                    break;
                case '10d':
                    ret = 'wi wi-day-showers';
                    break;
                case '10n':
                    ret = 'wi wi-night-showers';
                    break;
            }

            return ret;
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

    return app;
};
