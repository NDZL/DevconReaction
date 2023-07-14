package com.devconreaction;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Date;
import java.util.Map;
import java.util.HashMap;

//NDZL
//credit: https://reactnative.dev/docs/native-modules-android
//for events https://reactnative.dev/docs/native-modules-android#callbacks
public class ZebraDatawedgeModule  extends ReactContextBaseJavaModule{

    BroadcastReceiver dwBroadcastReceiver;
    ZebraDatawedgeModule(ReactApplicationContext context) {
        super(context);

        dwBroadcastReceiver = createDWBroadcastReceiver();
        IntentFilter filter = new IntentFilter();
        filter.addAction("com.ndzl.DW");
        filter.addCategory("android.intent.category.DEFAULT");
        getReactApplicationContext().registerReceiver(dwBroadcastReceiver, filter);

    }

    @NonNull
    @Override
    public String getName() {
        return "ZebraDatawedge";
    }

    Callback dwPushReadings;
    @ReactMethod
    public void dwTriggerScannerStart() {
        Log.i("ZebraDatawedgeModule", "RN @ReactMethod/dwTriggerScannerStart");
        dwStartScan();
    }

    @ReactMethod
    public void dwInit(Callback callBack) {
        Log.i("ZebraDatawedgeModule", "RN @ReactMethod/dwInit");
        dwPushReadings = callBack;
    }


    //@ReactProp(String("aa"))

    void dwStartScan(){
        String softScanTrigger = "com.symbol.datawedge.api.ACTION";
        String extraData = "com.symbol.datawedge.api.SOFT_SCAN_TRIGGER";

        Intent i = new Intent();
        i.setAction(softScanTrigger);
        i.putExtra(extraData, "START_SCANNING");
        getReactApplicationContext().sendBroadcast(i);
    }

    String barcode_value="";
    String barcode_type="";
    String readable_scan_time="";

    private BroadcastReceiver  createDWBroadcastReceiver(/*EventSink events*/) {
       // Log.i(TAG_LOG,"createDWBroadcastReceiver");
        return new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                //
                barcode_value = intent.getStringExtra("com.symbol.datawedge.data_string");
                barcode_type = intent.getStringExtra("com.symbol.datawedge.label_type");
                long epoch_scan_time =  intent.getLongExtra("com.symbol.datawedge.data_dispatch_time", -1 );
                readable_scan_time = (new Date(epoch_scan_time)).toGMTString();
                Log.i("ZebraDatawedgeModule","RN onReceive DW="+ barcode_type+" "+barcode_value );

                dwPushReadings.invoke(barcode_value, barcode_type, readable_scan_time);
            }
        };
    }


}
