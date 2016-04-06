/**
 * Created by iTEC001 on 2015/8/14.
 */

// 数据过滤
MetronicApp.filter('convert', function() {
    return function(input) {
        if (input=='1') {
            return input='';
        }
        else if(input=='4'){
            return input='待安排备货';
        }
        else if(input=='10'){
            return input='已安排仓库备货';
        }

        else if(input=='16'){
            return input='仓库待备货';
        }else if(input=='11'){
            return input='仓库备货完成';
        }

        else if(input=='32'){
            return input='待安排装柜';
        }else if(input=='12'){
            return input='已安排装柜';
        }

        if(input=='64'){
            return input='物流待装柜';
        }else if(input=='13'){
            return input='物流已装柜';
        }

       else if(input=='25') {
            return input = '已装柜,待生成运单';
        }
        else if (input=='26'){
            return input='已生成运单,待运送';
        }

        //else if(input=='3'){
        //    return input='待发货';
        //}else if(input=='13'){
        //    return input='发货完成';
        //}
        //
        //else if(input=='4'){
        //    return input='待收货';
        //}else if(input=='14'){
        //    return input='收货完成';
        //}
    }
});

MetronicApp.filter('DeliveryConvert', function() {
    return function(input) {
        if (input == '0') {
            return input = '运单登记';
        }
        else if(input == '15'){
            return input = '运单已登记，待运送';
        }

        else if(input == '1'){
            return input = '运送中';
        }
        else if(input == '16'){
            return input = '运送完成，待收货';
        }

        else if(input == '2'){
            return input = '待收货';
        }
        else if(input == '3'){
            return input = '已确认收货';
        }

    }
});

MetronicApp.filter("dateFilter", function () {
    return function (input) {
        var year=  input.getFullYear().toString();
        var month = input.getMonth()+1;
        if(month<10){
            month = '0'+month.toString();
        }else{
            month=month.toString();
        }
        var day = input.getDate();
        if(day<10){
            day = '0'+day.toString();
        }else{
            day=day.toString();
        }
        var dateFirst = [];
        dateFirst.push(year,month,'01');
        return input = dateFirst.join('-');
    }
});

MetronicApp.filter("dateToFilter", function () {
    return function (input) {
        var year=  input.getFullYear().toString();
        var month = input.getMonth()+1;
        if(month<10){
            month = '0'+month.toString();
        }else{
            month=month.toString();
        }
        var day = input.getDate();
        if(day<10){
            day = '0'+day.toString();
        }else{
            day=day.toString();
        }
        var dateNow=[];
        dateNow.push(year,month,day);
        return input = dateNow.join('-');
    }
});



