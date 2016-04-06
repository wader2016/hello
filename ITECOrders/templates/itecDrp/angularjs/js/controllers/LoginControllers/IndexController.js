/**
 * Created by iTEC001 on 2015/9/14.
 */
MetronicApp.controller('indexController',['$scope','$location','$window','authService', function ($scope, $location,$window, authService) {
    $scope.authentication = authService.authentication;
	 if($scope.authentication.isAuth==false){
         authService.logOut();
    }
}]);