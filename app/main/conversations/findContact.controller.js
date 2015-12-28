'use strict';
(function () {
  angular.module('main').controller('FindContactCtrl', ['$scope', 'ManagerService', 'PersonFactory', '$log', '$ionicHistory', FindContactCtrl]);
  function FindContactCtrl ($scope, ManagerService, PersonFactory, $log, $ionicHistory) {

    var vm = this;
    vm.query = '';
    vm.contactResults = [];

    vm.search = function (query) {
      console.log('search query: ', query);

      // validate
      if (!query || query === '') {
        return;
      }

      ManagerService.searchContact(query)
        .then(function (contacts) {

          vm.contactResults = _.map(contacts, function (contact) {
            return PersonFactory.build(contact);
          });
        })
        .catch(function (err) {
          $log.error('Error! Search: ', err);
        });
    };

    vm.clearStates = function () {
      vm.query = '';
      vm.contactResults = [];
    };


    // Init
    (function init () {

      vm.user = ManagerService.getUser();
    })();
  }
})();
