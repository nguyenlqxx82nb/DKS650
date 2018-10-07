
import GLOBALS from './Globals';
import BTElib from 'react-native-bte-lib';
import DATA_INFO from '../DataManagers/DataInfo';

var SQLite = require('react-native-sqlite-storage')
var db = SQLite.openDatabase({name: 'testDB', createFromLocation: '~songbook.db'})

export default class MySQLMagager { 
    
    static getSongList(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback){
        var type = "",
            type_val=-1,
            sort = "",
            temp = 1,
            kwd = "",
            kwd_alias="",
            page = pageCount*page ,
            ids = "";
        if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
            //var songIds = "";
            let size = DATA_INFO.PLAY_QUEUE.length;
            for(i = 0; i< size; i++){
                ids += DATA_INFO.PLAY_QUEUE[i];
                if(i < size - 1){
                    ids += ",";
                }
            }
        }
        else{
            if(songType != GLOBALS.SONG_TYPE.ALL){
                type="type";
                type_val=songType;
            }
            else if(lan != GLOBALS.LANGUAGE_KEY.all){
                type="lang";
                type_val= GLOBALS.LANGUAGE[lan];
            }
            else if(actor != ""){
                type="star";
                //type_val=actor;
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
                //kwd_alias=term;
            }
        }
        
        if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED && ids == ""){
            callback([]);
        }
        else{
            BTElib.fetchSongs(type,type_val,actor,sort,temp,kwd,ids,page,pageCount,(datas)=>{
                //console.warn("length songs = "+datas);
                var songs = this.covertSongDatas(datas);
                callback(songs);
            });
        }
    }

    static covertSongDatas(rows){
        var datas = [];
        if(rows == null || rows.length == 0){
            return datas;
        }
        var breakLine = (GLOBALS.LANDSCAPE)?"\n":" , ";
        for(var i=0; i<rows.length; i++){
            var singerName = 
                (rows[i].SecondActor =="NONE" || rows[i].SecondActor =="")?rows[i].Actor:rows[i].Actor+breakLine+rows[i].SecondActor;
            var item = {
                id: rows[i].Song_ID,
                name : rows[i].Song_Name,
                actor : rows[i].Actor,
                singerName: singerName
            }
            //console.warn("covertSongDatas = "+singerName);
            let selectIndex = DATA_INFO.PLAY_QUEUE.indexOf(item.id);
            if(selectIndex > -1){
                item.status = GLOBALS.SING_STATUS.SELECTED;
                item.index = " "+(selectIndex + 1);
            }
            else{
                if(rows[i].Temp == 0){
                    item.status = GLOBALS.SING_STATUS.NO_DOWNLOADED;
                }
                else if(rows[i].Temp == 2){
                    item.status = GLOBALS.SING_STATUS.DOWNLOADING;
                }
                else{
                    item.status = GLOBALS.SING_STATUS.NORMAL;
                }
                //item.status = GLOBALS.SING_STATUS.NORMAL;
                item.index = "";
            }
            datas.push(item);
        }
        return datas;
    }

    static getSong(songId,callback,errorCallback){
        BTElib.fetchSong(songId,(datas)=>{
            //console.warn("length songs = "+datas);
            //var songs = this.covertSongDatas(datas);
            callback(datas[0]);
        });
    }

    static async getDownloadQueue(callback,errorCallback){
        BTElib.fetchDownloadSong((datas)=>{
            //console.warn("length songs = "+datas);
            //var songs = this.covertSongDatas(datas);
            callback(datas);
        });
    }

    static getSingers(lan,sex,term,page,pageCount,callback,errorCallback){
        var type_val = "";
        var type="star";
        var sort="";

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
                type_val="2";
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
        page = page*pageCount;
        //console.warn(type +" , "+ type_val+" , "+sort+" , "+term+" , "+page +" , "+pageCount);
        BTElib.fetchSinger(type,type_val,sort,term,page,pageCount,(datas)=>{
            //console.warn("length singer = "+datas.length);
            this.covertSingerDatas(datas,callback);
        });
    }

    static covertSingerDatas(rows,callback){
        var datas = [];
        if(rows == null || rows.length == 0){
            callback([]);
        }
        //console.warn(" covertSingerDatas length =  "+rows.length);
        for(var i=0; i<rows.length; i++){
            var item = {
                id: ""+rows[i].Singer_ID,
                name : rows[i].Singer_Name,
                sex : rows[i].Singer_Sex,
                url:"",
            }
           // console.warn(" actor = "+item.name);
            datas.push(item);
            const index = i;
            BTElib.getUrlActorAvatar(rows[i].Singer_Name,index,(url,_index)=>{
                datas[_index].url = url;
                item.url = url;
                if(_index == rows.length - 1){
                    callback(datas);
                }
            });
        }
    }
}