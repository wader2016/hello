/**
 * Created by iTEC001 on 2016/1/20.
 */
MetronicApp.controller("OrderDetailController",['$http','$scope','localStorageService', function ($http, $scope,localStorageService) {
    // 获得选中的订单
    var current = localStorageService.get("currentStatus");
    $scope.List = localStorageService.get("listData");
    var sellsInfo = $scope.List.ConsignneInfo;
    var index = sellsInfo.lastIndexOf("}");
   if(index != -1){
       var consigneeContactWay = JSON.parse(sellsInfo.substring(0,index+1));
       $scope.List.ConsignneInfo = sellsInfo.substring(index+1);
       $scope.List.ConsigneeTel = consigneeContactWay.Tel;
       $scope.List.ConsigneePhone = consigneeContactWay.Phone;
   }
    $scope.total = 0;
    for(var i=0;i<$scope.List.SalesOrderLines.length;i++){
        $scope.total += $scope.List.SalesOrderLines[i].ProductQty *  $scope.List.SalesOrderLines[i].SalesPrice;
    }
    // 加载进度条
    FormWizard.init(current);
}]);