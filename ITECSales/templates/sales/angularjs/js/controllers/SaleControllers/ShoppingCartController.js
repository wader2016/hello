/**
 * Created by iTEC001 on 2015/10/15.
 */
MetronicApp.controller('ShoppingCartController',['$scope','$http','$rootScope','SalesService','authService','apiUrl','$location','localStorageService','$timeout', function ($scope,$http,$rootScope,SalesService,authService,apiUrl,$location,localStorageService,$timeout) {
    // 获得用户数据
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $scope.ContactInfo = JSON.parse($scope.userInfo.ContactInfo);
        $scope.InvoiceInfo = JSON.parse($scope.userInfo.InvoiceInfo);
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);

        $scope.Identity = $scope.userInfo.Identity;
        $scope.storeId = $scope.StoreInfo.Id;
        $scope.invoiceInfoId = $scope.InvoiceInfo.Id;
        $scope.contactId = $scope.ContactInfo.Id;
        $scope.storeId = $scope.StoreInfo.Id;

        //获得购物车数据
        getShoppingData();
    });

    function getShoppingData(){
        SalesService.shoppingCart($scope.Identity).success(function (data) {
            $rootScope.listCart = data.Data;
            $rootScope.totalPrice = 0;
            $scope.deleteId = [];
            $scope.salesInfo = [];
            for(var i=0;i<$rootScope.listCart.length;i++){
                $rootScope.totalPrice += $rootScope.listCart[i].ProductQty * $rootScope.listCart[i].SalesPrice;
                var info={
                    "ProductId":$rootScope.listCart[i].ProductId,
                    "ProductBarCode":$rootScope.listCart[i].ProductCode,
                    "ProductColor":$rootScope.listCart[i].ProductColor,
                    "ProductSize":$rootScope.listCart[i].ProductSize,
                    "Qty":$rootScope.listCart[i].ProductQty,
                    "PriceListId":$rootScope.listCart[i].PriceListId,
                    "ListPrice":$rootScope.listCart[i].ListPrice,
                    "SalesPrice":$rootScope.listCart[i].SalesPrice
                };
                $scope.salesInfo.push(info);
                $scope.deleteId.push($rootScope.listCart[i].Id);
            }
        });
    }
    // 数量的增加
    $scope.addList=function(index){
        $rootScope.listCart[index].ProductQty++;
        $rootScope.totalPrice=$rootScope.totalPrice+ $rootScope.listCart[index].SalesPrice;
        $http.put("http://"+apiUrl+"/Api/api/v1/me/shoppingCart",{"ShoppingCartLineId":$rootScope.listCart[index].Id,"Qty":$rootScope.listCart[index].ProductQty}).success(function () {
            getShoppingData();
        }).error(function () {
        });
    };
    //数量减少
    $scope.subtractList=function(index){
        if($rootScope.listCart[index].ProductQty>1){
            $rootScope.listCart[index].ProductQty--;
            $rootScope.totalPrice=$rootScope.totalPrice - $rootScope.listCart[index].SalesPrice;
            $http.put("http://"+apiUrl+"/Api/api/v1/me/shoppingCart",{"ShoppingCartLineId":$rootScope.listCart[index].Id,"Qty":$rootScope.listCart[index].ProductQty}).success(function () {
                getShoppingData();
            }).error(function () {
            });
        }
    };

    //购物车 删除
    $scope.deleteList=function(index){
        $http.put("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/Delete",[$rootScope.listCart[index].Id]).success(function () {
            getShoppingData();
            alertInfo.Success("删除成功!");
        }).error(function () {
            alertInfo.Error("删除失败!");
        });
    };

    //提交订单
    $scope.submitList= function () {
        SalesService.shoppingCart($scope.Identity).success(function (data) {
            $rootScope.listCart = data.Data;
            $rootScope.totalPrice = 0;
            $scope.deleteId = [];
            $scope.salesInfo = [];
            for(var i=0;i<$rootScope.listCart.length;i++){
                $rootScope.totalPrice += $rootScope.listCart[i].ProductQty * $rootScope.listCart[i].SalesPrice;
                var info={
                    "ProductId":$rootScope.listCart[i].ProductId,
                    "ProductBarCode":$rootScope.listCart[i].ProductCode,
                    "ProductColor":$rootScope.listCart[i].ProductColor,
                    "ProductSize":$rootScope.listCart[i].ProductSize,
                    "Qty":$rootScope.listCart[i].ProductQty,
                    "PriceListId":$rootScope.listCart[i].PriceListId,
                    "ListPrice":$rootScope.listCart[i].ListPrice,
                    "SalesPrice":$rootScope.listCart[i].SalesPrice
                };
                $scope.salesInfo.push(info);
                $scope.deleteId.push($rootScope.listCart[i].Id);
            }

            var postInfo={
                "Identity":$scope.Identity,
                "ContactId":$scope.contactId,
                "InvoiceInfoId":$scope.invoiceInfoId,
                "StoreId":$scope.storeId,
                "SalesOrderLineInfos":$scope.salesInfo
            };
            $http.post("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/IntoSalesOrder",postInfo).success(function (data) {
                $scope.salesId = data.Data;
                localStorageService.set("salesOrderId",$scope.salesId);
                $http.put("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/Delete",$scope.deleteId).success(function () {
                    $rootScope.listCart=[];
                }).error(function () {
                });
                alertInfo.Success("提交成功!");
                $location.path("/sales/shopCheckOut.html").replace();
            }).error(function () {
                alertInfo.Error("提交失败!");
            });
        });
    };
}]);
