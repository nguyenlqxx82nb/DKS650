import GLOBALS from "./Globals";

var SEARCH_API = "https://api.mixcloud.com/search/?amp=";
var SEARCH_API_TEST = "https://api.mixcloud.com/search/?amp=&limit=50&offset=50&q=karaoke&type=cloudcast";
export default class YoutubeAPI {
    
    static getSearchQuery(page, pageCount, term){
        var query = SEARCH_API;
        //query += "&channelId="+CHANNEL_ID;
        query += "&limit="+pageCount;
        if(page !=""){
            query += "&offset="+page*pageCount;
        }
        if(term == ""){
            query += "&q=karaoke";
        }
        else{
            query += "&q="+term;
        }
        query += "&type=cloudcast";

        return query;
    }

    static async fetchOnlineSongData(page, pageCount, term,callback,errorCallback){
        let query = this.getSearchQuery(page, pageCount, term);
        //console.warn(query);
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            callback(this.covertDatas(responseJson.data));
        } catch (error) {
           // console.warn(error);
           errorCallback(error);
        }
    }

    static covertDatas(rows){
        //console.warn("length = "+rows.length);
        if(rows == null || rows.length == 0){
            return [];
        }
        else{
            var datas= [];
            for(var i=0; i< rows.length; i++){
                var data = {
                    id : rows[i].key,
                    title : rows[i].name,
                    thumb : rows[i].pictures['320wx320h'],
                    channelTitle : rows[i].user.name
                };
                
                datas.push(data);
            }

            return datas;
        }
    }
}