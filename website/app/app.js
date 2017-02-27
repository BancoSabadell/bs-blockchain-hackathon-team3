'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
    'myApp.main',
  'myApp.myTokens',
  'myApp.transfer',
  'myApp.manageTokens',
  'myApp.shareholders',
  'myApp.createShareholder'


]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {

  $routeProvider.otherwise({redirectTo: '/myTokens'});
}]);
