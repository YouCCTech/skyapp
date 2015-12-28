'use strict';
(function () {
  angular.module('main').controller('ContactItemCtrl', [
    '$scope',
    ContactItemCtrl
  ]);
  function ContactItemCtrl ($scope) {
    var vm = this;

    // init
    (function () {
      if (!vm.conversation && vm.contact) {
        //case Person
        vm.conversation = {
          type: 'Conversation',
          person: vm.contact
        };
      }
    })();
  }
})();
