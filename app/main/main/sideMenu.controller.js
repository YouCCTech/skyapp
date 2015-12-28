'use strict';
(function () {
  angular.module('main').controller('SideMenuCtrl', [
    '$scope',
    'ManagerService',
    '$state',
    '$ionicLoading',
    SideMenuCtrl
  ]);
  function SideMenuCtrl ($scope, ManagerService, $state, $ionicLoading) {

    var vm = this;

    vm.signOut = function () {

      //todo

      //$ionicLoading.show({
      //  template: '<ion-spinner style="color: #fff;" icon="ripple"></ion-spinner>'
      //});
      //
      //ManagerService.signOut()
      //  .then(goToLogin, goToLogin);
      //
      //function goToLogin () {
      //  $state.go('login');
      //  $ionicLoading.hide();
      //}
    };

    // Init
    (function init () {

      vm.user = ManagerService.getUser();

    })();
  }
})();
