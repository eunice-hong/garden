---
title: AAC ViewModel + AAC LiveData
draft: false
noindex: true
tags:
  - android
date: 2020-05-24T13:54:00
---
# 세션 노트

## AAC ViewModel

> [!info]  
> undefined  
> [https://developer.android.com/topic/libraries/architecture/saving-states](https://developer.android.com/topic/libraries/architecture/saving-states)

> [!info]  
> undefined  
> [https://developer.android.com/topic/libraries/architecture/viewmodel?gclid=Cj0KCQjw-_j1BRDkARIsAJcfmTHyZxwxNwarOLcTxrKqa-Iy3WP8SCnC_K5NgaQegDDBaODQ5-9GUZEaAslvEALw_wcB&gclsrc=aw.ds](https://developer.android.com/topic/libraries/architecture/viewmodel?gclid=Cj0KCQjw-_j1BRDkARIsAJcfmTHyZxwxNwarOLcTxrKqa-Iy3WP8SCnC_K5NgaQegDDBaODQ5-9GUZEaAslvEALw_wcB&gclsrc=aw.ds)

> [!info]  
> undefined  
> [https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150](https://medium.com/androiddevelopers/livedata-with-snackbar-navigation-and-other-events-the-singleliveevent-case-ac2622673150)


# 추가 자료

## 🤔 What is AAC

![](https://pngegg.com/en/png-zipwz)

AAC : **A**ndroid **A**rchitecture **C**omponent

### _manage Application lifecycle_

- detect component changes
- prevent memory leak
- load data on UI

#### LiveData
notify data changes on database to view

#### ViewModel
store UI states even

#### Room
SQLite object mapping library

- Use it to avoid boilerplate code and easily convert SQLite table data to Java objects.
- Room provides compile time checks of SQLite statements and can return RxJava, [Flowable](https://medium.com/androiddevelopers/room-rxjava-acb0cd4f3757) and LiveData observables.

## Lifecycle

### Best Practice

UI controller: activity, fragment ...
→ should not acquire their own data
→ data should be on ViewModel

Use Kotlin coroutines

### Usage
- Video play
- Network connection
- animation play
- GPS

### [View Binding](https://developer.android.com/topic/libraries/view-binding)

#### alternative to `findViewById(<!—id—>)`
- Null safe
- Type safe

#### vs data binding
→ data binding은 `<layout>`안에 생성된 데이터 바인딩 레이아웃만 처리한다.
→ `@+id` 만 있으면 모든 view 참조/binding 가능
