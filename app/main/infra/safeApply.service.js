'use strict';
(function () {
  angular.module('main').service('safeApply', ['$rootScope', safeApply]);
  function safeApply ($rootScope) {

    this.apply = function (fn) {
      var phase = $rootScope.$$phase;
      if (phase === '$apply' || phase === '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        $rootScope.$apply(fn);
      }
    };
  }
})();
