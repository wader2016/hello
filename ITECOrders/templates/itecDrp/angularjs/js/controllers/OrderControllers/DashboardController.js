'use strict';

MetronicApp.controller('DashboardController',['$rootScope','$scope','$http','$timeout',function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        Metronic.initAjax();
    });
}]);