import GLOBALS from "./Globals";
import DATA_INFO from './DataInfo';
import BTElib from 'react-native-bte-lib';

const DATA_API = "http://192.168.100.17:8081/app_api.php";

export default class HTTPManager {
    static getSelectSongQuery(){
        var query = DATA_API + "?ajax=songs";
        var songIds = "";
        let size = DATA_INFO.PLAY_QUEUE.length;
        for(i = 0; i< size; i++){
            songIds += DATA_INFO.PLAY_QUEUE[i];
            if(i < size - 1){
                songIds += ",";
            }
        }

        if(songIds == ""){
            return "";
        }
        else {
            query += "&ids="+songIds ;
        }

        return encodeURI(query);
    }
    static getSongQuery(listType,songType,lan,actor,page, pageCount,term){
        var query = DATA_API + "?ajax=songs";
        // if(mSongListType == CommonTypes.SongListType.Downloading){
            //     return getDownloadingQuery();
            // }
            // else if(mSongListType == CommonTypes.SongListType.Selected){
            //     return getSelectedSongQuery();
            // }
        if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
            return this.getSelectSongQuery();
        }
        
        if(songType != GLOBALS.SONG_TYPE.ALL){
            query += "&type=type&type_val="+songType;
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.hot){
            query += "&type=hot";
        }
        else if(lan != GLOBALS.LANGUAGE_KEY.ALL){
            query += "&type=lang&type_val="+GLOBALS.LANGUAGE[lan];
        }
        else if(actor != ""){
            query += "&type=star&type_val="+actor;
        }

        if(listType == GLOBALS.SONG_LIST_TYPE.NEW){
            query += "&sort=new";
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.UNDOWNLOAD){
            query += "&temp=0&sort=new";
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.DOWNLOADING){
            query += "&temp=2";
        }
        else if(listType == GLOBALS.SONG_LIST_TYPE.FAVORITE){
            query += "&sort=hot";
        }

        if(term != ""){
            query += "&kwd="+term;
            //String _searchTerm  = unidecode(mSearchText);
            query += "&kwd_alias="+term;//URLEncoder.encode(_searchTerm, "UTF-8");
        }

        query += "&page="+pageCount*page +"&pagesize="+pageCount;
        return encodeURI(query);
    }

    static async getSongList(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback){
        let query = this.getSongQuery(listType,songType,lan,actor,page,pageCount,term);
        //console.warn("query = "+query);
        if(query == ""){
            callback([]);
        }
        else{
            try {
                let response = await fetch(query);
                let responseJson = await response.json();
                var datas = responseJson.data;
                var items = this.covertSongDatas(datas);
                if(listType == GLOBALS.SONG_LIST_TYPE.SELECTED){
                    items = this.sortSelectSong(items);
                }
                callback(items);
            } catch (error) {
                console.warn(error);
                errorCallback(error);
            }
        }
    }

    static covertSongDatas(rows){
        var datas = [];
        if(rows == null || rows == undefined || rows.length == 0){
            return datas;
        }

        for(var i=0; i<rows.length; i++){
            var item = {
                id: rows[i].Song_ID,
                name : rows[i].Song_Name,
                actor : rows[i].Actor,
                singerName: rows[i].Singer_Name,
            }

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
                item.index = "";
            }
            datas.push(item);
        }
        return datas;
    }

    static sortSelectSong(datas){
        var newDatas = [];
        var temps = {};
        for(var i=0; i<datas.length; i++){
            temps[datas[i].id] = datas[i];
        }

        for(var j=0; j<DATA_INFO.PLAY_QUEUE.length; j++){
            if(temps[DATA_INFO.PLAY_QUEUE[j]]!= null){
                newDatas.push(temps[DATA_INFO.PLAY_QUEUE[j]]);
            }
        }

        return newDatas;
    }

    static async getSong(songId,callback,errorCallback){
        let query = DATA_API + "?ajax=songs&ids="+songId;
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            var datas = responseJson.data;
            if(datas.length > 0){
                callback(datas[0]);
            }
            else{
                callback(null);
            }
        } catch (error) {
            //console.warn(error);
            errorCallback(error);
        }
    }

    static async getDownloadQueue(callback,errorCallback){
        let query = DATA_API + "?ajax=download";
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            var datas = responseJson.data;
            callback(datas);
        } catch (error) {
            //console.warn(error);
            errorCallback(error);
        }
    }
    
    static getSingerQuery(lan,sex,term,page,pageCount){
        query = DATA_API+"?ajax=stars&type=star";
        if(lan == GLOBALS.LANGUAGE_KEY.hot){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=20,21,19";
                query += "&sort=area";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=20";
                query += "&sort=area";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=21";
                query += "&sort=area";
            }
            else{
                query += "&type_val=19";
                query += "&sort=area";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.vn){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=20,21,19";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=20";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=21";
            }
            else{
                query += "&type_val=19";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.cn){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=1,2,3";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=2";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=3";
            }
            else{
                query += "&type_val=1";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.en){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=7,8,9";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=8";
            }
            else if(sex ==  GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=9";
            }
            else{
                query += "&type_val=7";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.ja){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=13,14,15";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=14";
            }
            else if(sex ==  GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=15";
            }
            else{
                query += "&type_val=13";
            }
        }
        else if(lan == GLOBALS.LANGUAGE_KEY.kr){
            if(sex == GLOBALS.SINGER_SEX.ALL){
                query += "&type_val=22,23,24";
            }
            else if(sex == GLOBALS.SINGER_SEX.MALE){
                query += "&type_val=23";
            }
            else if(sex == GLOBALS.SINGER_SEX.FEMALE){
                query += "&type_val=24";
            }
            else{
                query += "&type_val=22";
            }
        }

        if(term != ""){
            query += "&kwd="+ term;
        }
        query += "&page="+pageCount*page +"&pagesize="+pageCount;
        return encodeURI(query);
    }

    static async getSingers(lan,sex,term,page,pageCount,callback,errorCallback){
        let query = this.getSingerQuery(lan,sex,term,page,pageCount);
        //console.warn(query);
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            this.covertSingerDatas(responseJson.data,callback);
        } catch (error) {
           // console.warn(error);
           errorCallback(error);
        }
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
