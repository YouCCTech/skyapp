'use strict';
(function () {
  angular.module('main').controller('ConversationsCtrl', [
    '$scope',
    'ManagerService',
    '$ionicModal',
    ConversationsCtrl
  ]);
  function ConversationsCtrl ($scope, ManagerService, $ionicModal) {

    var vm = this;
    vm.findContactModal = null;
    vm.uiStates = {
      loading: true,
      activeTab: 'chats',
      showSearch: false,
      queryTerm: ''
    };
    vm.tabs = {
      chats: 'chats',
      contacts: 'contacts',
      groups: 'groups'
    };


    vm.selectTab = function (tab) {
      vm.uiStates.activeTab = tab;
    };

    vm.openSearchModal = function () {
      // open modal
      vm.findContactModal && vm.findContactModal.show();
    };

    vm.showSearch = function () {
      vm.uiStates.showSearch = true;
    };

    vm.hideSearch = function () {
      vm.uiStates.showSearch = false;
      vm.uiStates.queryTerm = '';
    };

    vm.searchContactSelected = function (contact) {
      vm.beginConversation(contact);
      vm.closeSearchModal();
    };

    vm.closeSearchModal = function () {
      vm.findContactModal && vm.findContactModal.hide();
    };


    // Init
    (function init () {

      vm.user = ManagerService.getUser();

      // init modals
      setupFindContactModal();

      //
      // Events
      $scope.$on('$destroy', function () {
        //Cleanup the modal when we're done
        vm.findContactModal.remove();
      });

    })();

    function setupFindContactModal () {
      $ionicModal.fromTemplateUrl('main/conversations/findContact.html', {
        scope: $scope.$new(),
        animation: 'slide-in-up',
        focusFirstInput: true
      })
        .then(function (modal) {
          vm.findContactModal = modal;
        });
    }
  }
})();
