---
title: Android Threads
description: "📱 What Android Threads are and how they work."
draft: true
---

### 다중 스레드 작업

- 로더
- 서비스
- 프로세스 및 쓰레드

  

### 알람 뿌수기

- RTC - 지정된 시간에 대기 중인 인텐트를 실행하지만 기기의 절전 모드는 해제하지 않습니다.

- Reboot 시 반복 알람 재 등록 하기 [link](https://developer.android.com/training/scheduling/alarms?hl=ko)
    - Manifest.xml
        
        ```
        <uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
        ```
        
    - BroadcastReceiver
        
        ```
        class SampleBootReceiver : BroadcastReceiver() {
        
                override fun onReceive(context: Context, intent: Intent) {
                    if (intent.action == "android.intent.action.BOOT_COMPLETED") {
                        // Set the alarm here.
                    }
                }
            }
        ```
        
    

# Main Thread

  

  

# UI Thread

  

  

# WorkerThread

  

# BinderThread

  

# AnyThread