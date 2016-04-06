/**
 * Created by iTEC001 on 2015/9/14.
 */
MetronicApp.controller('LoginController',['$scope','$location','$rootScope','authService','$http','apiUrl','localStorageService', function ($scope, $location,$rootScope, authService,$http,apiUrl,localStorageService) {

    if(authService.authentication.isAuth==true){
        $location.url('/orders/lightTable.html');
    }
    else{
        authService.logOut();
    }
    $scope.loginData = {
        userName: "",
        password: ""
    };
    $scope.message = "";
    $scope.login = function () {
        authService.login($scope.loginData)
            // 登录成功
            .then(function (response) {
                $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
                    $scope.userProfile = data.Data;
                    if(localStorageService.get(response.userName+"image") == null){
                        localStorageService.set(response.userName+"image","/assets/admin/pages/media/profile/profile_user.jpg");
                    }
                    $location.path('/orders/lightTable.html').replace();
                    window.location.href = "#/orders/lightTable.html";
                    window.location.reload(true);
                })
            .error(function () {
                authService.logOut();
                alertInfo.Error("登录失败!");
            })

            },
            function (err) {
                $scope.message = err.error_description;
            }
    );
    };


}]);