'use strict';

var angular = require('angular'),
    ngRoute= require('angular-route');

module.exports = function init() {
    var app = angular.module('sunshine', [ngRoute]);

    app.controller('WeatherController', function ($window) {
        this.location = $window.localStorage.getItem('sunshine.settings.location');

        this.forecasts = [
            {
                "dt": 1429113600,
                "temp": {
                    "day": 30.01,
                    "min": 23.42,
                    "max": 30.8,
                    "night": 23.42,
                    "eve": 28.18,
                    "morn": 26.16
                },
                "pressure": 1007.19,
                "humidity": 77,
                "weather": [
                    {
                        "id": 500,
                        "main": "Rain",
                        "description": "light rain",
                        "icon": "10d"
                    }
                ],
                "speed": 1.61,
                "deg": 117,
                "clouds": 20,
                "rain": 1.05
            },
            {
                "dt": 1429200000,
                "temp": {
                    "day": 25.52,
                    "min": 20.14,
                    "max": 26.24,
                    "night": 22.71,
                    "eve": 26.24,
                    "morn": 20.14
                },
                "pressure": 1007.82,
                "humidity": 69,
                "weather": [
                    {
                        "id": 500,
                        "main": "Rain",
                        "description": "light rain",
                        "icon": "10d"
                    }
                ],
                "speed": 1.86,
                "deg": 113,
                "clouds": 80
            },
            {
                "dt": 1429286400,
                "temp": {
                    "day": 26.83,
                    "min": 19.52,
                    "max": 28.55,
                    "night": 22.26,
                    "eve": 26.7,
                    "morn": 19.52
                },
                "pressure": 1007.19,
                "humidity": 64,
                "weather": [
                    {
                        "id": 801,
                        "main": "Clouds",
                        "description": "few clouds",
                        "icon": "02d"
                    }
                ],
                "speed": 2.02,
                "deg": 130,
                "clouds": 20
            }
        ];
        this.selectedForecast = this.forecasts[0];

        this.isLocationSet = () => !!$window.localStorage.getItem('sunshine.settings.location');
        this.selectForecast = (idx) => this.selectedForecast = this.forecasts[idx];
    });

    app.controller('SettingsController', function ($window) {
        this.location = '';

        this.updateLocation = () => {
            $window.localStorage.setItem('sunshine.settings.location', this.location);
        };

        this.isLocationSet = () => !!$window.localStorage.getItem('sunshine.settings.location');
    });

    return app;
};
