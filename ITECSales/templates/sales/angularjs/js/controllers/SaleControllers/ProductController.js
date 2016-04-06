
MetronicApp.controller('ProductController',['authService','SalesService','apiUrl','$scope','$rootScope','$http','$timeout','$location','$stateParams','localStorageService',function(authService,SalesService,apiUrl,$scope,$rootScope,$http,$timeout,$location,$stateParams,localStorageService){

    $scope.loginName = authService.authentication.userName;
    // 获得用户信息
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.Identity = $scope.userInfo.Identity;
        localStorageService.set("Identity",$scope.Identity);

        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $scope.storeId = $scope.StoreInfo.Id;
        localStorageService.set("storeId",$scope.storeId);

        //  获得购物车数据
        SalesService.shoppingCart($scope.Identity).success(function (data) {
            $rootScope.listCart = data.Data;
        });
    });
    //获得页面数据
    $http.get("http://"+apiUrl+"/Api/api/v1/ProductCatalog").success(function (data) {
        $scope.itemList = data.Data;
        for(var j=0;j<$scope.itemList.length;j++){
            $scope.itemList[j].quantity = 1;
        }
        $scope.listId = $stateParams.listType;
        $scope.FilterItem=[];
        $scope.getFilterItem = function (id) {
            for (var i = 0; i < $scope.itemList.length; i++) {
                if ($scope.itemList[i].CatalogId == id) {
                    $scope.FilterItem.push($scope.itemList[i]);
                }
            }
        };

        // 根据路由传的参数不同，加载不同页面，对产品进行分类
        switch ($scope.listId){
            case "all":$scope.FilterItem = $scope.itemList;
                break;
            case "4430":$scope.getFilterItem('4430');
                break;
            case "4431":$scope.getFilterItem('4431');
                break;
            case "4432":$scope.getFilterItem('4432');
                break;
            case "4433":$scope.getFilterItem('4433');
                break;
            case "4434":$scope.getFilterItem('4434');
                break;
            case "4435":$scope.getFilterItem('4435');
                break;
            case "4436":$scope.getFilterItem('4436');
                break;
            case "4437":$scope.getFilterItem('4437');
                break;
            case "4438":$scope.getFilterItem('4438');
                break;
            case "4439":$scope.getFilterItem('4439');
                break;
            case "4440":$scope.getFilterItem('4440');
                break;
            case "4441":$scope.getFilterItem('4441');
                break;
            case "4442":$scope.getFilterItem('4442');
                break;
            case "4443":$scope.getFilterItem('4443');
                break;
            case "4444":$scope.getFilterItem('4444');
                break;
            case "4445":$scope.getFilterItem('4445');
                break;
            case "4446":$scope.getFilterItem('4446');
                break;
            case "4447":$scope.getFilterItem('4447');
                break;
            case "4448":$scope.getFilterItem('4448');
                break;
            case "4449":$scope.getFilterItem('4449');
                break;
            case "4450":$scope.getFilterItem('4450');
                break;
            case "4451":$scope.getFilterItem('4451');
                break;
            case "4452":$scope.getFilterItem('4452');
                break;
            case "4453":$scope.getFilterItem('4453');
                break;
            case "4454":$scope.getFilterItem('4454');
                break;
            case "4455":$scope.getFilterItem('4455');
                break;
            case "4456":$scope.getFilterItem('4456');
                break;
            default :$scope.FilterItem = $scope.itemList;
                break;
        }
        $scope.len = $scope.FilterItem.length;
        $scope.totalPage = Math.ceil(($scope.len) / $scope.pageSize);
        $scope.listCount =  $scope.FilterItem.slice(0, $scope.pageSize);

    });

    //模态框 View ,加载时显示产品的颜色和尺寸
    $scope.viewDetail=function(item){
        $scope.productItem = item;
        $http.get("http://"+apiUrl+"/Api/api/v1/ProductCatalog/"+item.CatalogId+"/"+$scope.storeId+"/Products").success(function (data) {
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
    };
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
    // 商品详情---加入购物车
    $scope.shoppingCart=function(){
        $scope.productItem.ProductSize = $scope.size;
        $scope.productItem.ProductColor = $scope.color;
        var shoppingCartInfo ={
            "StoreId":$scope.storeId,
            "ProductId":$scope.id,
            "ListPrice":$scope.productItem.Price,
            "BuyerAccountId": $scope.Identity,
            "ProductColor":$scope.productItem.ProductColor,
            "ProductSize":$scope.productItem.ProductSize,
            "Qty":$scope.productItem.quantity
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
    // 页面---加入购物车
    $scope.addToCart= function (item) {
        var shoppingCartInfo ={
            "StoreId":$scope.storeId,
            "ProductId":item.ProductId,
            "ListPrice":item.Price,
            "BuyerAccountId": $scope.Identity,
            "ProductColor":item.ProductColor,
            "ProductSize":item.ProductSize,
            "Qty":item.quantity
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

    //默认排序
    $scope.selectedList="ProductId";

    //商品详情页面数量--- 增加、减少
    $scope.add=function(){
        $scope.productItem.quantity++;
    };
    $scope.subtract=function(){
        if($scope.productItem.quantity>1){
            $scope.productItem.quantity--;
        }
    };
    // 页面展示数量
    $scope.showPageSize=[
        {"pageSize":12},
        {"pageSize":24},
        {"pageSize":36},
        {"pageSize":48},
        {"pageSize":60}
    ];
    $scope.pageSize=$scope.showPageSize[0].pageSize;

    // 改变页面显示的数量
    $scope.pageChange= function () {
        $scope.listCount =  $scope.FilterItem.slice(0, $scope.pageSize);
    };
    $scope.currentPage = 1;
    $scope.pages = [1,2,3,4,5];

    //生成数字页码
    $scope.setPage=function(page,pageSize){
        $scope.listCount = $scope.FilterItem.slice((page - 1) * pageSize, page * pageSize);
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

    //点击进入商品详情页面
   $scope.getListItem= function (item) {
       item.listId= $scope.listId;
       localStorageService.set("item",item);
       $scope.link="/sales/productDetail.html";
       $location.url( $scope.link);
   };

}]);
