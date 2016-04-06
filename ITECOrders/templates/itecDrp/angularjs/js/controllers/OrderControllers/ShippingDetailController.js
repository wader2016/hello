/**
 * Created by iTEC001 on 2015/7/29.
 */
MetronicApp.controller('ShippingDetailController',['$http','$scope','$rootScope','$location','ModelService','apiUrl', function ($http,$scope,$rootScope,$location,ModelService,apiUrl) {
    //ModelService.getData(25).success(function(data){
    //    if(data.ErrMessage==null) {
    //        $scope.items = data.Data;
    //        $scope.CarrierId = $scope.items[0].CarrierAccountId;
    //
    //        ////获得联系人信息
    //        $http.get('http://' + apiUrl + '/Api/api/Organization?contacts&carrierId=' + $scope.CarrierId).success(function (data) {
    //            $scope.contactInfo = data.Data;
    //        });
    //        //获得公司信息
    //        $http.get('http://' + apiUrl + '/Api/api/Organization?account&id=' + $scope.CarrierId).success(function (data) {
    //            $scope.shipCompanyInfo = data.Data;
    //        })
    //    }
    //});


    // 单选  选择承运人
    $scope.checkContactInfo= function ($index,item) {
        $scope.info=$index;
        $scope.ContactInfoId = item.Id;
    };

    //生成运单
    $scope.createOrder='生成运单';
    $scope.crateDeliver= function () {
       if(angular.isNumber($scope.info)){
           if($scope.createOrder=='生成运单'){
               $scope.createOrder='生成成功';
               alertInfo.Success("运单生成成功!");
           }
           $scope.testItem=[];
               for(var i=0;i<$scope.items.length;i++){
                   $scope.items[i].SalesOrderLineState='26';
                   $scope.testItem.push($scope.items[i].SalesOrderLineId);
               }
           //改变订单状态
           $http.put('http://'+apiUrl+'/Api/api/SalesOrderLine?state=26',$scope.testItem).success(function () {
           });

           var contactInfoId = [{'CarrierAccountId':$scope.CarrierId,'CarrierContactId':$scope.ContactInfoId}];
           var InfoItem=[];
           var organization={"CarrierAccountId":$scope.CarrierId,"CarrierContactId":$scope.ContactInfoId,"ShipperId":$scope.items[0].BuyerAccountId,"ShipperContactId":$scope.items[0].BuyerContactId,"ConsigneerId":$scope.items[0].SellerAccountId,"ConsigneerContactId":$scope.items[0].SellerContactId};
           var DeliverInfo = {"SalesOrderId":$scope.items[0].SalesOrderId,"SalesOrderLineId":$scope.items[0].SalesOrderLineId,"ProductId":$scope.items[0].ProductId,"ProductBarcode":$scope.items[0].ProductBarcode,"Qty":$scope.items[0].Qty};
           var Info={"deliveryOrder":organization,"deliveryOrderLine":DeliverInfo};
           for(var j=0;j<$scope.items.length;j++){
               InfoItem.push(Info);
           }

           // 绑定订单和承运人信息  生成运单
           $http.post('http://'+apiUrl+'/Api/api/DeliveryOrderLine?bulk',InfoItem).success(function () {
               })
               .error(function () {
                   alertInfo.Error("生成失败!");
               });
       }
       else{
           alertInfo.Error("请先选择承运人!");
       }
    };
}]);