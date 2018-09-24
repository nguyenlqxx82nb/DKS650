<?php

require(dirname(__FILE__) . '/includes/mysql.php');
require(dirname(__FILE__) . '/includes/file.php');

if(isset($_GET['ajax']))
{
    $db = new mysql('localhost:3306','root','','skymedia_vod','','UTF8');
    $callback = isset($_GET['callback'])?$_GET['callback']:"";
    $ajax = $_GET['ajax'];
    if($ajax == 'control')//查询歌曲
    {
        require(dirname(__FILE__) . '/includes/websocket.php');
        echo '/*';
        $flag = isset($_GET['flag'])?$_GET['flag']:"";
        $cmd = isset($_GET['cmd'])?$_GET['cmd']:"";
        $roomip = isset($_GET['roomip'])?$_GET['roomip']:"";
        $ws = new websocket();
        $str = '';
        try{
            if($ws -> connect($roomip,8000)){
            
                $str = $ws -> sendData($cmd);
                if(!strstr($str,'|'))$str = $flag.'|1|?|'.$str;
            }
        }catch(Exception $e){
            echo $e->getMessage();
        }
        echo '*/';
        if(empty($str))$str = $flag.'|0||';
        if(!empty($callback)){
            $str = "var temp_callback_data=\"" . $str . "\";\r\n" . $callback . "(temp_callback_data);";
        }
        echo $str;
    }
    else if($ajax == 'songs')//查询歌曲
    {        
        $type = isset($_GET['type'])?$_GET['type']:"";
        $type_val = isset($_GET['type_val'])?$_GET['type_val']:"";
        $type_val = str_replace('--', '',str_replace('\'', '\'\'', $type_val));
        
        $sort = isset($_GET['sort'])?$_GET['sort']:"";
        if($sort=='new')$sort='date desc';
        else if($sort=='name'){$sort = 'Qindex asc';}
        else if($sort=='hot'){$sort='hothit desc';}
        
        $kwd = str_replace('--', '',str_replace('\'', '\'\'', isset($_GET['kwd'])? $_GET['kwd']: ""));
        $kwd1 = str_replace('--', '',str_replace('\'', '\'\'', isset($_GET['kwd_alias'])? $_GET['kwd_alias']: ""));
		
        $ids = isset($_GET['ids'])?$_GET['ids']:"";
        $ids = str_replace('--', '',str_replace('\'', '\'\'', $ids));
        
		$temp = isset($_GET['temp'])?$_GET['temp']:"1";
        
        $start = isset($_GET['page'])?intval($_GET['page']):0;
        //if($page<1)$page = 1;
        $pagesize = isset($_GET['pagesize'])?intval($_GET['pagesize']):50;
        if($pagesize<1 || $pagesize>100)$pagesize = 10;
        //$start = ($page-1) * $pagesize;
        $sql = "select 
	            ID as Song_ID,
	            Name as Song_Name,
	            date as Song_NewSongDate,
				actor as Actor,
	            CONCAT(actor,(case when ifnull(SecondActor,'')='NONE' then '' else concat(',',SecondActor) end)) as Singer_Name,
	            Sex as Singer_Sex,
				Temp,
	            true as IsValid
	            from ";
		
        $sql .= (($type=='type' && $type_val=='7') ? " disco as song ": " song ");//当类型为disco时读取disco表中的歌曲
        
        $sql .= ' where temp = ' .$temp ;
        
        //类型过滤
        if(!empty($type)){
            if($type=='type')$sql .= ' and type=' . intval($type_val);
            else if($type=='new')$sql .= ' and id in(select id from newsong)';
            else if($type=='hot')$sql .= ' and id in(select id from topsong)';
            else if($type=='lang')$sql .= ' and language=' . intval($type_val);
            else if($type=='star')$sql .= ' and Actor =\''. $type_val . '\'';
        }
		
		$sql .= (($type=='type' && $type_val=='8') ? " and Sex = 3 ": " ");
        
        //查询指定Id歌曲
        
        if(isset($ids) && strlen($ids)>0){
            $sql .= ' and id in(' . $ids . ')';
        }
        
        //关键字过滤
        if(!empty($kwd) && !empty($kwd1)){
            $sql .= ' and (Qindex like \'' . $kwd1 . '%\' or NameAlias like \'' . $kwd1 . '%\' or Name like \'' . $kwd . '%\' or Actor like \'' . $kwd . '%\')';
        }
        
        //排序
        if(!empty($sort))$sql .= ' order by ' . $sort;
        
        //分页
        $sql .= " limit " . $start . "," . $pagesize;
       // echo $sql;
        
        //查询
        $str = '';
        $res = $db -> query($sql);
        $str = json_encode(array("status"=>"0","summary"=>"",'data'=>(!empty($res)?$res:null)));
        if(!empty($callback)){
            $str = "var temp_callback_data=" . $str.";\r\n" . $callback . "(temp_callback_data);";
        }
        echo $str;
        /* * */
    }
    elseif($ajax == 'stars')//查询歌星
    {        
        $type = isset($_GET['type'])?$_GET['type']:"";
        $type_val = isset($_GET['type_val'])?$_GET['type_val']:"";
        $type_val = str_replace('--', '',str_replace('\'', '\'\'', $type_val));
        
        $sort = isset($_GET['sort'])?$_GET['sort']:"";
        if($sort=='name')$sort = 'Qindex asc';
        if(!empty($sort)){$sort = $sort . ' desc';}
        
        $kwd = str_replace('--', '',str_replace('\'', '\'\'', isset($_GET['kwd'])? $_GET['kwd']: ""));
        
        $start = isset($_GET['page'])?intval($_GET['page']):0;
        //if($page<1)$page = 1;
        $pagesize = isset($_GET['pagesize'])?intval($_GET['pagesize']):10;
        //if($pagesize<1 || $pagesize>100)$pagesize = 10;
        //$start = ($page-1) * $pagesize;
        /*
            "Singer_ID": "12000923",
            "Singer_Name": "慧琳",
            "Singer_Sex": "2",
            "Singer_PhoneticCode": "HL",
            "Singer_NewRegion": "2",
            "Singer_NameWordCount": 0,
            "Singer_HotRank": 327,
            "Singer_SingerHeadAddress": "../../Images/WxImg/default.png"
        */
        $sql = "select 
            ID as Singer_ID,
            Actor as Singer_Name,
            sex as Singer_Sex,
            Qindex as Singer_PhoneticCode,
            Area as Singer_NewRegion,
            '' as Singer_NameWordCount,
            Hothit as Singer_HotRank,
            CONCAT('http://wx.skymedia.cn/Pictures/singer_picture/', actor, '.jpg') as Singer_SingerHeadAddress,
            0 as SongCount
            from ";
        
        $sql .= " star ";//当类型为disco时读取disco表中的歌曲
        
        $sql .= ' where 1=1 ';
        
        //类型过滤
        if(!empty($type)){
            if($type=='star')$sql .= ' and sex in(' . $type_val . ')';
            else if($type=='area')$sql .= ' and area=' . intval($type_val);
            else if($type=='star')$sql .= ' and actor=\''. $type_val . '\' or secondactor=\'' . $type_val . '\'';
        }
        
        //关键字过滤
        if(!empty($kwd)){
            $sql .= ' and (actor like \'%' . $kwd . '%\' or Qindex like \'%' . $kwd . '%\')';
        }
        
        //排序
        if(!empty($sort))$sql .= ' order by ' . $sort ;
        
        //分页
        $sql .= " limit " . $start . "," . $pagesize;
       //die($sql);
        
        //查询
        $str = '';
        $res = $db -> query($sql);
        $str = json_encode(array("status"=>"0","summary"=>"",'data'=>(!empty($res)?$res:null)));
        if(!empty($callback)){
            $str = "var temp_callback_data=" . $str.";\r\n" . $callback . "(temp_callback_data);";
        }
        echo $str;
        /* * */
    }
    elseif($ajax == 'download')//查询歌星
    {        
        $sql = "select ID,Progress from download";
        //查询
        $str = '';
        $res = $db -> query($sql);
        $str = json_encode(array("status"=>"0","summary"=>"",'data'=>(!empty($res)?$res:null)));
        if(!empty($callback)){
            $str = "var temp_callback_data=" . $str.";\r\n" . $callback . "(temp_callback_data);";
        }
        echo $str;
        /* * */
    }
    else if($ajax == 'count')//统计各分类数量
    {
        $f = new file();
        $f->forcemkdir('./cache');
        $fn = './cache/songcount.txt';
        $str = '';
        if($f->iswriteable($fn)){
            $ft = $f->getfiletime($fn);
            $spanTime = time() -  $ft;
            if($spanTime < 30*60 )//30分钟内
            {
                $str = $f->readfromfile($fn);
            }
        }
        
        if(1==0 && empty($str)){
            $sql = "select 'type' menu,type val,count(id) sl from (select id,type from song union all select id,type from disco) a group by type 
            union all
            select 'lang',language,count(id) from (select id,language from song union all select id,language from disco) b group by language 
            union all
            select 'star',star.sex,count(star.id) from star left join song on star.actor=song.actor or star.actor=song.secondactor left join disco on  star.actor=disco.actor or star.actor=disco.secondactor group by star.sex ";
            
            $res = $db -> query($sql);
            $str = json_encode(array("status"=>"0","summary"=>"",'data'=>(!empty($res)?$res:null)));
            
            $f->writetofile($fn, $str);//缓存
        }
        
        if(!empty($callback)){
            $str = "var temp_callback_data=" . $str .";\r\n" . $callback . "(temp_callback_data);";
        }
        echo $str;
    }
}

?>