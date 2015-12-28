'use strict';
(function () {
  angular.module('main', [
    'ionic',
    'ngCordova',
    'ui.router',
    'angularMoment',
    'pascalprecht.translate',
    'tmh.dynamicLocale'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $translateProvider) {

    // translate
    configTranslateProvider($translateProvider);


    // ROUTING with ui.router
    $urlRouterProvider.otherwise('/main/list');
    $stateProvider
      // this state is placed in the <ion-nav-view> in the index.html
      .state('login', {
        url: '/login',
        templateUrl: 'main/login/login.html',
        controller: 'LoginCtrl as vm'
      })
      .state('layout', {
        url: '',
        abstract: true,
        templateUrl: 'main/main/layout.html'
      })
      .state('layout.conversations', {
        url: '/conversations',
        views: {
          'mainView': {
            templateUrl: 'main/conversations/conversations.html',
            controller: 'ConversationsCtrl as vm'
          }
        }
      })
      .state('layout.chat', {
        url: '/chat',
        views: {
          'mainView': {
            templateUrl: 'main/chat/chat.html',
            controller: 'ChatCtrl as vm'
          }
        }
      })
      .state('layout.newChat', {
        url: '/newChat',
        views: {
          'mainView': {
            templateUrl: 'main/newChat/newChat.html',
            controller: 'NewChatCtrl as vm'
          }
        }
      })
      .state('layout.newGroup', {
        url: '/newGroup',
        views: {
          'mainView': {
            templateUrl: 'main/newGroup/newGroupStep1.html',
            controller: 'NewGroupStep1Ctrl as vm'
          }
        }
      })
      .state('layout.newGroupFin', {
        url: '/newGroupFin/:name',
        views: {
          'mainView': {
            templateUrl: 'main/newGroup/newGroupFin.html',
            controller: 'NewGroupCtrl as vm'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
  })
  .run(function ($ionicPlatform, $rootScope, $state, authService, $log, $location, $translate, tmhDynamicLocale, LanguageService) {
    $ionicPlatform.ready(function () {
      $log.log('*** App is running ***');

      // for inject 'rtl' class in body element when necessary.
      $rootScope.Language = LanguageService;

      // only on mobile devices
      if (typeof navigator.globalization !== 'undefined') {
        setPreferredLanguageMobile($translate, tmhDynamicLocale);
      }

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
      }

      // if not login state -> redirect to login
      redirectToLoginState($location, $state);

      // check if user authorized when state change
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        authService.authorize(toState)
          .then(function (result) {

            if (typeof result === 'string') {
              // explicit state defined
              $state.go(result);
            } else {
              var isAllowed = result;
              if (!isAllowed) {
                $log.warn('User is not allowed to go to this state:', toState);
                event.preventDefault();
                $state.go('login');
              }
            }
          });
      });

      $rootScope.$on('$stateNotFound', function (event, toState, toParams, fromState, fromParams) {
        $log.warn('$stateNotFound', event, toState, toParams, fromState, fromParams);
      });
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams) {
        $log.warn('$stateChangeError', event, toState, toParams, fromState, fromParams);

        // on error - > go to login page
        $state.go('login');
      });

    });
  });

  //////
  function redirectToLoginState ($location, $state) {
    if ($location.url() !== '/login') {
      $state.go('login');
    }
  }

  function configTranslateProvider ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: 'main/language/',
      suffix: '.json'
    });
    $translateProvider.registerAvailableLanguageKeys(['en', 'he'], {
      'en-US': 'en',
      'en-UK': 'en',
      'he-IL': 'he'
    });
    $translateProvider.preferredLanguage('en');
    $translateProvider.fallbackLanguage('en');
  }

  function setPreferredLanguageMobile ($translate, tmhDynamicLocale) {
    navigator.globalization.getPreferredLanguage(function (language) {
      $translate.use((language.value).split('-')[0]).then(function (data) {
        console.log('SUCCESS -> ' + data);
      }, function (error) {
        console.log('ERROR -> ' + error);
      });

      tmhDynamicLocale.set((language.value).split('-')[0]);
    }, null);
  }
})();
