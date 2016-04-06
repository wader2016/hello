/**
 * Created by iTEC001 on 2015/8/14.
 */
MetronicApp.controller('DeliverySearchController',['$http','$scope','apiUrl','ModelService','$filter',function ($http,$scope,apiUrl,ModelService,$filter) {

    ModelService.getCategory().success(function (data) {
        $scope.category=data.Data;
        $scope.catelog = [] ;
        for(var i=0;i< $scope.category.length;i++){
            if($scope.category[i].ParentCode === 0){
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

    //时间搜索
    $scope.searchList= function (state) {
        var url ='http://'+apiUrl+'/Api/api/DeliveryOrder?state='+state;
        if($scope.DocDateFrom !=null){
            var dateFrom = $scope.DocDateFrom.split('-').join('');
            url = url+'&dateFrom='+dateFrom;
        }else {
            url = url+'&dateFrom';
        }
        if($scope.DocDateTo !=null){
            var dateTo = $scope.DocDateTo.split('-').join('');
            url = url+'&dateTo='+dateTo;
        }else{
            url = url+'&dateTo';
        }
        if($scope.ProductCode !=null){
            var ProductCode = $scope.ProductCode;
            url = url+'&productCode='+ProductCode;
        }else{
            url = url+'&productCode';
        }
        if($scope.DeliveryOrderNo !=null){
            var DeliveryOrderNo = $scope.DeliveryOrderNo;
            url = url+'&DeliveryOrderNo='+DeliveryOrderNo;
        }else{
            url = url+'&DeliveryOrderNo';
        }
        $http.get(url).success(function (data) {
           $scope.items1 =data.Data;
            for(var i=0 ;i<$scope.items1.length;i++){
                $scope.items1[i].Actions='产品卸货';
            }
            $scope.listCount = $scope.items1.slice(0, $scope.pageSize);
        }).error(function () {
            $scope.items1=[];
            $scope.listCount=[];
        });
    };

    //产品大类筛选
    $scope.checkListItem=[];
    $scope.checkItems= function (item) {
        $scope.checkListItem.push(item);
        for(var i=0;i<$scope.checkListItem.length-1;i++){
            if($scope.checkListItem[i].CatalogName == item.CatalogName){
                $scope.checkListItem.splice(i,1);
                $scope.checkListItem.splice($scope.checkListItem.length-1,1);
            }
        }
        var CateLogItem =[];
        for(var n=0;n<$scope.checkListItem.length;n++){
            CateLogItem.push($scope.checkListItem[n].CatalogId);
        }

        var CateLogIdItem={"CatalogIds":CateLogItem};
        $http.post('http://'+apiUrl+'/Api/api/SalesOrder?state=0',CateLogIdItem).success(function (data) {
            $scope.items1 =data.Data;
            for(var i=0 ;i<$scope.items1.length;i++){
                $scope.items1[i].Actions='产品卸货';
            }
            $scope.listCount = $scope.items1.slice(0, $scope.pageSize);
        })

    };


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


}]);