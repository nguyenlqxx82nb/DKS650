package com.bte.libs;

import java.util.ArrayList;

import android.os.Handler;

public class Global {

    public static ArrayList<String> playQueue = new ArrayList<String>();

//	//�Ƿ��Ǹ���ר��
//	public static Boolean isSingerAlbum;
//	//�Ƿ����ѵ���б�
//	public static Boolean isPlayList;
//	//�Ƿ����ղ��б�
//	public static Boolean isFavoriteSongs;
//
//	//����������
//	public static Context appContext;

    //����IP
//	public static String hostIp;
//
//	//����˿�
//	public static int hostPort;
//
//	//������IP
    public static String serverIp;
    //
    // ca si hat hoac khong
    public static int isOriginal;

    // choi nhac hoac tam dung
    public static int isPlaying;
    //
//	//����
    public static int isMute;
    //
//	//��Ϣ���
    public static Handler handler;
//

    //	//�л�ԭ�鳪
    public static final int SWITCHINGORIGINALACCOMPANIMENT = 100;
    //
//	//������ͣ
    public static final int TOGGLEPLAYPAUSE = 200;
    //
//	//��������ʾ
    public static final int DOWNLOADEND = 300;
    //
//	//���ظ��ֲ˵�
    public static final int SINGERMENU = 400;
    //
//	//���ظ���˵�
    public static final int SONGMENU = 500;
    //
//	//��ݸ��ֲ�ѯ����
    public static final int SONGBYACTOR = 600;
    //
//	//ˢ�¸����б�
    public static final int REFRESHSONGLIST = 700;
    //
//	//�����ϲ�˵�
    public static final int BACK = 800;
    //
//	//����
    public static final int MUTE = 246;
    //
//	//��������
    public static final int SETVOLUME = 1000;
    public static final int HASDOWNLOADING = 2000;
    //
//
    //����ͷ����Դ��PATH
//	public static final String SINGERIMAGERESOURCEPATH = "http://192.168.10.1:2012/Ktv/singer_picture/";
//
//	public static TypeCommand currTypeCommand;
//
//	public static SingerDao singerDao;
//
//	public static SongDao songDao;
//
//	public static FavoriteSongsDao favoriteSongsDao;
//
//	//ȫ�ֲ�ѯ����
//	public static String actor;
//	//�ղظ���db
//	public static SQLiteDatabase favoiriteSongDb;
//
//	//˫�򻬶��˵�����
//	public static BidirSlidingLayout bidirSldingLayout;
//	//���¼���ͼ����
//	public static ArrayList<View> bindViews;
//
    // am luong hien tai cua dau karaoke
    public static int volume = 0;
    public static boolean isAppRunning;

    public static int stb_videoput;

    public static int stb_audioput;

    public static String stb_revolvint1;

    public static String stb_revolvint2;

    public static int stb_databasetype;

    public static String stb_downdomain;

    public static String stb_delesongpwd;

    public static int stb_netmode;

    public static int stb_lantype;

    public static String stb_ipadd;

    public static String stb_gateway;

    public static String stb_wlanid;

    public static String stb_wlanpwd;

    public static String stb_ssidid;

    public static String stb_ssidpwd;

    public static String stb_publicsong;

    public static String stb_usbsongs = "";

    public static String driver = "com.mysql.jdbc.Driver";

    public static String url = "jdbc:mysql://192.168.10.1:3306/skymedia_vod";//characterEncoding=UTF8

    //public static Connection con;
    //public static boolean isConnected = false;
    public static boolean isWifiConnected = false;
    public static boolean isDisconnected = false;
    public static boolean isHasDownloading = false;
    public static int retryNunmber = 4;
    public static int volume_curent_ring = 0;
    public static int volume_curent_music = 0;
    //public static ArrayList<DownloadModel> songDownloadings = new ArrayList<DownloadModel>() ;

    public interface MySQLConnectionListener {
        public void onResponse(boolean isConnectionSuccess);
    }

}


