---
title: Effects and Effect Handlers
description: "Jetpack Compose는 상태 기반 선언형 시스템으로, 사이드 이펙트를 제어하기 위한 다양한 이펙트 핸들러(DisposableEffect, SideEffect, LaunchedEffect 등)를 제공한다. 외부 데이터 스트림도 이를 통해 통합되며, Compose Runtime은 UI 없이도 다양한 트리 구조 관리에 활용 가능하다."
date: 2025-04-27T21:00:00
draft: false
noindex: false
tags:
  - JetpackCompose
---
# Introducing side effects

## 사이드 이펙트란?

> [!abstract] Side Effect
> - 호출자가 예상하지 못한 방식으로 함수 외부에서 발생하는 부수적인 행동이다.
> - 이러한 행동은 함수의 동작을 변경시킬 수 있다.
> - 코드 추론을 어렵게 하고, 테스트하기 어렵게 만들며, flaky한 코드를 초래할 수 있다.

본질적으로, 사이드 이펙트는 함수의 제어와 범위를 벗어나는 모든 것을 의미한다. 예를 들어 두 수를 더하는 함수는 다음과 같이 작성될 수 있다:

```kotlin
fun add(a: Int, b: Int): Int = a + b
```

이 함수는 입력값만을 사용해 결과를 도출하므로 순수 함수(pure function)이다. 같은 입력값에 대해 항상 같은 결과를 반환하며, 이 함수는 결정적(deterministic)이라고 할 수 있다. 따라서 개발자가 코드를 쉽게 추론할 수 있다.

## 사이드 이펙트의 예

- 전역 변수에 읽기/쓰기
- 메모리 캐시에 접근
- 데이터베이스 접근
- 네트워크 쿼리 수행
- 화면에 무언가 표시
- 파일에서 읽기

이제 동일한 함수에 캐시 기능을 추가한다고 가정해보자:

```kotlin
fun add(a: Int, b: Int) =
    calculationsCache.get(a, b) ?:
    (a + b).also { calculationsCache.store(a, b, it) }
```

이제 calculationsCache라는 캐시를 사용해 이전 결과를 재활용한다. 이 캐시는 함수의 제어 범위를 벗어난 외부 리소스로, 값이 마지막 실행 이후 변경되지 않았는지 확인할 방법이 없다. 만약 다른 스레드에서 캐시 값을 바꾼다면 어떻게 될까?

```kotlin
fun main() {
    add(1, 2) // 3
    // 다른 스레드가 cache.store(1, 2, 4) 호출
    add(1, 2) // 4
}
```

동일한 입력값에 대해 다른 결과를 반환하게 되며, 함수는 더 이상 결정적이지 않다. 만약 이 캐시가 데이터베이스에 저장되어 있다면, 네트워크 오류로 인해 get 또는 store에서 예외가 발생할 수 있고, 이로 인해 함수가 실패할 수도 있다.


# Side effects in Compose

## Composable 함수 내부에서의 사이드 이펙트 문제

- Composable 함수 내부에서 사이드 이펙트를 실행하면, 이펙트는 Composable의 생명 주기(lifecycle) 제약을 벗어나게 된다. 
- 이는 일반 함수에서 발생하는 사이드 이펙트 문제와 동일한 문제를 발생시킨다.
    
## 재구성(Recomposition) 문제

- Composable은 여러 번 재구성될 수 있으며, 이는 동일한 사이드 이펙트가 여러 번 실행되는 결과를 초래할 수 있다. 
- 이런 이유로 Composable 함수 안에서 직접 사이드 이펙트를 실행하는 것은 좋지 않은 방법이다. 
- Composable 함수는 재시작 가능하므로(restartable), 이를 염두에 두고 설계해야 한다.
    
## 예시: 네트워크 상태를 로드하는 Composable

```kotlin
@Composable
fun EventsFeed(networkService: EventsNetworkService) {
    val events = networkService.loadAllEvents() // side effect

    LazyColumn {
        items(events) { event ->
            Text(text = event.name)
        }
    }
}
```

- 위 코드는 매번 recomposition 시마다 loadAllEvents()가 실행된다.
- 이는 네트워크 요청이 중복 실행되는 문제를 유발할 수 있다.
- 우리가 원하는 것은 “최초 composition 시에만” 이펙트를 실행하고, 그 상태를 유지하는 것이다.

## 예시 2: 외부 상태와 동기화하는 코드

```kotlin
@Composable
fun MyScreen(drawerTouchHandler: TouchHandler) {
    val drawerState = rememberDrawerState(DrawerValue.Closed)

    drawerTouchHandler.enabled = drawerState.isOpen

    // ...
}
```

- drawerTouchHandler.enabled 값을 외부 상태인 drawerState에 따라 업데이트하는 것은 하나의 사이드 이펙트이다.

## Composable의 생명 주기

Composable은
1. UI에 나타나면 composition에 들어가고, 
2. UI 트리에서 제거되면 composition에서 빠져나간다.

이 두 이벤트 사이에 이펙트가 실행될 수 있으며, 어떤 이펙트는 Composable 생명 주기를 넘어 지속될 수 있다.

## 이펙트 핸들러의 두 가지 분류

1. Non-suspended effects
    - 예: Composable이 composition에 진입할 때 콜백을 등록하고, 빠져나갈 때 해제하는 경우
2. Suspended effects
    - 예: 네트워크로부터 데이터를 가져와 상태를 갱신하는 경우

# What we need

Jetpack Compose의 composition은 다양한 스레드에서 실행될 수 있고, 병렬로 실행되거나 순서가 달라질 수 있다. 이러한 유연성은 Compose 팀이 성능 최적화를 위해 열어두고자 하는 가능성이며, 따라서 composition 중에 아무 제어 없이 바로 사이드 이펙트를 실행하는 것은 지양해야 한다.

## 우리가 필요로 하는 메커니즘

- 이펙트는 Composable 생명 주기의 적절한 시점에 실행되어야 한다. 너무 이르거나 늦지 않게, Composable이 준비되었을 때 실행되어야 한다. 
- suspend 함수 기반의 이펙트는 적절히 설정된 런타임에서 실행되어야 한다. 예: Coroutine 및 CoroutineContext. 
- 참조를 캡처하는 이펙트는 composition에서 벗어날 때 이를 해제할 수 있는 기회를 가져야 한다. 
- composition에서 벗어날 때, 진행 중인 suspend 이펙트는 취소되어야 한다. 
- 입력값의 변화에 의존하는 이펙트는 그 값이 바뀔 때마다 자동으로 해제(dispose), 취소(cancel), 재시작(relaunch)되어야 한다.

이러한 메커니즘은 Jetpack Compose가 제공하며, 이를 **effect handlers**라고 부른다.

## 버전 정보

이 문서에서 공유되는 모든 effect handler는 1.0.0-beta02 버전 기준으로 사용할 수 있다. Jetpack Compose는 public API가 beta에 진입하면서 고정되었기 때문에, 1.0.0 정식 릴리스 전까지는 변경되지 않는다.

# Effect Handlers

## Composable의 생명주기

- Composable은 화면에 나타나면서 composition에 진입하고, UI 트리에서 제거되면 composition에서 벗어난다. 
- 이 두 시점 사이에 이펙트가 실행될 수 있으며, 일부 이펙트는 Composable 생명주기를 넘어 실행될 수도 있다. 
- 즉, 하나의 이펙트가 여러 composition에 걸쳐 존재할 수 있다.
    
## 이펙트 핸들러 분류

Jetpack Compose에서는 이펙트 핸들러를 두 가지로 분류할 수 있다.

1. Non suspended effects
    예: Composable이 composition에 들어갈 때 콜백을 초기화하고, 빠져나갈 때 해제하는 이펙트를 실행
    - 콜백 등록 및 해제에 사용됨
2. Suspended effects
    예: 네트워크에서 데이터를 불러와서 UI 상태를 업데이트할 때 사용
    - suspend 함수와 coroutine을 활용

## Non suspended effects - DisposableEffect

### 개요

DisposableEffect는 composition 생명주기에 반응하는 사이드 이펙트를 나타낸다. 일반적으로 정리(dispose)가 필요한 non-suspend 타입의 이펙트에 사용된다.

### 주요 특징

- 정리가 필요한 non-suspended 이펙트를 다룰 때 사용된다. 
- Composable이 composition에 진입할 때 처음 실행되며, 키(key)가 변경될 때마다 다시 실행된다. 
- Composable이 composition에서 벗어나거나 키가 바뀌면 onDispose 콜백을 통해 정리된다. 
- 최소 한 개 이상의 키를 필요로 한다.
    
### 사용 예시

```kotlin
@Composable
fun backPressHandler(onBackPressed: () -> Unit, enabled: Boolean = true) {
    val dispatcher = LocalOnBackPressedDispatcherOwner.current.onBackPressedDispatcher

    val backCallback = remember {
        object : OnBackPressedCallback(enabled) {
            override fun handleOnBackPressed() {
                onBackPressed()
            }
        }
    }

    DisposableEffect(dispatcher) {
        dispatcher.addCallback(backCallback)
        onDispose {
            backCallback.remove() // 메모리 누수 방지
        }
    }
}
```

### 코드 설명

- dispatcher는 CompositionLocal을 통해 얻은 값이다. 
- DisposableEffect(dispatcher)는 dispatcher가 변경되면 이펙트를 재실행하고 이전 이펙트를 정리한다. 
- Composable이 composition에서 사라질 때도 onDispose가 호출되어 콜백을 제거한다.
    
## 효과를 한 번만 실행하고 싶은 경우

효과를 오직 첫 composition 진입 시에만 실행하고, 나갈 때 정리하고 싶다면 다음처럼 상수를 키로 사용할 수 있다.

```kotlin
DisposableEffect(true)
DisposableEffect(Unit)
```

### 요약

- DisposableEffect는 composition 생명주기에 맞춰 이펙트를 실행하고 정리할 수 있게 해준다. 
- 키가 변경되면 자동으로 이전 이펙트를 정리하고 새로운 이펙트를 실행한다. 
- 항상 최소 한 개의 키가 필요하다.
    

## SideEffect

### 개요

SideEffect는 composition의 사이드 이펙트를 처리하기 위한 핸들러 중 하나이다. 다음과 같은 특징이 있다:

- composition이 성공적으로 완료되었을 때만 실행된다. 
- composition이 실패하면 이펙트는 무시된다. 
- 슬롯 테이블(slot table)에 저장되지 않기 때문에 composition의 생명주기를 넘어서 지속되지 않는다. 
- 다시 실행되거나 재시도되지 않는다. 
- 일회성으로 실행되는 “이번 composition에서만 실행하고 잊는다” 식의 이펙트이다.
    
### 용도

- 정리(dispose)가 필요 없는 이펙트에 사용한다. 
- 모든 composition 및 recomposition 이후에 실행된다. 
- 외부 상태를 갱신(publish update)하는 데 유용하다.
    
### 사용 예시

```kotlin
@Composable
fun MyScreen(drawerTouchHandler: TouchHandler) {
    val drawerState = rememberDrawerState(DrawerValue.Closed)

    SideEffect {
        drawerTouchHandler.enabled = drawerState.isOpen
    }

    // ...
}
```

### 코드 설명

- drawerTouchHandler.enabled를 drawerState.isOpen 값에 따라 업데이트함으로써 외부 상태를 반영한다. 
- TouchHandler가 싱글톤이고, 앱 전체에서 항상 존재하는 컴포넌트라면 굳이 정리할 필요가 없기 때문에 SideEffect가 적합하다.
    
SideEffect는 외부 상태를 최신 상태로 유지해야 할 때 유용하다. Compose 내부의 상태 시스템으로 관리되지 않는 외부 값들을 지속적으로 업데이트하는 데에 적합한 도구이다.

정리 로직이 필요하지 않으며, composition 마다 한 번씩 실행된다는 점이 특징이다.

### currentRecomposeScope

#### 개요

currentRecomposeScope는 전통적인 View.invalidate()와 유사한 역할을 하는 도구이다. 이는 **컴포지션을 명시적으로 무효화**하여 재구성을 강제할 수 있다. 자체적으로 effect handler는 아니지만, 컴포지션과 관련된 중요한 도구이므로 다루게 된다.

#### 작동 방식

- invalidate()를 호출하면 해당 scope에 한해 컴포지션을 무효화하고 다시 수행하도록 한다. 
- 이는 Compose의 상태 시스템(State snapshot)을 사용하지 않을 때 유용하다.
    
#### 인터페이스

```kotlin
interface RecomposeScope {
    fun invalidate()
}
```

#### 예시

```kotlin
interface Presenter {
    fun loadUser(after: @Composable () -> Unit): User
}

@Composable
fun MyComposable(presenter: Presenter) {
    val user = presenter.loadUser {
        currentRecomposeScope.invalidate() // 재구성 강제
    }

    Text("The loaded user: ${user.name}")
}
```

#### 사용 시 주의점

- 이 방식은 매우 특수한 상황에서만 사용해야 하며, 일반적으로는 Compose의 State를 사용하는 것이 더 바람직하다. 
- State를 사용하면 Compose가 변경 사항을 자동으로 감지하고 스마트하게 재구성을 수행할 수 있다. 
- 프레임 기반 애니메이션 등에서 필요한 경우에는 공식 문서를 참고하여 적절한 API를 사용하는 것이 좋다.
    
#### 요약

- currentRecomposeScope는 외부 상태 변화에 따라 명시적으로 recomposition을 트리거할 수 있게 해주는 도구이다. 
- 일반적인 상황에서는 Compose의 상태 시스템(State)을 사용하는 것이 더 안전하고 효율적이다.
    

## Suspended effects

### rememberCoroutineScope

#### 설명

- composition 생명주기에 바인딩된 CoroutineScope를 생성한다. 
- 이 scope를 사용해 suspend 함수 기반 이펙트를 실행할 수 있다. 
- composition에서 벗어나면 scope도 자동으로 취소된다. 
- 동일한 composition 안에서는 동일한 scope가 재사용된다.
    
#### 사용 용도

- 유저 인터랙션에 반응해 작업을 실행할 때 사용 
- dispatcher는 일반적으로 AndroidUiDispatcher.Main
    
#### 예시

```kotlin
@Composable
fun SearchScreen() {
    val scope = rememberCoroutineScope()
    var currentJob by remember { mutableStateOf<Job?>(null) }
    var items by remember { mutableStateOf<List<Item>>(emptyList()) }

    Column {
        Row {
            TextField("Start typing to search", onValueChange = { text ->
                currentJob?.cancel()
                currentJob = scope.async {
                    delay(threshold)
                    items = viewModel.search(query = text)
                }
            })
        }
        Row {
            ItemsVerticalList(items)
        }
    }
}
```

  

### LaunchedEffect

### 설명

- composition 진입 시 실행되는 suspend 이펙트 
- composition에서 벗어날 때 자동으로 취소됨 
- key가 바뀔 때마다 취소되고 재실행됨 
- recomposition을 넘어 job을 유지할 수 있음
    
### 특징

- 최소 하나의 key가 필요함 
- dispatcher는 보통 AndroidUiDispatcher.Main
    
### 예시

```kotlin
@Composable
fun SpeakerList(eventId: String) {
    var speakers by remember { mutableStateOf<List<Speaker>>(emptyList()) }

    LaunchedEffect(eventId) {
        speakers = viewModel.loadSpeakers(eventId)
    }

    ItemsVerticalList(speakers)
}
```


### produceState

#### 설명

- LaunchedEffect 위에 얹힌 문법적 설탕(syntax sugar) 
- 상태(state)를 생성하고 유지하며, 그 상태는 외부 UI에서 관찰 가능 
- 대부분의 경우 LaunchedEffect로 상태를 업데이트하는 상황에서 사용
    
#### 특징

- 기본값과 key를 지정할 수 있음 
- key가 없으면 내부적으로 LaunchedEffect(Unit)으로 동작하며, composition을 넘어 job이 유지됨
    
#### 예시

```kotlin
@Composable
fun SearchScreen(eventId: String) {
    val uiState = produceState(initialValue = emptyList<Speaker>(), eventId) {
        value = viewModel.loadSpeakers(eventId)
    }

    ItemsVerticalList(uiState.value)
}
```

# Third party library adapters


Jetpack Compose에서는 Observable, Flow, LiveData 등 외부 라이브러리에서 제공하는 데이터 스트림을 사용해야 할 경우가 많다. 이를 위해 Compose는 각각에 맞는 **adapter**들을 제공한다.

## 주요 의존성

```gradle
implementation "androidx.compose.runtime:runtime:$compose_version" // Flow 포함
implementation "androidx.compose.runtime:runtime-livedata:$compose_version"
implementation "androidx.compose.runtime:runtime-rxjava2:$compose_version"
```

## 작동 방식

- 이 adapter들은 모두 내부적으로 **effect handler**에 위임된다. 
- 각 adapter는 외부 데이터 스트림에 옵저버를 등록하고, 전달받은 값을 MutableState로 매핑한다. 
- 이 MutableState는 외부에서 State로 노출된다.


### 예시 - LiveData

```kotlin
class MyComposableVM : ViewModel() {
    private val _user = MutableLiveData(User("John"))
    val user: LiveData<User> = _user
}

@Composable
fun MyComposable() {
    val viewModel = viewModel<MyComposableVM>()
    val user by viewModel.user.observeAsState()

    Text("Username: ${user?.name}")
}
```

- observeAsState()는 내부적으로 DisposableEffect를 사용해 구현됨

### 예시 - RxJava2

```kotlin
class MyComposableVM : ViewModel() {
    val user: Observable<ViewState> = Observable.just(ViewState.Loading)
}

@Composable
fun MyComposable() {
    val viewModel = viewModel<MyComposableVM>()
    val state by viewModel.user.subscribeAsState(ViewState.Loading)

    when (state) {
        ViewState.Loading -> TODO("Show loading")
        ViewState.Error -> TODO("Show error")
        is ViewState.Content -> TODO("Show content")
    }
}
```

- subscribeAsState()는 RxJava2 외에도 Flowable 등에 확장되어 있음
    

### 예시 - KotlinX Coroutines Flow

```kotlin
class MyComposableVM : ViewModel() {
    val user: Flow<ViewState> = flowOf(ViewState.Loading)
}

@Composable
fun MyComposable() {
    val viewModel = viewModel<MyComposableVM>()
    val uiState by viewModel.user.collectAsState(ViewState.Loading)

    when (uiState) {
        ViewState.Loading -> TODO("Show loading")
        ViewState.Error -> TODO("Show snackbar")
        is ViewState.Content -> TODO("Show content")
    }
}
```

- collectAsState()는 Flow를 suspend context에서 처리해야 하므로 produceState를 내부적으로 사용한다. 
- 결국 이 또한 LaunchedEffect에 위임된다.

## 요약

- Compose는 다양한 외부 데이터 스트림을 위한 어댑터를 제공한다. 
- 이 어댑터들은 대부분 DisposableEffect, LaunchedEffect, produceState 등 Compose 내부 이펙트 핸들러에 의존한다. 
- 동일한 패턴을 따르며 커스텀 라이브러리도 쉽게 확장 가능하다.
    

