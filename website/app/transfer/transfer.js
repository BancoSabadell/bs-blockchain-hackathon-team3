'use strict';

angular.module('myApp.transfer', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/transfer', {
    templateUrl: 'transfer/transfer.html',
    controller: 'TransferCtrl'
  });
}])

.controller('TransferCtrl', [function() {

}]);