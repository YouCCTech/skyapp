'use strict';
(function () {
  angular.module('main').controller('ChatCtrl', [
    '$scope',
    '$ionicScrollDelegate',
    'ManagerService',
    'safeApply',
    '$log',
    '$ionicModal',
    'popService',
    '$filter',
    chatCtrl
  ]);

  function chatCtrl ($scope, $ionicScrollDelegate, ManagerService, safeApply, $log, $ionicModal, popService, $filter) {
    var vm = this;
    var $translate = $filter('translate');

    /**
     * Variables
     */
    vm.uiStates = {
      doneLoading: false,
      typingMsg: ''
    };
    vm.user = null;
    vm.participants = [];
    vm.chooseContactModal = null;
    vm.messages = [];
    vm.input = {
      message: ''
    };
    var unbindViewEnter = null;
    var unbindViewLeave = null;
    var conversation = null;


    vm.keydown = function (ev, msg) {
      if (ev.keyCode === 13) {
        vm.sendMessage(msg);
      }
    };

    vm.sendMessage = function (msg) {

      // validate
      if (!msg || msg === '') {
        return;
      }
      if (!conversation) {
        return;
      }

      // send message
      conversation.sendMessage(msg)
        .then(function () {

          // clear message input
          vm.input.message = '';

        }, function (err) {
          popService.alert($translate('couldNotSendMessage'));
        });
    };

    vm.openChooseContactModal = function () {
      //todo
      // open modal for choosing participant
      //vm.chooseContactModal.show();
    };

    vm.addParticipant = function (contact) {
      //todo
      // adding the chosen participant
      //ManagerService.addParticipant(contact.original);

      //vm.closeChooseContactModal();
    };

    vm.closeChooseContactModal = function () {
      //todo
      vm.chooseContactModal.hide();
    };

    vm.onTypingEvent = function (event) {
      safeApply.apply(function () {
        if (event.typing) {
          vm.uiStates.typingMsg = event.user + ' ' + $translate('isTyping') + '..';
        } else {
          vm.uiStates.typingMsg = '';
        }

        // scroll to bottom
        $ionicScrollDelegate.scrollBottom();
      });
    };

    vm.onMessageReceived = function (message) {
      safeApply.apply(function () {

        // scroll to bottom
        $ionicScrollDelegate.scrollBottom();
      });
    };

    vm.updateTyping = function () {
      conversation.sendIsTyping();
    };

    // init
    (function init () {
      unbindViewEnter = $scope.$on('$ionicView.enter', viewEnter);
      unbindViewLeave = $scope.$on('$ionicView.leave', viewLeave);

      $scope.$on('$destroy', function () {
        //Cleanup the modal when we're done
        vm.chooseContactModal.remove();
      });

      $ionicModal.fromTemplateUrl('main/conversations/chooseContact.html', {
        scope: $scope,
        animation: 'slide-in-up'
      })
      .then(function (modal) {
        vm.chooseContactModal = modal;
      });

    })();


    //////////
    function viewEnter () {
      $log.info('>>> Chat view $ionicView.enter');

      vm.user = ManagerService.getUser();
      conversation = vm.user.getCurrentConversation();
      vm.participants = conversation.getParticipants(); // todo 2 way binding for updates
      vm.messages = conversation.messages;

      conversation.start()
        .then(function (result) {

          vm.uiStates.doneLoading = true;

          if (!result) {
            popService.alert($translate('couldNotStartConversation'));
            return;
          }

          conversation.getChatMessages(vm.onMessageReceived);
          conversation.getChatTypingStates(vm.onTypingEvent);
        })
        .catch(function (err) {
          $log.error('Error! start conversation', err);
        });
    }

    function viewLeave () {
      $log.info('>>> Chat view $ionicView.leave');

      conversation.stop()
        .catch(function (err) {
          $log.error('Error! stop conversation', err);
        });

      // reset states
      vm.uiStates.doneLoading = false;
      vm.uiStates.typingMsg = '';
      unbindViewEnter();
      unbindViewEnter = null;
      unbindViewLeave();
      unbindViewLeave = null;
    }

  }
})();
