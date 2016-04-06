/**
 * Created by YYL-PC on 2016-01-10.
 */
MetronicApp.controller("UserInfoController",['$scope','$http','localStorageService', function ($scope, $http,localStorageService) {
    $http.get("../angularjs/data/users.json").success(function (data) {
        $scope.userData = data;
    });

    $http.get("http://192.168.1.10:8081/Api/api/v1/Enterprise/GeneralTitle").success(function (data) {
        $scope.GeneralTitle = data.Data;
    });

    // 产品分页
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 15,
        pagesLength: 5,
        perPageOptions: [15, 20, 30, 40, 50],
        onChange: function(){
            $http.get("../angularjs/data/users.json").success(function (data) {
                $scope.userData = data;
                localStorageService.set("userData",$scope.userData);
                $scope.userData = localStorageService.get("userData");
                $scope.paginationConf.totalItems = $scope.userData.length;
                $scope.userList = $scope.userData.slice(($scope.paginationConf.currentPage-1)*$scope.paginationConf.itemsPerPage,$scope.paginationConf.itemsPerPage*$scope.paginationConf.currentPage);
            });
        }
    };
    $scope.loadUsers= function (index) {
        $scope.userNick = $scope.userList[index].Nick;
        $scope.userName = $scope.userList[index].Name;
        $scope.userJob = $scope.userList[index].Job;
        $scope.userPhone = $scope.userList[index].Phone;
        $scope.userTel = $scope.userList[index].Tel;
        $scope.userEmail = $scope.userList[index].Email;
    };

    $scope.updateUsers= function () {

    };

    $scope.deleteUsers = function (index) {

    };

    $scope.dateNow = new Date();
}]);