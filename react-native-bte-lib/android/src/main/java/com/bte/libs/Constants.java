package com.bte.libs;

public final class Constants {
    public static char[] API_KEY = new char[] { '2', '1', '5', '0', '4', '3', '4', '5', '3', '1' };

    public static String HOST_IP = "192.168.10.1";
    public static String SERVER_IP = "";
    public static String ADMIN_API = "http://192.168.10.1:8989/tablet?cmd=";
    public static String DATA_API = "";

    public static int HOST_PORT = 1688;

    public static short TIME_OUT = 3000;

    public static String SINGER_IMAGE_RESOURCE_PATH = "http://192.168.10.1:2012/Ktv/singer_picture/";

    // api
    public static final String API_GET_APPCONFIG = "http://remote.api.bte.vn/config.php/app/cfg";
    // api error codes
    public static final int API_ERROR_CODE_BAD_REQUEST = 400;
    public static final int API_ERROR_CODE_API_NOT_EXIST = 404;
    public static final int API_ERROR_CODE_UNAUTHORIZED = 403;
    public static final int API_ERROR_CODE_SESSION_TIMEOUT = 440;
    public static final int API_ERROR_CODE_SERVER_ERROR = 500;
    public static final int API_ERROR_CODE_SERVER_OFFLINE = 503;
    public static final int API_ERROR_CODE_UPDATE_ERROR = 410;
    public static final int API_ERROR_CODE_UNKNOW = 9999;
    public static final String API_RESPONSE_ERROR_KEY_NAME = "error";
    public static final String API_RESPONSE_ERROR_CODE_NAME = "code";
    public static final String API_RESPONSE_ERROR_MESSAGE_NAME = "message";

    // control karaoke box
    public static final byte BYTE_NEXT_SONG = (byte) 139;
    public static final byte BYTE_CLAP = (byte) 0x15;
    public static final byte BYTE_CHEER = (byte) 0x14;;
    public static final byte BYTE_WHISTLE = (byte) 0x17;
    public static final byte BYTE_MUTE = (byte) 148;
    public static final byte BYTE_HOOTING = (byte) 0x16;
    public static final byte BYTE_LIKE = (byte) 24;
    public static final byte BYTE_KIS = (byte) 25;
    public static final byte BYTE_FLOWER = (byte) 26;
    public static final byte BYTE_REPLAY = (byte) 147;
    public static final byte BYTE_PLAY_OR_PAUSE = (byte) 135;
    public static final byte BYTE_SWITCH_PLAY_TYPE = (byte) 137;
    public static final byte BYTE_SET_VOLUME = (byte) 136;
    public static final byte BYTE_PRIORITY = (byte) 152;
    public static final byte BYTE_KARAOKE_TYPE = (byte) 137;
    public static final byte BYTE_GRAP_SONG = (byte) 152;

    public static   String SONGDATABASEURL = "http://192.168.10.1:2012/songbook.db";
    public static final String SONGDATABASENAME = "songbook.db";
    public static final String SONGDATABASENAMETEMP = "temp.db";
    // public static final String PATH = "sdcard/Dieukhien";

    public static final int RADIUS_SINGER_AVATAR = 6;

    public static final String BROADCAST_EVENT_CONNECT_TO_BOX = "connect_to_box";
    public static final String BROADCAST_EVENT_CONNECT_TO_WIFI = "connect_to_wifi";
    public static final String BROADCAST_EVENT_DISCONNECT_TO_BOX = "disconnect_to_box";

    public static final String BROADCAST_EVENT_REFRESH_DATA = "refresh_data";
    public static final String BROADCAST_EVENT_CHANGE_INFO_PLAYBACK = "change_info_playback";
    public static final String BROADCAST_EVENT_GONE_ALL_VIEW = "gone_all_view";
    public static final String BROADCAST_EVENT_SHOW_DIALOG_CONNECTING_WIFI = "show_dialog_connecting_wifi";
    public static final String BROADCAST_EVENT_HAS_DOWNLOADING = "BROADCAST_EVENT_HAS_DOWNLOADING";
    public static final String BROADCAST_EVENT_START_DOWNLOADING = "BROADCAST_EVENT_START_DOWNLOADING";

    public static final String PACKAGE_VNM_LAUNCHER = "vn.bte.launcher";
    public static final String PACKAGE_VNM_LAUNCHER_SETTING_ACTIVITY = "vn.vnm.launcher.WifiSettingActivity";

    public static final String BROADCAST_EVENT_ADD_AUTO_PLAY = "add_auto_play";

    public static class Api {

        public static String API_CODE_SUCCESS = "1";
        public static String API_CODE_FAIL = "2";
        public static int API_ERROR_CODE_PASSWORD_LENGTH_BELOW_8 = 3;
        public static int API_ERROR_CODE_SSID_EMPTY = 7;
        public static String CALLBACK_KILLALLKTV = "killallktv";
        public static String CALLBACK_RESTART = "restart";
        public static String CALLBACK_REBOOT = "reboot";
        public static String CALLBACK_RESTART_WIFI = "restartwifi";
        public static String CALLBACK_POWEROFF = "poweroff";

        public static String API_CHECK_ADMIN_PASS = ADMIN_API + "checkadminpass";
        public static String API_SET_ADMIN_PASS = ADMIN_API + "setadminpass";
        public static String API_SET_HOTSPOT = ADMIN_API + "sethotspot";
        public static String API_SET_ANNOUNCEMENT = ADMIN_API + "setannouncement";
        public static String API_SET_VIDEO_OUTPUT = ADMIN_API + "setvideooutput";
        public static String API_SET_DELETE_SONG_PASS = ADMIN_API + "setdeletesongpass";
        public static String API_SET_DOMAIN = ADMIN_API + "setdomain";
        public static String API_SET_DB_ONLINE_CONFIG = ADMIN_API + "setdbonlineconfig";
        public static String API_SET_AUTOPLAY = ADMIN_API + "setautoplay";

        public static String API_GET_HOTSPOT = ADMIN_API + "gethotspot";
        public static String API_GET_ANNOUNCEMENT = ADMIN_API + "getannouncement";
        public static String API_GET_DBINFO = ADMIN_API + "getdbinfo";
        public static String API_GET_VIDEO_OUTPUT = ADMIN_API + "getvideooutput";
        public static String API_GET_DELETE_SONG_PASS = ADMIN_API + "getdeletesongpass";
        public static String API_GET_DOMAIN = ADMIN_API + "getdomain";
        public static String API_GET_DB_ONLINE_CONFIG = ADMIN_API + "getdbonlineconfig";
        public static String API_GET_DOWNLOAD_QUEUE_STATUS = ADMIN_API + "getdownloadqueuestatus";
        public static String API_GET_AUTOPLAY = ADMIN_API + "getautoplay";

        public static String API_DONWLOAD_SONG = ADMIN_API + "downloadsong";
        public static String API_RESTART = ADMIN_API + "restart";
        public static String API_RESTART_WIFI = ADMIN_API + "restartwifi";
        public static String API_POWEROFF = ADMIN_API + "poweroff";
        public static String API_SYSCONLINEDB = ADMIN_API + "synconlinedb";

        // khoi dong lai app ktv
        public static String API_KILL_ALL_KTV = ADMIN_API + "killallktv";

    }

    public static class Tab {
        public static final String TAB_ANNOUNCEMENT = "tab_announcement";
        public static final String TAB_AUTOPLAY = "tab_autoplay";
        public static final String TAB_VIDEO_OUTPUT = "tab_video_output";
        public static final String TAB_PASSWORD_SETTING = "tab_password_setting";
        public static final String TAB_WIFI_SETTING = "tab_wifi_setting";
        public static final String TAB_RESTART = "restart";
        public static final String TAB_POWEROFF = "poweroff";

        public static final String TAB_LAN = "tab_lan";
        public static final String TAB_SONG = "scan_song";
        public static final String TAB_SONGBOOK = "scan_songbook";
        public static final String TAB_DOMAIN = "DOMAIN";
        public static final String TAB_WLAN = "wlan";
        public static final String TAB_USB = "tab_usb";
    }

    public static class Event {
        public static final String EVENT_ADD_AUTOPLAY_DATA = "add_autoplay_data";
        public static final String EVENT_DELETE_AUTOPLAY_DATA = "delete_autoplay_data";
    }

    public static class SongType {
        public static final int TYPE_SONG_CATEGORY = 1;
        public static final int TYPE_SONG_LANGUAGE = 2;
        public static final int TYPE_SONG_ALL = 3;
        public static final int TYPE_SONG_DUET = 4;

        public static final int NUMBER_SONG_TYPE_OTHER = 8;
        public static final int NUMBER_SONG_TYPE_REMIX_DJ = 7;
        public static final int NUMBER_SONG_TYPE_THIEU_NHI = 6;
        public static final int NUMBER_SONG_TYPE_NHAC_DO = 5;
        public static final int NUMBER_SONG_TYPE_LIEN_KHUC = 4;
        public static final int NUMBER_SONG_TYPE_TANCO = 3;
        public static final int NUMBER_SONG_TYPE_SINH_NHAT = 2;
        public static final int NUMBER_SONG_TYPE_DAN_CA = 1;
        public static final int NUMBER_SONG_TYPE_TRE = 111;
        public static final int NUMBER_SONG_TYPE_TRINH = 112;
        public static final int NUMBER_SONG_TYPE_BOLERO = 113;
        public static final int NUMBER_SONG_TYPE_ROCK = 114;
        public static final int NUMBER_SONG_TYPE_RAP = 115;
        public static final int NUMBER_SONG_TYPE_XUAN = 116;

        public static final int NUMBER_SONG_TYPE_CHINESE = 1;
        public static final int NUMBER_SONG_TYPE_HONGKONG = 2;
        public static final int NUMBER_SONG_TYPE_TAIWAN = 3;
        public static final int NUMBER_SONG_TYPE_ENGLISH = 4;
        public static final int NUMBER_SONG_TYPE_JAPANESE = 5;
        public static final int NUMBER_SONG_TYPE_KOREAN = 6;
        public static final int NUMBER_SONG_TYPE_VIETNAM = 10;
        public static final int NUMBER_SONG_TYPE_ALL = 0;



        public static final int NUMBER_SONG_TYPE_SONG_CA = 3;

    }
}
