'use strict';
(function () {
  angular.module('main').directive('fallbackDefaultAvatarImg', [fallbackDefaultAvatarImg]);
  function fallbackDefaultAvatarImg () {
    return {
      link: function postLink (scope, element, attrs) {
        element.bind('error', function () {
          angular.element(this).attr('src', '/img/default-avatar.png');
        });
      }
    };
  }
})();
