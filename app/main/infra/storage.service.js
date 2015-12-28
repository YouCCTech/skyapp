'use strict';
(function () {
  angular.module('main').service('storageService', ['$window', storageService]);
  function storageService ($window) {
    var pre = 'v0.1-';

    this.set = function (key, value) {
      $window.localStorage[pre + key] = value;
    };
    this.get = function (key, defaultValue) {
      return $window.localStorage[pre + key] || defaultValue;
    };
    this.setObject = function (key, value) {
      $window.localStorage[pre + key] = JSON.stringify(value);
    };

    this.getObject = function (key) {
      var json = $window.localStorage[pre + key];
      return json && JSON.parse(json);
    };
  }
})();

