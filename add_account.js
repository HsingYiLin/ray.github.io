// 在各層級帳戶新增下限的判斷
// 首先先去php request 子帳號下限數的限制
// 再去另一隻php 判斷新增或修改這個動作現在是否能執行動作
// 再跳轉到下限的新增頁面
_self.gotoAdd = function(){
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.dataCompele);
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams = "p=account_limit&ver=" + top.ver + "&" + urlParams;
        getHttp.loadURL(top.url, "POST", urlParams);
    }

    _self.dataCompele = function(data){
        var arr_data = JSON.parse(data);
        if (arr_data.sub_user_data!=null) {
            magager_count = arr_data.sub_user_data.magager_count;
            user_mlimit = arr_data.sub_user_data.user_mlimit;
        }
        _self.addAccountEventPrev();
    }

    _self.addAccountEventPrev = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.addAccountEvent);
        var param = "";
        param += "login_layer=" + top.login_layer;
        param += "&keys=addAccount";
        param += "&uid=" + top.uid;
        param += "&langx="+top.langx;
        param += "&p=prevData&ver=" + top.ver;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.addAccountEvent = function (data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = arr_data.code;
        var ParentName = "acc_"+downlayer+"_list"


        if (_status == "error") {
            var tmp = code.split("|");
            _self.showErrorMsg(tmp[1], arr_data);
        } else {
            try {
                if (downlayer != "") {
                    var obj = new Object();
                    obj.postHash = new Object();
                    obj.page = "acc_"+downlayer+"_add";
                    obj.postHash.up_id = top.layer_id;
                    obj.postHash.back_page = ParentName;
                    obj.postHash.pay_type = top.pay_type;
                    _self.addAccountEventHandler(obj);
                }
            }catch (e) {
            }
        }
    }

    _self.addAccountEventHandler = function (paramObj) {
        if (magager_count != -1 && user_mlimit != -1 && magager_count * 1 >= user_mlimit * 1) {
            var msg = LS.get("sub_selMax");
            parentClass.dispatchEvent("showAlertMsg", { msg: msg});
        } else {
            parentClass.dispatchEvent("bodyGoToPage", paramObj);
        }
    }

    _self.showErrorMsg = function (code, arr_data) {
        if (code == "clean_db") {
            parentClass.dispatchEvent("showAlertMsg", arr_data);
        }
    }
