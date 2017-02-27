'use strict';

angular.module('myApp.myTokens', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/myTokens', {
    templateUrl: 'myTokens/myTokens.html',
    controller: 'MyTokensCtrl'
  });
}])

.controller('MyTokensCtrl', [function() {

}]);