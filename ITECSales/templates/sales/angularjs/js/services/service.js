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
    this.totalOrders = function (id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
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
    this.payingOrders = function (id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
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
    this.deliveryOrders = function (id) {
        var putData={
            "SalesOrderId":0,
            "BuyerId":id,
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


MetronicApp.factory("CatalogFactory",['$http','$q','apiUrl', function ($http,$q,apiUrl) {
    var menuFactory={};

    menuFactory.getCategory = function () {
        var deferred = $q.defer();
        $http.get("http://"+apiUrl+"/Api/api/v1/ProductCategory",{cache:true}).success(function (data) {
            var menu = data.Data;
            var menuData= [];
            for(var i=0;i<menu.length;i++){
                if(menu[i].ParentCode == 0 && menu[i].Id<10000){
                   menu[i].module=[];
                    for(var j =0;j<menu.length;j++){
                        if(menu[i].Id == menu[j].ParentCode){
                            menu[j].url = "#/sales/productList/"+menu[j].Id;
                            menu[i].module.push(menu[j])
                        }
                    }
                    menuData.push(menu[i]);
                }
            }

            deferred.resolve(menuData);
        }).error(function () {
            deferred.reject("获取失败");
        });
        return deferred.promise;
    };
    return menuFactory;
}]);


