
import GLOBALS from './Globals.js'
import DATA_INFO from './DataInfo.js'
import DatabaseManager from './DatabaseManager';
import { EventRegister } from 'react-native-event-listeners';
//import PlaybackQueueThread from '../../playbackQueue.thread.js'
import BTE_LIB from 'react-native-bte-lib';

const BOX_COMMAND ={
    BYTE_NEXT_SONG : 139,
    BYTE_CLAP : 15,
    BYTE_CHEER : 14,
    BYTE_WHISTLE : 17,
    BYTE_MUTE  : 148,
    BYTE_HOOTING : 16,
    BYTE_LIKE : 24,
    BYTE_KIS : 25,
    BYTE_FLOWER : 26,
    BYTE_REPLAY : 147,
    BYTE_PLAY_OR_PAUSE : 135,
    BYTE_SWITCH_PLAY_TYPE : 137,
    BYTE_SET_VOLUME : 136,
    BYTE_PRIORITY : 152,
    BYTE_KARAOKE_TYPE : 137,
    BYTE_GRAP_SONG : 152,
    BYTE_DOWNLOAD_SONG: 249
}

class BoxControl {
 
    static syncPlaybackQueue(){
        console.warn("ping 0 ");
        
        setTimeout(()=>{
            console.warn("ping 1 ");
            this.ping();
        },1000);
    }

    static ping(){
        
        setTimeout(()=>{
            this.ping();
        }, 1000);
    }

    static play(){
        if(DATA_INFO.PLAYBACK_INFO.IsPlaying)
            BTE_LIB.sendRequestControlBox2(BOX_COMMAND.BYTE_PLAY_OR_PAUSE,1);
        else
            BTE_LIB.sendRequestControlBox2(BOX_COMMAND.BYTE_PLAY_OR_PAUSE,0);
    }

    static mute(){
        if(DATA_INFO.PLAYBACK_INFO.IsMute)
            BTE_LIB.sendRequestControlBox2(BOX_COMMAND.BYTE_MUTE,1);
        else
            BTE_LIB.sendRequestControlBox2(BOX_COMMAND.BYTE_MUTE,0);
    }

    static volumeChange(value){
        BTE_LIB.sendRequestControlBox3(BOX_COMMAND.BYTE_SET_VOLUME,1,value*100);
    }

    static selectSong(songId){
        BTE_LIB.addSongToEndOfList(songId);
    }

    static playNow(songId){
        BTE_LIB.playNow(songId);
    }

    static priority(songId){
        BTE_LIB.priority(songId);
    }

    static rePlay(){
        BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_REPLAY);
    }

    static nextSong(){
        BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_NEXT_SONG);
    }

    static downloadSong(id,callback) {
        //console.warn("Download song id = "+id);
        BTE_LIB.stbset(BOX_COMMAND.BYTE_DOWNLOAD_SONG,id+",",(errorCode)=>{
            //console.warn("Download errorCode = "+errorCode);
            if(errorCode == 0){
                var item = {
                    id: id,
                    progress: 0
                }
                if(DATA_INFO.DOWN_QUEUE[id] == null){
                    DATA_INFO.DOWN_QUEUE[id] = item;
                }
                BTE_LIB.setDownloadStatus(1);
                EventRegister.emit("SongDownloadUpdate",{});
            }  
                
            callback(errorCode);
        });
    }   

    static effect(type){
        switch(type){
            case GLOBALS.EMOJI.HuytSao:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_WHISTLE);
                break;
            case GLOBALS.EMOJI.HoReo:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_CHEER);
                break;
            case GLOBALS.EMOJI.VoTay:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_CLAP);
                break;
            case GLOBALS.EMOJI.Smile:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_HOOTING);
                break;
            case GLOBALS.EMOJI.Kiss:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_KIS);
                break;
            case GLOBALS.EMOJI.TangHoa:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_FLOWER);
                break;
            case GLOBALS.EMOJI.Like:
                BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_LIKE);
                break;
            case GLOBALS.EMOJI.ChamDiem:
                //BTE_LIB.sendRequestControlBox(BOX_COMMAND.BYTE_LIKE);
                break;
            default:
                break;
        }
    }

    static getDownloadQueue(){
        DatabaseManager.getDownloadQueue(
            (datas)=>{
                if(datas != null){
                    //console.warn("download length = "+datas.length);
                    BTE_LIB.setDownloadStatus(1);
                    DATA_INFO.DOWN_QUEUE = {};
                    for(var i=0; i<datas.length; i++){
                        //console.warn("id , progress = "+datas[i].ID +" , "+datas[i].Progress);
                        var item = {
                            id: datas[i].ID,
                            progress:datas[i].Progress
                        }    

                        DATA_INFO.DOWN_QUEUE[item.id] = item;
                    }
                }
                else{
                   // console.warn("download length = "+0);
                    BTE_LIB.setDownloadStatus(0);
                    DATA_INFO.DOWN_QUEUE = {};
                }

                EventRegister.emit("SongDownloadUpdate",{});
            },
            () =>{

            }
        )
    }

}

export default BoxControl;