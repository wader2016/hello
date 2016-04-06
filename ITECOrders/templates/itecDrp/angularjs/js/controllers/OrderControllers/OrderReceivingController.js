/**
 * Created by iTEC001 on 2015/8/10.
 */
// 获得数据
MetronicApp.controller('OrderReceivingController',['$scope','$http','ModelService','apiUrl','$filter', function ($scope,$http,ModelService,apiUrl,$filter) {
    ModelService.getData(27).success(function(data){
        if(data.ErrMessage===null) {
            $scope.items = data.Data;
            for (var i = 0; i < $scope.items.length; i++) {
                $scope.items[i].isCheck = false;
                $scope.items[i].Actions = '待收货';
            }
            $scope.len = $scope.items.length;
            if ($scope.len > 0) {
                $scope.totalPage = Math.ceil(($scope.len) / $scope.pageSize);
                $scope.listCount = $scope.items.slice(0, $scope.pageSize);
            }
        }
    });

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
//-------------------数据处理部分----------------------------------------

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
        var url ='http://'+apiUrl+'/Api/api/SalesOrder?state='+state;
        if($scope.DocDateFrom !==null){
            var dateFrom = $scope.DocDateFrom.split('-').join('');
            url = url+'&dateFrom='+dateFrom;
        }else {
            url = url+'&dateFrom';
        }
        if($scope.DocDateTo !==null){
            var dateTo = $scope.DocDateTo.split('-').join('');
            url = url+'&dateTo='+dateTo;
        }else{
            url = url+'&dateTo';
        }
        if($scope.ProductCode !==null){
            var ProductCode = $scope.ProductCode;
            url = url+'&productCode='+ProductCode;
        }else{
            url = url+'&productCode';
        }
        if($scope.BuyerAccountName !==null){
            var BuyerAccountName = $scope.BuyerAccountName;
            url = url+'&buyerAccountName='+BuyerAccountName;
        }else{
            url = url+'&buyerAccountName';
        }
        $http.get(url).success(function (data) {
            $scope.items = data.Data;
            for(var i=0 ;i<$scope.items.length;i++){
                $scope.items[i].isCheck=false;
                $scope.items[i].Actions='待收货';
            }
            $scope.listCount = $scope.items.slice(0, $scope.pageSize);
        }).error(function () {
            $scope.items=[];
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
        var cateId = CateLogItem.join("*");
        $http.get('http://'+apiUrl+'/Api/api/SalesOrder?state=27&catalog='+cateId).success(function (data) {
            $scope.items=data.Data;
            for(var i=0 ;i<$scope.items.length;i++){
                $scope.items[i].isCheck=false;
            }
            $scope.listCount = $scope.items.slice(0, $scope.pageSize);
        })

    };


    //不限
    $scope.allList= function () {
        ModelService.getData(27).success(function(data){
            $scope.items = data.Data;
            for(var i=0 ;i<$scope.items.length;i++){
                $scope.items[i].isCheck=false;
                $scope.items[i].Actions='待收货';
            }
            $scope.len = $scope.items.length;
            if($scope.len>0){
                $scope.totalPage = Math.ceil(($scope.len) / $scope.pageSize);
                $scope.listCount = $scope.items.slice(0, $scope.pageSize);
            }

        });
    };


    //全选 备货确认
    $scope.stuckConfirm=function() {
        $scope.testItem=[];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                $scope.List[i].isCheck=false;
                $scope.List[i].SalesOrderLineState='14';
                $scope.List[i].Actions='取消收货';
                $scope.testItem.push($scope.List[i].SalesOrderLineId);
            }
            $http.put('http://'+apiUrl+'/Api/api/SalesOrderLine?state=5',$scope.testItem).success(function () {
                alertInfo.Success("ok!");
            })
        }
    };

    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };

    //单个产品确认
    $scope.Confirm=function(){
        $scope.listId =[];
        $scope.listId.push($scope.list.SalesOrderLineId);
        if($scope.list.Actions=='待收货'){
            $scope.list.SalesOrderLineState='14';
            $scope.list.Actions='取消收货';
            $http.put('http://'+apiUrl+'/Api/api/SalesOrderLine?state=5', $scope.listId).success(function () {
                alert('ok');
            }).error(function () {
                alert('error');
            });
        }
        else if($scope.list.Actions=='取消收货'){
            $scope.list.SalesOrderLineState='4';
            $scope.list.Actions='待收货';

            $http.put('http://'+apiUrl+'/Api/api/SalesOrderLine?state=4',$scope.listId).success(function () {
                alert('ok');
            }).error(function () {
                alert('error');
            });
        }


    };

    $scope.List=[];
    //单选
    $scope.CheckElement=function($index){
        if( $scope.listCount[$index].isCheck==false){
            $scope.List.splice(0,0,$scope.listCount[$index]);
            $scope.listCount[$index].isCheck=true;
        }else if($scope.listCount[$index].isCheck==true){
            for(var i=0;i<$scope.List.length;i++){
                if($scope.listCount[$index].ProductId ==$scope.List[i].ProductId){
                    $scope.listCount[$index].isCheck=false;
                    $scope.List.splice(i,1);
                }
            }
        }
    };

    //全选
    $scope.checkAll= function () {
        for(var i=0;i<$scope.listCount.length;i++){
            if( $scope.listCount[i].isCheck==false){
                $scope.List.splice(0,0,$scope.listCount[i]);
                $scope.listCount[i].isCheck=true;
            }else if($scope.listCount[i].isCheck==true){
                $scope.listCount[i].isCheck=false;
                $scope.List=[];
            }
        }
    };


    $scope.currentPage = 1;
    $scope.pages = [1,2,3,4,5];
    $scope.pageSize=10;

    $scope.setPage=function(page,pageSize){
        $scope.listCount = $scope.items.slice((page - 1) * pageSize, page * pageSize);
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

