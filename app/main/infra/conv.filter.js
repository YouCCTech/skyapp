'use strict';
(function () {
  angular.module('main').filter('convFilter', [convFilter]);
  function convFilter () {
    return function (items, term) {
      var filtered = [];
      angular.forEach(items, function (item) {
        if (item.type === 'Conversation') {
          if (item.person && item.person.displayName && item.person.displayName.indexOf(term) !== -1) {
            filtered.push(item);
          }
        }
        else if (item.type === 'GroupConversation') {
          if (item.name && item.name.indexOf(term) !== -1) {
            filtered.push(item);
          }
        }
        else {
          if (item.displayName && item.displayName.indexOf(term) !== -1) {
            filtered.push(item);
          }
        }
      });
      return filtered;
    };
  }

})();

