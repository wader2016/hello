
// 获得数据
MetronicApp.controller('OrderPrepareController',['$scope','$http','ModelService','apiUrl','$filter', function ($scope,$http,ModelService,apiUrl,$filter) {
    // 获取卖家信息
    $http.get("http://"+apiUrl+"/Api/api/v1/Sales/Profile").success(function (data) {
        $scope.SalesInfo = data.Data;
        $scope.salesId = $scope.SalesInfo.SalesId;
        $scope.StoreInfo = JSON.parse($scope.SalesInfo.storeInfos);
        getStorePreparationLines([0],[0]);
    });
    // 获得产品大类
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

    // 显示/收起 筛选
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

    //搜索
    $scope.searchList= function (state) {
        var url ='http://'+apiUrl+'/Api/api/SalesOrder?state='+state;
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
        if($scope.BuyerAccountName !=null){
            var BuyerAccountName = $scope.BuyerAccountName;
            url = url+'&buyerAccountName='+BuyerAccountName;
        }else{
            url = url+'&buyerAccountName';
        }
        $http.get(url).success(function (data) {
            $scope.items = data.Data;
            for(var i=0 ;i<$scope.items.length;i++){
                $scope.items[i].isCheck=false;
                $scope.items[i].Actions='备货完成';
            }
            $scope.listCount = $scope.items.slice(0, $scope.pageSize);
        }).error(function () {
            $scope.items = [];
            $scope.listCount=[];
        })
    };

    //产品大类选择
    $scope.checkListItem=[];
    $scope.checkItems= function (item) {
        $scope.checkListItem.push(item.Id);
        SelectId($scope.checkListItem,item);
        getStorePreparationLines($scope.checkListItem,[0]);
    };
    //仓库选择
    $scope.checkStoreItem=[];
    $scope.checkStore= function (item) {
        $scope.checkStoreItem.push(item.StoreId);
        SelectId($scope.checkStoreItem,item);
        getStorePreparationLines([0],checkStoreItem);
    };

    //不限
    $scope.allList= function () {
        getStorePreparationLines($scope.salesId,[0],[0]);
    };
    // 单选
    $scope.checkBox = false;
    $scope.List=[];
    $scope.CheckElement = function (index,model) {
        if(model==false){
            for(var i=0;i<$scope.List.length;i++){
                if($scope.listCount[index].Id ==$scope.List[i].Id){
                    $scope.List.splice(i,1);
                }
            }
        }
        else{
            $scope.List.push($scope.listCount[index]);
        }

    };

    //全选
    $scope.master=false;
    $scope.checkAll= function (flag) {
        if(flag==false){
            $scope.checkBox = true;
            for(var i=0;i<$scope.listCount.length;i++){
                $scope.List.push($scope.listCount[i]);
            }
        }else{
            $scope.checkBox = false;
            $scope.List = [];
            console.log($scope.List);
        }
    };

    //全选 备货确认
    $scope.stuckConfirm=function() {
        var checkId=[];
        var DocCode=[];
        if($scope.List.length>0){
            for(var i=0;i<$scope.List.length;i++){
                DocCode.push($scope.List[i].DocCode);
            }
            var order =  Enumerable.From(DocCode).Distinct().ToArray();
            for(var j=0;j<order.length;j++){
                var listId =[];
                var item =[];
                for(var k=0;k<$scope.List.length;k++){
                    if(order[j] == $scope.List[k].DocCode){
                        item.push($scope.List[k].Id);
                        listId = {"DocCode":order[j],"SalesOrderLineIds":item};
                    }
                }
                checkId.push(listId);
            }
            $http.put('http://'+apiUrl+'/Api/api/v1/Sales/SalesOrders/'+$scope.salesId+'/StorePreparing',checkId).success(function () {
                alertInfo.Success("仓库备货完成!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Actions='取消备货';
                    $scope.List[i].Status='11';
                }
            }).error(function () {
                alertInfo.Error("仓库备货失败!");
            })
        }
    };

    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
    };

    //单个产品确认
    $scope.Confirm=function(){
        if($scope.list.Actions=='备货完成'){
            $http.put('http://'+apiUrl+'/Api/api/v1/Sales/SalesOrders/'+$scope.salesId+'/StorePreparing',[{"DocCode":$scope.list.DocCode,"SalesOrderLineIds":[$scope.list.Id]}]).success(function () {
                alertInfo.Success("仓库备货完成!");
                $scope.list.Status='11';
                $scope.list.Actions='取消备货';
            }).error(function () {
                alertInfo.Error("仓库备货失败!");
            });
        }
        else if( $scope.list.Actions=='取消备货'){
            $http.put('http://'+apiUrl+'/Api/api/v1/Sales/SalesOrders/'+$scope.salesId+'/CancelStorePrepared',[{"DocCode":$scope.list.DocCode,"SalesOrderLineIds":[$scope.list.Id]}]).success(function () {
                alertInfo.Success("取消仓库备货!");
                $scope.list.Status='16';
                $scope.list.Actions='备货完成';

            }).error(function () {
                alertInfo.Error("取消仓库备货失败!");
            });
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
//--------------------------------------------------------------------
    // 将选中项的Id存放在数组中
    function SelectId(array,item){
        for(var i=0;i<array.length-1;i++){
            if(array[i] == item.Id){
                array.splice(i,1);
                array.splice(array.length-1,1);
            }
        }
    }
    // 获取仓库备货订单
    function getStorePreparationLines(categoryId,storeId){
        var putInfo={
            "SalesId":$scope.salesId,
            "SalesOrderId":0,
            "Id":0,
            "DateFrom":0,
            "DateTo":0,
            "ProductCode":0,
            "CategoryId":categoryId,
            "StoreId":storeId,
            "DeliveryPoint":[0]
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/Sales/SalesOrders/GetStorePreparingLines",putInfo,{cache:true}).success(function (data) {
            $scope.getSalesOrder = data.Data;
            for(var i=0 ;i< $scope.getSalesOrder.length;i++){
                $scope.getSalesOrder[i].Actions='备货完成';
            }
            $scope.totalPage = Math.ceil(($scope.getSalesOrder.length) / $scope.pageSize);
            $scope.listCount = $scope.getSalesOrder.slice(0, $scope.pageSize);
        });
    }
}]);





