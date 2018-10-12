package com.bte.libs;

import android.annotation.SuppressLint;
import android.content.BroadcastReceiver;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.support.annotation.Nullable;
import android.widget.Toast;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class MyModule extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;
    public MyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
        listenNetworkInfoChange();

    }

    @Override
    public String getName() {
        return "MyModule";
    }

    @ReactMethod
    public void alert(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_LONG).show();
    }

    @ReactMethod
    public void test(int cmd, Callback callback){
        callback.invoke("dcm",cmd*2);
    }

    @ReactMethod
    public void getUrlActorAvatar(String actor,int index,Callback callback){
        String urlStr = Tools.getUrl(actor);
        WritableMap map = Arguments.createMap();
        map.putString("url",urlStr);
        callback.invoke(urlStr,index);
    }
    @ReactMethod
    public void fetchSystemInfo(Callback callback){
        Tools.getSystemInfo(callback);
    }

    @ReactMethod
    public void syncPlaybackQueue(){
        Tools.synchronousPlaybackQueue(mReactContext);
    }

    @ReactMethod
    public void syncPlaybackInfo(){
        Tools.synchronousPlaybackInformation(mReactContext);
    }

    @ReactMethod
    public void syncDownloadQueue(){
        Tools.syncDownloadQueue(mReactContext);
    }

    @ReactMethod
    public void setDownloadStatus(int status){
        Global.isHasDownloading = (status == 1)?true:false;
    }

    @ReactMethod
    public void checkConnectToBox(){
        ConnectivityManager manager = (ConnectivityManager) mReactContext.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo netinfo = manager.getActiveNetworkInfo();
        if (netinfo != null && netinfo.isConnected() && netinfo.isAvailable()
                && netinfo.getType() == ConnectivityManager.TYPE_WIFI) {
            Tools.checkWifiStatus(mReactContext);
        } else {
            WritableMap params = Arguments.createMap();
            params.putBoolean("isConnected",false);
            sendEvent("ConnectToBox",params);
        }
    }

    @ReactMethod
    public void addSongToEndOfList(String songId){

        Tools.addSongToEndOfList(songId);
    }

    @ReactMethod
    public void addYoutubeToEndOfList(String videoId,String videoName, String videoType){
        Tools.addYoutubeToEndOfList(videoId,videoName,videoType);
    }

    @ReactMethod
    public void addYoutubeToEndOfList2(String videoId,String videoName){
        Tools.addYoutubeToEndOfList2(videoId,videoName);
    }

    @ReactMethod
    public void playNow(String songId){
        Tools.playNow(songId);
    }

    @ReactMethod
    public void priority(String songId){
        Tools.priority(songId);
    }

    @ReactMethod
    public void sendRequestControlBox(int cmd){
        Tools.sendRequestControlBox(cmd);
    }

    @ReactMethod
    public void sendRequestControlBox2(int cmd,int state){
        Tools.sendRequestControlBox(cmd,state);
    }
    @ReactMethod
    public void sendRequestControlBox3(int cmd,int state,int value){
        Tools.sendRequestControlBox(cmd,state,value);
    }

    @ReactMethod
    public void stbset(int cmd,String url,Callback callback){
        Tools.stbset(cmd,url,callback);
    }
    @ReactMethod
    public void fetchSongs(String type, int type_val , String actor , String sort ,
                           int temp, String kwd , String ids,
                           int start, int pagesize,Callback callback){
        MySQConnector.fetchSongs(type,type_val,actor,sort,temp,kwd,ids,start,pagesize,callback);
    }
    @ReactMethod
    public void fetchSong(String songId, Callback callback){
        MySQConnector.fetchSong(songId,callback);
    }
    @ReactMethod
    public void fetchDownloadSong(Callback callback){
        MySQConnector.fetchDownloadSongs(callback);
    }
    @ReactMethod
    public void fetchSinger(String type, String type_val , String sort ,
                           String kwd ,int page, int pagesize,Callback callback){
        MySQConnector.fetchSingers(type,type_val,sort,kwd,page,pagesize,callback);
    }
    @ReactMethod
    public void fetchUsbSong(Callback callback){
        Tools.fetchSongsFromUsb(callback);
    }
    private void sendEvent(String eventName, @Nullable WritableMap params) {
        mReactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private void listenNetworkInfoChange() {
        IntentFilter filter;
//        if(Build.VERSION.SDK_INT > Build.VERSION_CODES.M){
//            filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
//        }
//        else{
//            filter = new IntentFilter("RNNetInfoChange");
//        }
       //filter.addAction("android.intent.action.LOCKED_BOOT_COMPLETED");
        filter = new IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION);
        mReactContext.registerReceiver(new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                checkConnectToBox();
            }
        },filter);
    }


}
