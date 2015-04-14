'use strict';

var LOCATION_SETTING_KEY = 'sunshine.settings.location';

class SettingsController {
    constructor($window, $location) {
        this.$window = $window;
        this.$location = $location;

        this.location = '';
    }

    updateLocation() {
        this.$window.localStorage.setItem(LOCATION_SETTING_KEY, this.location);

        this.redirectToIndex();
    }

    redirectToIndex() {
        this.$location.url('/');
    }
}

module.exports = {
    SettingsController: SettingsController,
    LOCATION_SETTING_KEY: LOCATION_SETTING_KEY
};
