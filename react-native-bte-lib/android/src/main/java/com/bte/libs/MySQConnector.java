package com.bte.libs;

import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;

public class MySQConnector {

   private static String getSongQuery(String type, int type_val , String actor ,String sort ,
                                       int temp, String kwd , String ids,
                                       int start, int pagesize){
        if(sort.equals("new")) sort = "date desc";
        else if(sort.equals("name")){sort = "Qindex asc";}
        else if(sort.equals("hot")){ sort="hothit desc";}

        String  sql = "select ";
        sql +=   "ID as Song_ID,";
        sql +=   "Name as Song_Name,";
        sql +=   "date as Song_NewSongDate,";
        sql +=            "actor as Actor,SecondActor,";
        sql +=   "Sex as Singer_Sex,Temp from ";

        sql += ((type.equals("type") && type_val ==7) ? " disco as song ": " song ");//当类型为disco时读取disco表中的歌曲

        sql += " where temp = " + temp ;

        if(type.equals("type"))
            sql += " and type= " + type_val;
        else if(type.equals("new"))
            sql += " and id in(select id from newsong)";
        else if(type.equals("hot"))
            sql += " and id in(select id from topsong)";
        else if(type.equals("lang")) {
            sql += " and language=" + type_val;
        } else if(type.equals("star"))
            sql += " and Actor =\"" + actor + "\"";

        sql += ((type.equals("type") && type_val ==8) ? " and Sex = 3 ": " ");

        //查询指定Id歌曲

        if(!ids.equals("")){
            sql += " and id in(" + ids + ")";
        }

        //关键字过滤
        if(!kwd.equals("")){
            sql += " and (Qindex like \"" + kwd + "%\" or NameAlias like \"" + kwd + "%\" or Name like \"" + kwd + "%\")" ;
        }

        //排序
        if(!sort.equals("")) sql += " order by " + sort;

        //分页
        sql += " limit " + start + "," + pagesize;

        return sql;
    }

    public static void  fetchSongs(String type, int type_val , String actor ,String sort ,
                                     int temp, String kwd , String ids,
                                     int start, int pagesize,final Callback callback){
        final String _sql = getSongQuery(type, type_val ,actor ,sort ,
                                    temp,kwd ,ids,start,pagesize);
        getSongs(_sql,callback);
    }

    public static void fetchSong(String id, final Callback callback){
        String  sql = "select ";
        sql +=   "ID as Song_ID,";
        sql +=   "Name as Song_Name,";
        sql +=   "date as Song_NewSongDate,";
        sql +=    "actor as Actor, SecondActor,";
        sql +=   " Sex as Singer_Sex,Temp from song where id = "+id;

        final String _sql = sql;
        getSongs(_sql,callback);
    }

    private static void getSongs(final String sql,final Callback callback){
        new Thread(new Runnable() {
            public void run() {
                WritableArray queue = Arguments.createArray();
                //JSONArray items = new JSONArray();
                Connection con=null;
                Statement mStmt=null;
                ResultSet mRs =null;
                try {
                    // Load driver
                    Class.forName(Global.driver);
                    // Connect
                    con = DriverManager.getConnection(Global.url, "root", "");
                    //  Log.e("getSongsMysql","Into  getSongsMysql2 "+Global.url);
                    mStmt = con.createStatement();
                    mRs = mStmt.executeQuery(sql);
                    while (mRs.next()) {
                        WritableMap item = Arguments.createMap();
                        item.putString("Song_ID",mRs.getString("Song_ID"));
                        item.putString("Song_Name",mRs.getString("Song_Name"));
                        item.putString("Song_NewSongDate",mRs.getString("Song_NewSongDate"));
                        item.putString("Actor",mRs.getString("Actor"));
                        item.putString("SecondActor",mRs.getString("SecondActor"));
                        item.putInt("Singer_Sex",mRs.getInt("Singer_Sex"));
                        item.putInt("Temp",mRs.getInt("Temp"));

                        queue.pushMap(item);
                    }

                    //callback.invoke("type = "+type+" , type_val = "+type_val+" , sql = "+sql);
                } catch (Exception e) {
                    //Log.e("getSongsMysql","MSQL Exception: "+e.toString());
                    e.printStackTrace();
                    //return "Exception = "+e.getMessage();
                }finally {

                    try {
                        if(mStmt!=null)
                            mStmt.close();
                        if(mRs!=null)
                            mRs.close();
                        if(con!=null)
                            con.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }

                    callback.invoke(queue);
                    //callback.invoke(sql);
                }
            }
        }).start();
    }

    public static String getSingerQuery(String type, String type_val, String sort, String kwd,int page,int pagesize){


        if(sort=="name") sort = "Qindex asc";
        if(!sort.equals("")) sort = sort + " desc";

        String sql = "select ";
            sql += " ID as Singer_ID, ";
            sql += " Actor as Singer_Name, ";
            sql += " sex as Singer_Sex, ";
            sql +=  " Qindex as Singer_PhoneticCode, ";
            //sql +=  "  Area as Singer_NewRegion, ";
            //sql += " Hothit as Singer_HotRank, ";
            sql +=  " CONCAT('http://wx.skymedia.cn/Pictures/singer_picture/', actor, '.jpg') as Singer_SingerHeadAddress ";
            //sql +=  " 0 as SongCount ";
            sql +=   " from ";
            sql +=  " star ";
            sql +=  " where 1=1 " ;

        if(!type.equals("")){
            if(type.equals("star")) sql += " and sex in(" + type_val + ")";
            else if(type.equals("area")) sql += " and area=" + type_val;
            else if(type.equals("star")) sql += " and actor=\"" + type_val + "\" or secondactor=\"" + type_val + "\"";
        }

        //关键字过滤
        if(!kwd.equals("")){
            sql += " and (actor like \"%" + kwd + "%\" or Qindex like \"%" + kwd + "%\")" ;
        }

        //排序
        if(!sort.equals("")) sql += " order by " + sort ;

        //分页
        sql += " limit " + page + "," + pagesize;

        return sql;
    }

    public static void  fetchSingers(String type, String type_val, String sort, String kwd,int page,int pagesize,
                                    final Callback callback){
        final String _sql = getSingerQuery(type, type_val, sort, kwd,page,pagesize);
        //callback.invoke(_sql);
        new Thread(new Runnable() {
            public void run() {
                WritableArray queue = Arguments.createArray();
                //JSONArray items = new JSONArray();
                Connection con=null;
                Statement mStmt=null;
                ResultSet mRs =null;
                try {
                    // Load driver
                    Class.forName(Global.driver);
                    // Connect
                    con = DriverManager.getConnection(Global.url, "root", "");
                    //  Log.e("getSongsMysql","Into  getSongsMysql2 "+Global.url);
                    mStmt = con.createStatement();
                    mRs = mStmt.executeQuery(_sql);
                    while (mRs.next()) {
                        WritableMap item = Arguments.createMap();
                        item.putString("Singer_ID",mRs.getString("Singer_ID"));
                        item.putString("Singer_Name",mRs.getString("Singer_Name"));
                        item.putInt("Singer_Sex",mRs.getInt("Singer_Sex"));
                        item.putString("Singer_PhoneticCode",mRs.getString("Singer_PhoneticCode"));
                        item.putString("Singer_SingerHeadAddress",mRs.getString("Singer_SingerHeadAddress"));

                        queue.pushMap(item);
                    }
                } catch (Exception e) {
                    //Log.e("getSongsMysql","MSQL Exception: "+e.toString());
                    e.printStackTrace();
                    //return "Exception = "+e.getMessage();
                }finally {

                    try {
                        if(mStmt!=null)
                            mStmt.close();
                        if(mRs!=null)
                            mRs.close();
                        if(con!=null)
                            con.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }

                    callback.invoke(queue);
                }
            }
        }).start();
    }

    public static void fetchDownloadSongs(final Callback callback){
        final String _sql = "select ID,Progress from download";
        //callback.invoke(_sql);
        new Thread(new Runnable() {
            public void run() {
                WritableArray queue = Arguments.createArray();
                //JSONArray items = new JSONArray();
                Connection con=null;
                Statement mStmt=null;
                ResultSet mRs =null;
                try {
                    // Load driver
                    Class.forName(Global.driver);
                    // Connect
                    con = DriverManager.getConnection(Global.url, "root", "");
                    //  Log.e("getSongsMysql","Into  getSongsMysql2 "+Global.url);
                    mStmt = con.createStatement();
                    mRs = mStmt.executeQuery(_sql);
                    while (mRs.next()) {
                        WritableMap item = Arguments.createMap();
                        item.putString("ID",mRs.getString("ID"));
                        item.putString("Progress",mRs.getString("Progress"));

                        queue.pushMap(item);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }finally {

                    try {
                        if(mStmt!=null)
                            mStmt.close();
                        if(mRs!=null)
                            mRs.close();
                        if(con!=null)
                            con.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }

                    callback.invoke(queue);
                }
            }
        }).start();
    }
}
