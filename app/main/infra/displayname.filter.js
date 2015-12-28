'use strict';
(function () {
  angular.module('main').filter('displayname', [displayname]);
  function displayname () {
    var reg = new RegExp('sip:');

    return function (data) {

      if (!data) {
        return data;
      }

      if (reg.test(data)) {
        var noSip = data.replace('sip:', '');
        var parts = noSip.split('@');

        if (parts.length > 1) {
          // returning the prefix of the email address
          return parts[0];
        }

        return noSip;
      }

      // string with no 'sip:' return as is
      return data;
    };
  }
})();
