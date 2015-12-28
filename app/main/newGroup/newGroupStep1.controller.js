'use strict';
(function () {
  angular.module('main').controller('NewGroupStep1Ctrl', [
    '$scope',
    'popService',
    '$state',
    '$filter',
    newGroupStep1Ctrl
  ]);
  function newGroupStep1Ctrl ($scope, popService, $state, $filter) {
    var vm = this;
    var $translate = $filter('translate');

    vm.form = {
      name: ''
    };

    vm.next = function (name) {

      // validate
      if (!name || name === '') {
        popService.alert($translate('pleaseEnterGroupName'));
        return;
      }

      $state.go('layout.newGroupFin', {
        name: name
      });
    };

    //init
    (function () {

    })();
  }
})();
