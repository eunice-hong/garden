---
title: MVVM Pattern
draft: false
noindex: true
tags:
  - android
date: 2020-05-17T13:00:00
---
# 세션 노트

MVx ⇒ model view 사이를 어떻게 이어줄까?

## MVVM

- Observer Pattern
- ViewModel : View에 표시될 데이터가 저장되어있는 곳
    - data가 변경될 때만 View가 변경사항을 catch 하여 화면에 표시한다
    - ViewModel → View : data change callback

## Example

> [!info] Observer pattern  
> The observer pattern is a software design pattern in which an object, called the subject, maintains a list of its dependents, called observers, and notifies them automatically of any state changes, usually by calling one of their methods. It is mainly used to implement distributed event handling systems, in "event driven" software.  
> [https://en.wikipedia.org/wiki/Observer_pattern](https://en.wikipedia.org/wiki/Observer_pattern)

- app
    - activity
    - viewmodel
    - observer

`class Observer<T>`
- private val observerList<>
- observe(observer: (T)→ )
- notify(value: T)
- example code
	```kotlin
	import java.util.Scanner
	typealias Observer = (event: String) -> Unit;
	
	class EventSource {
		private val observers = mutableListOf<Observer>()
	
		private fun notifyObservers(event: String) {
			observers.forEach { it(event) }
		}
	
		fun addObserver(observer: Observer) {
			observers += observer
		}
	
		fun scanSystemIn() {
			val scanner = Scanner(System.`in`)
			while (scanner.hasNext()) {
				val line = scanner.nextLine()
				notifyObservers(line)
			}
		}
	}
	```
- 이전 데이터와 다를 경우 update 하지 않을 것을 입력해줘야한다. (⚠️ 무한루프 주의)

~안드로이드에 있는 ViewModel, LiveData 없이 만들어보자~

databinding을 사용하려면 ObservableField를 사용해야한다

- bus 형태로, 각 ViewModel이 데이터를 공유하게 할 건가?
- activity ViewModel 하나에 여러 개의 ViewModel을 사용할 건가?

여러 가지 방법 알아보기!

! BindingAdapter → value should be `NULLABLE`


# 추가 자료

- [ ] swipable listview로 바꿔보자
- [ ] paging 넣어보자
    - [ ] 페이지에서 더 나올 부분 없을 때 메시지 띄워보기!

> [!info] sjjeong/SimpleRecyclerView  
> SimpleRecyclerView aims to help produce an easily usable implementation of a RecyclerView.Adapter and RecyclerView.ViewHolder Then, add the library to your module build.gradle dependencies { implementation 'com.dino.library:simplerecyclerview:x.y.z' } SimpleRecyclerView use DataBinding To configure your app to use data binding, add the dataBinding element to your build.gradle file in the app module (not root build.gradle file), as shown in the following example: There is a sample.  
> [https://github.com/sjjeong/SimpleRecyclerView](https://github.com/sjjeong/SimpleRecyclerView)

### BaseObservable

> [!info]  
> undefined  
> [https://developer.android.com/reference/android/databinding/BaseObservable](https://developer.android.com/reference/android/databinding/BaseObservable)

> [!info]  
> undefined  
> [https://androidwave.com/](https://androidwave.com/)

> [!info]  
> undefined  
> [http://kpp.unaux.com/category/tech-news/?i=1](http://kpp.unaux.com/category/tech-news/?i=1)
