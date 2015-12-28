'use strict';
(function () {
  angular.module('main').factory('ConversationFactory', [
    'PersonFactory',
    'skypeService',
    'MessageFactory',
    '$q',
    ConversationFactory
  ]);
  function ConversationFactory (PersonFactory, skypeService, MessageFactory, $q) {

    function Conversation (person, messages, manager) {
      this.type = 'Conversation';
      this.person = PersonFactory.build(person);
      this.messages = messages || [];
      this.manager = manager;
      this.skypeConversation = null;
      this.incoming = false;
      this.typingHandler = null;
    }

    Conversation.prototype.getLastMessagePreview = function () {
      var result = '';

      var messages = this.messages;
      if (messages && messages.length > 0) {
        var msg = messages[messages.length - 1];
        result = msg.text;
        if (msg.direction === 'Outgoing') {
          result = '- ' + msg.text;
        }
      }

      return result;
    };

    Conversation.prototype.begin = function (newConversation) {
      var _this = this;
      this.incoming = !!newConversation;
      var skypeConversationsManager = skypeService.getConversationsManager();

      if (this.incoming) {

        this.skypeConversation = newConversation;
      } else {

        this.skypeConversation = skypeConversationsManager.getConversation(_this.person.original);
      }
    };

    Conversation.prototype.start = function () {
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

    Conversation.prototype.stop = function () {
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

    Conversation.prototype.sendMessage = function (msg) {
      return this.skypeConversation.chatService.sendMessage(msg);
    };

    Conversation.prototype.sendIsTyping = function () {
      return this.skypeConversation.chatService.sendIsTyping();
    };

    Conversation.prototype.onMessageReceived = function (message) {
      this.messages.push(message);
      this.updateStorage();
    };

    Conversation.prototype.updateStorage = function () {
      this.manager.updateStorage();
    };

    Conversation.prototype.getChatMessages = function (handler) {
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

    Conversation.prototype.getChatTypingStates = function (handler) {
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

    Conversation.prototype.toJsonObj = function () {
      var _this = this;

      return {
        type: _this.type,
        person: {
          personId: _this.person.id,
          displayName: _this.person.displayName
        },
        messages: _this.messages
      };
    };

    Conversation.prototype.getParticipants = function () {
      return this.skypeConversation.participants();
    };

    Conversation.fromJsonObj = function (jsonObj, manager) {
      return new Conversation(jsonObj.person.personId, jsonObj.messages, manager);
    };

    Conversation.build = function (person, messages, manager) {
      return new Conversation(person, messages, manager);
    };

    return Conversation;
  }
})();
