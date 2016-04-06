/**
 * Created by iTEC001 on 2015/8/14.
 */

MetronicApp.controller('AllDeliveryOrderController',['$scope','ModelService','$http','apiUrl','$filter',function ($scope, ModelService, $http, apiUrl,$filter) {
    ModelService.getCategory().success(function (data) {
        $scope.category=data.Data;
    }).error(function () {
    });

    // 收起/显示菜单
    $scope.isShowList=true;
    $scope.ShowList=function(){
        $scope.isShowList = ! $scope.isShowList;
    };

    //折叠 更多/收起
    $scope.isShow=true;
    $scope.packUpDown= function () {
        $scope.isShow = ! $scope.isShow;
    };

    //获得当前时间
    var date =new Date();
    $scope.DocDateFrom = $filter("dateFilter")(date);
    $scope.DocDateTo = $filter("dateToFilter")(date);

    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=0*1*2*3').success(function (data) {
        $scope.items1 =data.Data;
    }).error(function () {
    });
    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=0*1*2*3').success(function (data) {
        $scope.items =data.Data;
        $scope.sellName = $scope.items;
        for(var j= 0;j< $scope.sellName.length-1;j++){
            for(var k=j+1;k<$scope.sellName.length;k++){
                if($scope.sellName[j].CarrierContactName == $scope.sellName[k].CarrierContactName){
                    $scope.sellName.splice(k,1);
                    k--;
                }
            }
        }

    }).error(function () {
    });

    //$scope.prevent= function (e) {
    //    e.preventDefault();
    //}

}]);