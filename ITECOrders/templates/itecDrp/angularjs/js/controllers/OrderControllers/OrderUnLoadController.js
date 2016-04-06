/**
 * Created by iTEC001 on 2015/8/14.
 */
MetronicApp.controller('OrderUnLoadController',['$scope','ModelService','$http','apiUrl','$filter', function ($scope, ModelService, $http, apiUrl,$filter) {
    ModelService.getCategory().success(function (data) {
        $scope.category=data.Data;
        $scope.catelog = [] ;
        for(var i=0;i< $scope.category.length;i++){
            if($scope.category[i].ParentCode == 0){
                $scope.category[i].module=[];
                for(var j=0;j< $scope.category.length;j++){
                    if( $scope.category[j].ParentCode==$scope.category[i].Id){
                        $scope.category[i].module.push($scope.category[j]);
                    }
                }
                $scope.catelog.push($scope.category[i]);
            }
        }
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


    //获得修改后的数据
    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=1').success(function (data) {
        $scope.items1 =data.Data;
        for(var i=0 ;i<$scope.items1.length;i++){
            $scope.items1[i].Actions='产品卸货';
        }
    }).error(function () {
    });


    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=1').success(function (data) {
        $scope.items =data.Data;
        for(var i=0 ;i<$scope.items.length;i++){
            $scope.items[i].orderCheck='运单卸货';
        }
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


    //运单卸货
    $scope.orderCheckIn= function ($index) {
        $scope.items[$index].orderCheck='运单完成';
        var checkId = $scope.items[$index].CarrierAccountId;
        var Id=[];
        for(var i=0;i<$scope.items1.length;i++){
            if($scope.items1[i].CarrierAccountId == checkId){
                $scope.items1[i].DeliveryOrderLineState='16';
                $scope.items1[i].Actions='卸货完成';
                Id.push($scope.items1[i].Id);
            }
        }
        $http.put('http://'+apiUrl+'/Api/api/DeliveryOrderLine?state=2',Id).success(function () {
            alertInfo.Success("运单完成!");
        }).error(function () {
            alert('卸货失败');
        });

    };


    // 点击单个产品，加载单个数据到模态框
    $scope.unLoad= function (item) {
        $scope.list = item;
    };


    // 模态框确认
    $scope.Confirm= function () {
        var itemId =[];
        itemId.push($scope.list.Id);
        $scope.list.DeliveryOrderLineState='16';
        $http.put('http://'+apiUrl+'/Api/api/DeliveryOrderLine?state=2',itemId).success(function () {
            alertInfo.Success("产品卸货完成!");
        }).error(function () {
            alertInfo.Error('产品卸货失败');
        });
        $scope.list.Actions='卸货完成';
    };


}]);