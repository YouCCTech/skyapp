'use strict';
(function () {
  angular.module('main').controller('NewGroupCtrl', [
    '$scope',
    'ManagerService',
    '$stateParams',
    'popService',
    '$state',
    '$filter',
    newGroupCtrl
  ]);
  function newGroupCtrl ($scope, ManagerService, $stateParams, popService, $state, $filter) {
    var vm = this;
    var $translate = $filter('translate');

    vm.uiStates = {
    };

    vm.createGroup = function (persons) {

      var selectedContacts = angular.copy(_.filter(persons, {checked: true}));

      // validate
      if (selectedContacts.length === 0) {
        popService.alert($translate('pleaseChooseParticipants'));
        return false;
      }

      vm.user.createNewGroupConversation(selectedContacts, $stateParams.name);

      vm.clearNewGroupStates();

      $state.go('layout.conversations');
    };

    vm.clearNewGroupStates = function () {
      _.each(vm.user.conversations, function (contact) {
        delete contact.checked;
      });
    };

    //init
    (function () {
      vm.user = ManagerService.getUser();
    })();
  }
})();
