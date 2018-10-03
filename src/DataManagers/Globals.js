export default {
    STORE_KEY: 'a56z0fzrNpl^2',
    BASE_URL: 'http://someurl.com',

    CONTROL_CMD: {
        SELECT: 1,
        REMOVE: 2,
        DOWNLOAD: 3,
        PRIORITY: 4,
        PLAY: 5,
        PAUSE: 6,
        VOLUMN: 7,
        NEXT: 8,
    },

    COLOR: {
        ORANGE: '#C50',
        DARKBLUE: '#0F3274',
        LIGHTBLUE: '#6EA8DA',
        DARKGRAY: '#999',
    },

    SING_STATUS: {
        NORMAL: 'NORMAL',
        SELECTED: 'SELECTED',
        NO_DOWNLOADED: 'NO_DOWNLOADED',
        DOWNLOADING: 'DOWNLOADING',
    },

    SONG_ACTION: {
        PLAY : 1,
        PRIORITY : 2,
        SINGER : 3,
        DOWNLOAD: 4,
        ADD_AUTO:5,
        REMOVE_AUTO:6,
        REMOVE_SELECT:7,
        SELECT : 8
    },
    
    SONG_MENU_TYPE:{
        NORMAL: 1,
        SINGER:2,
        SELECT:3,
        UNDOWNLOAD:4,
        DOWNLOADING:5
    },

    SINGER_COLORS: {
        'NORMAL': "#B6BACC",
        'SELECTED': "#00ECBC",
        'NO_DOWNLOADED': "#8FA1A7",
        'DOWNLOADING': "#FF2626"
    },

    SING_COLORS: {
        'NORMAL': "#fff",
        'SELECTED': "#00ECBC",
        'NO_DOWNLOADED': "#8FA1A7",
        'DOWNLOADING': "#FF2626"
    },

    SING_PREFIX: {
        'NORMAL': "",
        'SELECTED': "Bài thứ",
        'NO_DOWNLOADED': "",
        'DOWNLOADING': ""
    },

    SING_COLORS_2: {
        NORMAL: "#fff",
        SELECTED: "#00ECBC",
        NO_DOWNLOADED: "#8FA1A7",
        DOWNLOADING: "#FF2626"
    },

    SING_OVERLAY: {
        NONE: 0,
        NORMAL: 1,
        EMOJI: 2,
        SINGER: 3,
        KEYBROARD: 4,
    },

    LANGUAGE: {
        'vn': 8,
        'en': 4,
        'cn': 1,
        'ja': 5,
        'kr': 6,
        'hk': 3,
        'taiwan': 3,
        'tl': 9,
        'ml': 7,
        'other': 10,
        'ca': 11,
        'hot': 100,
        'all': 0
    },
    LANGUAGE_KEY: {
        vn: 'vn',
        en: 'en',
        cn: 'cn',
        ja: 'ja',
        kr: 'kr',
        hk: 'hk',
        taiwan: 'taiwan',
        tl: 'tl',
        ml: 'ml',
        other: 'other',
        ca: 'ca',
        hot: 'hot',
        all: 'all'
    },

    LANGUAGE_NAME: {
        'hot': "HOT",
        'vn': "VIỆT NAM",
        'en': "ENGLISH",
        'cn': "CHINESE",
        'ja': "JAPANESE",
        'kr': "KOREAN",
        'taiwan':"TAIWAN",
        'hk' : "HONGKONG",
        'ml':"MALAYSIA",
        'tl' :"THÁI-LÀO",
        'ca' :"CAMPUCHIA"
    },

    DOWNLOAD_STATUS: {
        DOWNLOADED: 1,
        NO_DOWNLOAD: 2,
        DOWNLOADING: 3,
    },

    SONG_LIST_TYPE: {
        ALL:0,
        NORMAL: 1,
        SELECTED: 2,
        UNDOWNLOAD: 3,
        AUTO: 4,
        SINGER: 5,
        HOT: 6,
        USB: 7,
        FAVORITE: 8,
        DOWNLOADING: 9,
        NEW: 10
    },

    TRANSITION: {
        FADE: 1,
        SLIDE_LEFT: 2,
        SLIDE_TOP: 3
    },

    SONG_TYPE: {
        "ALL": 0,
        "DJ": 7,
        "TRE": 111,
        "VANG": 113,
        "DO": 5,
        "SONGCA": 8,
        "TN": 6,
        "LK": 4,
        "SN": 2,
        "XUAN": 116,
        "TRINH": 112,
        "CL": 3,
        "DC": 1,
        "RK": 114,
        "RAP": 115.
    },

    SONG_TYPE_NAME: {
        "ALL":"ALL",
        "DJ": "REMIX",
        "TRE": "NHẠC TRẺ",
        "VANG": "NHẠC VÀNG",
        "DO": "NHẠC ĐỎ",
        "SONGCA": "SONG CA",
        "TN": "THIẾU NHI",
        "LK": "LIÊN KHÚC",
        "SN": "SINH NHẬT",
        "XUAN": "NHẠC XUÂN",
        "TRINH": "NHẠC TRỊNH",
        "CL": "CẢI LƯƠNG",
        "DC": "DÂN CA",
        "RK": "ROCK",
        "RAP": "RAP",
    },

    SONG_TYPE_KEY: {
        ALL: "ALL",
        DJ: "DJ",
        NHACTRE: "TRE",
        NHACVANG: "VANG",
        NHACDO: "DO",
        SONGCA: "SONGCA",
        THIEUNHI: "TN",
        LIENKHUC: "LK",
        SINHNHAT: "SN",
        NHACXUAN: "XUAN",
        NHACTRINH: "TRINH",
        CAILUONG: "CL",
        DANCA: "DC",
        ROCK: "RK",
        RAP: "RAP",
    },

    Emo1: require("../../assets/Emojiii2.png"),
    Emo2: require("../../assets/Emojiii1.png"),
    Emo3: require("../../assets/Emojiii3.png"),
    Emo4: require("../../assets/Emojiii4.png"),
    Emo5: require("../../assets/Emojiii5.png"),
    Emo6: require("../../assets/clap1.png"),
    Emo7: require("../../assets/rose.png"),
    Emo8: require("../../assets/like.png"),

    EMOJI :{
        HuytSao: 1,
        Kiss: 2,
        Smile: 3,
        HoReo: 4,
        ChamDiem: 5,
        VoTay: 6,
        TangHoa: 7,
        Like:8
    },

    SINGER_TEST: [
        "http://mediaold.tiin.vn:8080/media_old_2016//archive/images/2017/05/04/142620_img_9272.jpg",
        "http://image.baophapluat.vn/w620/Uploaded/2018/wlesfjofzyr/2018_03_25/8_ylci.jpg",
        "https://avatar-nct.nixcdn.com/playlist/2017/05/31/4/9/7/8/1496225850244_500.jpg",
        "http://2sao.vietnamnetjsc.vn/images/2017/09/04/19/21/ho-ngoc-ha-1.jpg",
        "https://dantricdn.com/2018/1/29/huong-tram-111-15172246997241116257391.jpg",
        "http://file.vforum.vn/hinh/2018/03/hinh-anh-hinh-nen-noo-phuoc-thinh-dep-nhat-de-thuong-22.jpg",
        "https://baoconggiao.net/uploads/news/2018_05/mv-cua-son-tung-mtp-mat-khoi-top-trending-vi-xuc-pham-duc-me-va-dao-cong-giao.jpg",
        "https://baomoi-photo-1-td.zadn.vn/w700_r1/18/03/19/255/25311763/3_487236.jpg",
        "https://zmp3-photo-fbcrawler-te-vnso-qt-1.zadn.vn/avatars/4/d/4d870627ce2f41a989ba676e0a313597_1427689508.jpg"
    ],

    SINGER_SEX: {
        MALE: 1,
        FEMALE: 2,
        GROUP: 3,
        ALL: 4,
    },

    SONG_ONLINE: {
        YOUTUBE: 1,
        SOUNDCLOUD: 2,
        MIXCLOUD: 3
    },

    SCREEN_TYPE: {
        TOP: 1,
        BOTTOM: 2
    },

    STATUS_BAR_HEIGHT: 23,

    COLORS: {
        MAIN: "#444083",
        STATUS_BAR: "#222143",
        HEADER: "#444083",
        ERROR: "#FF0000",
        SELECTED: "#00ECBB",
        BACKGROUND: []
    },

    FLAG: {
        VN: require('../../assets/Tieng-Viet.png'),
        EN: require('../../assets/Tieng-Anh.png'),
        CN: require('../../assets/Tieng-Trung.png'),
        JP: require('../../assets/Tieng-Nhat-Ban.png'),
        KR: require('../../assets/Tieng_Han.png'),
    },

    SECOND_SCREEN: {
        NONE: -1,
        NGONNGU: 1,
        SECURE: 2,
        UNDOWNLOAD : 3,
        DOWNLOADING : 4,
        USB : 5,
        SING : 6
    },

    ADMIN_SCREEN:{
        CHU_CHAY : 1,
        AUTO_PLAY: 2,
        NGO_VIDEO: 3,
        MAT_KHAU: 4,
        WIFI: 5,
        LAN: 6,
        WLAN:7,
        SERVER: 8,
        SAN_MUSIC:9,
        DATA:10,
        RESTART:11,
        SHUTDOWN:12
    },

    FONT: {
        REGULAR: "SF-Pro-Text-Regular",
        MEDIUM: "SF-Pro-Text-Medium",
        BOLD: "SF-Pro-Text-Bold",
    },

    IS_BOX_CONNECTED: false,
    IS_WIFI_CONNECTED: false,
    IS_NO_WIFI_CHECKED: true,

    ICON_STATUS :{
        ONLINE:1,
        OFFLINE:2
    },

    BOX_VERSION : {
        S600:1,
        S650:2
    },

    DATABASE_CONNECT:{
        HTTP:1,
        SQLITE:2
    },

    INFO:{
        VERSION : 1,
        CONNECT : 2
    },

    ORIENTATION_TYPE:{
        LANDSCAPE:1,
        PORTRAIT:2
    },

    ORIENTATION : 2,
    
    LANDSCAPE : false,

    SONG_TAB:{
        LANGUAGE : 1,
        SONG_TYPE:2
    },

    FOOTER_HEIGHT:60
};