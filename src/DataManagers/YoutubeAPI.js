import GLOBALS from "./Globals";
import DataInfo from './DataInfo';

const API_KEY = "AIzaSyCKkzbPU_2Oq_d3vRavFt6Y-mYIhxiWW4U";//"AIzaSyB5JMptWGXqC7IJT3fTNdbMfthO9YsYkkY";
const CHANNEL_ID = "UCKo00d6hS17XvaJL9-Wzlww";
var SEARCH_API = "https://www.googleapis.com/youtube/v3/search?part=snippet";
var CHANNEL_API = "https://www.googleapis.com/youtube/v3/channels?";
var VIDEO_API = "https://www.googleapis.com/youtube/v3/videos/?part=snippet";

const channelIds = [
    "UChWbouyyeaF9hk-QRgmYfMQ",
    "UCUVIGR0c8KmIgLy9hXHCkaw",
    "UCKo00d6hS17XvaJL9-Wzlww",
    "UCtqazoDOsBw6GzyV6hR_MNg",
    "UCtaVOvFEOinTJXZu2jLxlxA",
    "UCs1nyM9gm2DjoTO2JmqzUKg",
    "UCLFFGchs82bZUs1DxYumpRQ",
    "UCtqazoDOsBw6GzyV6hR_MNg",
    "UC373nHu6ip5dTIuP2JEdzHg",
    "UCynE25yj8K--oj726fYsUBQ",
];
export default class YoutubeAPI {
    
    static getSearchQuery(page, pageCount, term){
        var query = SEARCH_API;
        //query += "&channelId="+CHANNEL_ID;
        query += "&maxResults="+pageCount;
        if(page !=""){
            query += "&pageToken="+page;
        }
        if(term == ""){
            query += "&q=Nonstop 2019";
        }
        else{
            query += "&q="+term;
        }
        query += "&key="+API_KEY;

        return query;
    }

    static async fetchOnlineSongData(page, pageCount, term,callback,errorCallback){
        let query = this.getSearchQuery(page, pageCount, term);
        //console.warn(query);
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            let pageToken = responseJson.nextPageToken;
            callback(this.covertDatas(responseJson.items),pageToken);
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
                var snippet = rows[i].snippet;
                //console.warn("kind = "+rows[i].kind +", id = "+rows[i].id.videoId +" , url = "+snippet.thumbnails.high.url);
                var snippet = rows[i].snippet;
                var data = {
                    id : rows[i].id.videoId,
                    title : snippet.title,
                    thumb : snippet.thumbnails.high.url,
                    channelTitle : snippet.channelTitle
                };
                if(DataInfo.PLAY_QUEUE.indexOf(data.id) > -1){
                    data.isSelected = 1;
                }
                else{
                    data.isSelected = 0;
                }
                datas.push(data);
            }

            return datas;
        }
    }

    static async fetchOnlineSongsById(ids,callback,errorCallback){
        var query = VIDEO_API;
        query += "&id="+ids;
        query += "&key="+API_KEY;
        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            callback(responseJson.items);
        } catch (error) {
           // console.warn(error);
           errorCallback(error);
        }
    }

    static async getChannels(callback,errorCallback){
        var query = CHANNEL_API;
        query += "part=snippet";
        query += "&id=";
        for(var i=0; i<channelIds.length; i++){
            query +=channelIds[i] + ","
        }

        query += "&key="+API_KEY;

        try {
            let response = await fetch(query);
            let responseJson = await response.json();
            callback(this.covertChannelData(responseJson.items));
        } catch (error) {
           // console.warn(error);
           errorCallback(error);
        }
    }

    static covertChannelData(rows){
        //console.warn("length = "+rows.length);
        if(rows == null || rows.length == 0){
            return [];
        }
        else{
            var datas= [];

            for(var i=0; i< rows.length; i++){
                var snippet = rows[i].snippet;
                var data = {
                    id : rows[i].id,
                    title : snippet.title,
                    thumb : snippet.thumbnails.medium.url,
                };
                
                datas.push(data);
            }

            return datas;
        }
    }
}