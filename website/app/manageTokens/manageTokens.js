'use strict';

angular.module('myApp.manageTokens', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/manageTokens', {
    templateUrl: 'manageTokens/manageTokens.html',
    controller: 'ManageTokensCtrl'
  });
}])

.controller('ManageTokensCtrl', [function() {

}]);