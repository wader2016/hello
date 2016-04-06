
MetronicApp.controller('CheckOutController',['SalesService','localStorageService','$timeout','$http','$scope','$rootScope','$location','apiUrl','authService', function (SalesService,localStorageService,$timeout,$http,$scope,$rootScope,$location,apiUrl,authService) {

    $scope.loginName = authService.authentication.userName;
    $scope.salesOrderId = localStorageService.get("salesOrderId");
    // 获得用户信息
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        console.log($scope.userInfo);
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.Identity = $scope.userInfo.Identity;
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $scope.storeId = $scope.StoreInfo.Id;
        $scope.MainAddressInfo = JSON.parse($scope.userInfo.MainAddressInfo);

        $scope.AddressInfo = JSON.parse($scope.userInfo.AddressInfo);
        for(var i=0;i<$scope.AddressInfo.length;i++){
            $scope.AddressInfo[i].contact = JSON.parse($scope.AddressInfo[i].StrExt2);
            if($scope.AddressInfo[i].Name ==$scope.MainAddressInfo[0].Name ){
                $scope.AddressInfo.unshift($scope.AddressInfo[i]);
                $scope.AddressInfo.splice(i+1,1);
            }
        }
        getData();
    });

    function getData () {
        var putData={
            "SalesOrderId":$scope.salesOrderId,
            "BuyerId":$scope.Identity,
            "PageIndex":0,
            "PageSize":0
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/Submitted",putData).success(function (data) {
            $scope.orderInfo = data.Data;
            if($scope.orderInfo !="") {
                $scope.orderId = $scope.orderInfo[0].Id;
                $scope.totalPrice = 0;
                for (var i = 0; i < $scope.orderInfo[0].SalesOrderLines.length; i++) {
                    $scope.totalPrice += $scope.orderInfo[0].SalesOrderLines[i].ProductQty * $scope.orderInfo[0].SalesOrderLines[i].SalesPrice;
                    $scope.orderInfo[0].SalesOrderLines[i].showBtn = false;
                }
            }else{
                $location.path("/sales/productList.html");
            }

        });
    }

    // 单选 收货地址
    $scope.info = 0;
    $scope.checkAddress = function (item,index) {
        var id = item.Id;
        $scope.info = index;
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/"+$scope.Identity+"/"+$scope.salesOrderId+"/ConsigneeAddress/"+id).success(function () {
        }).error(function () {
        });
    };

    $scope.isShow = false;
    $scope.ShowDropDown= function () {
        $scope.isShow = !$scope.isShow;
    };

    // 鼠标进入时  显示按钮
    $scope.showButton= function (index) {
        $scope.orderInfo[0].SalesOrderLines[index].showBtn = true;
    };
    // 鼠标离开时  隐藏按钮
    $scope.hideButton= function (index) {
        $scope.orderInfo[0].SalesOrderLines[index].showBtn = false;
    };

    // 移入购物车
    $scope.backShoppingCart= function (item) {
        var shoppingCartInfo ={
            "StoreId":$scope.storeId,
            "BuyerAccountId": $scope.Identity,
            "ProductId":item.ProductId,
            "ListPrice":item.ListPrice,
            "ProductColor":item.ProductColor,
            "ProductSize":item.ProductSize,
            "Qty":item.ProductQty
        };
        $http.post("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart",shoppingCartInfo).success(function () {
            $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/Delete/Lines/"+item.Id).success(function () {
                SalesService.shoppingCart($scope.Identity).success(function (data) {
                    $rootScope.listCart = data.Data;
                    getData();
                    alertInfo.Success("移入购物车成功!");
                }).error(function () {
                    alertInfo.Error("移入购物车失败");
                });
            }).error(function () {
                alertInfo.Error("删除失败");
            });
        }).error(function () {
            alertInfo.Error("移入购物车失败!");
        })
    };

    // 数量增加
    $scope.add= function (index) {
        $scope.orderInfo[0].SalesOrderLines[index].ProductQty++;
        var updateData={
            "SalesOrderLineId":$scope.orderInfo[0].SalesOrderLines[index].Id,
            "Qty":$scope.orderInfo[0].SalesOrderLines[index].ProductQty,
            "UserIdentity":$scope.Identity
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/LinesQty",updateData).success(function () {
            $scope.totalPrice += $scope.orderInfo[0].SalesOrderLines[index].SalesPrice;
        }).error(function () {
        })

    };
    // 数量减少
    $scope.subtract = function (index) {
        if($scope.orderInfo[0].SalesOrderLines[index].ProductQty>1){
            $scope.orderInfo[0].SalesOrderLines[index].ProductQty--;
            var updateData={
                "SalesOrderLineId":$scope.orderInfo[0].SalesOrderLines[index].Id,
                "Qty":$scope.orderInfo[0].SalesOrderLines[index].ProductQty,
                "UserIdentity":$scope.Identity
            };
            $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/LinesQty",updateData).success(function () {
                $scope.totalPrice -= $scope.orderInfo[0].SalesOrderLines[index].SalesPrice;
            }).error(function () {

            });
        }
    };
    // 取消订单
    $scope.cancelSalesOrder= function () {
        $http.delete("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/"+$scope.orderId).success(function () {
            alertInfo.Success("取消成功!");
            $location.url("/sales/productList/all");
        }).error(function () {
            alertInfo.Error("取消失败");
        })
    };

    // 确认订单
    $scope.confirmSalesOrder= function () {
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/"+$scope.Identity+"/ConfirmSalesOrder/"+$scope.orderId).success(function () {
            alertInfo.Success("确认成功!");
            $location.url("/sales/payment.html");
            $rootScope.orderLength++;
        });
    };

}]);