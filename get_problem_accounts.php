// 繞問題帳號
// 判斷此問題帳號的權限及狀態
// 依層級判斷須繞哪一個表
// 此問題帳號的下限
// 是現金會員還是信用會員
<?php
//include config //載入設定檔
include WEB_PATH."/conf/config_ag.php";

//======== 正規化參數 start ========
$variable = Array("p"=>"string","ver"=>"string","uid"=>"string","login_layer"=>"string","action"=>"string","langx"=>"string" ,"sta"=>"string","range"=>"string","qlayer"=>"string","sort_type"=>"string","sort_name"=>"string","idAry"=>"string");
VariableStandard($variable,$_REQUEST);
//======== 正規化參數  end  ========

$MEM_DATA = $MEM_DATA;              //使用者登入資料
$user_id = $MEM_DATA["id"];         //使用者 ID
$uid = $uid;                        //使用者 UID
$login_layer = $login_layer;        //使用者層級
$action = $action;                  //判斷做何事
$langx = $langx;                    //當下語系
$sta = $sta;
$range = $range;
$qlayer = $qlayer;
$sort_type = $sort_type;
$sort_name = $sort_name;
$idAry = $idAry;
$out = array();



// $user_Type = Array("co"=>"co_user","su"=>"su_user","ag"=>"ag_user");

if($action == "getAccInfo"){
    $DB_Main_R = DB_select("MAIN");
    $DB_Main_R1 = DB_select("MAIN");
    $dateAry = array();
    $limitNum = 50;
    $zoneStr = "";
    $startTime;
    $endTime;
    if(empty($show_count)||$show_count*1 < $limitNum || $show_count%$limitNum != 0 ) $show_count = $limitNum;
    if($range == "TW" || $range == "") $zoneStr = "this week ".WEB_TIME_ZONE." hour";
    else if($range == "LW") $zoneStr = "last week ".WEB_TIME_ZONE." hour";
    else if($range == "TP") {
        $sql = "select text from other_set where name='report_s_e';";
        $DB_Main_R->query($sql,1);
        $period_date=explode (":", $DB_Main_R->f("text"));
        $startTime = $period_date[0];
        $endTime = $period_date[1];
    }

    if($range == "TW" || $range == "LW"){
        $d = new DateTime();
        $d->modify($zoneStr);
        $startTime = $d->format('Y-m-d');
        $setEndTime = strtotime($startTime." 00:00:00") + (60*60*24)*6;
        $endTime = date("Y-m-d", $setEndTime);
    }

    if($sta == "READ" ) $sta = "1";
    else if($sta == "UNREAD" ) $sta = "0";
    else if($sta == "ALL" ) $sta = $sta;
    else $sta = "ALL";

    $id_name = get_layer_user_id($qlayer);
    $table = get_layer_table($qlayer);
    $lower_table = get_lower_layer_table($qlayer);
    $layer_id = get_layer_id($qlayer);
    $lay = ( $qlayer == "su")?"s":"a";
    if($sort_type == "") $sort_type = "desc";
    if($sort_name == "" ) $sort_name = "t_date";

    $sub_sql = "(select adddate from ncr_list_record where ncr_id=a.id and ncr_act='S' order by id desc limit 1) as ag_date";
    //$lower_sql = " AND ".$dataAry["low_user_id"]." in (".$MEM_DATA["subuserManager_low_user_id_sql"].") ";

    $sql = "SELECT a.id,".$sub_sql.",".$lay."_user as user,alias,checked,".$id_name.", ";
    $sql.= "CASE WHEN (enable='Y' AND enable_pri='N') THEN 'F' ELSE enable END as _enable, ";
    $sql.= "(select count(id) from ".$lower_table." where ".$layer_id."=a.".$lay."id AND enable='Y' AND enable_pri='Y') as lower_count ";
    $sql.= "FROM ncr_list as a,".$table." as b WHERE ";
    $sql.= "cid='".$MEM_DATA["cid"]."' ".$MEM_DATA["subuserManager_low_user_id_sql"];
    $sql.= "AND ncr_type='S' ";
    $sql.= "AND t_date>='".$startTime."' ";
    $sql.= "AND t_date<='".$endTime."' ";
    $sql.= "AND ".$id_name."=b.id ";
    if( $sta !="ALL") $sql.= "AND checked='".$sta."' ";
    ($qlayer=="su")? $sql.= "AND aid='0' ":$sql.= "AND aid!='0' ";
    $sql.= " ORDER BY checked asc,".$sort_name." ".$sort_type." ";
    $sql.= "limit ".intval($show_count - $limitNum).",".($show_count+1).";";


    $DB_Main_R->query($sql);
    $total_count = $DB_Main_R->num_rows();
    
    while ($DB_Main_R->next_record()){
        $tmpAry = array();
		$user_id = $DB_Main_R->f($id_name);
		$lower_count = $DB_Main_R->f("lower_count") * 1;
		if($lower_count != 0) $lower_ary = getLower($user_id,$lower_table,$layer_id,$DB_Main_R1);
        $ag_date = explode(" ",$DB_Main_R->f("ag_date"));

        $tmpAry["user_id"] = $user_id;
        $tmpAry["id"] = $DB_Main_R->f("id");
        $tmpAry["username"] = $DB_Main_R->f("user");
        $tmpAry["alias"] = $DB_Main_R->f("alias");
        $tmpAry["enable"] = $DB_Main_R->f("_enable");
        $tmpAry["t_date"] = $ag_date[0];
        $tmpAry["review"] = $DB_Main_R->f("checked");
        $tmpAry["lower_ary"] = $lower_count != 0 ? $lower_ary:"-";
        $tmpAry["layer"] = $qlayer;
        $tmpAry["review_time"] = $DB_Main_R->f("checked_datetime");
        $dateAry[] = $tmpAry;
    }
    
    // $out["sql"] = $sql;
    $out["dateAry"] = $dateAry;
    $out["total_count"] = $total_count;
}else if($action == "setReview"){
        if(!preg_match("/^\d{1,}(,\d{1,})*?$/",$idAry)){        //如果型態不是 1,3,2,534 會被剔除
            $out["msg"] = "error action Param";
            echo json_encode($out);
            exit;
        }
        $DB_Main_U = DB_update("MAIN");
		$sql = "update ncr_list set checked='1',checked_datetime=now() where id in(".$idAry.");";
        $DB_Main_U->query($sql);

        // $out["sql"] = $sql;
}
else{
    $out["msg"] = "error Param";
}

if($DB_Main_R)  $DB_Main_R->close();
if($DB_Main_R1) $DB_Main_R1->close();
if($DB_Main_U)  $DB_Main_U->close();
echo json_encode($out);
exit;
// --------------------------------------------------------------------------------------
function getLower($user_id,$lower_table,$layer_id,$DB_Main_R1){
	$tmp_str = "";
	$enable_sql = "CASE WHEN (enable='Y' AND enable_pri='N') THEN 'F' ELSE enable END as _enable ";
	$sql = "SELECT id,username,alias,".$enable_sql." FROM ".$lower_table;
	$sql.= " WHERE ".$layer_id."='".$user_id."' ORDER BY username ASC;";
	$DB_Main_R1->query($sql);
    $accAry = array();
	while($DB_Main_R1->next_record()){
            $tmpAry = array();
			$username = $DB_Main_R1->f("username");
			$alias = $DB_Main_R1->f("alias");
			$enable = $DB_Main_R1->f("_enable");
			if($enable == "Y"){
                $tmpAry["username"] = $username;
                $tmpAry["alias"] = $alias;
                $accAry[] = $tmpAry;
            }
    }
	return $accAry;
}


?>
