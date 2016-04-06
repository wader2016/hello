/**
 * Created by iTEC001 on 2015/9/10.
 */
'use strict';
MetronicApp.factory('ordersService', ['$http', function ($http) {

    var serviceBase = 'http://192.168.1.48:8081/';
    //var serviceBase = 'http://localhost:26264/';
    var ordersServiceFactory = {};

    var _getOrders = function () {

        return $http.get(serviceBase + 'api/orders').then(function (results) {
            return results;
        });
    };

    ordersServiceFactory.getOrders = _getOrders;

    return ordersServiceFactory;

}]);