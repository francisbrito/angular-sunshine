/* global describe, it, browser, expect, element, by, beforeEach */
'use strict';

describe('settings view', function () {
    beforeEach(function () {
        this.settingsView = element(by.css('.view-settings'));
    }); 

    it('should hide if a location is set.', function () {
        browser.get('http://localhost:3000');
        browser.executeScript('window.localStorage.setItem("sunshine.settings.location", "Santo Domingo, DO");');
        
        expect(this.settingsView.getAttribute('class')).toMatch('ng-hide');
    });
});
