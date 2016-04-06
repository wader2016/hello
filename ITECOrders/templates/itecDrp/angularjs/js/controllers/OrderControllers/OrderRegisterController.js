/**
 * Created by iTEC001 on 2015/8/3.
 */
MetronicApp.controller('OrderRegisterController',['$http','$scope','apiUrl','ModelService','$filter', function ($http,$scope,apiUrl,ModelService,$filter) {

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
    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=0').success(function (data) {
        $scope.items1 =data.Data;
    }).error(function () {
    });

    // 运单筛选分组
    $http.get('http://'+apiUrl+'/Api/api/DeliveryOrder?state=0').success(function (data) {
        $scope.items=data.Data;
        for(var i=0 ;i<$scope.items.length;i++){
            $scope.items[i].orderCheck='运单登记';
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

    });

    // 运单登记
    $scope.orderCheckIn= function ($index) {
        $scope.items[$index].orderCheck='登记成功';
        var checkId = $scope.items[$index].CarrierAccountId;

        var Id=[];
        for(var i=0;i<$scope.items1.length;i++){
            if($scope.items1[i].CarrierAccountId == checkId){
                $scope.items1[i].DeliveryOrderLineState = '15';
                Id.push($scope.items1[i].Id);
            }
        }

        // 改变运单的状态
        $http.put('http://'+apiUrl+'/Api/api/DeliveryOrderLine?state=1',Id).success(function () {
            toastr.success("运单登记成功!",'成功！',{
                "closeButton": true,
                "debug": false,
                "positionClass": "toast-bottom-full-width",
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "1500",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            });
        }).error(function () {
        })

    };

}]);

