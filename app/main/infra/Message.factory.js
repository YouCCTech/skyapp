'use strict';
(function () {
  angular.module('main').factory('MessageFactory', ['safeApply', MessageFactory]);
  function MessageFactory (safeApply) {

    function Message (msgOrig, conversation) {
      var _this = this;

      this.text = msgOrig.text();
      this.direction = msgOrig.direction();
      this.date = msgOrig.timestamp();
      this.avatarUrl = msgOrig.sender.avatarUrl();
      this.username = msgOrig.sender.displayName();
      this.userId = msgOrig.sender.id();

      // if msg is outgoing -> registering to status changes
      if (this.direction === 'Outgoing') {
        this.status = '';
        msgOrig.status.changed(function (status) {
          safeApply.apply(function () {
            _this.status = status;
          });

          conversation.updateStorage();
        });
        msgOrig.status.subscribe();
      }
    }

    Message.build = function (data, conversation) {
      return new Message(data, conversation);
    };

    return Message;
  }
})();
