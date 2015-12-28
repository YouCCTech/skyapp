'use strict';
(function () {
  angular.module('main').service('skypeService', ['safeApply', '$q', 'Config', skypeService]);
  function skypeService (safeApply, $q, Config) {

    var client = null;

    // skype states object
    this.states = {
      signInState: null,
      me: {
        displayName: '',
        title: '',
        email: ''
      }
    };

    this.getPersonsAndGroupsManager = function () {
      return client.personsAndGroupsManager;
    };

    this.getConversationsManager = function () {
      return client.conversationsManager;
    };

    /**
     * bindEvents - binding skype api events
     */
    this.bindEvents = function () {
      var _this = this;

      // signIn state
      client.signInManager.state.changed(function (state) {
        safeApply.apply(function () {
          _this.states.signInState = state;
        });
      });

      client.personsAndGroupsManager.mePerson.displayName.changed(function (value) {
        safeApply.apply(function () {
          _this.states.me.displayName = value;
        });
      });
      client.personsAndGroupsManager.mePerson.title.changed(function (value) {
        safeApply.apply(function () {
          _this.states.me.title = value;
        });
      });
      client.personsAndGroupsManager.mePerson.email.changed(function (value) {
        safeApply.apply(function () {
          _this.states.me.email = value;
        });
      });
    };

    /**
     * init Skype and get the client object
     */
    this.init = function () {
      var deferred = $q.defer();

      var _this = this;

      Skype.initialize({
        apiKey: 'SWX-BUILD-SDK'
      }, function (api) {

        client = new api.application();

        // bind events from skype api
        _this.bindEvents();

        deferred.resolve(true);

      }, function (err) {

        console.log('Error! Skype.initialize: ' + err);
        deferred.reject(err);
      });

      return deferred.promise;
    };

    /**
     * signIn - sign in to Skype web api
     *
     * @param username {string}
     * @param password {string}
     * @returns {promise}
     */
    this.signIn = function (username, password) {
      return client.signInManager.signIn({
        username: username,
        password: password,
        root: {
          user: Config.ENV.ROOT_USER,
          xframe: Config.ENV.ROOT_XFRAME
        }
      });
    };

    /**
     * signOut - sign out of Skype Api
     *
     * @returns {promise}
     */
    this.signOut = function () {
      return client.signInManager.signOut();
    };

  }
})();
