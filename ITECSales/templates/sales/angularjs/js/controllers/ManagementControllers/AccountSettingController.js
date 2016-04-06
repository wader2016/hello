/**
 * Created by iTEC001 on 2015/10/22.
 */
MetronicApp.controller('AccountSettingController', function ($scope, $http,authService,apiUrl,$timeout,$location,$rootScope,localStorageService) {
    $scope.loginName = authService.authentication.userName;
    //获得用户信息
    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        //个人信息
        $scope.ContactInfoDetail = JSON.parse($scope.userInfo.ContactInfo);
        $scope.realName = $scope.ContactInfoDetail.Name;
        $scope.Tel = $scope.ContactInfoDetail.Tel1;
        $scope.loginEmail = $scope.ContactInfoDetail.Email1;
        $rootScope.Nick = $scope.ContactInfoDetail.Nick;

        // 主要地址
        $scope.MainAddressInfo = JSON.parse($scope.userInfo.MainAddressInfo);

        // 首选商场  库存信息
        $scope.StoreInfo = JSON.parse($scope.userInfo.StoreInfo);
        $http.get("http://"+apiUrl+"/Api/api/v1/Store").success(function (data) {
            $scope.mapAddress = data.Data;
            if($scope.StoreInfo != null){
                for(var i=0;i<$scope.mapAddress.length;i++){
                    if($scope.mapAddress[i].StoreId == $scope.StoreInfo.Id){
                        $scope.mapAdd = $scope.mapAddress[i];
                        mapFun($scope.mapAdd);
                    }
                }
            }
            else{
                $scope.mapAdd =  $scope.mapAddress[0];
                mapFun($scope.mapAdd);
            }
        });
        $scope.userId = $scope.ContactInfoDetail.Id;
        $scope.Identity = $scope.userInfo.Identity;

        // 收货地址信息
        $scope.AddressInfo = JSON.parse($scope.userInfo.AddressInfo);
        for(var i=0;i<$scope.AddressInfo.length;i++){
            $scope.AddressInfo[i].defaultSet = false;
            if($scope.AddressInfo[i].Id == $scope.MainAddressInfo[0].Id){
                $scope.AddressInfo[i].defaultSet = true;
            }
            var TelAndPhone = JSON.parse($scope.AddressInfo[i].StrExt2);
            var s = $scope.AddressInfo[i].AddressLine2;
            var addDetail="";
            var area = "";
            if(s.lastIndexOf("区") !=-1){
                addDetail = s.substring(0,s.lastIndexOf("区")+1);
                area = s.substring(s.lastIndexOf("区")+1);
            }
            else if(s.lastIndexOf("县") !=-1){
                addDetail = s.substring(0,s.lastIndexOf("县")+1);
                area = s.substring(s.lastIndexOf("县")+1);
            }
            else if(s.lastIndexOf("旗") !=-1){
                addDetail = s.substring(0,s.lastIndexOf("旗")+1);
                area = s.substring(s.lastIndexOf("旗")+1);
            }
            else if(s.lastIndexOf("市") !=-1){
                addDetail = s.substring(0,s.lastIndexOf("市")+1);
                area = s.substring(s.lastIndexOf("市")+1);
            }
            $scope.AddressInfo[i].addDetail=addDetail;
            $scope.AddressInfo[i].area = area;
            $scope.AddressInfo[i].TelAndPhone = TelAndPhone;
        }
        // 支付信息
        if($scope.userInfo.PaymentInfo !=null){
            $scope.PaymentInfo = $scope.userInfo.PaymentInfo.split("|");
            $scope.payInfo = [];
            for(var j=0;j<$scope.PaymentInfo.length;j++){
                var item = $scope.PaymentInfo[j].split(":")[1];
                $scope.payInfo.push(item);
            }
            $scope.CardNumber = $scope.payInfo[0];
            $scope.CardName = $scope.payInfo[1];
            $scope.IdCard = $scope.payInfo[2];
            $scope.CardPhone = $scope.payInfo[3];
        }
        // 发票信息
        $scope.InvoiceInfo = JSON.parse($scope.userInfo.InvoiceInfo);

        if($scope.InvoiceInfo !=null){
            $scope.invoiceId = $scope.InvoiceInfo.Id;
            $scope.invoiceName =  $scope.InvoiceInfo.Name;
            $scope.invoiceNumber =  $scope.InvoiceInfo.Code;
            $scope.invoiceAddressAndPhone =  $scope.InvoiceInfo.AddressLine;
            $scope.bankLine =  $scope.InvoiceInfo.BankLine;
        }
        else{
            $scope.invoiceId = 0;
        }
        $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile/"+$scope.Identity+"/MarketInfo").success(function (data) {
            $scope.marketInfo = data.Data;
            if( $scope.marketInfo !=null){
                $scope.marketId = $scope.marketInfo.Id;
                $scope.birthDay = $scope.marketInfo.Birthday.substring(0,$scope.marketInfo.Birthday.indexOf(" "));
                $scope.bikeClub = $scope.marketInfo.ClubInfo;
                $scope.checkItem = $scope.marketInfo.PurchaseIntention;
                for(var i=0;i<$scope.purchase.length;i++){
                    if($scope.purchase[i].intention == $scope.checkItem){
                        $scope.checkId = $scope.purchase[i].Id;
                    }
                }
                $scope.checkSaleItem = $scope.marketInfo.SalesInfoChannel;
                for(var j=0;j<$scope.SalesInfoChannel.length;j++){
                    if($scope.SalesInfoChannel[j].channel == $scope.checkSaleItem){
                        $scope.checkSalesId = $scope.SalesInfoChannel[j].Id;
                    }
                }
            }
            else{
                $scope.marketId = 0;
            }
        })
    }).error(function () {
        authService.logOut();
        $location.url("/Login/login/html");
    });

    //------------------个人信息页面--------------------------
    // 个人信息保存
    $scope.saveForm = function () {
        var user = {"Id":$scope.userId,"Name":$scope.realName,"Tel":$scope.Tel,"Nick":$scope.Nick};
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+ $scope.Identity+"/ContactInfo",user).success(function () {
          $rootScope.Nick = $scope.Nick;
          alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    };
//  密码修改
    $scope.updatePwd= function () {
        if($scope.newPassword == $scope.confirmPassword){
            $http.post("http://192.168.1.10:8083/api/account/ChangePassword",{"UserName":$scope.loginName,"CurrentPassword":$scope.password,"NewPassword":$scope.newPassword})
                .success(function () {
                    alertInfo.Success("密码修改成功!");
                    authService.logOut();
                    startTimer();
                })
                .error(function () {
                    alertInfo.Error("修改失败!");
                })
        }
        else{
            alertInfo.Error("两次密码不一致!");
        }
    };
    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 2000);
    };
    // 上传头像
    $scope.getImg = function () {
        var image = document.getElementsByTagName("img");
        $rootScope.headImg = image[4].src;
        localStorageService.set($scope.loginName+"image",$rootScope.headImg);
        alertInfo.Success("保存成功!");
    };
//----------------收货地址页面-------------------------------------
    $http.get("/data/ProJson.json").success(function (data) {
        $scope.getProvince = data;
    });
    $http.get("/data/CityJson.json").success(function (data) {
        $scope.City = data;
    });
    $http.get("/data/DistrictJson.json").success(function (data) {
        $scope.Street = data;
    });
    //获得省的名称 selectProvince
    $scope.getCity = [];
    $scope.getProData= function (item) {
        $scope.getCity = [];
        $scope.selCity = [];
        $scope.selStreet=[];
        if(item==null)return;
       $scope.selectProvince = item.ProName;
            for(var i=0;i<$scope.City.length;i++){
                if($scope.selProvince.ProID == $scope.City[i].ProID){
                    $scope.getCity.push($scope.City[i]);
                }
            }
    };
    // 获得市区名称  selectCity
    $scope.getStreet=[];
    $scope.getCityData= function (item) {
        $scope.getStreet=[];
        $scope.selStreet = 0;
        if(item==null)return;
        $scope.selectCity = item.CityName;
        for(var i=0;i<$scope.Street.length;i++){
            if($scope.selCity.CityID == $scope.Street[i].CityID){
                $scope.getStreet.push($scope.Street[i]);
            }
        }
    };
    //获得区/县名称  selectStreet
    $scope.getStreetData= function (item) {
        if(item==null)return;
       $scope.selectStreet = item.DisName;
    };
    // 是否勾选默认地址
   $scope.defaultCheck = false;
   $scope.setDefault = function() {
   };
    $scope.isChecked = function (item) {
        if(item){
            return true;
        }
        else{
            return false;
        }
    };

    $scope.saveInfo= function () {
        if($scope.listId == null){
            $scope.listId =0;
        }
        var info = {
            "Id":$scope.listId,
            "ContactWay":{"Consignee":$scope.acceptName,"Tel":$scope.telNumber,"Phone":$scope.phoneNum},
            "Province": $scope.selectProvince,
            "City":$scope.selectCity,
            "Street":$scope.selectStreet,
            "AddressLine1":"",
            "ZipCode":$scope.codeNum,
            "AddressLine2":$scope.selectProvince+$scope.selectCity+$scope.selectStreet+$scope.detailAddress,
            "DefaultAddress":$scope.defaultCheck
        };
        var addInfo = {
            "Name":$scope.acceptName,
            "addDetail":$scope.selectProvince+$scope.selectCity+$scope.selectStreet,
            "AddressLine2":$scope.selectProvince+$scope.selectCity+$scope.selectStreet+$scope.detailAddress,
            "ZipCode":$scope.codeNum,
            "TelAndPhone":{"Tel":$scope.telNumber,"Phone":$scope.phoneNum},
            "defaultSet":$scope.defaultCheck

        };
        // 判断是否勾选默认设置
        if(info.DefaultAddress){
            for(var i = 0;i<$scope.AddressInfo.length;i++){
                $scope.AddressInfo[i].defaultSet = false;
            }
        }
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+ $scope.Identity+"/AddressInfo",info).success(function () {
            if(info.Id == 0){
                $scope.AddressInfo.push(addInfo);
            }
            else{
                $scope.AddressInfo.splice($scope.listIndex,1,addInfo);
            }
            alertInfo.Success("保存成功！");
            $scope.defaultCheck = false;
            clear();
        }).error(function () {
            alertInfo.Error("保存失败!");
        });
    };
    var clear = function(){
        $scope.selProvince="";
        $scope.selCity="";
        $scope.selStreet="";
        $scope.acceptName = "";
        $scope.phoneNum = "";
        $scope.telNumber = "";
        $scope.codeNum = "";
        $scope.detailAddress = "";
        $scope.defaultCheck = false;
    };
    //修改地址信息
    $scope.updateInfo= function (index) {
        $scope.listId = $scope.AddressInfo[index].Id;
        $scope.listIndex = index;
        $scope.acceptName = $scope.AddressInfo[index].Name;
        $scope.phoneNum = $scope.AddressInfo[index].TelAndPhone.Phone;
        $scope.telNumber = $scope.AddressInfo[index].TelAndPhone.Tel;
        $scope.codeNum = $scope.AddressInfo[index].ZipCode;
        $scope.detailAddress = $scope.AddressInfo[index].area;
        $scope.defaultCheck =$scope.AddressInfo[index].defaultSet;
        $scope.selectProvince = $scope.AddressInfo[index].Province;
        $scope.selectCity = $scope.AddressInfo[index].City;
        $scope.selectStreet = $scope.AddressInfo[index].Street;
    };
    $scope.viewModal= function (index) {
        $scope.delIndex = index;
    };
    // 删除
    $scope.deleteInfo= function () {
        $http.delete("http://"+apiUrl+"/Api/api/v1/UserProfile/"+ $scope.Identity+"/"+$scope.AddressInfo[$scope.delIndex].Id).success(function () {
        });
        $scope.AddressInfo.splice($scope.delIndex,1);
    };
    // 鼠标进入时 显示按钮
    $scope.showDefault = function (index) {
        if($scope.AddressInfo[index].defaultSet == false){
            for(var i=0;i<$scope.AddressInfo.length;i++){
                $scope.AddressInfo[i].showSet = false;
            }
            $scope.AddressInfo[index].showSet = true;
        }
    };
    // 鼠标离开时 不显示按钮
    $scope.hideDefault= function () {
        for(var i=0;i<$scope.AddressInfo.length;i++){
            $scope.AddressInfo[i].showSet = false;
        }
    };
    // 改变默认地址
    $scope.changeAddress= function (index) {
        for(var i=0;i<$scope.AddressInfo.length;i++){
            $scope.AddressInfo[i].showSet = false;
            $scope.AddressInfo[i].defaultSet = false;
        }
       $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+$scope.Identity+"/Address/"+$scope.AddressInfo[index].Id).success(function () {
           $scope.AddressInfo[index].defaultSet = true;
           alertInfo.Success("修改成功!");
       }).error(function () {
           alertInfo.Error("修改失败!");
       })
    };
    //------------------支付与发票--------------------------------
    //支付信息
    $scope.bankInfo= function () {
        var bank={
            "CardNo":$scope.CardNumber,
            "Name":$scope.CardName,
            "Identity":$scope.IdCard,
            "Tel":$scope.CardPhone
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+ $scope.Identity+"/PayInfo",bank).success(function () {
            alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    };
    // 发票信息
    $scope.invoiceInfo= function () {
        var invoice = {
            "Id":$scope.invoiceId,
            "Name":$scope.invoiceName,
            "AddressLine":$scope.invoiceAddressAndPhone,
            "Code":$scope.invoiceNumber,
            "BankLine":$scope.bankLine
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+$scope.Identity+"/InvoiceInfo",invoice).success(function () {
            alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("更新失败!");
        })
    };
    //------------首选商场------------------------------------------
    $scope.saveAddress= function () {
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+$scope.Identity+"/Store/"+ $scope.mapAdd.StoreId).success(function () {
            alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    };
    $scope.getMap= function (item) {
        $scope.mapAdd = item;
        mapFun(item);
    };
    //------------------------市场信息--------------------------------
    $scope.purchase = [{
        "intention":"自己使用","Id":0,"for":"self"},{
        "intention":"送朋友","Id":1,"for":"friend"},{
        "intention":"收藏","Id":2,"for":"collection"},{
        "intention":"其他","Id":3,"for":"else"}];

    $scope.SalesInfoChannel = [{
        "channel":"偶然发现",Id:0,"for":"find"},{
        "channel":"朋友介绍",Id:1,"for":"command"},{
        "channel":"店铺推荐",Id:2,"for":"prefer"},{
        "channel":"其他",Id:3,"for":"something"}];

    $scope.checkPurchase= function (item, index) {
        $scope.checkId = index;
        $scope.checkItem = item.intention;
    };

    $scope.checkChannel= function (item, index) {
        $scope.checkSalesId = index;
        $scope.checkSaleItem = item.channel;
    };

    $scope.saveSaleInfo= function () {
        var info = {
            "Id":$scope.marketId,
            "Birthday":$scope.birthDay,
            "ClubInfo":$scope.bikeClub,
            "PurchaseIntention":$scope.checkItem,
            "SalesInfoChannel":$scope.checkSaleItem
        };
        $http.put("http://"+apiUrl+"/Api/api/v1/UserProfile/"+$scope.Identity+"/MarketInfo",info).success(function () {
            alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    }
});




