'use strict';

angular.module('myApp.createShareholder', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/createShareholder', {
    templateUrl: 'createShareholder/createShareholder.html',
    controller: 'CreateShareholderCtrl'
  });
}])

.controller('CreateShareholderCtrl', ['$scope',function($scope) {
  $scope.treatment = "Mr";
  $scope.name = "";
  $scope.surname = "";
  $scope.id = "";
  $scope.account = "";
    $scope.userHash = "";

  $scope.generateHash = function() {
      var stringToEncrypt =  $scope.name + $scope.surname + "3/^5b,GhSh}%(,b*" +$scope.id + $scope.account;
      var ciphertext = sha3_256(stringToEncrypt);
      $scope.userHash = ciphertext;
  }


}]);