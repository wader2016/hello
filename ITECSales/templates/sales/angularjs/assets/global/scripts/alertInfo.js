/**
 * Created by iTEC001 on 2015/11/30.
 */

var alertInfo = function () {
    var success = function (text) {
        toastr.success(text,'成功！',{
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "1500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        });
    };

    var error = function (text) {
        toastr.error(text,'失败！',{
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "1500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        });
    };

    var warning = function (text) {
        toastr.warning(text,'警告',{
            "closeButton": true,
            "debug": false,
            "positionClass": "toast-bottom-full-width",
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "1500",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        })
    };

    return {
        Success: function (text) {
            success(text)
        },
        Error: function (text) {
            error(text);
        },
        Warning: function (text) {
            warning(text);
        }
    }
}();