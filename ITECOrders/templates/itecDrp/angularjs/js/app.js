/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap",
    "oc.lazyLoad",  
    "ngSanitize",
    'LocalStorageModule',
    'angular-loading-bar'
]);

//配置请求的ip地址
MetronicApp.constant('apiUrl','192.168.1.10:8081');

MetronicApp.run(function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
});

MetronicApp.run(['authService', function (authService) {
    authService.fillAuthData();
}]);

 MetronicApp.config(function ($stateProvider, $urlRouterProvider,$httpProvider) {
     if (!$httpProvider.defaults.headers.get) {
               $httpProvider.defaults.headers.get = {};
         }
     //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
     // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
     });

MetronicApp.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };
    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope,$rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });

}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider) {
        // Redirect any unmatched url
        $urlRouterProvider.otherwise("/Login/login.html");
        $stateProvider
            .state('login', {
                url: '/Login/login.html',
                templateUrl: 'views/Login/login.html',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/global/plugins/select2/select2.css",
                                "assets/admin/pages/css/login3.css",
                                'assets/global/css/loading-bar.css',
                                "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                                "assets/global/plugins/select2/select2.min.js",
                                'js/controllers/LoginControllers/LoginController.js'
                            ]
                        });
                    }]
                }
            })
            .state('signUp', {
                url: '/Login/signUp.html',
                templateUrl: 'views/Login/signUp.html',
                controller: 'SignUpController',
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/global/plugins/select2/select2.css",
                                "assets/admin/pages/css/login3.css",
                                'assets/global/css/loading-bar.css',
                                "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                                "assets/global/plugins/select2/select2.min.js",
                                'js/controllers/LoginControllers/SignUpController.js'
                            ]
                        });
                    }]
                }
            })
            // Light Table
            .state('lightTable', {
                url: "/orders/lightTable.html",
                templateUrl: "views/orders/lightTable.html",
                data: {pageTitle: '安排仓库备货', pageSubTitle: '业务安排'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/LightTableController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderLoading', {
                url: "/orders/orderLoading.html",
                templateUrl: "views/orders/orderLoading.html",
                data: {pageTitle: '安排物流装柜', pageSubTitle: '选择物流公司'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderLoadingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderPrepare', {
                url: "/orders/orderPrepare.html",
                templateUrl: "views/orders/orderPrepare.html",
                data: {pageTitle: '仓库备货', pageSubTitle: '仓库捡货，自动产生销货单'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderPrepareController.js'
                            ]
                        });
                    }]
                }
            })
            .state('allOrder', {
                url: "/orders/allOrder.html",
                templateUrl: "views/orders/allOrder.html",
                data: {pageTitle: '全部订单', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/AllOrderController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderReceiving', {
                url: "/orders/orderReceiving.html",
                templateUrl: "views/orders/orderReceiving.html",
                data: {pageTitle: '待收货订单查询', pageSubTitle: '付运单号'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderReceivingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderFinish', {
                url: "/orders/orderFinish.html",
                templateUrl: "views/orders/orderFinish.html",
                data: {pageTitle: '已收货订单查询', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderFinishController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderShipping', {
                url: "/orders/orderShipping.html",
                templateUrl: "views/orders/orderShipping.html",
                data: {pageTitle: '待运送订单查询', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderShippingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('productShipping', {
                url: "/orders/productShipping.html",
                templateUrl: "views/orders/productShipping.html",
                data: {pageTitle: '打包装柜作业', pageSubTitle: '物流'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/ProductShippingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderRegister', {
                url: "/orders/orderRegister.html",
                templateUrl: "views/orders/orderRegister.html",
                data: {pageTitle: '启运登记', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderRegisterController.js'
                            ]
                        });
                    }]
                }
            })
            .state('orderUnLoad', {
                url: "/orders/orderUnLoad.html",
                templateUrl: "views/orders/orderUnLoad.html",
                data: {pageTitle: '物流到站卸货', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/OrderUnLoadController.js'
                            ]
                        });
                    }]
                }
            })
            .state('deliverySearch', {
                url: "/orders/deliverySearch.html",
                templateUrl: "views/orders/deliverySearch.html",
                data: {pageTitle: '在途运单查询', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/DeliverySearchController.js'

                            ]
                        });
                    }]
                }
            })
            .state('deliveryFinish', {
                url: "/orders/deliveryFinish.html",
                templateUrl: "views/orders/deliveryFinish.html",
                data: {pageTitle: '已结案运单查询', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/DeliveryFinishController.js'
                            ]
                        });
                    }]
                }
            })
            .state('allDeliveryOrder', {
                url: "/orders/allDeliveryOrder.html",
                templateUrl: "views/orders/allDeliveryOrder.html",
                data: {pageTitle: '全部运单查询', pageSubTitle: ''},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/AllDeliveryOrderController.js'

                            ]
                        });
                    }]
                }
            })
            .state('shippingDetail', {
                url: "/orders/shippingDetail.html",
                templateUrl: "views/orders/shippingDetail.html",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/order.css',
                                'assets/global/plugins/select2/select2.css',
                                'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                                'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                                'assets/global/plugins/select2/select2.min.js',
                                'js/controllers/OrderControllers/ShippingDetailController.js'

                            ]
                        });
                    }]
                }
            })
            .state('userProfile',{
                url:"/managements/userProfile",
                views:{
                    '':{
                        templateUrl:"views/managements/userProfile.html"
                    },
                    'user_left@userProfile':{
                        templateUrl: 'views/managements/user_left.html'
                    },
                    'user_right@userProfile':{
                        templateUrl: 'views/managements/user_right.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css" ,
                                "assets/admin/pages/css/profile.css",
                                "assets/admin/pages/css/tasks.css",
                                "assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js",
                                 "assets/global/plugins/jquery.sparkline.min.js" ,
                                "js/sparkline.js",
                                'js/controllers/ManagementControllers/UserProfileController.js'
                             ]
                        });
                    }]
                }
            })
            .state('userProfile.accountSetting',{
                url:"/accountSetting",
                views:{
                    'user_right@userProfile':{
                        templateUrl: 'views/managements/accountSetting.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/admin/pages/css/profile.css",
                                "assets/admin/pages/css/tasks.css",
                                "assets/global/plugins/select2/select2.css",
                                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                                "assets/admin/pages/css/todo.css",

                                "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                                "assets/admin/pages/scripts/todo.js",
                                "assets/global/plugins/select2/select2.min.js",
                                'js/controllers/ManagementControllers/AccountSettingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('userProfile.companySetting',{
                url:"/companySetting",
                views:{
                    'user_right@userProfile':{
                        templateUrl: 'views/managements/companySetting.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/admin/pages/css/profile.css",
                                "assets/admin/pages/css/tasks.css",
                                "assets/global/plugins/select2/select2.css",
                                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                                "assets/admin/pages/css/todo.css",

                                "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                                "assets/admin/pages/scripts/todo.js",
                                "assets/global/plugins/select2/select2.min.js",
                                'js/controllers/ManagementControllers/CompanySettingController.js'
                            ]
                        });
                    }]
                }
            })
            .state('userProfile.tasks',{
                url:"/tasks",
                views:{
                    'user_left@userProfile':{
                        templateUrl: 'views/managements/task_left.html'
                    },
                    'user_right@userProfile':{
                        templateUrl: 'views/managements/task_right.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/admin/pages/css/profile.css",
                                "assets/admin/pages/css/tasks.css",
                                "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                                "assets/global/plugins/select2/select2.css",
                                 "assets/admin/pages/css/todo.css",
                               "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                                "assets/global/plugins/select2/select2.min.js",
                                "assets/admin/pages/scripts/todo.js",
                                'js/controllers/ManagementControllers/TasksController.js'
                            ]
                        });
                    }]
                }
            })
            .state('userProfile.help',{
                url:"/help",
                views:{
                    'user_right@userProfile':{
                        templateUrl: 'views/managements/help.html'
                    }
                },
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/admin/pages/css/profile.css",
                                "assets/admin/pages/css/tasks.css",
                                'js/controllers/ManagementControllers/HelpController.js'
                            ]
                        });
                    }]
                }
            })

            .state('product', {
                url: "/managements/product.html",
                templateUrl: "views/managements/product.html",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/global/css/jquery-ui.css",
                                "css/product.css",
                                "assets/global/scripts/jquery-ui.js",

                                "assets/frontend/layout/scripts/back-to-top.js",
                                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",

                                "assets/global/plugins/fancybox/source/jquery.fancybox.pack.js",
                                "assets/global/plugins/carousel-owl-carousel/owl-carousel/owl.carousel.min.js" ,
                                'assets/global/plugins/zoom/jquery.zoom.min.js',
                                "assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js" ,
                                "assets/global/scripts/pagination.js",
                                "assets/global/scripts/linq.min.js",
                                'js/controllers/ManagementControllers/ProductController.js'
                            ]
                        });
                    }]
                }
            })
            .state('productDetail',{
                url:'/managements/productDetail.html',
                templateUrl:'views/managements/productDetail.html',
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                'css/product.css',
                                "assets/global/scripts/linq.min.js",
                                'js/controllers/ManagementControllers/ProductDetailController.js'

                            ]
                        });
                    }]
                }
            })
            .state('users', {
                url: "/managements/userInfo.html",
                templateUrl: "views/managements/userInfo.html",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "css/product.css",
                                "assets/admin/pages/css/profile.css",
                                "assets/global/scripts/pagination.js",
                                "assets/global/scripts/linq.min.js",
                                'js/controllers/ManagementControllers/UserInfoController.js'
                            ]
                        });
                    }]
                }
            })
            .state('store', {
                url: "/managements/storeInfo.html",
                templateUrl: "views/managements/storeInfo.html",
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "css/product.css",
                                "assets/admin/pages/css/profile.css",
                                "assets/global/scripts/pagination.js",
                                "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                                "assets/global/scripts/linq.min.js",
                                'js/controllers/ManagementControllers/StoreInfoController.js'
                            ]
                        });
                    }]
                }
            })

            .state('analyse', {
                url: "/orders/analysis.html",
                templateUrl: "views/orders/analysis.html",
                data: {pageTitle: '销售', pageSubTitle: '销售战情看板'},
                resolve: {
                    deps: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'MetronicApp',
                            files: [
                                "assets/global/plugins/flot/jquery.flot.js",
                                "assets/global/plugins/flot/jquery.flot.resize.js" ,
                                "assets/global/plugins/flot/jquery.flot.categories.js" ,
                                "assets/admin/pages/scripts/ecommerce-index.js",
                                'js/controllers/OrderControllers/AnalyseController.js'
                            ]
                        });
                    }]
                }
            })



}]);

MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope,settings,$state) {
    $rootScope.$state = $state;

}]);


