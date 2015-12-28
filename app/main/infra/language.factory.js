'use strict';
(function () {
  angular.module('main').factory('LanguageService', [
    '$translate',
    '$log',
    ManagerService
  ]);
  function ManagerService ($translate, $log) {
    //add the languages you support here. ar stands for arabic
    var rtlLanguages = [ 'he' ];

    function isRtl () {
      var languageKey = $translate.proposedLanguage() || $translate.use();
      for (var i = 0; i < rtlLanguages.length; i += 1) {
        // You may need to change this logic depending on your supported languages (possible languageKey values)
        // This code will match both "ar", "ar-XXX" locales. It won't match any other languages as we only support en, es, ar.
        if (languageKey.indexOf(rtlLanguages[i]) > -1) {
          return true;
        }
      }
      return false;
    }

    //public api
    return {
      isRtl: isRtl
    };
  }
})();
