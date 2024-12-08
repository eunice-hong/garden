---
title: Model 소개
draft: false
noindex: true
tags:
  - android
date: 2020-04-26T13:56:00
---
# 세션 노트

### 모델 Model Layer

> _데이터를 가져오는 부분 ⇒ Retrofit ..._

MVx: MVC, MVP, MVVM, MVI, 

`Server`, `Local DB`, `Local File system` ⇒ `Model` ⇒ `UI`

- datasource 만들기
    - 종류: remote datasource / local datasource
        local: db, shared pref, files etc
    - `server → <>` → UI
        ☝️이 부분만 따로 떼어서 사용할 경우 역할 분리 가능! [SOLID](http://www.nextree.co.kr/p6960/)
- repository
    데이터를 어디서 가져올 지 결정하는 부분!
    ex) fb, insta ⇒ 인터넷 연결이 안될 때 앱을 켰을 경우, remote 가능 → 가져오고, 안되면 local을 가져오고 새로고침을 막아 버림
    단, 여기서 가공하지 않음! (가공한다 == UI에 어떻게 보여질 지 알고 있다)
    데이터 컨셉에 따라, friend repo, chat repo

### UI : activity, fragment, view

- POJO class, DTO class ..
- [Android Clean Architecture Repo 참고하기](https://github.com/android/architecture-samples)

## 👀 Code Check!

🗂**package example**

- data
    - local
        MovieRemoteDataSource
        saveMovieList
        getMovieList
    - model
        Movie
    - remote
        MovieRemoteDataSource
        getMovie(query, onSuccess, onFailure) ...
    - repository
        MovieRepository
        getMovie(query, onSuccess, onFailure) ...
        if (remotesource not working) { get list from local }
- ui
    activity

==if (response.isSuccessful) { } else ... ?==

- Retrofit안에 있는 onFailure(HttpException(response))로 보내면 됩니다! ⇒
- override fun onFailed(—-) → 기기 통신이 안좋을때 사용함
    - 이 이외의 처리를 onFailure()로 해라

syncronized (variable) ⇒ 병렬 Thread에서 한 variable에 접근 하려고 할 때 필요하다

### 과제

*Model layer가 들어가 있는 프로젝트로 바꾸기!*

# 추가 자료

### Search View

> [!info] Support multiple themes in an Android application  
> In this post we will talk about supporting multiple themes in Android application. We will create demo application with 2 themes. User can choose of of this theme for whole application. Theme in our application will be change background color, status bar color,... This image show different style tags and meaning for Android 5.+.  
> [https://alexzh.com/support-multiple-themes-in-android-application/](https://alexzh.com/support-multiple-themes-in-android-application/)  


### RecyclerView.Adapter.onBindViewHolder

- bind 하는 부분에서 data 가공이 안 들어가는 것이 좋다 ⇒ recyclerview scroll 시 버벅거림의 원인이 된다.
- 서버에서 받은 데이터를 가공하는 작업을 떼어내고, 가공 완료된 것만 bind 한다

### Android Slow Rendering
    
> [!INFO]
> Slow rendering | Android Developers  
    > UI Rendering is the act of generating a frame from your app and displaying it on the screen. To ensure that a user's interaction with your app is smooth, your app should render frames in under 16ms to achieve 60 frames per second ( why 60fps?).  
    > [ Link](https://developer.android.com/topic/performance/vitals/render)  
    
> [!info] galaxy s20 frame rate - Google Search  
> Please click here if you are not redirected within a few seconds. Capture Millions More Pixels In Each Shot On The Revolutionary Galaxy S20 5G. One of the highlights on the Galaxy S20 is the 120Hz refresh rate screen. The high refresh rate makes everyday interactions silky smooth, and the difference is immediately noticeable.  
> [Link](https://www.google.com/search?q=galaxy+s20+frame+rate&oq=galaxy+s20+frame+rate&aqs=chrome.0.0j69i57.8880j0j7&sourceid=chrome&ie=UTF-8)  
