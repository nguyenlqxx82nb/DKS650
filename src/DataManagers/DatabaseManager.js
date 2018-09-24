import GLOBALS from "./Globals";
import DataInfo from './DataInfo';
import SQLiteManager from "./SqliteManager";
import HTTPManager from "./HTTPManager";
import YoutubeAPI from './YoutubeAPI';
import MixAPI from './MixCloudAPI';

class Databases {
    
    static async fetchSongData(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback){
        if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.SQLITE)
            SQLiteManager.getSongList(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback);
        else if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP)
            HTTPManager.getSongList(lan,page,pageCount,term,songType,listType,actor,callback,errorCallback);
    }

    static async fetchSingerData(lan,page, pageCount, term,sex,callback,errorCallback){
        if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.SQLITE)
            SQLiteManager.getSingers(lan,sex,term,page,pageCount,callback,errorCallback);
        else if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP)
            HTTPManager.getSingers(lan,sex,term,page,pageCount,callback,errorCallback);
    }

    // static fetchSelectedSong(callback){
    //     setTimeout(()=>{
    //         var retDatas = [];
    //         for(var i =0; i<DataInfo.PLAY_QUEUE.length; i++){
    //             var songId = DataInfo.PLAY_QUEUE[i];
    //             var id = (songId % 1000)%30 - 1;
    //             id = (id < 0)?29:id;
    //             var data = {
    //                 id : songId,
    //                 name : SongDataTemp[id].name,
    //                 singer : SongDataTemp[id].singer,
    //                 download : SongDataTemp[id].download,
    //                 status : GLOBALS.SING_STATUS.NORMAL
    //             };
                
    //             retDatas.push(data);
    //         }
    //         callback(retDatas);
    //     },300);
    // }

    static getSong(songId,callback,errorCallback){
       if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP)
            HTTPManager.getSong(songId,callback,errorCallback);
    }

    static fetchOnlineSongData(page, pageCount, term,songOln,callback,errorCallback){
        if(songOln == GLOBALS.SONG_ONLINE.MIXCLOUD){
            MixAPI.fetchOnlineSongData(page, pageCount, term,callback,errorCallback);
        }
        else{
            YoutubeAPI.fetchOnlineSongData(page, pageCount, term,callback,errorCallback);
        }
    }

    static getDownloadQueue(callback,errorCallback){
        if(GLOBALS.INFO.CONNECT == GLOBALS.DATABASE_CONNECT.HTTP)
             HTTPManager.getDownloadQueue(callback,errorCallback);
    }

    static getChannels(callback,errorCallback){
        YoutubeAPI.getChannels(callback,errorCallback);
    }
}

export default Databases;