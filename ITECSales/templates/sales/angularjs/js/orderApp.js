/***
Metronic AngularJS App Main Script
***/
/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap",
    "oc.lazyLoad",  
    "ngSanitize",
    "LocalStorageModule",
    "angular-loading-bar"
]);

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


//配置请求的ip地址
MetronicApp.constant('apiUrl','192.168.1.10:8081');

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
MetronicApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
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
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/Login/login.html");
    $stateProvider
        .state('login',{
            url:'/Login/login.html',
            templateUrl:'views/Login/login.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "assets/global/plugins/select2/select2.css",
                            "assets/admin/pages/css/login3.css",
                            'assets/global/css/loading-bar.css',
                            "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                            "assets/global/plugins/select2/select2.min.js"
                        ]
                    });
                }]
            }
        })
        .state('signUp',{
            url:'/Login/signUp.html',
            templateUrl:'views/Login/signUp.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "assets/global/plugins/select2/select2.css",
                            "assets/admin/pages/css/login3.css",
                            'assets/global/css/loading-bar.css',
                            "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                            "assets/global/plugins/select2/select2.min.js"
                        ]
                    });
                }]
            }
        })
        .state('productList',{
            url:'/sales/productList/{listType:.*}',
            templateUrl: 'views/sales/productList.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            'assets/global/css/jquery-ui.css',
                            'assets/global/scripts/jquery-ui.js',
                            "css/sale.css",
                            "assets/frontend/layout/css/style.css",
                            "assets/frontend/layout/scripts/back-to-top.js",
                            "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                            "assets/global/plugins/fancybox/source/jquery.fancybox.pack.js",
                            "assets/global/plugins/carousel-owl-carousel/owl-carousel/owl.carousel.min.js" ,
                            'assets/global/plugins/zoom/jquery.zoom.min.js',
                            "assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js" ,
                            "assets/global/plugins/uniform/jquery.uniform.min.js",
                            "assets/global/plugins/rateit/src/jquery.rateit.js"

                        ]
                    });
                }]
            }
        })
        .state('productDetail',{
            url:'/sales/productDetail.html',
            templateUrl:'views/sales/productDetail.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            'css/sale.css',
                            "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                            "assets/global/plugins/fancybox/source/jquery.fancybox.pack.js",
                            "assets/global/plugins/carousel-owl-carousel/owl-carousel/owl.carousel.min.js"
                        ]
                    });
                }]
            }
        })
        .state('shoppingCart',{
            url:'/sales/shoppingCart.html',
            templateUrl:'views/sales/shoppingCart.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            'assets/global/css/jquery-ui.css',
                            'assets/global/scripts/jquery-ui.js',
                            'css/sale.css',
                            "assets/frontend/layout/scripts/back-to-top.js",
                            "assets/global/plugins/jquery-slimscroll/jquery.slimscroll.min.js",
                            "assets/global/plugins/fancybox/source/jquery.fancybox.pack.js",
                            "assets/global/plugins/carousel-owl-carousel/owl-carousel/owl.carousel.min.js" ,
                            'assets/global/plugins/zoom/jquery.zoom.min.js',
                            "assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js" ,
                            "assets/global/plugins/uniform/jquery.uniform.min.js",
                            "assets/global/plugins/rateit/src/jquery.rateit.js"
                        ]
                    });
                }]
            }
        })
        .state('shopCheckOut',{
            url:'/sales/shopCheckOut.html',
            templateUrl:'views/sales/shopCheckOut.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            'css/sale.css'
                        ]
                    });
                }]
            }
        })
        .state('myOrderList',{
            url:'/sales/myOrderList.html',
            templateUrl:'views/sales/myOrderList.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            'assets/global/plugins/bootstrap/css/bootstrap.min.css',
                            "css/sale.css",
                            'assets/global/plugins/bootstrap-datepicker/css/datepicker.css',
                            'assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            "filter/SalesFilter.js"
                        ]
                    });
                }]
            }
        })
        .state('payment',{
            url:'/sales/payment.html',
            templateUrl:'views/sales/payment.html',
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "css/sale.css"
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
                            "js/sparkline.js"
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
                            "css/sale.css",
                            "assets/admin/pages/css/profile.css",
                            "assets/admin/pages/css/tasks.css",
                            "assets/global/plugins/select2/select2.css",
                            "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                            "assets/admin/pages/css/todo.css",

                            "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                            "assets/admin/pages/scripts/todo.js",
                            "assets/global/plugins/select2/select2.min.js"
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
                            "css/sale.css",
                            "assets/admin/pages/css/profile.css",
                            "assets/admin/pages/css/tasks.css",
                            "assets/global/plugins/select2/select2.css",
                            "assets/global/plugins/bootstrap-datepicker/css/datepicker3.css",
                            "assets/admin/pages/css/todo.css",

                            "assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js",
                            "assets/admin/pages/scripts/todo.js",
                            "assets/global/plugins/select2/select2.min.js"
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
                            "assets/admin/pages/scripts/todo.js"

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
                            "assets/admin/pages/css/tasks.css"
                        ]
                    });
                }]
            }
        })

        .state('productManagement',{
            url:"/managements/productManagement.html",
            templateUrl:"views/managements/productManagement.html",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                        ]
                    });
                }]
            }
        })

        .state('orderDetail',{
            url:"/sales/orderDetail.html",
            templateUrl:"views/sales/orderDetail.html",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        files: [
                            "css/sale.css",
                           "assets/global/plugins/jquery-validation/js/jquery.validate.min.js",
                            "assets/global/plugins/jquery-validation/js/additional-methods.min.js",
                            "assets/global/plugins/bootstrap-wizard/jquery.bootstrap.wizard.min.js",
                            "assets/global/plugins/select2/select2.min.js",
                            "js/form-wizard.js"
                        ]
                    });
                }]
            }
        })
}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", function($rootScope,$scope,settings,$state) {
    $rootScope.$state = $state;

    $rootScope.listCart = [];
    $rootScope.totalPrice=0;

    $rootScope.orderLength=0;
}]);

