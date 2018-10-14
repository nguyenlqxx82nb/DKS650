
import GLOBALS from './Globals';
import BTElib from 'react-native-bte-lib';
import DATA_INFO from '../DataManagers/DataInfo';
import MixCloudAPI from './MixCloudAPI';
import YoutubeAPI from './YoutubeAPI';

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
        if(listType == GLOBALS.SONG_LIST_TYPE.USB){
            BTElib.fetchUsbSong((datas)=>{
                //console.warn("length Usb songs = "+datas);
                var songs =[];
                if(datas != "" && datas.indexOf(".") != -1){
                    var items = datas.split(",");
                    for(var i=0; i<items.length; i++){
                        var item = {
                            id: items[i],
                            name : items[i],
                            actor : "Từ USB",
                            singerName: "Từ USB",
                            status : GLOBALS.SING_STATUS.NORMAL
                        }
                        songs.push(item);
                    }
                }
                callback(songs);
            });
            return;
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
            //var songIds = "";
            let size = DATA_INFO.PLAY_QUEUE.length;
            for(i = 0; i< size; i++){
                //console.warn("songid = "+DATA_INFO.PLAY_QUEUE[i]);
                if(!isNaN(DATA_INFO.PLAY_QUEUE[i])){
                    ids += DATA_INFO.PLAY_QUEUE[i]+",";
                }
            }

            if(ids.length >0)
                ids = ids.slice(0, -1);
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.AUTO){
            //var songIds = "";
            let autoIds = DATA_INFO.SYSTEM_INFO.stb_publicsong.split(",");
            let size = autoIds.length;
            for(i = 0; i< size -1; i++){
                ids += autoIds[i];
                if(i < size - 2){
                    ids += ",";
                }
            }
            //console.warn("stb_publicsong = "+DATA_INFO.SYSTEM_INFO.stb_publicsong+", length= "+size);
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING){
            var size = 0,i=0;
            for (var key in DATA_INFO.DOWN_QUEUE) {
                size++;
            }

            for (var key in DATA_INFO.DOWN_QUEUE){
                ids += key;
                if(i < size - 1){
                    ids += ",";
                }
                i++;
            }
            temp=0;
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
            else if(listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
                temp=0;
                sort="new";
            }
            else if(listType == GLOBALS.SONG_LIST_TYPE.HOT){
                type="hot";
                //sort= "hot";
            }
            else if(listType == GLOBALS.SONG_LIST_TYPE.FAVORITE){
                sort="hot";
            }
            if(term != ""){
                kwd=term;
                //kwd_alias=term;
            }
        }
        //console.warn("temp = "+temp +" , type = "+type+" , sort "+sort+", kwd= "+kwd+" , page = "+page+",ids = "+ids);
        if((listType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING && ids == "")
            || (listType == GLOBALS.SONG_LIST_TYPE.SELECTED && ids == "")
                || (listType == GLOBALS.SONG_LIST_TYPE.AUTO && ids == "")){
            if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
                //console.warn("getSelectVideoOnline");
                this.getSelectVideoOnline([],callback);
            }
            else 
                callback([]);
        }
        else{
            BTElib.fetchSongs(type,type_val,actor,sort,temp,kwd,ids,page,pageCount,(datas)=>{
                //console.warn("length songs = "+datas);
                var songs = this.covertSongDatas(datas);
                if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
                    this.getSelectVideoOnline(songs,callback);
                }
                else
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
                //console.warn("Temp = "+rows[i].Temp);
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

    static getSelectVideoOnline(songs,callback){
        let size = DATA_INFO.PLAY_QUEUE.length,_ids = "";
        for(i = 0; i< size; i++){
            if(isNaN(DATA_INFO.PLAY_QUEUE[i])){

                _ids += DATA_INFO.PLAY_QUEUE[i]+",";
            }
        }
        DATA_INFO.VIDEOS = {};
        if(_ids.length > 0){
            YoutubeAPI.fetchOnlineSongsById(_ids,(videos)=>{
                //console.warn("videos = "+videos.length);
                for(var i=0; i<videos.length; i++){
                    var item = {
                        id: videos[i].id,
                        name : videos[i].snippet.title,
                        actor : "Youtube",
                        singerName: "Youtube",
                        status: GLOBALS.SING_STATUS.NORMAL,
                        index: ""
                    }
                    DATA_INFO.VIDEOS[videos[i].id]={
                        name : videos[i].snippet.title,
                        id: videos[i].id,
                        type:"0"
                    }
                    songs.push(item);
                }
                //console.warn("songs = "+songs.length)
                songs = this.sortSelectSong(songs);
                //console.warn("songs 2 = "+songs.length)
                callback(songs);
            },
            (error)=>{
            });
        }
        else{
            songs = this.sortSelectSong(songs);
            //console.warn("songs 2 = "+songs.length)
            callback(songs);
        }
    }

    static sortSelectSong(datas){
        var newDatas = [];
        var temps = {};
        for(var i=0; i<datas.length; i++){
            //console.warn("video id = "+datas[i].id);
            temps[datas[i].id] = datas[i];
        }

        for(var j=0; j<DATA_INFO.PLAY_QUEUE.length; j++){
            //console.warn("video id 2 = "+DATA_INFO.PLAY_QUEUE[j]);
            if(temps[DATA_INFO.PLAY_QUEUE[j]] != null){
                newDatas.push(temps[DATA_INFO.PLAY_QUEUE[j]]);
            }
        }

        return newDatas;
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