const title = document.getElementById("title");
const btn = document.getElementById("btn");
const passwd = document.getElementById("passwd");
const dinner = document.getElementsByName("dinner");
const sex = document.getElementsByName("sex");
const select = document.getElementById("select");
const btn2 = document.getElementById("btn2");
const list = document.getElementById("list");

function init(){
    // console.log("test.js init");

    title.onkeydown = function(){
        alert(titel_val()) ;
    }
    //新增部覆寫，兩個事件
    title.addEventListener("click", function(){
        alert("確定嗎？")
    })
    
    btn.onclick = function(){
        alert(click_val());
    } 
   
    passwd.onkeyup = function(){
        alert(passwd_val());
    } 

    //尋訪賦予事件
    var len = dinner.length;
    for (var i = 0; i < len; i++) {
        dinner[i].onclick = function(){
            alert(dinner_());
        }
    }

    //尋訪賦予事件
    var len = sex.length;
    for(var i=0; i<len; i++){
        sex[i].onclick = function(){
            alert(sex_());
        }
    }
    
    select.onchange = function(){
        alert(select_val());
    }
   
    btn2.onclick = function(){
        alert(btn2_val());
    }
}




function titel_val(){
    return title.value;
}

function click_val(){
    return "click";
}

function passwd_val(){
    return passwd.value;
}

//判斷是否勾選
function dinner_(){
    var len = dinner.length; 
    var show_str = "";
    for (var i = 0; i < len; i++) { 
        if(dinner[i].checked){ 
            show_str += dinner[i].value+'\n';
        } 
    }
    return show_str
}

//判斷是否勾選
function sex_(){
    var len = sex.length;
    var str_sex = "";
    for (var i = 0; i < len; i++) {
        if(sex[i].checked ){
            str_sex += sex[i].value;
        }
    }
    return str_sex;
}


function select_val(){
    return select.value;
}

function btn2_val(){
    var str = "";
    str += "1." + titel_val() + "\n";
    str += "2." + click_val() + "\n";
    str += "3."+ passwd_val() + "\n";
    str += "4."+ dinner_();
    str += "5" + sex_() + "\n";
    str += "6."+ select_val() + "\n";
    list.innerText = str;
    return list.innerText;
}
