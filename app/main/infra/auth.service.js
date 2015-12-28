'use strict';
(function () {
  angular.module('main').service('authService', ['$q', 'skypeService', authService]);
  function authService ($q, skypeService) {

    var SIGNED_IN_STATE = 'SignedIn';

    /***
     * authorize - check if the user allowed to view this state if not redirect them to login
     *
     * @param toState {object}
     * @returns {jQuery.promise|promise.promise|d.promise|promise|.ready.promise|Q.promise|*}
     */
    this.authorize = function (toState) {
      var deferred = $q.defer();

      var isSignedIn = skypeService.states.signInState === SIGNED_IN_STATE;

      if (isSignedIn) {
        // if user signed in -> authorized
        deferred.resolve(true);
      } else {
        // if user signed out -> not authorized
        if (toState.name !== 'login') {
          deferred.resolve(false);
        }
      }

      return deferred.promise;
    };
  }
})();
