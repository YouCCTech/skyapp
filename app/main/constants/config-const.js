'use strict';
angular.module('main')
  .constant('Config', {

    // gulp environment: injects environment vars
    // https://github.com/mwaylabs/generator-m-ionic#gulp-environment
    ENV: {
      /*inject-env*/
      'LOGIN_USER': 'oryan@youcc.net',
    'LOGIN_PW': 'Aa123456',
    'ROOT_USER': 'https://lync.youcc.co.il/Autodiscover/AutodiscoverService.svc/root/oauth/user?originalDomain=youcc.co.il',
    'ROOT_XFRAME': 'https://lync.youcc.co.il/XFrame'
      /*endinject*/
    },

    // gulp build-vars: injects build vars
    // https://github.com/mwaylabs/generator-m-ionic#gulp-build-vars
    BUILD: {
      /*inject-build*/
      /*endinject*/
    }

  });
