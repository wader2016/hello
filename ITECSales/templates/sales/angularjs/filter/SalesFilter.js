/**
 * Created by iTEC001 on 2015/12/10.
 */
MetronicApp.filter("salesFilter", function () {
    return function (input) {
        if(input=='2'){
            return input='待付款';
        }
        else if(input=="4"){
            return input='待发货';
        }
        else if(input=="8"){
            return input='待发货';
        }
        else if(input=="16"){
            return input='待发货';
        }
        else if(input=="32"){
            return input='待发货';
        }
        else if(input=="64"){
            return input='待发货';
        }
        else if(input=="128"){
            return input='待发货';
        }
        else if(input=="256"){
            return input='待收货';
        }

    }
});


MetronicApp.filter("searchFilter", function () {
    return function (input) {

    }
});
