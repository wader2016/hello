/**
 * Created by iTEC001 on 2015/12/23.
 */
MetronicApp.controller("ProductController",['$scope','$http','localStorageService','$location', function ($scope, $http,localStorageService,$location) {


    // 产品分页
    $scope.paginationConf = {
        currentPage: 1,
        itemsPerPage: 10,
        pagesLength: 5,
        perPageOptions: [10, 20, 30, 40, 50],
        onChange: function(){
            $http.get("../angularjs/data/Product.json").success(function (data) {
                $scope.ProductData = data;
                localStorageService.set("productData",$scope.ProductData);
                $scope.ProductData = localStorageService.get("productData");
                $scope.paginationConf.totalItems = $scope.ProductData.length;
                $scope.productList = $scope.ProductData.slice(($scope.paginationConf.currentPage-1)*$scope.paginationConf.itemsPerPage,$scope.paginationConf.itemsPerPage*$scope.paginationConf.currentPage);
                $scope.list = $scope.productList[0];
                $scope.descriptionKey = Enumerable.From($scope.list.ProductDescription).Select($.key).ToArray();
            });
        }
    };


    // 点击加载行数据
    $scope.loadLine= function (item) {
        localStorageService.set("productItem",item);
      window.open("#/managements/productDetail.html");
        //$scope.list = item;

    };

    // 删除
    $scope.delProduct= function (index) {
        $scope.productList.splice(index,1);
        alertInfo.Success("删除成功!");
    };

    // 获得产品分组
    $http.get("http://192.168.1.47/Api/api/v1/ProductCategory").success(function (data) {
        $scope.category=data.Data;
        $scope.catelog = [] ;
        for(var i=0;i< $scope.category.length;i++){
            if($scope.category[i].ParentCode == 0){
                for(var j=0;j< $scope.category.length;j++){
                    if( $scope.category[j].ParentCode==$scope.category[i].Id){
                        $scope.category[j].mainName = $scope.category[i].Name;
                        $scope.catelog.push($scope.category[j]);
                    }
                }
            }
        }
    });

    // 仓库信息
    $scope.StoreInfo=[{
        "StoreId":5001,"Abbr":"中石化成品仓"},{
        "StoreId":5002,"Abbr":"中石油成品仓"},{
        "StoreId":5003,"Abbr":"中国移动成品仓"},{
        "StoreId":5004,"Abbr":"中国建筑成品仓"},{
        "StoreId":5005,"Abbr":"工商银行成品仓"}];

    $scope.updateProductDetail= function (item) {
    };

    $scope.StoreChange= function (item) {
        $scope.selectStore = item;
    };
}]);




