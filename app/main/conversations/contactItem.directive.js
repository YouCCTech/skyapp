'use strict';
(function () {
  angular.module('main').directive('contactItem', [contactItemDirective]);
  function contactItemDirective () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'main/conversations/contactItem.html',
      scope: {
      },
      controller: 'ContactItemCtrl as vm',
      bindToController: {
        contact: '=',
        conversation: '='
      }
    };
  }
})();
