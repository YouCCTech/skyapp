'use strict';
(function () {
  angular.module('main').directive('loader', ['$timeout', loaderDirective]);
  function loaderDirective ($timeout) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'main/ux/loader.html',
      scope: {
      }
    };
  }
})();
