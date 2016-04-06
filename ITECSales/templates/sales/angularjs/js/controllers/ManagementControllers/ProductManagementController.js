MetronicApp.controller("ProductManagementController", function ($scope, $http) {
    $http.get("../angularjs/data/Product.json").success(function (data) {
        $scope.product = data;
    }).error(function () {
    })
});