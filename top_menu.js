// 依據不同頁面，顯示標題，如果進到帳號管理的頁面，需額外有麵包屑的功能
// 麵包屑會依據層級的不同，顯示方式也不一樣
_self.setPageName = function (param) {
        if (param.pageType && !param.url_hash) {
            var _name = LS.get("page_" + param.pageType);
            if(top.ls == "us"){
                if(param.pageType == "account") _name = "Account Management";
                if(param.pageType == "report") _name = "Reports"
            }
            dom.getElementById("page_menu").innerHTML = _name;
            dom.getElementById("page_menu").style.display = "";
        } else {
            dom.getElementById("page_menu").style.display = "none";
        }
        
        // menu 麵包屑
        var page_name = dom.getElementById("page_name");
        var menu_ul = dom.getElementById("menu_ul");
        page_name.innerHTML="";
        if(param.url_hash!=null){
            if(menu_ul){
                menu_ul.style.display = "";
                var hash = JSON.parse(param.url_hash);
                page_name.innerHTML = LS.get("page_" + param.pageType);
                var layer = eval(top.login_layer+"_layer");
                var tmp = layer[hash["view_layer"]];
                var group_name = document.getElementsByName("menu_group_name");
                for (var i = 0, len = group_name.length ; i < len ; i++){
                    var obj = group_name[i];
                    var key = obj.id.split("_")[1];
                    var _view = false;
                    if (layer[key]){
                        if (layer[key] >= tmp) _view = true;
                        // if (getView().viewportwidth <= 599 && layer[key] != tmp) _view = false;                        if (getView().viewportwidth <= 599 && layer[key] != tmp) _view = false;
                        if (_view) {
                            if(obj.classList.contains("hide_item")) obj.classList.remove("hide_item");
                            util.removeEvent(obj, "click", _self.changePage);
                            util.addEvent(obj, "click", _self.changePage, { "page": "acc_" + key +"_list" });
                        } else {
                            if(!obj.classList.contains("hide_item")) obj.classList.add("hide_item");
                            util.removeEvent(obj, "click", _self.changePage);
                        }
                    }else{
                        if(!obj.classList.contains("hide_item")) obj.classList.add("hide_item");
                        util.removeEvent(obj, "click", _self.changePage);
                    }
                }
            }
        }else{
            if(param.pageName == "sub"){
                menu_ul.style.display = "none";
            }
            var _name = LS.get("page_" + param.pageName);
            if (param.uniqText) _name = param.uniqText;
            page_name.innerHTML = _name;
            page_name.style.display = "";
        }
    }
