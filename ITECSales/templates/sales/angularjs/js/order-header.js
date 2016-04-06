/**
 * Created by iTEC001 on 2015/8/18.
 */
/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController1', ['$scope','$http','authService','$location','$rootScope','localStorageService','apiUrl','CatalogFactory', function($scope,$http,authService,$location,$rootScope,localStorageService,apiUrl,CatalogFactory) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });
    $scope.loginName = authService.authentication.userName;
    $rootScope.headImg = localStorageService.get($scope.loginName+"image");

    // 获取用户信息
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $rootScope.Nick = JSON.parse($scope.userInfo.ContactInfo).Nick;

        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $scope.ContactInfo = JSON.parse($scope.userInfo.ContactInfo);
        $scope.InvoiceInfo = JSON.parse($scope.userInfo.InvoiceInfo);
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);

        $scope.Identity = $scope.userInfo.Identity;
        $scope.storeId = $scope.StoreInfo.Id;
        $scope.invoiceInfoId = $scope.InvoiceInfo.Id;
        $scope.contactId = $scope.ContactInfo.Id;
        $scope.storeId = $scope.StoreInfo.Id;

        //  获得购物车数据
        getShoppingCart();

    }).error(function () {
        authService.logOut();
        $location.url("/Login/login/html");
    });

    // 获取导航栏数据

    CatalogFactory.getCategory().then(function (data) {
        $scope.menuData = data;
    });

    function getShoppingCart(){
        $http.get("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/"+$scope.Identity).success(function (data) {
            $rootScope.listCart = data.Data;
            $rootScope.totalPrice = 0;
            $scope.salesInfo = [];
            $scope.deleteId = [];
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
    // 删除
    $scope.deleteCart= function (index) {
        $http.put("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/Delete",[$rootScope.listCart[index].Id]).success(function () {
            getShoppingCart();
            alertInfo.Success("删除成功!");
        }).error(function () {
            alertInfo.Error("删除失败!");
        })
    };

    // 清空
    $scope.clearCart= function () {
        var deleteId = [];
        for(var i=0;i<$rootScope.listCart.length;i++){
            deleteId.push($rootScope.listCart[i].Id);
        }
        $http.put("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/Delete",deleteId).success(function () {
            $rootScope.totalPrice =0;
            getShoppingCart();
            alertInfo.Success("清空购物车成功!");
        }).error(function () {
            alertInfo.Error("删除失败!");
        })
    };

    // 结算
    $scope.checkOut= function () {
        $http.get("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/"+$scope.Identity).success(function (data) {
            $rootScope.listCart = data.Data;
            $scope.salesInfo = [];
            $scope.deleteId = [];
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
                    alertInfo.Success("提交成功!");
                    $location.path("/sales/shopCheckOut.html").replace();
                    window.location.reload();
                }).error(function () {
                    alertInfo.Error("删除失败");
                });
            }).error(function () {
                alertInfo.Error("提交失败!");
            });
        });

    };

    // 退出登录
    $scope.logOut = function () {
        authService.logOut();
        $location.url('/Login/login.html');
    };
    // 我的订单
    $scope.myOrder= function () {
        $location.url('/sales/myOrderList.html');
        top.location.reload();
    };

    $http.get("http://"+apiUrl+"/Api/api/v1/ProductCatalog").success(function (data) {
        $scope.itemList = data.Data;
        for(var j=0;j<$scope.itemList.length;j++){
            $scope.itemList[j].quantity = 1;
        }
    });
    //页面搜索
    $scope.search= function () {

    }

}]);
