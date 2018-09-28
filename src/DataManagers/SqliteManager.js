
import GLOBALS from './Globals';
import BTElib from 'react-native-bte-lib';
import DATA_INFO from '../DataManagers/DataInfo';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'testDB', createFromLocation: '~songbook.db'})

export default class SQLiteMagager { 
    static getSongQuery(type,type_val,sort,temp,kwd,kwd_alias,page,pageSize){
        var query = "",_sort ="",_start = 0,_pagesize;
        
        if(sort=='new') _sort='date desc';
        else if(sort=='name'){ _sort = 'Qindex asc'; }
        else if(sort=='hot'){ _sort='hothit desc'; }
        
        //$ids = isset($_GET['ids'])?$_GET['ids']:"";
       // $ids = str_replace('--', '',str_replace('\'', '\'\'', $ids));
        
		//temp = isset($_GET['temp'])?$_GET['temp']:"1";
        _start = page;
        //$start = ($page-1) * $pagesize;
        query = "select ID as Song_ID,Name as Song_Name,date as Song_NewSongDate,actor as Actor, SecondActor,"
        //query += "CONCAT(actor,(case when ifnull(SecondActor,'')='NONE' then '' else concat(',',SecondActor) end)) as Singer_Name,"
	    query +=  " Sex as Singer_Sex,Temp from song";
		query += ' where temp = ' + temp ;
        
        //类型过滤
        if(type != ""){
            if(type == 'type') query += ' and type =' + type_val;
            else if(type=='new') query +=' and id in(select id from newsong)';
            else if(type=='hot') query +=' and id in(select id from topsong)';
            //else if(type=='lang') query +=' and language=' +type_val;
            else if(type=='star') query +=' and Actor =\'' +type_val + '\'';
        }
		
		query += (type=='type' && type_val=='8') ? " and Sex = 3 ": " ";
        //查询指定Id歌曲
        
        // if(isset($ids) && strlen($ids)>0){
        //     $sql .= ' and id in(' . $ids . ')';
        // }
        
        //关键字过滤
        if(kwd != ""){
            query += ' and (Qindex like \'' + kwd_alias + '%\' or NameAlias like \'' + kwd + '%\' or Name like \'' +kwd + '%\' or Actor like \'' + kwd + '%\')';
        }
        
        //排序
        if(_sort != "") query += ' order by ' +_sort;
        //分页
        query += " limit " + _start + "," + pageSize;
       // echo $sql;
        
        return  query;
    }

    static getSongList(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback){
        var type = "",
            type_val = "",
            sort = "",
            temp = 1,
            kwd = "",
            kwd_alias="",
            page = pageCount*page ;
        //console.warn("song type = "+songType);
        if(songType != GLOBALS.SONG_TYPE.ALL){
            type="type";
            type_val=""+songType;
        }
        else if(lan != GLOBALS.LANGUAGE_KEY.ALL){
            type="lang";
            type_val=""+GLOBALS.LANGUAGE[lan];
        }
        else if(actor != ""){
            type="star";
            type_val=actor;
        }

        if(listType == GLOBALS.SONG_LIST_TYPE.NEW){
            sort= "new";
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.NO_DOWNLOAD){
            temp=0;
            sort="new";
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.FAVORITE){
            sort="hot";
        }
        if(term != ""){
            kwd=term;
            kwd_alias=term;
        }
        var query = this.getSongQuery(type,type_val,sort,temp,kwd,kwd_alias,page,pageCount)
      //  console.warn("query = "+query);
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
               // console.warn("length = "+results.rows.length);
                var datas = this.covertSongDatas(results.rows);
               // console.warn("length = "+results.rows.length +" , data = "+datas.length);
                callback(datas);
            },(error)=>{
                errorCallback(error)
            });
        });
    }

    static covertSongDatas(rows){
        var datas = [];
        if(rows == null || rows.length == 0){
            return datas;
        }

        for(var i=0; i<rows.length; i++){
            var singerName = 
                (rows.item(i).SecondActor =="NONE" || rows.item(i).SecondActor =="")?rows.item(i).Actor:rows.item(i).Actor+","+rows.item(i).SecondActor;
            var item = {
                id: rows.item(i).Song_ID,
                name : rows.item(i).Song_Name,
                actor : rows.item(i).Actor,
                singerName: singerName
            }
            //console.warn("covertSongDatas = "+singerName);
            let selectIndex = DATA_INFO.PLAY_QUEUE.indexOf(item.id);
            if(selectIndex > -1){
                item.status = GLOBALS.SING_STATUS.SELECTED;
                item.index = " "+(selectIndex + 1);
            }
            else{
                // if(rows.item(i).Temp == 0){
                //     item.status = GLOBALS.SING_STATUS.NO_DOWNLOADED;
                // }
                // else if(rows[i].Temp == 2){
                //     item.status = GLOBALS.SING_STATUS.DOWNLOADING;
                // }
                // else{
                //     item.status = GLOBALS.SING_STATUS.NORMAL;
                // }
                item.status = GLOBALS.SING_STATUS.NORMAL;
                item.index = "";
            }
            datas.push(item);
        }
        return datas;
    }

    static getSingers(lan,sex,term,page,pageCount,callback,errorCallback){
        var type_val = "",
            sort = "",
            kwd = "",
            page = pageCount*page ;

        if(lan == GLOBALS.LANGUAGE_KEY.hot){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="20,21,19";
                sort="area";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                type_val="20";
                sort="area";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                type_val="21";
                sort="area";
            }
            else{
                type_val="19";
                sort="area";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.vn){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="20,21,19";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                type_val="20";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                type_val="21";
            }
            else{
                type_val="19";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.cn){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="1,2,3";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                ype_val="2";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                type_val="3";
            }
            else{
                type_val="1";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.en){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="7,8,9";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                type_val="8";
            }
            else if(sex ==  GLOBALS.SINGER_SEX.FEMALE){
                type_val="9";
            }
            else{
                type_val="7";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.ja){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="13,14,15";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                type_val="14";
            }
            else if(sex ==  GLOBALS.SINGER_SEX.FEMALE){
                type_val="15";
            }
            else{
                type_val="13";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.kr){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                type_val="22,23,24";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                type_val="23";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                type_val="24";
            }
            else{
                type_val="22";
            }
        }
        // else if(lan == CommonTypes.Language.all){
        //     if(mSingerType == CommonTypes.SingerType.All){
        //         query = Constant.DATA_API+"?ajax=stars&sort=area";
        //     }
        //     else if(mSingerType == CommonTypes.SingerType.Male){
        //         query += "&type_val=20,2,8,14,23";
        //         query += "&sort=area";
        //     }
        //     else if(mSingerType == CommonTypes.SingerType.Female){
        //         query += "&type_val=21,3,9,15,24";
        //         query += "&sort=area";
        //     }
        //     else{
        //         query += "&type_val=19,1,7,13,22";
        //         query += "&sort=area";
        //     }
        // }

        if(term != ""){
            kwd=term;
        }

        page=pageCount*page;
        pagesize=pageCount;

        var query = this.getSingerQuery("star",type_val,sort,kwd,page,pageCount);
        
        db.transaction((tx) => {
            tx.executeSql(query, [], (tx, results) => {
                //console.warn("query = "+query +" , length = " +results.rows.length);
                this.covertSingerDatas(results.rows,callback);
            },(error)=>{
                errorCallback(error)
            }); 
        });
    }

    static getSingerQuery(type,type_val,sort,kwd,page,pageSize){
        var _sort = "";
        if(sort == 'name')_sort = 'Qindex asc';
        if(sort != ""){_sort = sort + ' desc'};
        var query = "select ID as Singer_ID, Actor as Singer_Name, sex as Singer_Sex from ";
        query += " star ";//当类型为disco时读取disco表中的歌曲
        query += ' where 1=1 ';
        
        //类型过滤
        // if(type !=""){
        //     if(type=='star') query += ' and sex in(' + type_val + ')';
        //     else if(type=='area') query += ' and area=' + type_val;
        // }
        
        //关键字过滤
        if(kwd != ""){
            query += ' and (actor like \'%'  + kwd + '%\' or Qindex like \'%' + kwd + '%\')';
        }
        
        //排序
        if(sort != "") query += ' order by ' + sort ;
        //分页
        query += " limit " + page + "," + pagesize;

        return query;
    }

    static covertSingerDatas(rows,callback){
        var datas = [];
        if(rows == null || rows.length == 0){
            callback([]);
        }

        for(var i=0; i<rows.length; i++){
            var item = {
                id: ""+rows.item(i).Singer_ID,
                name : rows.item(i).Singer_Name,
                sex : rows.item(i).Singer_Sex,
                url:"",
            }
            //console.warn(" actor = "+rows.item(i).Actor);
            datas.push(item);
            const index = i;
            BTElib.getUrlActorAvatar(rows.item(i).Singer_Name,index,(url,_index)=>{
                datas[_index].url = url;
                item.url = url;
                if(_index == rows.length - 1){
                    callback(datas);
                }
            });
        }
    }
}