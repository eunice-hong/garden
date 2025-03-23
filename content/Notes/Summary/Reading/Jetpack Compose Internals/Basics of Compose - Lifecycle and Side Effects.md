---
title: "Basics of Compose: Lifecycle and Side Effects"
description: Jetpack Compose의 생애 주기와 부수효과에 대해 알아봅니다.
date: 2025-02-03T22:00:00
draft: false
noindex: true
tags:
  - JetpackCompose
---

# Jetpack Compose 생애 주기와 부수효과

안녕하세요! 오늘은 **Jetpack Compose의 생애 주기**에 대해 설명하겠습니다.  
컴포지션과 리컴포지션의 개념을 이해하고, **성능 최적화 방법**까지 다루겠습니다.

## 생애 주기 개요

Jetpack Compose는 UI를 **컴포지션(Composition)** 으로 구성하고,  
앱의 상태가 변경될 때 **리컴포지션(Recomposition)** 을 수행하여 UI를 업데이트합니다.

![Compose Lifecycle](https://developer.android.com/static/develop/ui/compose/images/lifecycle-composition.png?hl=ko)

- **컴포지션(Composition)**: UI를 정의하는 **컴포저블 트리** 생성
- **리컴포지션(Recomposition)**: 변경된 **UI 요소만 업데이트**
- **성능 최적화의 핵심**: 불필요한 리컴포지션을 줄이는 것

## 컴포지션의 흐름

1. **초기 컴포지션**: UI가 처음 생성될 때 실행됨
2. **리컴포지션**: 상태가 변경될 때, 필요한 UI 요소만 업데이트됨
3. **컴포지션 종료**: 더 이상 필요 없는 UI 요소가 제거됨

```kotlin
@Composable
fun MyComposable() {
    Column {
        Text("Hello")
        Text("World")
    }
}
```

이 개념을 이해하면 **불필요한 리컴포지션을 줄여서 성능을 최적화할 수 있습니다.**
예제 코드에서 **MyComposable()이 실행될 때, Column 내부의 Text 요소들이 초기 컴포지션됩니다.**

## 상태 변화와 리컴포지션

리컴포지션은 일반적으로 State<T\> 객체가 변경될 때 트리거됩니다.

```kotlin
@Composable
fun LoginScreen(showError: Boolean) {
    if (showError) {
        LoginError()
    }
    LoginInput()
}
```

- showError 값이 **true**일 때만 LoginError()가 실행됨
- LoginInput()은 **항상 호출**되므로 상태 변화와 관계없이 유지됨
- 이렇게 하면 **불필요한 리컴포지션을 방지**할 수 있음

## 리스트에서의 리컴포지션

컴포저블이 리스트 내에서 여러 번 호출되면 각 호출은 **고유한 인스턴스**를 생성합니다.

```kotlin
@Composable
fun MoviesScreen(movies: List<Movie>) {
    Column {
        for (movie in movies) {
            MovieOverview(movie)
        }
    }
}
```

- **목록의 하단**에 요소가 추가되면 기존 요소는 유지됨 ✅
- **목록의 중간**에 요소가 추가되면 **모든 요소가 리컴포지션됨** ❌
- 이를 방지하려면 **key()를 사용해야 함**

## key()를 활용한 최적화

리스트 내 컴포저블을 **key()** 로 구분하면 **불필요한 리컴포지션을 방지**할 수 있습니다.

```kotlin
@Composable
fun MoviesScreenWithKey(movies: List<Movie>) {
    Column {
        for (movie in movies) {
            key(movie.id) {
                MovieOverview(movie)
            }
        }
    }
}
```

- key(movie.id)를 사용하면 **기존 요소를 재사용**할 수 있음
- **리스트가 변경될 때 순서가 바뀌어도** 이전 상태를 유지
- 성능 최적화를 위해 필수적인 기법!

# Compose 렌더링 3단계 (Phases)

![The three phases in which Compose transforms data into UI.](https://developer.android.com/static/develop/ui/compose/images/compose-phases.png)

1. **컴포지션(Composition)**: UI를 선언하고 구성
2. **레이아웃(Layout)**: UI 요소의 위치와 크기 결정
3. **그리기(Draw)**: 화면에 UI를 실제로 렌더링

이 **3단계 구조**를 이해하면 **상태를 어느 단계에서 읽어야 하는지** 알 수 있습니다.

- 상태를 **컴포지션에서 읽으면** 전체가 리컴포지션됨
- 상태를 **레이아웃 단계에서 읽으면** 크기 변경 시에만 업데이트됨
- 상태를 **그리기 단계에서 읽으면** 색상 같은 시각적 요소만 변경됨

### 1. 컴포지션 단계 (Composition)

- UI의 구조를 정의하는 단계
- `@Composable` 함수가 실행되며, UI 트리가 생성됨

```kotlin
val padding by remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    // The `padding` state is read in the composition phase
    // when the modifier is constructed.
    // Changes in `padding` will invoke recomposition.
    modifier = Modifier.padding(padding)
)
```

컴포지션 단계에서는 UI를 선언하는 **컴포저블 함수**가 실행됩니다.  
이 과정에서 Compose는 UI 요소들의 트리를 만들고, 상태를 추적합니다.

### 2. 레이아웃 단계 (Layout)

- UI 요소의 크기와 위치를 결정
- UI 트리를 바탕으로 레이아웃이 계산됨

```kotlin
var offsetX by remember { mutableStateOf(8.dp) }
Text(
    text = "Hello",
    modifier = Modifier.offset {
        // The `offsetX` state is read in the placement step
        // of the layout phase when the offset is calculated.
        // Changes in `offsetX` restart the layout.
        IntOffset(offsetX.roundToPx(), 0)
    }
)
```

레이아웃 단계에서는 컴포넌트의 **크기와 배치 위치**를 계산합니다.  
이 단계에서 상태를 읽으면 **레이아웃이 변경될 때만 재계산**됩니다.

### 3. 그리기 단계 (Draw)

- 실제 화면에 UI를 렌더링하는 단계
- `Canvas` 또는 `Modifier.drawBehind` 등을 사용하여 그래픽을 직접 그림

```kotlin
var color by remember { mutableStateOf(Color.Red) }
Canvas(modifier = modifier) {
    // The `color` state is read in the drawing phase
    // when the canvas is rendered.
    // Changes in `color` restart the drawing.
    drawRect(color)
}
```

그리기 단계는 UI를 **화면에 실제로 렌더링하는 과정**입니다.  
이 단계에서 상태를 읽으면 **색상 변경 같은 시각적 요소만 업데이트됩니다.**

# 부수 효과 (Side Effects)

컴포저블은 **부수 효과(Side Effects)** 없이 동작하는 것이 이상적이지만,

API 요청이나 네트워크 호출이 필요한 경우 **Effect API를 활용**해야 합니다.

부수 효과란 **컴포저블의 수명 주기와 관계없이 발생하는 작업**을 의미합니다.
이러한 작업을 적절하게 관리하는 것이 중요합니다.

## LaunchedEffect

LaunchedEffect는 특정 키 값이 변경될 때 **한 번만 실행되는** 정지 함수를 실행합니다.

```kotlin
LaunchedEffect(pulseRateMs) {
    while (isActive) {
        delay(pulseRateMs)
        alpha.animateTo(0f)
        alpha.animateTo(1f)
    }
}
```

- pulseRateMs 값이 변경되면 기존 코루틴이 **취소**되고 **새로운 코루틴이 실행됨**
- UI의 생명 주기와 연결되지 않으므로 **컴포지션이 종료되면 자동으로 정리됨**

## DisposableEffect

DisposableEffect는 **컴포저블이 사라질 때 정리해야 하는 리소스**가 있을 때 사용합니다.

```kotlin
DisposableEffect(lifecycleOwner) {
    val observer = LifecycleEventObserver { _, event ->
        if (event == Lifecycle.Event.ON_START) {
            onStart()
        } else if (event == Lifecycle.Event.ON_STOP) {
            onStop()
        }
    }

    lifecycleOwner.lifecycle.addObserver(observer)

    onDispose {
        lifecycleOwner.lifecycle.removeObserver(observer)
    }
}
```

- onDispose 블록에서 **LifecycleObserver**를 제거하여 메모리 누수를 방지할 수 있음
- API 요청, 센서 이벤트 리스너 등 **정리가 필요한 작업**에서 유용함

## SideEffect

SideEffect는 **Compose 상태를 Compose 외부의 코드와 동기화할 때** 사용됩니다.  
Compose 내부의 상태가 변경될 때마다 실행됩니다.

```kotlin
@Composable
fun rememberFirebaseAnalytics(user: User): FirebaseAnalytics {
    val analytics: FirebaseAnalytics = remember { FirebaseAnalytics() }

    SideEffect {
        analytics.setUserProperty("userType", user.userType)
    }

    return analytics
}
```

- **SideEffect는 리컴포지션이 발생할 때마다 실행됨**
- 위 코드에서는 user.userType이 변경될 때마다 애널리틱스 값을 업데이트
- 외부 API와 Compose 상태를 연결할 때 사용 가능

## rememberCoroutineScope

컴포저블 외부에서 **코루틴을 실행할 수 있는 범위를 제공하는 API**입니다.

```kotlin
@Composable
fun MoviesScreen(snackbarHostState: SnackbarHostState) {
    val scope = rememberCoroutineScope()

    Scaffold(
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) }
    ) { contentPadding ->
        Column(Modifier.padding(contentPadding)) {
            Button(
                onClick = {
                    scope.launch {
                        snackbarHostState.showSnackbar("Something happened!")
                    }
                }
            ) {
                Text("Press me")
            }
        }
    }
}
```

- rememberCoroutineScope()는 컴포지션과 연결된 **코루틴 스코프**를 제공
- 이벤트 핸들러에서 비동기 작업을 실행할 때 사용
- **LaunchedEffect와 차이점**: LaunchedEffect는 자동 실행, rememberCoroutineScope()는 직접 호출 필요

## rememberUpdatedState

**값이 변경되더라도 다시 시작되지 않도록** 값을 유지하는 데 사용됩니다.

```kotlin
@Composable
fun LandingScreen(onTimeout: () -> Unit) {
    val currentOnTimeout by rememberUpdatedState(onTimeout)

    LaunchedEffect(true) {
        delay(3000)
        currentOnTimeout()
    }
}
```

- rememberUpdatedState를 사용하면 **람다가 변경되더라도 기존 코루틴을 다시 시작하지 않음**
- LaunchedEffect(true)는 **최초 한 번 실행되며, 이후 값 변경에 영향받지 않음**
- **긴 작업 중에 최신 값을 유지**해야 할 때 유용

## produceState

Compose 외부의 비동기 데이터를 **Compose 상태로 변환**하는 API입니다.

```kotlin
@Composable
fun loadNetworkImage(
    url: String,
    imageRepository: ImageRepository = ImageRepository()
): State<Result<Image>> {
    return produceState<Result<Image>>(initialValue = Result.Loading, url, imageRepository) {
        val image = imageRepository.load(url)
        value = if (image == null) Result.Error else Result.Success(image)
    }
}
```

- **외부 데이터를 Compose 상태로 변환**
- produceState는 **컴포지션이 시작될 때 비동기 작업을 실행하고 상태를 반환**
- 네트워크 요청, 데이터베이스 조회 등에 활용 가능

## derivedStateOf

상태 객체를 다른 상태로 변환하는 데 사용됩니다.

**자주 변경되는 상태를 기반으로 새로운 상태를 만들 때 최적화**할 수 있습니다.

```kotlin
@Composable
fun MessageList(messages: List<Message>) {
    val listState = rememberLazyListState()

    LazyColumn(state = listState) {
        items(messages) { message ->
            MessageItem(message)
        }
    }

    val showButton by remember {
        derivedStateOf {
            listState.firstVisibleItemIndex > 0
        }
    }

    AnimatedVisibility(visible = showButton) {
        ScrollToTopButton()
    }
}
```

- listState.firstVisibleItemIndex가 변경될 때마다 모든 컴포저블이 리컴포지션되지 않도록 최적화
- **derivedStateOf를 사용하면 불필요한 UI 업데이트를 방지**
- ScrollToTop 버튼을 **필요할 때만** 표시하는 예제

## snapshotFlow

- `snapshotFlow`를 사용하면 `State<T>` 객체를 **콜드 Flow**로 변환할 수 있습니다.

```kotlin
val listState = rememberLazyListState()

LazyColumn(state = listState) {
    // ...
}

LaunchedEffect(listState) {
    snapshotFlow { listState.firstVisibleItemIndex }
        .map { index -> index > 0 }
        .distinctUntilChanged()
        .filter { it == true }
        .collect {
            MyAnalyticsService.sendScrolledPastFirstItemEvent()
        }
}
```

- `snapshotFlow`를 사용하면 Compose의 `State`를 Flow로 변환하여 **Flow의 연산자(map, distinctUntilChanged, filter 등)를 활용할 수 있음**
- `snapshotFlow`는 수집될 때 블록을 실행하고 그 안에서 읽은 `State` 객체의 값을 반환합니다. 내부에서 읽은 `State` 객체 중 하나라도 변경되면, Flow는 새로운 값을 내보냅니다. 단, **새로운 값이 이전 값과 다를 때만 방출**됩니다. (Flow.distinctUntilChanged()와 유사한 동작)
- 위 코드에서는 사용자가 **리스트의 첫 번째 항목을 지나칠 때** 이벤트가 한 번만 기록됨 (연속적으로 기록되지 않음)
- `distinctUntilChanged()`를 사용하여 동일한 이벤트가 여러 번 발생하는 것을 방지

# 최적화 전략

1. 리컴포지션 최소화
   - key()를 활용하여 리스트 성능 최적화
   - 모든 상태를 **최대한 낮은 단계에서 읽기**
2. 부수 효과 최소화
   - rememberCoroutineScope() 활용하여 **필요할 때만** 코루틴 실행
   - SideEffect를 **외부 API 연동에만 사용**
   - DisposableEffect를 사용해 **리소스 정리 필수**

이러한 전략을 적용하면 **퍼포먼스를 획기적으로 개선할 수 있습니다!**
실제 프로젝트에서도 **불필요한 리컴포지션을 최소화**하는 것이 중요합니다.
