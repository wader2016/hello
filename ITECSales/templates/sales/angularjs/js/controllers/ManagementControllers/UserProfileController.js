/**
 * Created by iTEC001 on 2015/10/22.
 */
MetronicApp.controller('UserProfileController', function ($scope,$http,authService,$rootScope,localStorageService,apiUrl,$location) {

    $scope.loginName = authService.authentication.userName;
    $rootScope.headImg = localStorageService.get($scope.loginName+"image");

    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $rootScope.Nick = JSON.parse($scope.userInfo.ContactInfo).Nick;
    }).error(function () {
        authService.logOut();
        $location.url("/Login/login/html");
    });



  $http.get("/itecDrpWeb/templates/itecDrp/angularjs/data/userData1.json").success(function (data) {
      $scope.pageData = data.data1;
      $scope.dataLenth = 0;
      for(var i = 0;i<$scope.pageData.length;i++){
          $scope.dataLenth =  $scope.dataLenth + $scope.pageData[i];
      }
      $scope.pageData2 = data.data2;
      $scope.dataLenth2 = 0;
      for(var j = 0;j<$scope.pageData2.length;j++){
          $scope.dataLenth2 =  $scope.dataLenth2 + $scope.pageData2[j];
      }

  });

    $http.get("/itecDrpWeb/templates/itecDrp/angularjs/data/Member1.json").success(function (data) {
        $scope.Member = data;
    });

    $scope.timeClick = function (time) {
        $http.get("/itecDrpWeb/templates/itecDrp/angularjs/data/userData"+time+".json").success(function (data) {
            $scope.pageData = data.data1;
            $scope.dataLenth = 0;
            for(var i = 0;i<$scope.pageData.length;i++){
                $scope.dataLenth =  $scope.dataLenth + $scope.pageData[i];
            }
            $scope.pageData2 = data.data2;
            $scope.dataLenth2 = 0;
            for(var j = 0;j<$scope.pageData2.length;j++){
                $scope.dataLenth2 =  $scope.dataLenth2 + $scope.pageData2[j];
            }
        });
        $http.get("/itecDrpWeb/templates/itecDrp/angularjs/data/Member"+time+".json").success(function (data) {
            $scope.Member = data;
        });
        sparkLineInit.init(time);
    };

});