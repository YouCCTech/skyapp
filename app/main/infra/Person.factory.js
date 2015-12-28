'use strict';
(function () {
  angular.module('main').factory('PersonFactory', ['safeApply', '$q', 'skypeService', PersonFactory]);
  function PersonFactory (safeApply, $q, skypeService) {

    function Person (personObj) {
      var _this = this;

      if (_.isString(personObj)) {

        // get Skype person object and build
        getPersonObject(personObj)
          .then(function (person) {
            _this.extractFromSkypeObject(person);
          });

      } else {

        // build from Skype object
        this.extractFromSkypeObject(personObj);
      }
    }

    Person.prototype.extractFromSkypeObject = function (personObj) {
      var _this = this;

      this.original = personObj;
      this.id = personObj.id();
      this.emails = personObj.emails();
      this.displayName = personObj.displayName();
      this.title = personObj.title();
      this.activity = personObj.activity();
      this.avatarUrl = personObj.avatarUrl();

      // subscribe to properties change event
      this.original.status.changed(function (status) {
        safeApply.apply(function () {
          _this.status = status;
        });
      });
      this.original.status.subscribe();
    };

    Person.build = function (personObj) {

      // check if object is not Person already
      if (personObj instanceof Person) {
        return personObj;
      }

      return new Person(personObj);
    };


    /**
     * Private
     */
    function getPersonObject (personId) {
      var deferred = $q.defer();

      var personsAndGroupsManager = skypeService.getPersonsAndGroupsManager();
      var query = personsAndGroupsManager.createPersonSearchQuery();
      query.text(personId);
      query.limit(1);
      query.getMore().then(function (results) {
        var person = null;

        results.forEach(function (result) {
          person = result.result;
        });

        deferred.resolve(person);
      }, function (err) {
        console.log('Error! getPersonObject', err);
        deferred.reject(err);
      });

      return deferred.promise;
    }

    return Person;
  }
})();
