/**
 * Created by YYL-PC on 2016-01-10.
 */
MetronicApp.controller("StoreInfoController", ['$scope','$http',function ($scope, $http) {

    $http.get("/data/store.json").success(function (data) {
        $scope.StoreInfo = data;
        $scope.storeDetail =  $scope.StoreInfo[0];
        loadPageData($scope.storeDetail);
    });

    // 加载仓库详细信息
    $scope.loadStore= function (index) {
        $scope.storeDetail = $scope.StoreInfo[index];
        loadPageData($scope.storeDetail);
    };

    // 仓库新增
    $scope.addNewStore= function () {
        loadPageData([]);
    };

    function loadPageData(array){
        $scope.storeAbbr = array.StoreAbbr;
        $scope.storeName = array.StoreName;
        $scope.Address = array.AddressLine;
        $scope.storeArea = array.City;
        $scope.companyAbbr = array.CompanyAbbr;
        $scope.companyName = array.CompanyName;
        $scope.zipCode = array.ZipCode;
        $scope.contactName = array.ContactName;
        $scope.contactTel = array.ContactTel;
        $scope.contactEmail = array.ContactEmail;
    }
}]);