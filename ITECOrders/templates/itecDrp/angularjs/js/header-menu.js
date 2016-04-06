/**
 * Created by iTEC001 on 2015/8/18.
 */
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope','$http','$location','authService','apiUrl','localStorageService','$rootScope', function($scope,$http,$location,authService,apiUrl,localStorageService,$rootScope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
 
		$http.get('/data/menu.json').success(function (data) {
            $scope.Menu = data;
        });

    $scope.loginName = authService.authentication.userName;
    $rootScope.headImg = localStorageService.get($scope.loginName+"image");

    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.ContactInfo = JSON.parse($scope.userInfo.ContactInfo);
        $rootScope.Nick = $scope.ContactInfo.Nick;
    }).error(function () {
        authService.logOut();
        $location.url("/Login/login/html");
    });

    $scope.logOut = function () {
        authService.logOut();
        $location.path('/Login/login.html').replace();
    };



}]);
