
MetronicApp.controller('LightTableController',['$scope','$http','ModelService','apiUrl','$filter','authService','$location',function ($scope,$http,ModelService,apiUrl,$filter,authService,$location) {
    // 获取卖家信息
    if(authService.authentication.isAuth==false){
        authService.logOut();
        $location.url('/Login/login.html');
    }


    $http.get("http://"+apiUrl+"/Api/api/v1/Sales/Profile").success(function (data) {
        $scope.SalesInfo = data.Data;
        $scope.salesId = $scope.SalesInfo.SalesId;
        $scope.StoreInfo = JSON.parse($scope.SalesInfo.storeInfos);
        GetSalesOrderData([0],[0]);
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
        var data = {state:state,DateFrom:dateFrom,DateTo:dateTo,ProductCode:ProductCode, BuyerAccountName:BuyerAccountName};
        if($scope.DocDateFrom !=null){
            var dateFrom = $scope.DocDateFrom.split('-').join('');
        }else {
           dateFrom = "";
        }
        if($scope.DocDateTo !=null){
            var dateTo = $scope.DocDateTo.split('-').join('');
        }else{
            dateTo ="";
        }
        if($scope.ProductCode !=null){
            var ProductCode = $scope.ProductCode;
        }else{
           ProductCode = "";
        }
        if($scope.BuyerAccountName !=null){
            var BuyerAccountName = $scope.BuyerAccountName;
        }else{
           BuyerAccountName = "";
        }
        var req ={
            method:"POST",
            url:'http://'+apiUrl+'/Api/api/SalesOrder?one',
            data:data
            };
        $http(req).success(function (data) {
          $scope.items = data.data;
            for(var i=0 ;i<$scope.items.length;i++){
                $scope.items[i].isCheck=false;
                $scope.items[i].Actions='安排备货';
            }
          $scope.listCount = $scope.items.slice(0, $scope.pageSize);
        }).error(function () {
            $scope.items=[];
            $scope.listCount=[];
        });
    };

    //产品大类选择
    $scope.checkListItem=[];
    $scope.checkItems= function (item) {
        $scope.checkListItem.push(item.Id);
        SelectId($scope.checkListItem,item);
        GetSalesOrderData($scope.checkListItem,[0]);
    };
    //仓库选择
    $scope.checkStoreItem=[];
    $scope.checkStore= function (item) {
        $scope.checkStoreItem.push(item.StoreId);
        SelectId($scope.checkStoreItem,item);
        GetSalesOrderData([0],$scope.checkStoreItem);
    };

    //不限
    $scope.allList= function () {
        GetSalesOrderData([0],[0]);
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
            $http.put("http://"+apiUrl+"/Api/api/v1/Sales/SalesOrders/"+$scope.salesId+"/Preparing",checkId).success(function () {
                alertInfo.Success("已安排仓库备货!");
                for(var i=0;i<$scope.List.length;i++){
                    $scope.List[i].Status='10';
                    $scope.List[i].Actions='取消安排';
                }
            }).error(function () {
                alertInfo.Error("安排仓库备货失败!");
            });

        }
    };

    //模态框加载单个产品信息
    $scope.test=function($index){
        $scope.list = $scope.listCount[$index];
        console.log( $scope.list);
    };

    //单个产品确认
    $scope.Confirm=function(){
        if($scope.list.Actions=='安排备货'){
            $http.put("http://"+apiUrl+"/Api/api/v1/Sales/SalesOrders/"+$scope.salesId+"/Preparing",[{"DocCode":$scope.list.DocCode,"SalesOrderLineIds":[$scope.list.Id]}]).success(function () {
                alertInfo.Success("已安排仓库备货!");
                $scope.list.Status='10';
                $scope.list.Actions='取消安排';
            }).error(function () {
                alertInfo.Error("安排备货失败!");
            });
        }
        else if($scope.list.Actions=='取消安排'){
            $http.put("http://"+apiUrl+"/Api/api/v1/Sales/SalesOrders/"+$scope.salesId+"/CancelPrepared",[{"DocCode":$scope.list.DocCode,"SalesOrderLineIds":[$scope.list.Id]}]).success(function () {
                alertInfo.Success("已安排仓库备货!");
                $scope.list.Status='4';
                $scope.list.Actions='安排备货';
            }).error(function () {
                alertInfo.Error("取消备货失败!");
            });

        }
    };

//-------------------------------分页--------------------------------------
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

//-------------------------------函数--------------------------------
    // 将选中项的Id存放在数组中
    function SelectId(array,item){
        for(var i=0;i<array.length-1;i++){
            if(array[i] == item.Id){
                array.splice(i,1);
                array.splice(array.length-1,1);
            }
        }
    }

    // 根据不同的筛选条件 获取数据
    function GetSalesOrderData(categoryId,storeId){
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
        $http.put("http://"+apiUrl+"/Api/api/v1/Sales/SalesOrders/GetPreparingLines",putInfo,{cache:true}).success(function (data) {
            $scope.getSalesOrder = data.Data;
            for(var i=0 ;i< $scope.getSalesOrder.length;i++){
                $scope.getSalesOrder[i].Actions='安排备货';
            }
            $scope.totalPage = Math.ceil(($scope.getSalesOrder.length) / $scope.pageSize);
            $scope.listCount = $scope.getSalesOrder.slice(0, $scope.pageSize);
        });
    }

}]);













