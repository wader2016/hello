/**
 * Created by iTEC001 on 2015/10/26.
 */

var sparkLineInit = function () {
    var sparkTest = function (num) {
       $.ajax({
           type:"GET",
           url:"/itecDrpWeb/templates/itecDrp/angularjs/data/userData"+num+".json",
           success:function(data){
               var array1 = data.data1 ;
               var array2 = data.data2;
               $('#sparkline_bar').sparkline(array1,{
                   type: 'bar',
                   barWidth: 7,
                   height:50,
                   zeroAxis: false,
                   barColor: '#FF947F',
                   negBarColor: '#7f3f00'});
               $('#sparkline_bar2').sparkline(array2,{
                   type: 'bar',
                   barWidth: 7,
                   height:50,
                   zeroAxis: false,
                   barColor: '#81D9FF',
                   negBarColor: '#7f3f00'});
           }
       });
    };
    return {
        init : function (num) {
            sparkTest(num);
        }
    }
}();
