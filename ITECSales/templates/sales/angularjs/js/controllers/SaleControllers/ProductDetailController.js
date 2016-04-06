/**
 * Created by iTEC001 on 2015/7/16.
 */
MetronicApp.controller('ProductDetailController',['$http','$scope','$rootScope','SalesService','$timeout','$location','apiUrl','localStorageService', function ($http,$scope,$rootScope,SalesService,$timeout,$location,apiUrl,localStorageService) {
    $scope.getItem = localStorageService.get("item");
    //获得路由参数
    $scope.getUrlId = $scope.getItem.listId;
    $scope.storeId = localStorageService.get("storeId");
    $scope.Identity = localStorageService.get("Identity");

    //  获得购物车数据
    SalesService.shoppingCart($scope.Identity).success(function (data) {
        $rootScope.listCart = data.Data;
    });

    // 获得尺寸、颜色
    $http.get("http://"+apiUrl+"/Api/api/v1/ProductCatalog/"+$scope.getItem.CatalogId+"/"+$scope.storeId+"/Products").success(function (data) {
        $scope.specification = data.Data;
        $scope.ProductColor=[];
        $scope.ProductSize=[];
        $scope.Stock =[];
        $scope.ProductId=[];
        $scope.Price=[];
        $scope.SalesPrice=[];
        for(var i=0;i<$scope.specification.length;i++){
            if($scope.specification[i].ProductColor !=null){
                $scope.ProductColor.push($scope.specification[i].ProductColor);
            }
            $scope.ProductSize.push($scope.specification[i].ProductSize);
            $scope.Stock.push($scope.specification[i].StockQty);
            $scope.ProductId.push($scope.specification[i].ProductId);
            $scope.Price.push($scope.specification[i].Price);
            $scope.SalesPrice.push($scope.specification[i].SalesPrice);
        }
        $scope.ProductSize = Enumerable.From($scope.ProductSize).Distinct().ToArray();
        $scope.ProductColor = Enumerable.From($scope.ProductColor).Distinct().ToArray();
        $scope.color= $scope.ProductColor[0];
        $scope.size = $scope.ProductSize[0];
        $scope.stockQty = $scope.Stock[0];
        $scope.id =  $scope.ProductId[0];
        $scope.price =  $scope.Price[0];
        $scope.SalesPrice =  $scope.SalesPrice[0];
    });

    // 改变尺寸
    $scope.changeSize= function (item) {
        $scope.getSize = item;
        $scope.ProductColor=[];
        $scope.Stock =[];
        $scope.ProductId=[];
        $scope.Price=[];
        $scope.SalesPrice=[];
        for(var i=0;i< $scope.specification.length;i++){
            if($scope.specification[i].ProductSize == item){
                if($scope.specification[i].ProductColor !=null){
                    $scope.ProductColor.push($scope.specification[i].ProductColor);
                }
                $scope.Stock.push($scope.specification[i].StockQty);
                $scope.ProductId.push($scope.specification[i].ProductId);
                $scope.Price.push($scope.specification[i].Price);
                $scope.SalesPrice.push($scope.specification[i].SalesPrice);
            }
        }
        $scope.ProductColor = Enumerable.From($scope.ProductColor).Distinct().ToArray();
        $scope.color = $scope.ProductColor[0];
        $scope.stockQty = $scope.Stock[0];
        $scope.id =  $scope.ProductId[0];
        $scope.price =  $scope.Price[0];
        $scope.SalesPrice =  $scope.SalesPrice[0];
    };

    //改变颜色
    $scope.changeColor= function (item) {
        $scope.getColor = item;
        $scope.Stock =[];
        $scope.ProductId=[];
        if($scope.getSize ==null){   // 先改变颜色
            for(var i=0;i< $scope.specification.length;i++) {
                if($scope.specification[i].ProductColor ==item){
                    if($scope.specification[i].ProductSize ==$scope.size){    // 选中的颜色有当前尺寸
                        $scope.stockQty = $scope.specification[i].StockQty;
                        $scope.id = $scope.specification[i].ProductId;
                        $scope.price = $scope.specification[i].Price;
                        $scope.SalesPrice = $scope.specification[i].SalesPrice;
                        $scope.stockId = $scope.specification[i].StockId;
                    }
                    else{   // 选中的颜色没有这个尺寸
                        $scope.size = $scope.specification[i].ProductSize;
                        $scope.stockQty = $scope.specification[i].StockQty;
                        $scope.id = $scope.specification[i].ProductId;
                        $scope.price = $scope.specification[i].Price;
                        $scope.SalesPrice = $scope.specification[i].SalesPrice;
                        $scope.stockId = $scope.specification[i].StockId;
                    }
                }
            }
        }
        else{
            for(var j=0;j< $scope.specification.length;j++) {
                if ($scope.specification[j].ProductSize == $scope.getSize && $scope.specification[j].ProductColor ==item) { // 先改变尺寸
                    $scope.stockQty = $scope.specification[j].StockQty;
                    $scope.id = $scope.specification[j].ProductId;
                    $scope.price = $scope.specification[j].Price;
                    $scope.SalesPrice = $scope.specification[j].SalesPrice;
                    $scope.stockId = $scope.specification[j].StockId;
                }
            }
        }
    };

    //加入购物车
    $scope.shoppingCart=function(){
        $scope.getItem.ProductSize=$scope.size;
        $scope.getItem.ProductColor=$scope.color;
        $rootScope.totalPrice += $scope.getItem.SalesPrice*$scope.getItem.quantity;
        if($rootScope.totalPrice>0){
            $rootScope.free=300;
        }else {
            $rootScope.free=0;
        }
        var shoppingCartInfo ={
            "StoreId":$scope.storeId,
            "ProductId":$scope.id,
            "ListPrice":$scope.getItem.Price,
            "BuyerAccountId": $scope.Identity,
            "ProductColor":$scope.getItem.ProductColor,
            "ProductSize":$scope.getItem.ProductSize,
            "Qty":$scope.getItem.quantity
        };
        $http.post("http://"+apiUrl+"/Api/api/v1/me/ShoppingCart",shoppingCartInfo).success(function () {
            SalesService.shoppingCart($scope.Identity).success(function (data) {
                $rootScope.listCart = data.Data;
                alertInfo.Success("成功加入购物车!");
            });
        }).error(function () {
            alertInfo.Error("加入购物车失败!");
        });
    };

    //增加、减少数量
    $scope.add=function(){
        $scope.getItem.quantity++;
    };
    $scope.subtract=function(){
        if($scope.getItem.quantity>1){
            $scope.getItem.quantity--;
        }
    };
    // 返回页面
    $scope.getBack= function () {
        $scope.link="/sales/productList/"+$scope.getUrlId;
        $location.url($scope.link);
        $scope.getItem=[];
    };

}]);