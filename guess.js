var guess = document.getElementById("guess");
var btn = document.getElementById("btn");
var list = document.getElementById("list");
var answer_array = [];

function init(){

    var answer = "";
    var answer_len = 4;
    for(var i=0; i<answer_len; i++){
        do{
            answer = Math.floor(Math.random() * 10); 
            var isRepeat = false;                    
            for(var j=0; j<i; j++){                  
                if(answer_array[j] == answer){       
                    isRepeat = true;
                    break;
                }
            }
        }
        while(isRepeat)                             
        answer_array[i] = answer;
        answer_array.toString;
    }
    console.log(answer_array); 


    //keycode
    guess.onkeydown = function(event){
        var x = event.keyCode || event.which;
        var max_str = 3;
        // console.log(guess.value.length);
        if(x > 57 || x < 48 && x != 8 && x !=13 && x != 20){
            // guess.value = guess.value.substring(0,guess.value.length);
            alert("請輸入數字");
        }
        // console.log(typeof(guess.value));
        if(guess.value.length > max_str){
            guess.value = guess.value.substring(0,max_str);
        }
    }

    
    //印到印到歷史紀錄&判斷(字數、位置)
    btn.addEventListener("click", function(){
        if(limit_val(guess_val())){
            btn_val();
        }
        clear_val();
    })
     
}

  


//取得值
function guess_val(){
    var value = guess.value; //string
    return value; 
}


//str_guess
// 範圍限制
function limit_val(str_guess) {
    var len = str_guess.split('').map(Number).length;
    if( len != 4 ){
        alert("超出範圍");
        return false
    }else{
        return true;
    }
}


//清除
function clear_val(){
    guess.value = "";
    var clear = guess.value;
    return clear;
}

// //判斷
function judge_val() {
    var digit = guess_val().split(''); //值隔開
    var realDigits = digit.map(Number); //尋訪變數字
    var a = 0;
    var b = 0;
    for(var i=0; i<4; i++){
        var idx = answer_array.indexOf(realDigits[i]);
        if(idx != -1){
            if(idx == i){
                a++;
            }else{
                b++;
            }
        }
    }
    var y = `${a}` + "A" + `${b}` + "B" + "\n";
    return y
}


//印出來
function btn_val(){
    var str = "";
    str = guess_val();
    list.innerText = list.innerText + str + "-" + judge_val() + "\n";
    return list.innerText;
}
