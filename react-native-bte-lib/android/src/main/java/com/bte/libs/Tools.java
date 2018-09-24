package com.bte.libs;

import android.content.Context;
import android.os.Message;
import android.provider.Settings;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.SocketAddress;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;

public class Tools {

    public static void synchronousPlaybackInformation(final ReactContext reactContext) {
        new Thread(new Runnable() {
            public void run() {
                while (true) {
                    if(Global.isWifiConnected){
                        Socket socket = null;
                        OutputStream writes = null;
                        try {
                            socket = new Socket();
                            SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                            socket.connect(socketAddress, 3000);
                            writes = socket.getOutputStream();
                            byte[] buff = new byte[2048];
                            buff[3] = 0x26;
                            writes.write(buff);
                            writes.flush();

                            InputStream inputStream = socket.getInputStream();// ������������������socket��������
                            byte[] bytes = new byte[1024];
                            inputStream.read(bytes);
                            boolean isChanged = false;
                            if (Global.isPlaying != ((int) bytes[100] == 1 ? 0 : 1)) {
                                Global.isPlaying = (int) bytes[100] == 1 ? 0 : 1;
                                isChanged = true;
                            }
                            if (Global.isMute != ((int) bytes[101] == 1 ? 0 : 1)) {
                                Global.isMute = ((int) bytes[101] == 1 ? 0 : 1);
                                isChanged = true;
                            }
                            if (Global.isOriginal != ((int) bytes[102] == 1 ? 0 : 1)) {
                                Global.isOriginal = (int) bytes[102] == 1 ? 0 : 1;
                                isChanged = true;
                            }
                            if (Global.volume != (int) bytes[103]) {
                                Global.volume = (int) bytes[103];
                                isChanged = true;
                            }

                            if(isChanged){
                                WritableMap params = Arguments.createMap();
                                params.putInt("play", Global.isPlaying);
                                params.putInt("mute", Global.isMute);
                                params.putInt("original", Global.isOriginal);
                                params.putInt("volume", Global.volume);
                                SendEvent(reactContext, params, "PlaybackInfoUpdate");
                            }
                        } catch (Exception e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                            //XLog.e("synchronousPlaybackInformation error :" + e.getMessage());
                            // alert("���ڲ���ʹ�ã�������ָ����wifi!");
                        } finally {
                            try {
                                socket.close();
                            } catch (Exception e) {
                                // TODO Auto-generated catch block
                                e.printStackTrace();
                            }
                        }
                    }

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public static void synchronousPlaybackQueue(final ReactContext reactContext) {
        new Thread(new Runnable() {
            public void run() {
                Boolean isFirst = true;
                while (true) {
                    if(Global.isWifiConnected) {
                        Socket socket = null;
                        OutputStream writes = null;
                        Boolean flag = false;
                        //                    while(Constants.HOST_IP.length()<5)
                        //                    {
                        //                        try {
                        //                            Thread.sleep(1000);
                        //                        } catch (InterruptedException e) {
                        //                            // TODO Auto-generated catch block
                        //                            e.printStackTrace();
                        //                        }
                        //                    }

                        try {
                            socket = new Socket();
                            SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                            socket.connect(socketAddress, 3000);
                            writes = socket.getOutputStream();
                            byte[] buff = new byte[2048];
                            buff[3] = (byte) 149;
                            writes.write(buff);
                            writes.flush();

                            InputStream inputStream = socket.getInputStream();// ������������������socket��������
                            byte[] bytes = new byte[1024];
                            inputStream.read(bytes);
                            byte[] songIdQueue = new byte[1020];
                            System.arraycopy(bytes, 4, songIdQueue, 0, 1020);
                            String songIdQueueString = new String(songIdQueue);
                            String[] songIdQueueArray = songIdQueueString.split(",");
                            int queueLen = Global.playQueue.size();
                            WritableArray queue = Arguments.createArray();
                            if (queueLen != songIdQueueArray.length - 1 || isFirst) {
                                flag = true;
                            } else {
                                for (int i = 0; i < songIdQueueArray.length - 1; i++) {
                                    if (!Global.playQueue.get(i).equals(songIdQueueArray[i])) {
                                        flag = true;
                                        break;
                                    }
                                }
                            }
                            if (flag) {
                                Global.playQueue.clear();
                                for (int j = 0; j < songIdQueueArray.length - 1; j++) {
                                    Global.playQueue.add(songIdQueueArray[j]);
                                    queue.pushString(songIdQueueArray[j]);
                                }

                                WritableMap params = Arguments.createMap();
                                params.putArray("queue", queue);
                                SendEvent(reactContext, params, "SongQueueChange");
                            }

                            isFirst = false;

                        } catch (Exception e) {
                            // TODO Auto-generated catch block
                            e.printStackTrace();
                            //XLog.e(" synchronousPlaybackQueue error :" + e.getMessage());
                            // alert("���ڲ���ʹ�ã�������ָ����wifi!");
                        } finally {
                            try {
                                socket.close();
                            } catch (Exception e) {
                                // e.printStackTrace();
                            }
                        }
                    }

                    try {
                        Thread.sleep(1000);
                    } catch (InterruptedException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public static void checkWifiStatus(final ReactContext reactContext) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("isConnected",true);
                    SendEvent(reactContext,params,"ConnectToBox");
                    Global.isWifiConnected = true;
                } catch (Exception e) {
                    WritableMap params = Arguments.createMap();
                    params.putBoolean("isConnected",false);
                    SendEvent(reactContext,params,"ConnectToBox");
                    Global.isWifiConnected = false;
                } finally {
                    try {
                        socket.close();
                    } catch (Exception e) {
                        // e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public static void sendRequestControlBox(final int b) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, Constants.TIME_OUT);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)b;
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                    //ToastUtils.showInThread(context, "Can ket noi wifi");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    // ToastUtils.showInThread(context,
                    // context.getString(R.string.finish_send_request_to_box));
                }
            }
        }).start();
    }

    public static void sendRequestControlBox(final int b, final int state) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, Constants.TIME_OUT);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)b;
                    buff[4] = (byte)state;
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public static void sendRequestControlBox(final int b, final int state, final int value) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, Constants.TIME_OUT);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)b;
                    buff[4] = (byte)state;
                    buff[5] = (byte)value;
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }).start();
    }

    public static void playNow(final String songId) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte) 152;
                    System.arraycopy(songId.getBytes(), 0, buff, 4, songId.getBytes().length);
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }

                Socket socket2 = null;
                OutputStream writes2 = null;
                try {
                    socket2 = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket2.connect(socketAddress, 3000);
                    writes2 = socket2.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte) 139;
                    writes2.write(buff);
                    writes2.flush();
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket2.close();
                        writes2.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    // threadAlert("����ɹ�");
                }
            }
        }).start();
    }

    public static void addSongToEndOfList(final String songId) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                Boolean flag = false;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    if (Global.playQueue.contains(songId)) {
                        buff[3] = (byte) 151;
                        flag = true;
                    } else {
                        buff[3] = (byte) 150;
                        flag = false;
                    }
                    System.arraycopy(songId.getBytes(), 0, buff, 4, songId.getBytes().length);
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    if (flag) {
                        //XLog.d("-------------------------> add song success");
                        // threadAlert("��ȡ��");
                    } else {
                        //XLog.d("-------------------------> add song fail");
                        // threadAlert("�ѵ㲥");
                    }
                }
            }
        }).start();
    }

    public static void priority(final String songId) {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, Constants.TIME_OUT);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte) 152;
                    System.arraycopy(songId.getBytes(), 0, buff, 4, songId.getBytes().length);
                    writes.write(buff);
                    writes.flush();
                } catch (Exception e) {
                    e.printStackTrace();
                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                    // threadAlert("������");
                }
            }
        }).start();
    }

    public static void getServerIp() {
        new Thread(new Runnable() {
            public void run() {
                // while (Global.isAppRunning) {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, Constants.TIME_OUT);
                    writes = socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = 0x28;
                    writes.write(buff);
                    writes.flush();

                    InputStream inputStream = socket.getInputStream();// ������������������socket��������
                    byte[] bytes = new byte[1024];
                    inputStream.read(bytes);

                    byte[] serverIpByte = new byte[1020];
                    System.arraycopy(bytes, 4, serverIpByte, 0, 1020);
                    String serverIpString = new String(serverIpByte);

                    if (serverIpString.trim().equals("192.168.1.1")) {
                        Socket socket2 = null;
                        try {
                            socket = new Socket();
                            SocketAddress socketAddress2 = new InetSocketAddress(serverIpString, Constants.HOST_PORT);
                            socket2.connect(socketAddress, 3000);

                            Global.serverIp = serverIpString.trim();
                        } catch (Exception e) {
                            e.printStackTrace();

                            Global.serverIp = "0";
                        } finally {
                            try {
                                socket2.close();
                            } catch (Exception e) {
                                // TODO Auto-generated catch block
                                e.printStackTrace();
                            }
                        }
                    } else {
                        Global.serverIp = serverIpString.trim();
                    }
                    //XLog.d("----------------------> get server id =" + Global.serverIp);
                    // break;

                } catch (Exception e) {
                    // TODO Auto-generated catch block
                    // e.printStackTrace();
                    //XLog.e(" get server id error :" + e.getMessage());
                    // alert("���ڲ���ʹ�ã�������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            }
            // }
        }).start();
    }

    public static void stbset(final int cmd,final String url,final Callback callback){
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                int returnflag=1;

                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes= socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)cmd;
                    System.arraycopy(url.getBytes(), 0, buff, 4, url.getBytes().length);
                    writes.write(buff);
                    writes.flush();
                    //XLog.e("-----------------> stbset= cmd:" + cmd+",url: "+url);
                    InputStream inputStream = socket.getInputStream();
                    byte[] bytes = new byte[1024];
                    inputStream.read(bytes);
                    byte[] queue = new byte[1020];
                    System.arraycopy(bytes,4,queue,0,1020);
                    String queueString = new String(queue);
                    String[] array = queueString.split(",");
                    for(int i=0; i<array.length; i++){
                        if (array[i].indexOf("setreturn=") != -1) {
                            returnflag = Integer.parseInt(array[i].substring("setreturn=".length()));
                        }
                    }

                }catch (Exception e) {
                    returnflag = -1;
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }finally{
                    try {
                        if(returnflag != -1)
                        {
                            callback.invoke(0);
                        }
                        else
                        {
                            callback.invoke(1);
                        }
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                //SetStbReturnTips(returnflag);
            }
        }).start();
    }

    public static void stbset1(final int cmd,final String url,final Callback callback){
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                int returnflag= -1;

                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes= socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)cmd;
                    System.arraycopy(url.getBytes(), 0, buff, 4, url.getBytes().length);
                    writes.write(buff);
                    writes.flush();
                    //XLog.e("-----------------> stbset= cmd:" + cmd+",url: "+url);
                    InputStream inputStream = socket.getInputStream();
                    byte[] bytes = new byte[1024];
                    inputStream.read(bytes);
                    byte[] queue = new byte[1020];
                    System.arraycopy(bytes,4,queue,0,1020);
                    String queueString = new String(queue);
                    String[] array = queueString.split(",");
                    for(int i=0; i<array.length; i++){
                        if (array[i].indexOf("setreturn=") != -1) {
                            returnflag = Integer.parseInt(array[i].substring("setreturn=".length()));
                        }
                    }

                }catch (Exception e) {
                    returnflag = -1;
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }finally{

                    try {

                        callback.invoke(returnflag);

                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }
                //SetStbReturnTips(returnflag);
            }
        }).start();
    }

    public static void getSystemInfo()
    {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes= socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)255;
                    writes.write(buff);
                    writes.flush();

                    InputStream inputStream = socket.getInputStream();
                    byte[] bytes = new byte[1024];
                    inputStream.read(bytes);
                    if (bytes[3] == (byte)255) {
                        byte[] queue = new byte[1020];
                        System.arraycopy(bytes,4,queue,0,1020);
                        String queueString = new String(queue);

                        //XLog.e("-----------------> System Info =" + queueString);

                        String[] array = queueString.split("\n");
                        for(int i=0; i<array.length; i++){
                            //XLog.e(array[i]);
                            if (array[i].indexOf("cvbsoutput=") != -1) {
                                Global.stb_videoput = Integer.parseInt(array[i].substring(11));
                            }
                            else if (array[i].indexOf("disableaudio=") != -1) {
                                Global.stb_audioput = Integer.parseInt(array[i].substring(13));
                            }
                            else if (array[i].indexOf("revolvint=") != -1) {
                                String run_text = array[i].substring(10);
                                if(run_text.indexOf("|") != -1)
                                {
                                    String[] run_texts = run_text.split("\\|");

                                    Global.stb_revolvint1 = "";
                                    Global.stb_revolvint2 = "";

                                    if(run_texts.length == 1)
                                    {
                                        Global.stb_revolvint1 = run_texts[0];
                                    }
                                    else if(run_texts.length == 2)
                                    {
                                        Global.stb_revolvint1 = run_texts[0];
                                        Global.stb_revolvint2 = run_texts[1];
                                    }
                                }
                                else
                                {
                                    Global.stb_revolvint1 = run_text;
                                    Global.stb_revolvint2 = "";
                                }
                            }
                            else if (array[i].indexOf("databasetype=") != -1) {
                                Global.stb_databasetype = Integer.parseInt(array[i].substring(13));
                            }
                            else if (array[i].indexOf("downdomain=") != -1) {
                                Global.stb_downdomain = array[i].substring(11);
                            }
                            else if (array[i].indexOf("delesongpwd=") != -1) {
                                Global.stb_delesongpwd = array[i].substring(12);
                            }
                            else if (array[i].indexOf("netmode=") != -1) {
                                Global.stb_netmode = Integer.parseInt(array[i].substring("netmode=".length()));
                            }
                            else if (array[i].indexOf("lantype=") != -1) {
                                Global.stb_lantype = Integer.parseInt(array[i].substring("lantype=".length()));
                            }
                            else if (array[i].indexOf("ipadd=") != -1) {
                                Global.stb_ipadd = array[i].substring("ipadd=".length());
                            }
                            else if (array[i].indexOf("gateway=") != -1) {
                                Global.stb_gateway = array[i].substring("gateway=".length());
                            }
                            else if (array[i].indexOf("wlanid=") != -1) {
                                Global.stb_wlanid = array[i].substring("wlanid=".length());
                            }
                            else if (array[i].indexOf("wlanpwd=") != -1) {
                                Global.stb_wlanpwd = array[i].substring("wlanpwd=".length());
                            }
                            else if (array[i].indexOf("ssidid=") != -1) {
                                Global.stb_ssidid = array[i].substring("ssidid=".length());
                            }
                            else if (array[i].indexOf("ssidpwd=") != -1) {
                                Global.stb_ssidpwd = array[i].substring("ssidpwd=".length());
                            }
                            else if (array[i].indexOf("publicsong=") != -1) {
                                Global.stb_publicsong = array[i].substring("publicsong=".length());
                            }
                        }
                    }

//                    if(listener != null)
//                        listener.onResponse(1);

                } catch (Exception e) {
//                    if(listener != null)
//                        listener.onResponse(0);
//                    // TODO Auto-generated catch block
//
//                    XLog.e("-----------------> System Info Exception =" + e.getMessage());
                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    // threadAlert("����ɹ�");
                }

            }
        }).start();

    }

    public static void getSongsFromUsb()
    {
        new Thread(new Runnable() {
            public void run() {
                Socket socket = null;
                OutputStream writes = null;
                try {
                    socket = new Socket();
                    SocketAddress socketAddress = new InetSocketAddress(Constants.HOST_IP, Constants.HOST_PORT);
                    socket.connect(socketAddress, 3000);
                    writes= socket.getOutputStream();
                    byte[] buff = new byte[2048];
                    buff[3] = (byte)215;
                    writes.write(buff);
                    writes.flush();

                    InputStream inputStream = socket.getInputStream();
                    byte[] bytes = new byte[1024];
                    inputStream.read(bytes);
                    if (bytes[3] == (byte)215) {
                        byte[] queue = new byte[1020];
                        System.arraycopy(bytes,4,queue,0,1020);
                        //String queueString = new String(queue);
                        String usbSong = new String(queue);
                        if(usbSong != null && usbSong.indexOf(".") != -1)
                            Global.stb_usbsongs = usbSong;

                        //XLog.e("USB Songs = "+Global.stb_usbsongs);
                    }

//                    if(listener != null)
//                        listener.onResponse(0);

                } catch (Exception e) {
//                    if(listener != null)
//                        listener.onResponse(-1);
//                    // TODO Auto-generated catch block
//
//                    XLog.e("----------------->getSongsFromUsb  Exception =" + e.getMessage());
//                    // threadAlert("���������⣬������ָ����wifi!");
                } finally {
                    try {
                        socket.close();
                        writes.close();
                    } catch (Exception e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                    // threadAlert("����ɹ�");
                }

            }
        }).start();

    }

    public static void syncDownloadQueue(final ReactContext reactContext){

        new Thread(new Runnable() {
            public void run() {
                try {
                    while (true) {
                        if(Global.isWifiConnected  && Global.isHasDownloading){
                            WritableMap params = Arguments.createMap();
                            params.putBoolean("isConnected",true);
                            SendEvent(reactContext,params,"DownloadQueue");
                        }


//
//                        String url = Constants.DATA_API +"?ajax=download";
//                        AsyncLoadDownload asyncloadDownload = new AsyncLoadDownload();
//                        asyncloadDownload.execute(url);
//
////						Global.songDownloadings = Database.getDownloadingItems();
////						if(Global.songDownloadings != null){
////							Message msg = Global.handler.obtainMessage();
////							msg.what = Global.HASDOWNLOADING;
////							Global.handler.sendMessage(msg);
////							if(Global.songDownloadings.size() == 0){
////								Global.isHasDownloading = false;
////							}
////						}

                        try {
                            Thread.sleep(5000);
                        } catch (InterruptedException e) {
                            e.printStackTrace();
                        }
                    }
                } catch (Exception e) {

                } finally {
                    ;
                }

            }
        }).start();

    }


    private static String encode(String str) {
        String hexString = "0123456789ABCDEF";
        byte[] bytes = str.getBytes();
        StringBuilder sb = new StringBuilder(bytes.length * 2);
        for (int i = 0; i < bytes.length; i++) {
            sb.append(hexString.charAt((bytes[i] & 0xf0) >> 4));
            sb.append(hexString.charAt((bytes[i] & 0x0f) >> 0));
        }

        return sb.toString();
    }

    public static String getUrl(String singerName) {
        String singerNameUnicodeString = Tools.encode(singerName);
        String urlStr;
        urlStr = "http://" + Constants.HOST_IP + ":2012/Ktv/singer_picture/";
        urlStr = urlStr + singerNameUnicodeString + ".jpg";
        return  urlStr;
    }

    private static  void SendEvent(ReactContext reactContext, WritableMap params, String eventName){
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }


}
