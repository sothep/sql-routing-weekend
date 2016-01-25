var app = angular.module('sqlApp', ['ngRoute']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
  $routeProvider
    .when('/Addresses', {
      templateUrl: 'views/Addresses.html',
      controller: 'addressController'
    })
    .when('/Orders', {
      templateUrl: 'views/Orders.html',
      controller: 'orderController'
    });

  $locationProvider.html5Mode(true);
}]);

app.controller('addressController', ['$scope', 'sqlService', function($scope, sqlService){
  $scope.currentUser = null;
  $scope.users = [];
  $scope.userAddresses = [];
  sqlService.users().then(function(response){
    $scope.users = response.data;
  });
  
  $scope.changeUser = function(){
    sqlService.userAddresses($scope.currentUser).then(function(response){
      $scope.userAddresses = response.data;
    });
  };
}]);

app.controller('orderController', ['$scope', 'sqlService', function($scope, sqlService){
  $scope.currentUser = null;
  $scope.startDate = null;
  $scope.endDate = null;
  $scope.users = [];
  $scope.userOrders = [];

  sqlService.users().then(function(response){
    $scope.users = response.data;
  });

  $scope.updateOrders = function(){
    if (!$scope.currentUser || !$scope.startDate || !$scope.endDate) return;
    sqlService.userOrders($scope.currentUser, $scope.startDate.toISOString(), $scope.endDate.toISOString()).then(function(response){
      $scope.userOrders = response.data;
    });
  };

  $scope.dateParse = function(dateString){
    var parsedArray = dateString.split(/[a-zA-Z]+/);
    return parsedArray[0];
  };

  $scope.moneyFormat = function(moneyVal){
    return '$' + moneyVal.replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  };

  $scope.totalPurchases = function(){
    if (!$scope.userOrders || $scope.userOrders.length <= 0) return '$0.00';
    var tempSum = 0;
    for (var i = 0; i < $scope.userOrders.length; i++){
      tempSum += Number($scope.userOrders[i].amount);
    }
    return $scope.moneyFormat(String(tempSum.toFixed(2)));
  };
}]);

app.factory('sqlService', ['$http', function($http){
  var sqlFactory = {};
  sqlFactory.users = function(){
    return $http.get('/api/users');
  };

  sqlFactory.userAddresses = function(userId){
    return $http.get('/api/userAddresses/' + userId);
  };

  sqlFactory.userOrders = function(userId, startDate, endDate){
    var params = userId + '/' + startDate + '/' + endDate;
    return $http.get('/api/userOrders/' + params);
  };

  return sqlFactory;
}]);
