package com.bte.libs;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

public class NetworkStateReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
//        ConnectivityManager manager = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
//        NetworkInfo netinfo = manager.getActiveNetworkInfo();
//        if (netinfo != null && netinfo.isConnected() && netinfo.isAvailable()
//                    && netinfo.getType() == ConnectivityManager.TYPE_WIFI) {
//            Intent i = new Intent("RNNetInfoChange");
//            i.putExtra("isConnected", true);
//            context.sendBroadcast(i);
//        } else {
//            Intent i = new Intent("RNNetInfoChange");
//            i.putExtra("isConnected", false);
//            context.sendBroadcast(i);
//        }
        Intent i = new Intent("RNNetInfoChange");
        i.putExtra("isConnected", false);
        context.sendBroadcast(i);
    }
}
