/**
 * Created by iTEC001 on 2015/8/17.
 */
MetronicApp.controller('SignUpController',['$http','$scope','$location','$timeout','authService', function ($http,$scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.registration = {
        Email: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function () {

        authService.saveRegistration($scope.registration).then(function (response) {

                $scope.savedSuccessfully = true;
                $scope.message = "注册成功！2秒中后跳转到登录页面";
                startTimer();

            },
            function (response) {
                var errors = [];
                for (var key in response.data.modelState) {
                    for (var i = 0; i < response.data.modelState[key].length; i++) {
                        errors.push(response.data.modelState[key][i]);
                    }
                }
                $scope.message = "注册失败:" + errors.join(' ');
            });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    }

}]);