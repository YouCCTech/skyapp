'use strict';
(function () {
  angular.module('main').controller('NewChatCtrl', [
    '$scope',
    'ManagerService',
    newChatCtrl
  ]);
  function newChatCtrl ($scope, ManagerService) {
    var vm = this;

    vm.uiStates = {
      showSearch: false
    };
    vm.filter = {
      displayName: ''
    };

    vm.showSearch = function () {
      vm.uiStates.showSearch = true;
    };

    vm.hideSearch = function () {
      vm.uiStates.showSearch = false;
      vm.filter.displayName = '';
    };

    //init
    (function () {
      vm.user = ManagerService.getUser();
    })();
  }
})();
