'use strict';
(function () {
  angular.module('main').filter('nl2br', [nl2brFilter]);
  function nl2brFilter () {
    return function (data) {
      if (!data) { return data; }
      return data.replace(/\n\r?/g, '<br />');
    };
  }
})();
