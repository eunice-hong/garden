---
title: Koin
draft: false
noindex: true
date: 2020-06-02T21:17:00
tags:
  - android
---
# 세션 노트

> [!info] alexzaitsev/apk-dependency-graph  
> Class dependency visualizer. Only apk file is needed. Class coupling is one of the significant code metrics that shows how easy is to change, maintain and test the code. This tool helps to view whole picture of the project. Table of contents Some helpful scripts are prepared for you.  
> [https://github.com/alexzaitsev/apk-dependency-graph](https://github.com/alexzaitsev/apk-dependency-graph)

# HOMEWORK 🏡

1. repository data source 옮기기
    1. app / data / local / remote 나누기
2. app에 local / remote interface 만들고, local/ remote에서 impl 구현 → internal로 사용할 수 없게 만들기
    1. app → data ← local/remote



`implementation` → 해당 모듈 안에서만 사용하겠다

`api` → 나를 import하는 곳에서도 사용할 수 있게 하겠다


# 추가 자료

## difference between private and internal

**Internal**
모듈 내부에서만 조회 가능 함

**private**
클래스 내부에서만 조회 가능 함


## Use interface for parameters, and implementations for arguments

mediaplayer and UI synchronization



## Error Handling like a pro 😎

> [!info] Android: Error handling in Clean Architecture  
> We have started refactoring our android project for almost two years with Clean Architecture. Since that time the only topic that has been missing till now is error handling. Sometimes it's confusing how to propagate errors crossing boundaries between layers. Our Clean Architecture brief: Domain : entities and business logic Data : data sources, repositories, providers, 3rd-party services, platform-specific stuff...  
> [https://proandroiddev.com/android-error-handling-in-clean-architecture-844a7fc0dc03](https://proandroiddev.com/android-error-handling-in-clean-architecture-844a7fc0dc03)


livedata on viewmodel

## What is `sealed`?

> [!info] Sealed classes in Kotlin: enums with super-powers  
> Sealed classes in Kotlin are another new concept we didn't have in Java, and open another new world of possibilities. A sealed class allows you to represent constrained hierarchies in which an object can only be of one of the given types. That is, we have a class with a specific number of subclasses.  
> [https://antonioleiva.com/sealed-classes-kotlin/](https://antonioleiva.com/sealed-classes-kotlin/)

### 2020년 6월 9일 오후 9:17

1. suggestion provider(content provider), shared preference class, interface location
2. create resource provider
3. how to import global components ??!?!?
