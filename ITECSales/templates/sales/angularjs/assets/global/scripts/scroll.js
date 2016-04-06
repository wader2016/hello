/**
 * Created by iTEC001 on 2016/3/8.
 */
$(function () {
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var portletBody = $(".portlet-body");
    var top = portletBody.offset().top;
    var x = clientHeight-top-75;
    portletBody.height(x+40);
    $(".scroller").height(x);
    $(".slimScrollDiv").height(x);
    $(window).resize(function(){
        var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
        var portletBody = $(".portlet-body");
        var top = portletBody.offset().top;
        var x = clientHeight-top-75;
        portletBody.height(x);
        $(".scroller").height(x-40);
        $(".slimScrollDiv").height(x-40);
    });
});