'use strict';
(function () {
  angular.module('main').service('popService', ['$ionicPopup', '$filter', popService]);
  function popService ($ionicPopup, $filter) {
    var $translate = $filter('translate');

    this.alert = function (title, msg) {
      $ionicPopup.alert({
        title: title,
        template: msg ? '<div class="alert-container">' + msg + '</div>' : undefined,
        buttons: [
          {
            text: $translate('confirm'),
            type: 'button-positive'
          }
        ]
      });
    };
  }
})();
