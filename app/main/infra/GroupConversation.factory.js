'use strict';
(function () {
  angular.module('main').factory('GroupConversationFactory', [
    'PersonFactory',
    'skypeService',
    'MessageFactory',
    '$q',
    '$filter',
    GroupConversationFactory
  ]);
  function GroupConversationFactory (PersonFactory, skypeService, MessageFactory, $q, $filter) {

    function GroupConversation (participants, name, messages, manager) {
      this.type = 'GroupConversation';
      this.participants = _.map(participants, function (p) { return PersonFactory.build(p); });
      this.messages = messages || [];
      this.name = name || '';
      this.manager = manager;
      this.skypeConversation = null;
      this.incoming = false;
      this.typingHandler = null;
    }

    GroupConversation.prototype.getLastMessagePreview = function () {
      var result = '';

      var messages = this.messages;
      if (messages && messages.length > 0) {
        var msg = messages[messages.length - 1];
        if (msg.direction === 'Outgoing') {
          result = '- ' + msg.text;
        } else {
          result = $filter('displayname')(msg.username) + ': ' + msg.text;
        }
      }

      return result;
    };

    GroupConversation.prototype.begin = function (newConversation) {
      var _this = this;
      this.incoming = !!newConversation;
      var skypeConversationsManager = skypeService.getConversationsManager();

      if (this.incoming) {

        this.skypeConversation = newConversation;
      } else {
        // creating the conversation
        var conversation = this.skypeConversation = skypeConversationsManager.createConversation();

        // add this conversation to the conversations collection
        skypeConversationsManager.conversations.add(conversation);

        _.each(_this.participants, function (person) {

          // adding participant to conversation
          var conversationParticipant = conversation.createParticipant(person.original);
          conversation.participants.add(conversationParticipant);
        });
      }
    };

    GroupConversation.prototype.start = function () {
      var deferred = $q.defer();
      var conversation = this.skypeConversation;
      var startFn = null;

      if (this.incoming) {

        // incoming conversation -> accept conversation
        startFn = conversation.chatService.accept;
      } else {

        // outGoing conversation -> start
        startFn = conversation.chatService.start;
      }

      // starting the conversation
      startFn().then(function () {
        console.log('### chat started.');

        conversation.chatService.state.changed(function (newState) {
          if (newState === 'Connected') {
            // connected to conversation
            deferred.resolve(true);
          }
        });

      }, function (err) {
        console.error('Error! chatService start', err);

        // not connected to conversation
        deferred.resolve(false);
      });

      return deferred.promise;
    };

    GroupConversation.prototype.stop = function () {
      var deferred = $q.defer();

      var _this = this;

      this.skypeConversation.leave()
        .then(function () {
          // clean current conversation states
          _this.skypeConversation = null;
          _this.incoming = false;
          _this.typingHandler = null;

          // conversation stopped
          deferred.resolve(true);
        });

      return deferred.promise;
    };

    GroupConversation.prototype.sendMessage = function (msg) {
      return this.skypeConversation.chatService.sendMessage(msg);
    };

    GroupConversation.prototype.sendIsTyping = function () {
      return this.skypeConversation.chatService.sendIsTyping();
    };

    GroupConversation.prototype.onMessageReceived = function (message) {
      this.messages.push(message);
      this.updateStorage();
    };

    GroupConversation.prototype.updateStorage = function () {
      this.manager.updateStorage();
    };

    GroupConversation.prototype.getChatMessages = function (handler) {
      var deferred = $q.defer();
      var _this = this;

      this.skypeConversation.historyService.activityItems.added(function (message) {
        if (message.type() === 'TextMessage') {

          // build Message object
          var msg = MessageFactory.build(message, _this);

          // add message to covnersation
          _this.onMessageReceived(msg);

          // fire message handler
          handler(msg);
        }
      });

      return deferred.promise;
    };
    // todo Conversation.prototype.unregisterGetChatMessages

    GroupConversation.prototype.getChatTypingStates = function (handler) {
      this.typingHandler = handler;

      _.each(this.skypeConversation.participants(), function (participant) {
        participant.chat.isTyping.changed(function (newState) {
          handler({
            user: participant.displayName(),
            typing: newState
          });
        });
      });
    };
    // todo Conversation.prototype.unregisterGetChatTypingStates

    GroupConversation.prototype.toJsonObj = function () {
      var _this = this;

      var participants = _.map(_this.participants, function (p) {
        return {
          personId: p.id,
          displayName: p.displayName
        };
      });

      return {
        type: _this.type,
        name: _this.name,
        participants: participants,
        messages: _this.messages
      };
    };

    GroupConversation.prototype.getParticipants = function () {
      return this.skypeConversation.participants();
    };

    GroupConversation.fromJsonObj = function (jsonObj, manager) {
      var participants = _.map(jsonObj.participants, function (p) { return PersonFactory.build(p.personId); });
      return new GroupConversation(participants, jsonObj.name, jsonObj.messages, manager);
    };

    GroupConversation.build = function (participants, name, messages, manager) {
      return new GroupConversation(participants, name, messages, manager);
    };

    return GroupConversation;
  }
})();
