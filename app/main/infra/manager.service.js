'use strict';
(function () {
  angular.module('main').service('ManagerService', [
    '$q',
    'UserFactory',
    '$rootScope',
    'skypeService',
    'popService',
    '$state',
    '$filter',
    '$ionicPopup',
    'MessageFactory',
    ManagerService
  ]);
  function ManagerService ($q, UserFactory, $rootScope, skypeService, popService, $state, $filter, $ionicPopup, MessageFactory) {

    var user = null;
    var $translate = $filter('translate');


    /**
    /* Public
    */

    var SEARCH_CONTACT_LIMIT = 20;
    this.skypeStates = skypeService.states;
    this.personsAndGroupsManager = null;
    this.conversationsManager = null;
    this.currChat = {
      incoming: false,
      conversation: null,
      typingHandler: null
    };

    this.init = function () {
      var _this = this;

      skypeService.init()
        .then(function (result) {
          if (!result) {
            popService.alert($translate('generalProblem'));
            console.log('skypeService.init failed');
            return;
          }

          // setting the Skype managers
          _this.personsAndGroupsManager = skypeService.getPersonsAndGroupsManager();
          _this.conversationsManager = skypeService.getConversationsManager();

        })
        .catch(function (err) {
          console.log('Error! skypeService.init ', err);
        });
    };

    this.setStatus = function (toState) {
      var personsAndGroupsManager = this.personsAndGroupsManager;
      var me = personsAndGroupsManager.mePerson;

      me.status.set(toState).then(function () {
        console.log('### Status set to Online.');
      }).then(null, function (error) {
        console.log('Error! Status set to Online.', error);
      });
    };

    this.signOut = function () {
      return skypeService.signOut();
    };

    this.login = function (username, password) {
      var deferred = $q.defer();
      var _this = this;

      skypeService.signIn(username, password)
        .then(function () {

          var personsAndGroupsManager = _this.personsAndGroupsManager;
          var me = personsAndGroupsManager.mePerson;

          user = UserFactory.build({
            id: me.id(),
            emails: me.emails(),
            displayName: me.displayName(),
            title: me.title(),
            activity: me.activity(),
            avatarUrl: me.avatarUrl(),
            status: me.status()
          });

          _this.setStatus('Online');

          // accessible to other scopes
          $rootScope.user = user;

          deferred.resolve(user);

        }, function (err) {
          console.log('Error! skypeService.signIn: ', err);

          if (err.code === 'InvalidCreds') {
            return deferred.resolve({error: err});
          }

          deferred.reject(err);
        });

      return deferred.promise;
    };

    this.getUser = function () {
      return user;
    };

    this.searchContact = function (q) {
      var deferred = $q.defer();

      var personsAndGroupsManager = this.personsAndGroupsManager;
      var pSearch = personsAndGroupsManager.createPersonSearchQuery();

      pSearch.limit(SEARCH_CONTACT_LIMIT);
      pSearch.text(q);

      pSearch.getMore().then(function (sr) {
        if (sr.length < 1) {
          throw new Error('Contact not found');
        }

        var contacts = _.pluck(sr, 'result');
        deferred.resolve(contacts);

      }).then(null, function (error) {
        console.error('Error search contact: ', error);
        deferred.reject(error);
      });

      return deferred.promise;
    };

    this.beginConversationByContact = function (contact) {
      // todo groups
      //if (_.isArray(contacts)) {
      //  this.beginConversationMultiContacts(contact);
      //} else {

      // 1 on 1 conversation
      this.beginConversationSingleContact(contact);
    };

    this.beginConversationMultiContacts = function (contacts) {
      var deferred = $q.defer();
      var _this = this;

      var conversationsManager = this.conversationsManager;

      // creating the conversation
      var conversation = _this.currChat.conversation = conversationsManager.createConversation();

      // add this conversation to the conversations collection
      conversationsManager.conversations.add(conversation);

      _.each(contacts, function (contact) {

        // adding participant to conversation
        var conversationParticipant = conversation.createParticipant(contact);
        conversation.participants.add(conversationParticipant);
      });

      deferred.resolve(true);
      $state.go('layout.chat');

      return deferred.promise;
    };

    this.beginConversationSingleContact = function (contact) {

      // getting the conversation
      var conversationsManager = this.conversationsManager;
      this.currChat.conversation = conversationsManager.getConversation(contact);

      // adding conversation
      user.newConversation(contact);

      $state.go('layout.chat');
    };

    this.addParticipant = function (person) {
      var _this = this;
      var conversation = this.currChat.conversation;
      var conversationParticipant = conversation.createParticipant(person);

      conversation.participants.add(conversationParticipant);

      conversationParticipant.chat.isTyping.changed(function (newState) {
        _this.currChat.typingHandler({
          user: conversationParticipant.displayName(),
          typing: newState
        });
      });

    };

  }
})();
