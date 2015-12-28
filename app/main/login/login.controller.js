'use strict';
(function () {
  angular.module('main').controller('LoginCtrl', ['$scope', 'ManagerService', '$state', 'popService', '$timeout', '$filter', 'Config', LoginCtrl]);

  function LoginCtrl ($scope, ManagerService, $state, popService, $timeout, $filter, Config) {
    var vm = this;
    var $translate = $filter('translate');

    vm.loginData = {
      username: Config.ENV.LOGIN_USER,
      password: Config.ENV.LOGIN_PW
    };

    vm.skypeStates = ManagerService.skypeStates;

    vm.doLogin = function (data) {
      console.log('do login: ', data);
      var username = data.username;
      var password = data.password;

      if (!username || username === '' || !password || password === '') {
        popService.alert($translate('authorizationProblem'), $translate('wrongUserOrPw'));
        return;
      }

      ManagerService.login(username, password)
        .then(function (result) {

          // check auth result
          if (result.error) {
            popService.alert($translate('authorizationProblem'), $translate('wrongUserOrPw'));
            return;
          }

          $state.go('layout.conversations');

        }, function (error) {
          popService.alert($translate('authorizationProblem'), $translate('generalProblem'));
          console.log('Error - do login', error);
        });
    };

    // init
    (function init () {
      ManagerService.init();

      $timeout(function () {
        //tryLogin(vm.loginData);
      }, 400);

      function tryLogin (data) {
        if (vm.skypeStates.signInState) {

          vm.doLogin(data);

        } else {
          $timeout(function () {
            tryLogin(data);
          }, 400);
        }
      }
    })();

  }
})();
