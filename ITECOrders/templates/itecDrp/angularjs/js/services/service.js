/**
 * Created by iTEC001 on 2015/8/31.
 */

MetronicApp.service('ModelService',['$http','apiUrl',function($http,apiUrl){
    this.getData=function(state){
        return $http({
            method: 'POST',
            url: 'http://'+apiUrl+'/Api/api/SalesOrder?one',
            data:{state:state},
            cache:true
        });
    };
    this.getCategory= function () {
        return $http({
            method: 'GET',
            url: "http://"+apiUrl+"/Api/api/v1/ProductCategory",
            cache:true
        });
    };

    this.getArea= function () {
        return $http({
            method: 'POST',
            url: 'http://'+apiUrl+'/Api/api/Organization'
        })
    }
}]);


MetronicApp.service("SalesService",['$http','apiUrl', function ($http,apiUrl){
    this.shoppingCart = function (id) {
        return $http({
            method:"GET",
            url:"http://"+apiUrl+"/Api/api/v1/me/ShoppingCart/"+id
        })
    }
}]);

MetronicApp.service("ListService",['$http','apiUrl', function ($http,apiUrl){
    this.totalOrders = function (status,id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
            "Status":status,
            "PageIndex":0,
            "PageSize":0
        };
        return $http({
            method:"put",
            url:"http://"+apiUrl+"/Api/api/v1/me/SalesOrders",
            data:putData,
            cache:true
        })
    };
    this.payingOrders = function (status,id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
            "Status":status,
            "PageIndex":0,
            "PageSize":0
        };
        return $http({
            method:"put",
            url:"http://"+apiUrl+"/Api/api/v1/me/SalesOrders/Paying",
            data:putData,
            cache:true
        })
    };
    this.deliveryOrders = function (status,id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
            "Status":status,
            "PageIndex":0,
            "PageSize":0
        };
        return $http({
            method:"put",
            url:"http://"+apiUrl+"/Api/api/v1/me/SalesOrders/Delivering",
            data:putData,
            cache:true
        })
    }

}]);


