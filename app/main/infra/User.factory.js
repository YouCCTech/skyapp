'use strict';
(function () {
  angular.module('main').factory('UserFactory', [
    'skypeService',
    'safeApply',
    'PersonFactory',
    '$q',
    'ConversationsManagerFactory',
    UserFactory
  ]);
  function UserFactory (skypeService, safeApply, PersonFactory, $q, ConversationsManagerFactory) {

    function User (json) {
      angular.extend(this, json);
      this.persons = [];
      this.groups = [];
      this.personsLoading = false;
      this.conversationsManager = ConversationsManagerFactory.build(this.id);
    }

    User.prototype.createNewGroupConversation = function (participants, name) {
      this.conversationsManager.createNewGroupConversation(participants, name);
    };

    User.prototype.beginConversationByPerson = function (person) {
      this.conversationsManager.beginConversationByPerson(person);
    };

    User.prototype.beginConversation = function (conversation) {
      this.conversationsManager.beginConversation(conversation);
    };

    User.prototype.getCurrentConversation = function () {
      return this.conversationsManager.getCurrentConversation();
    };

    User.prototype.getConversations = function () {
      var _this = this;

      var personsAndGroupsManager = skypeService.getPersonsAndGroupsManager();

      _this.personsLoading = true;
      personsAndGroupsManager.all.persons.get()
        .then(function (persons) {
          safeApply.apply(function () {

            _this.personsLoading = false;

            _.each(persons, function (person) {
              _this.persons.push(PersonFactory.build(person));
            });

          });
        });

      //personsAndGroupsManager.all.groups.get()
      //  .then(function (groups) {
      //    safeApply.apply(function () {
      //      _.each(groups, function (group) {
      //        _this.groups.push(group);
      //      });
      //    });
      //  });


      //conversationsManager.conversations.get().then(function(conversationsArray){
      //  if(conversationsArray && conversationsArray.length > 0) {
      //    //$('#status').text('Disconnected existed conversation.');
      //    conversationsArray.forEach(function (element, index, array) {
      //      //console.log("Closing existed conversation...");
      //      //element.chatService.stop();
      //      console.log('element: ', element);
      //    })
      //  }
      //});

      //conversationsManager.getMoreConversations(function (conversations) {
      //  console.log('conver', conversations);
      //});

      //var persons = skypeService.getAllPersons();
      //
      //persons.subscribe();
      //
      //// adding the user contacts
      //persons.added(function (contact) {
      //
      //  _this.conversations.push(
      //    ConversationFactory.build(contact)
      //  );
      //});

      // todo groups
      //var groups = skypeService.getAllGroups();
      //
      //groups.subscribe();
      //
      //// adding the groups contacts
      //groups.added(function (contact) {
      //
      //  _this.conversations.push(
      //    ConversationFactory.build(contact)
      //  );
      //});
    };

    User.build = function (data) {
      var user = new User(data);

      user.getConversations();

      return user;
    };

    return User;
  }
})();
