/**
 * Created by iTEC001 on 2015/7/16.
 */
MetronicApp.controller('ProductDetailController',['$http','$scope','localStorageService', function ($http,$scope,localStorageService) {
    $scope.getItem = localStorageService.get("productItem");
    $scope.descriptionKey = Enumerable.From($scope.getItem.ProductDescription).Select($.key).ToArray();
}]);