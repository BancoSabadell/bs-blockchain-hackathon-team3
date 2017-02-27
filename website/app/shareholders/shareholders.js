'use strict';

angular.module('myApp.shareholders', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/shareholders', {
    templateUrl: 'shareholders/shareholders.html',
    controller: 'ShareholdersCtrl'
  });
}])

.controller('ShareholdersCtrl', [function() {

}]);