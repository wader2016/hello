/**
 * Created by iTEC001 on 2015/11/17.
 */
MetronicApp.controller("CompanySettingController",['$scope','$http','authService','localStorageService','apiUrl','$location',function ($scope,$http,authService,localStorageService,apiUrl,$location) {
    $scope.loginName = authService.authentication.userName;
    $http.get("http://"+apiUrl+"/Api/api/v1/Enterprise/GeneralTitle").success(function (data) {
        $scope.GeneralTitle = data.Data;
    });
    $http.get("http://"+apiUrl+"/Api/api/v1/Enterprise/GeneralRole").success(function (data) {
        $scope.GeneralRole = data.Data;

    });
    $http.get("http://"+apiUrl+"/Api/api/v1/Enterprise/GeneralDepartment").success(function (data) {
        $scope.GeneralDepartment = data.Data;
    });


    $http.get("http://"+apiUrl+"/Api/api/v1/UserProfile").success(function (data) {
        $scope.userInfo = data.Data;
        if($scope.userInfo.ContactInfo =="null"){
            authService.logOut();
            $location.url("/Login/login/html");
        }
        $scope.parentId =  $scope.userInfo.ParentId;
        $http.get("http://"+apiUrl+"/Api/api/v1/Enterprise/"+$scope.parentId).success(function (data) {
            $scope.company = data.Data;
            $scope.defaultCompanyName = $scope.company.Name;
            $scope.companyAbbr = $scope.company.Abbr;

           $scope.contactList = $scope.company.Contacts;
            for(var i=0;i<$scope.contactList.length;i++){
                $scope.contactList[i].defaultSet = false;
                if($scope.contactList[i].Name == $scope.company.ContactName){
                    $scope.contactList[i].defaultSet =true;
                }
               for(var j=0;j<$scope.GeneralDepartment.length;j++){
                   if($scope.contactList[i].Department == $scope.GeneralDepartment[j].Id){
                       $scope.contactList[i].Department = $scope.GeneralDepartment[j].Description;
                   }
               }
                for(var k=0;k<$scope.GeneralRole.length;k++){
                    if($scope.contactList[i].Role == $scope.GeneralRole[k].Id){
                        $scope.contactList[i].Role = $scope.GeneralRole[k].Description;
                    }
                }
            }
        });

        $scope.ContactInfo = JSON.parse($scope.userInfo.ContactInfo);
        $scope.defaultName = $scope.ContactInfo.Name;
        $scope.defaultTel = $scope.ContactInfo.Tel1;

        $scope.contactId = $scope.ContactInfo.Id;

        $scope.MainAddressInfo = JSON.parse($scope.userInfo.MainAddressInfo);
        if($scope.MainAddressInfo != ""){
            $scope.addressId = $scope.MainAddressInfo[0].Id;
            $scope.defaultAddress = $scope.MainAddressInfo[0].AddressLine2;
        }

        $scope.Identity = $scope.userInfo.Identity;

    }).error(function () {
        authService.logOut();
        $location.url("/Login/login/html");
    });

    //企业信息保存
    $scope.companySave= function () {
        var info = {"Id":$scope.parentId,"ContactId":$scope.contactId,"AddressId":$scope.addressId,"Name":$scope.defaultCompanyName,"Abbr":$scope.companyAbbr};
        $http.put("http://"+apiUrl+"/Api/api/v1/Enterprise/"+$scope.Identity+"/EnterpriseInfo",info).success(function () {
            alertInfo.Success("保存成功!");
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    };

    var defaultFun = function (array) {
        for(var i =0;i<array.length;i++){
            if(array[i].defaultSet){
                $scope.defaultName = array[i].Name;
                $scope.defaultTel = array[i].Tel1
            }
        }
    };

    $http.get("/data/ProJson.json").success(function (data) {
        $scope.getProvince = data;
    });
    $http.get("/data/CityJson.json").success(function (data) {
        $scope.City = data;
    });
    $http.get("/data/DistrictJson.json").success(function (data) {
        $scope.Street = data;
    });

    // 获得省、市、区地址
    $scope.selProvince=[];
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
    $scope.getStreetData= function (item) {
        if(item==null)return;
        $scope.selectStreet = item.DisName;
    };

    // 判断是否设为默认
    $scope.defaultCheck = false;
    $scope.setDefault= function () {
        if($scope.defaultCheck==true){
            $scope.defaultCheck = false;
        }
        else{
            $scope.defaultCheck = true;
        }
    };

    // 新建、保存修改信息
    $scope.saveInfo= function () {
        if($scope.listId== null){
            $scope.listId =0;
        }
        var info = {
            "Contact":{
                "Id":$scope.listId,
                "Name":$scope.acceptName,
                "Email1":$scope.email,
                "Department":$scope.department.Id,
                "Title":$scope.title.Id,
                "Role":$scope.role.Id,
                "Tel1":$scope.telNumber,
                "Tel2":$scope.phoneNum},
            "UserIdentity":$scope.Identity,
            "EnterpriseId":$scope.parentId,
            "IsDefaultContact":$scope.defaultCheck
        };
        var addInfo={
            "Department":$scope.department.Description,
             "Title":$scope.title.Description,
             "Role":$scope.role.Description,
            "Name":$scope.acceptName,
            "Email1":$scope.email,
            "Tel1":$scope.telNumber,
            "Tel2":$scope.phoneNum,
            "defaultSet":$scope.defaultCheck
        };
        // 判断是否设为默认地址
        if(info.IsDefaultContact){
            for(var i = 0;i<$scope.contactList.length;i++){
                $scope.contactList[i].defaultSet = false;
            }
        }
        $http.put("http://"+apiUrl+"/Api/api/v1/Enterprise/Contact",info).success(function () {
            if(info.Contact.Id == 0){
                $scope.contactList.push(addInfo);
                defaultFun($scope.contactList);
            }
            else{
                $scope.contactList.splice($scope.list,1,addInfo);
            }
            alertInfo.Success("保存成功!");
            clear();
        }).error(function () {
            alertInfo.Error("保存失败!");
        })
    };
    var clear = function(){
        $scope.acceptName = "";
        $scope.phoneNum = "";
        $scope.telNumber = "";
        $scope.email = "";
        $scope.department="";
        $scope.title="";
        $scope.role="";
        $scope.defaultCheck =false;
    };
    // 点击修改 加载信息到输入框
    $scope.updateInfo= function (index) {
        $scope.listId = $scope.contactList[index].Id;
        $scope.list = index;
        $scope.acceptName = $scope.contactList[index].Name;
        $scope.phoneNum = $scope.contactList[index].Tel2;
        $scope.telNumber = $scope.contactList[index].Tel1;
        $scope.email = $scope.contactList[index].Email1;
        $scope.defaultCheck = $scope.contactList[index].defaultSet;
    };
    // 弹出信息提示框
    $scope.viewModal= function (index) {
        $scope.delIndex = index;
    };
    //  删除地址
    $scope.deleteInfo= function () {
        $scope.contactList.splice($scope.delIndex,1);
        defaultFun($scope.contactList);
    };

    // 鼠标进入时 显示按钮
    $scope.showDefault = function (index) {
        if($scope.contactList[index].defaultSet == false){
            for(var i=0;i<$scope.contactList.length;i++){
                $scope.contactList[i].showSet = false;
            }
            $scope.contactList[index].showSet = true;
        }
    };
    // 鼠标离开时 不显示按钮
    $scope.hideDefault= function () {
        for(var i=0;i<$scope.contactList.length;i++){
            $scope.contactList[i].showSet = false;
        }
    };

    // 改变默认地址
    $scope.changeAddress= function (index) {
        for(var i=0;i<$scope.contactList.length;i++){
            $scope.contactList[i].showSet = false;
            $scope.contactList[i].defaultSet = false;
        }
        $http.put("http://"+apiUrl+"/Api/api/v1/Enterprise/"+$scope.parentId+"/DefaultContact/"+$scope.contactList[index].Id).success(function () {
            $scope.contactList[index].defaultSet = true;
            defaultFun($scope.contactList);
            alertInfo.Success("设置成功!");
        }).error(function () {
            alertInfo.Error("设置失败!");
        })

    };

}]);