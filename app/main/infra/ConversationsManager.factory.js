'use strict';
(function () {
  angular.module('main').factory('ConversationsManagerFactory', [
    'storageService',
    'ConversationFactory',
    'PersonFactory',
    'skypeService',
    '$state',
    '$ionicPopup',
    'GroupConversationFactory',
    'safeApply',
    '$filter',
    ConversationsManagerFactory
  ]);
  function ConversationsManagerFactory (storageService, ConversationFactory, PersonFactory, skypeService, $state, $ionicPopup, GroupConversationFactory, safeApply, $filter) {
    var $translate = $filter('translate');

    function ConversationsManager (userId) {
      this.storageKey = userId + '_user_conversations';
      this.conversations = [];
      this.current = null;
      this.conversationsLoading = false;
      this.getAll();
      this.listenForNewConversations();
    }
    function showConfirm (newConversation, convMan) {
      var myPopup = $ionicPopup.show({
        cssClass: 'incoming-chat-popup',
        template: $translate('callFrom') + ' ' + newConversation.participants()[0].name(),
        title: $translate('incomingCall'),
        buttons: [
          {
            text: $translate('reject'),
            onTap: function (e) {
              return rejectConversation(newConversation);
            }
          },
          {
            text: '<b>' + $translate('accept') + '</b>',
            type: 'button-positive',
            onTap: function (e) {
              return acceptConversation(newConversation, convMan);
            }
          }
        ]
      });
      myPopup.then(function (res) {
        console.log('Tapped!', res);
      });
    }
    function acceptConversation (newConversation, convMan) {
      var INCOMING = true;
      var participants = newConversation.participants();

      if (participants.length === 1) {
        var person = PersonFactory.build(participants[0].person);
        convMan.beginConversationByPerson(person, newConversation);
      }

      // todo handler incoming group conversations
    }
    function rejectConversation (newConversation) {
      // reject conversation
      newConversation.chatService.reject();
    }

    ConversationsManager.prototype.listenForNewConversations = function () {
      var _this = this;
      var skypeConversationsManager = skypeService.getConversationsManager();
      skypeConversationsManager.conversations.added(function (newConversation) {
        if (newConversation.chatService.accept.enabled() &&
            newConversation.chatService.state() === 'Notified') {

          // accept or reject invite, confirm dialog
          showConfirm(newConversation, _this);
        }
      });
    };

    ConversationsManager.prototype.getCurrentConversation = function () {
      return this.current;
    };

    ConversationsManager.prototype.getByContactId = function (id) {
      var conversations = this.conversations;
      var result = null;

      _.each(conversations, function (conversation) {
        if (conversation.type === 'Conversation' &&
            conversation.person.id === id) {
          result = conversation;
        }
      });

      return result;
    };

    ConversationsManager.prototype.getAll = function () {
      this.conversationsLoading = true;
      var _this = this;

      // get json from storage
      var jsonObj = JSON.parse(storageService.getObject(_this.storageKey) || '[]');

      // parse json
      this.conversations = _.map(jsonObj, function (json) {
        if (json.type === 'Conversation') {
          return ConversationFactory.fromJsonObj(json, _this);
        }
        else if (json.type === 'GroupConversation') {
          return GroupConversationFactory.fromJsonObj(json, _this);
        }
      });
      this.conversationsLoading = false;
    };

    ConversationsManager.prototype.updateStorage = function () {
      var _this = this;
      storageService.setObject(_this.storageKey, getConversationJson(_this.conversations));
    };

    ConversationsManager.prototype.beginConversation = function (conversation, incomingNewConversation) {

      // todo handle running conversations

      this.current = conversation;

      // begin conversation
      conversation.begin(incomingNewConversation);

      $state.go('layout.chat');
    };

    ConversationsManager.prototype.beginConversationByPerson = function (person, incomingNewConversation) {

      // look for existing conversation with that person
      var conversation = this.getByContactId(person.id);

      if (!conversation) {
        // case not found -> create conversation
        conversation = ConversationFactory.build(person, null, this);
        this.conversations.push(conversation);
        this.updateStorage();
      }

      // begin that conversation
      this.beginConversation(conversation, incomingNewConversation);
    };

    //todo
    ConversationsManager.prototype.beginGroupConversation = function (name) {

      // look for the group conversation
      //todo
      var groupConversation = null;

      // begin conversation
      this.beginConversation(groupConversation, false);
    };

    ConversationsManager.prototype.createNewGroupConversation = function (participants, name) {
      var _this = this;
      var groupConversation = GroupConversationFactory.build(participants, name, null, this);

      safeApply.apply(function () {
        _this.conversations.push(groupConversation);
      });

      this.updateStorage();
    };


    ///////
    function getConversationJson (conversations) {
      return JSON.stringify(_.map(conversations, function (c) { return c.toJsonObj(); }));
    }

    ConversationsManager.build = function (userId) {
      return new ConversationsManager(userId);
    };

    return ConversationsManager;
  }
})();
