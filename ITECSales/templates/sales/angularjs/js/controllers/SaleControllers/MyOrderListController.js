/**
 * Created by iTEC001 on 2015/8/31.
 */
MetronicApp.controller('MyOrderListController',['authService','ListService','$scope','apiUrl','$http','localStorageService','$location', function (authService,ListService,$scope,apiUrl,$http,localStorageService,$location) {
    // 获得用户信息
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.Identity = $scope.userInfo.Identity;
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $scope.storeId = $scope.StoreInfo.Id;
        $scope.MainAddressInfo = JSON.parse($scope.userInfo.MainAddressInfo);
        $scope.ContactWay = JSON.parse($scope.MainAddressInfo[0].StrExt2);

        $scope.orderPayInfo = [];
        $scope.orderDeliverInfo=[];
        // 获取所有数据 （status=0）
        ListService.totalOrders($scope.Identity).success(function (data) {
            $scope.orderInfo  = data.Data;
            console.log(data.Data);
            for(var i=0;i<$scope.orderInfo.length;i++){
                if($scope.orderInfo[i].Status <3){
                    $scope.orderPayInfo.push($scope.orderInfo[i]);

                }else if($scope.orderInfo[i].Status <= 128){
                    $scope.orderDeliverInfo.push($scope.orderInfo[i]);
                }
            }
            $scope.listCount = $scope.orderInfo.slice(0, 10);
            $scope.totalPage = Math.ceil(($scope.orderInfo.length) / 10);
            $scope.salesOrderLine = $scope.orderInfo.SalesOrderLines;
        });

        $http.get("../angularjs/data/package.json").success(function (data) {
           $scope.orderReviewInfo = data;
        });

    });


    // 折叠菜单
    $scope.isShow = false;
    $scope.ShowDropDown= function () {
        $scope.isShow = !$scope.isShow;
    };

    // 确认付款
    $scope.confirmPay= function (index) {
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/"+$scope.Identity+"/PaidSalesOrder/"+$scope.orderPayInfo[index].Id).success(function () {
            $scope.orderPayInfo.splice(index,1);
            alertInfo.Success("付款成功!");
            ListService.deliveryOrders($scope.Identity).success(function (data) {
                $scope.orderDeliverInfo  = data.Data;
            });
        }).error(function () {
            alertInfo.Error("付款失败!");
        });
    };

    // 待收货
    $scope.confirmDeliver= function (index) {
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/"+$scope.Identity+"/FinishedSalesOrder/"+$scope.orderDeliverInfo[index].Id).success(function () {
            $scope.orderDeliverInfo.splice(index,1);
            alertInfo.Success("收货成功!");
            //ListService.shoppingCart1($scope.Identity).success(function (data) {
            //    $scope.orderReceiveInfo  = data.Data;
            //    console.log(data.Data);
            //});
        }).error(function () {
            alertInfo.Error("收货失败!");
        });
    };

    // 确认签收
    $scope.confirmReceive= function (index) {

    };

    // 查看订单详情
    $scope.viewOrderDetail= function (item) {
      var status  = item.Status;
      var current = 0;
        switch (status){
            case 1:
            case 2: current = 1;break;
            case 4:
            case 8:
            case 16:
            case 32:
            case 64:
            case 128:current = 2;break;
            case 256:current = 3;break;
            case 512:current = 4;break;
        }
        localStorageService.set("listData",item);
        localStorageService.set("currentStatus",current);
        $location.path("/sales/orderDetail.html");

    };

    $scope.items = [{"Name":"全部订单","status":0},{"Name":"待付款","status":2},{"Name":"待发货","status":4},{"Name":"待收货","status":32}];
    $scope.item = $scope.items[0];
    $scope.status = $scope.item.status;
    $scope.changeStatus= function (item) {
        $scope.status  = item.status;
    };

    // 产品搜索
    $scope.searchProduct= function () {
        var searchData={
            "BuyerId":$scope.Identity,
            "Status":$scope.status,
            "DateFrom":$scope.dateFrom,
            "DateTo":$scope.dateTo,
            "ProductName":$scope.productName,
            "ProductCode":$scope.productCode,
            "SalesOrderId":$scope.salesOrderId
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/me/SalesOrders/GetLines",searchData).success(function (data) {
            $scope.searchResult = data.Data;
        });
    };

    //$scope.showOrder= function (index) {
    //    $scope.listCount[index].isShow = !$scope.listCount[index].isShow;
    //};

    //$scope.reviewOrderLine= function (list) {
    //    $scope.orderLineRev = list;
    //};

    // 订单评价
    $scope.saveReview= function () {
            var postData={
                "UserId":$scope.Identity,
                "RefTypeStr":"订单",
                "RefId":$scope.orderLineRev.Id,
                "LineId":$scope.orderLineRev.CatalogId,
                "Comments":$scope.reviewText,
                "ParentId":0
            };
            $http.post("http://"+apiUrl+"/Api/api/v1/me/Comments",postData).success(function () {
                $scope.reviewName="";
                $scope.reviewText="";
                $scope.reviewTel="";
                alertInfo.Success("保存成功!");
            }).error(function () {
                alertInfo.Error("保存失败!");
            })
    };

//---------------------------------------------------------------------------------------
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.pages = [1,2,3,4,5];

    //生成数字页码
    $scope.setPage=function(page,pageSize){
        $scope.listCount = $scope.orderInfo.slice((page - 1) * pageSize, page * pageSize);
        if ($scope.currentPage <= 5) {
            $scope.pages = [1,2,3,4,5];
        }
        if ($scope.currentPage > 5) {
            $scope.pages = [
                $scope.currentPage - 4,
                $scope.currentPage - 3,
                $scope.currentPage - 2,
                $scope.currentPage - 1,
                $scope.currentPage
            ];
        }
    };
    //下一页
    $scope.next = function () {
        if ($scope.currentPage < $scope.totalPage) {
            $scope.currentPage++;
            $scope.setPage( $scope.currentPage,$scope.pageSize);
        }
    };
    //上一页
    $scope.prev = function () {
        if ($scope.currentPage > 1) {
            $scope.currentPage--;
            $scope.setPage( $scope.currentPage,$scope.pageSize);
        }
    };

    //页码加载
    $scope.loadPage= function(page){
        $scope.currentPage = page;
        $scope.setPage( $scope.currentPage,$scope.pageSize);
    };


}]);