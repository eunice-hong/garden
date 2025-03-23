---
title: "Basics of Compose: State Management"
description: "Jetpack Compose의 상태 관리 및 UI 상태 저장에 대한 개요"
date: 2025-02-17T22:00:00
draft: false
tags:
  - JetpackCompose
---

# Jetpack Compose 상태 관리

## 상태란?

- 앱의 상태는 시간이 지남에 따라 변할 수 있는 값입니다
- Room 데이터베이스부터 클래스 변수까지 포함됩니다
- 모든 Android 앱에서는 상태가 사용자에게 표시됩니다

앱의 상태는 매우 다양한 요소를 포함하며, Jetpack Compose에서는 이를 명시적으로 관리할 수 있습니다.

## 상태 및 구성

- Compose는 선언적 방식으로 UI를 업데이트합니다
- 상태 업데이트 시 재구성이 실행됩니다

```kotlin
@Composable
private fun HelloContent() {
    Column(
	    modifier = Modifier
		    .padding(16.dp)
		) {
		Text(
			text = "Hello!",
			modifier = Modifier.padding(bottom = 8.dp),
			style = MaterialTheme.typography.bodyMedium
		)
		OutlinedTextField(
			value = "",
			onValueChange = { },
			label = { Text("Name") }
		)
    }
}
```

Compose는 명령형 방식이 아닌 선언적 방식으로 UI를 업데이트합니다. 따라서 상태 변화가 UI에 반영되려면 명시적으로 전달해야 합니다. 이 코드를 실행하고 텍스트를 입력하려고 하면 아무 일도 일어나지 않습니다. `TextField`가 자체적으로 업데이트되지 않기 때문입니다. `value` 매개변수가 변경될 때 업데이트됩니다. 이는 Compose에서의 컴포지션 및 리컴포지션 작동 방식 때문입니다.

## 컴포저블의 상태

- `remember` API를 사용하여 메모리에 객체를 저장합니다
- `mutableStateOf`를 통해 관찰 가능한 `MutableState<T>`를 생성합니다

```kotlin
var name by remember { mutableStateOf("") }
```

remember를 활용하면 리컴포지션 중에도 상태가 유지됩니다. `mutableStateOf`는 상태 변경을 감지하고 UI를 업데이트합니다.

## 상태 호이스팅

- 상태를 컴포저블의 호출자로 이동하여 관리하는 패턴입니다
- 단방향 데이터 흐름을 유지할 수 있습니다

```kotlin
@Composable
fun HelloScreen() {
    var name by rememberSaveable { mutableStateOf("") }
    HelloContent(name = name, onNameChange = { name = it })
}
```

상태를 끌어올리면 UI와 상태 관리 로직이 분리되어 재사용성이 높아집니다.

## Compose에서 상태 복원

- `rememberSaveable`을 사용하여 상태를 유지합니다
- 리컴포지션뿐만 아니라 활동 재생성 및 프로세스 종료 후에도 상태를 보존할 수 있습니다

```kotlin
var userTypedQuery by rememberSaveable(typedQuery, stateSaver = TextFieldValue.Saver) {
    mutableStateOf(TextFieldValue(text = typedQuery, selection = TextRange(typedQuery.length)))
}
```

`rememberSaveable`은 `Bundle`에 저장할 수 있는 데이터만 자동 저장됩니다. 복원 가능한 데이터 구조를 고려해야 합니다.

## 상태 홀더

- 상태가 많아지면 상태 홀더 클래스를 사용하여 관리합니다
- UI 로직과 상태 로직을 분리할 수 있습니다

```kotlin
@Composable
private fun rememberMyAppState(windowSizeClass: WindowSizeClass): MyAppState {
    return remember(windowSizeClass) { MyAppState(windowSizeClass) }
}
```

상태 홀더를 사용하면 UI와 상태 관리가 분리되어 유지보수가 용이해집니다.

# 상태 호이스팅

## 상태를 호이스팅할 대상 위치

- UI 상태는 UI 로직과 비즈니스 로직 중 어느 쪽에서 필요한지에 따라 호이스팅 위치를 결정합니다
- UI 상태를 읽고 쓰는 모든 컴포저블의 **가장 낮은 공통 상위 요소**로 호이스팅해야 합니다
- 상태 소유자로부터 소비자에게 변경 불가능한 상태 및 이벤트를 노출하여 상태를 수정합니다

상태를 적절히 호이스팅하면 코드의 재사용성과 유지보수성이 향상됩니다

## UI 상태 및 로직

- **UI 상태**: UI를 설명하는 속성입니다
  - 화면 UI 상태: UI를 렌더링하는 데 필요한 데이터를 포함합니다
  - UI 요소 상태: UI 요소 자체의 상태입니다 (예: 버튼 클릭 여부)
- **로직**
  - 비즈니스 로직: 앱 데이터에 대한 제품 요구사항을 구현합니다
  - UI 로직: UI 상태를 표시하는 방법과 관련됩니다

UI 상태와 로직을 분리하면 코드 가독성이 좋아지고 유지보수성이 향상됩니다

## UI 로직에서의 상태 호이스팅

- UI 상태를 읽거나 써야 하는 경우 UI 수명 주기에 따라 상태 범위를 지정해야 합니다
- 상태 소유자로서의 **컴포저블**
  - 상태와 로직이 단순하면 컴포저블에 UI 로직과 UI 요소 상태를 포함할 수 있습니다
  - 단순한 상태는 내부에서 유지할 수 있습니다 (예: 애니메이션 상태)

```kotlin
@Composable
fun ChatBubble(message: Message) {
    var showDetails by rememberSaveable { mutableStateOf(false) }
    ClickableText(
        text = AnnotatedString(message.content),
        onClick = { showDetails = !showDetails }
    )
    if (showDetails) {
        Text(message.timestamp)
    }
}
```

단순한 UI 요소 상태는 컴포저블 내부에서 유지 가능하지만, 다른 컴포저블과 공유할 필요가 있다면 상태를 호이스팅해야 합니다

## 상태를 UI 계층 구조의 상위로 호이스팅하기

- 여러 위치에서 상태를 공유하고 UI 로직을 적용해야 할 경우 상위 컴포저블로 호이스팅합니다
- `LazyColumn` 상태를 `ConversationScreen`으로 호이스팅하여 UI 로직을 적용합니다

```kotlin
@Composable
private fun ConversationScreen() {
    val scope = rememberCoroutineScope()
    val lazyListState = rememberLazyListState()
    MessagesList(messages, lazyListState)
    UserInput(
        onMessageSent = {
            scope.launch { lazyListState.scrollToItem(0) }
        }
    )
}
```

상태를 필요로 하는 모든 컴포저블에서 접근할 수 있도록 적절한 수준에서 호이스팅해야 합니다

## ViewModel을 이용한 상태 관리

- 비즈니스 로직이 관련된 경우 ViewModel을 통해 상태를 관리하는 것이 적절합니다
- ViewModel은 컴포지션 외부에 저장되며, UI 상태의 **가장 낮은 공통 상위 요소** 역할을 수행합니다

```kotlin
class ConversationViewModel(channelId: String, messagesRepository: MessagesRepository) : ViewModel() {
    val messages = messagesRepository.getLatestMessages(channelId)
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    fun sendMessage(message: Message) { /* ... */ }
}
```

ViewModel을 사용하면 상태가 유지되며, UI 상태와 비즈니스 로직을 분리할 수 있습니다

## UI 요소 상태와 비즈니스 로직

- UI 요소 상태를 읽거나 써야 하는 비즈니스 로직이 있다면 ViewModel에서 상태를 관리합니다
- 사용자의 입력에 따라 UI 상태를 변경하는 예시:

```kotlin
class ConversationViewModel : ViewModel() {
    var inputMessage by mutableStateOf("")
        private set
    val suggestions: StateFlow<List<Suggestion>> =
        snapshotFlow { inputMessage }
            .filter { hasSocialHandleHint(it) }
            .mapLatest { getHandle(it) }
            .mapLatest { repository.getSuggestions(it) }
            .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), emptyList())
    fun updateInput(newInput: String) { inputMessage = newInput }
}
```

UI 요소 상태가 비즈니스 로직에 필요하지 않다면 컴포저블 내부에서 유지하는 것이 좋습니다

## 정지 함수와 상태 관리

- Compose UI 요소 상태의 일부 정지 함수는 `CoroutineScope`를 올바르게 지정해야 합니다
- `viewModelScope`에서 실행하면 예외가 발생할 수 있으므로 `rememberCoroutineScope()`를 사용합니다

```kotlin
fun closeDrawer(uiScope: CoroutineScope) {
    viewModelScope.launch {
        withContext(uiScope.coroutineContext) {
            drawerState.close()
        }
    }
}
```

애니메이션을 트리거하는 정지 함수는 컴포지션으로 범위 지정된 `CoroutineScope`를 사용해야 오류를 방지할 수 있습니다

# Compose에 UI 상태 저장

note:

- 상태가 호이스팅된 위치와 필요한 로직에 따라 적절한 API를 사용합니다
- 활동 또는 프로세스 재생성 후에도 UI 상태를 유지하는 것이 중요합니다
- 사용자 입력 및 탐색 관련 상태 유지를 권장합니다
- 상태가 손실될 수 있는 이벤트에는 구성 변경 및 시스템에서 시작된 프로세스 종료가 포함됩니다

## UI 로직에서 상태 저장

- `rememberSaveable`을 사용하여 상태를 유지합니다
- 구성 변경 및 프로세스 종료 후에도 UI 요소 상태를 복원할 수 있습니다

```kotlin
@Composable
fun ChatBubble(message: Message) {
    var showDetails by rememberSaveable { mutableStateOf(false) }
    ClickableText(
        text = AnnotatedString(message.content),
        onClick = { showDetails = !showDetails }
    )
    if (showDetails) {
        Text(message.timestamp)
    }
}
```

`rememberSaveable`은 `Bundle`을 사용하여 UI 상태를 저장하며, 기본 유형은 자동 저장됩니다

## LazyListState 저장

- `rememberSaveable`을 사용하여 `LazyListState`를 유지합니다
- 스크롤 위치 등의 상태를 저장하고 복원할 수 있습니다

```kotlin
@Composable
fun rememberLazyListState(
    initialFirstVisibleItemIndex: Int = 0,
    initialFirstVisibleItemScrollOffset: Int = 0
): LazyListState {
    return rememberSaveable(saver = LazyListState.Saver) {
        LazyListState(initialFirstVisibleItemIndex, initialFirstVisibleItemScrollOffset)
    }
}
```

리스트의 스크롤 위치를 유지하려면 `LazyListState.Saver`를 사용합니다

## ViewModel을 이용한 상태 저장

- `ViewModel`을 사용하면 구성 변경 후에도 상태가 유지됩니다
- `SavedStateHandle`을 활용하여 시스템 종료 후에도 상태를 복원할 수 있습니다

```kotlin
class ConversationViewModel(
    savedStateHandle: SavedStateHandle
) : ViewModel() {
    var message by savedStateHandle.saveable(stateSaver = TextFieldValue.Saver) {
        mutableStateOf(TextFieldValue(""))
    }
        private set

    fun update(newMessage: TextFieldValue) {
        message = newMessage
    }
}
```

`SavedStateHandle`을 사용하면 최소한의 상태를 저장하여 복원할 수 있습니다

## StateFlow를 사용한 상태 저장

- `getStateFlow()`를 사용하여 상태를 저장합니다
- `StateFlow`를 활용하여 지속적으로 UI 상태를 업데이트할 수 있습니다

```kotlin
private const val CHANNEL_FILTER_SAVED_STATE_KEY = "ChannelFilterKey"

class ChannelViewModel(
    channelsRepository: ChannelsRepository,
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    private val savedFilterType: StateFlow<ChannelsFilterType> =
        savedStateHandle.getStateFlow(
            key = CHANNEL_FILTER_SAVED_STATE_KEY,
            initialValue = ChannelsFilterType.ALL_CHANNELS
        )

    fun setFiltering(requestType: ChannelsFilterType) {
        savedStateHandle[CHANNEL_FILTER_SAVED_STATE_KEY] = requestType
    }
}
```

`StateFlow`를 사용하면 최신 상태를 지속적으로 추적할 수 있으며, `SavedStateHandle`에 저장하여 복원할 수 있습니다

## UI 상태 저장 요약

| 이벤트                          | UI 로직            | `ViewModel`의 비즈니스 로직 |
| ------------------------------- | ------------------ | --------------------------- |
| 구성 변경                       | `rememberSaveable` | 자동                        |
| 시스템에서 시작된 프로세스 종료 | `rememberSaveable` | `SavedStateHandle`          |

번들(`rememberSaveable`, `SavedStateHandle`)을 사용하여 적은 양의 UI 상태를 저장해야 하며, 대용량 데이터는 로컬 저장소를 활용해야 합니다

## Compose의 UI 개념

- Compose의 UI는 불변(Immutable)하며 직접 업데이트할 수 없습니다
- UI 상태를 제어하여 UI를 변경합니다
- 상태가 변경되면 Compose는 변경된 UI 트리 부분을 다시 생성합니다
- 컴포저블은 상태를 수락하고 이벤트를 노출할 수 있습니다

```kotlin
var name by remember { mutableStateOf("") }
OutlinedTextField(
    value = name,
    onValueChange = { name = it },
    label = { Text("Name") }
)
```

Compose에서 상태를 관리하는 방법을 설명하고, UI가 직접 변경되지 않는다는 점을 강조합니다.

# 단방향 데이터 흐름 (UDF)

![](https://developer.android.com/static/develop/ui/compose/images/state-unidirectional-flow.png)
note:

- 상태는 아래로 이동하고 이벤트는 위로 이동합니다
- UI 상태를 표시하는 컴포저블과 상태를 저장하는 앱의 부분을 분리합니다

1. 이벤트 발생 (예: 버튼 클릭, 사용자 입력 등)
2. 상태 업데이트 (ViewModel에서 상태 변경)
3. UI에 상태 반영

## Jetpack Compose의 단방향 데이터 흐름

- `TextField`의 `value` 매개변수와 `onValueChange` 콜백을 활용합니다
- `State` 객체를 사용해 상태 변경 시 리컴포지션을 트리거합니다
- `remember`와 `rememberSaveable`을 사용해 상태를 유지할 수 있습니다

Compose에서 단방향 데이터 흐름이 어떻게 적용되는지를 코드 예제와 함께 설명합니다.

## ViewModel과 Compose의 상태 관리

- `ViewModel`을 활용하여 상태를 관리하고 이벤트를 처리합니다
- `mutableStateOf`를 사용하여 UI 상태를 저장합니다

```kotlin
class MyViewModel : ViewModel() {
    private val _uiState = mutableStateOf<UiState>(UiState.SignedOut)
    val uiState: State<UiState> get() = _uiState
}
```

ViewModel을 활용하여 상태를 어떻게 유지하고 변경하는지 설명합니다.

# Jetpack Compose 아키텍처 레이어링

![](https://developer.android.com/static/develop/ui/compose/images/layering-major-layers.svg)

Jetpack Compose의 각 레이어가 어떤 역할을 하는지 설명합니다.

- **runtime**: Compose의 기초입니다(`remember`, `mutableStateOf` 등)
- **UI**: 입력 핸들러, 맞춤 레이아웃, 그리기 기능을 제공합니다
- **Foundation**: 디자인 시스템에 구애받지 않는 컴포넌트를 제공합니다 (`Row`, `Column`, `LazyColumn` 등)
- **Material**: 머티리얼 디자인 시스템의 구현 및 테마를 지원합니다

# `CompositionLocal`

note:
오늘은 Jetpack Compose의 `CompositionLocal`에 대해 이야기하겠습니다. `CompositionLocal`은 데이터를 암시적으로 UI 트리 전체에 전달하는 도구로, UI 설계에서 매우 유용한 패턴입니다.

## CompositionLocal 소개

- 일반적으로 Compose에서 데이터는 UI 트리를 따라 아래로 흐릅니다
- 그러나 일부 데이터(예: 테마, 언어 설정 등)는 매번 명시적으로 전달하기 번거롭습니다
- 이를 해결하기 위해 `CompositionLocal`을 사용합니다

Compose에서는 데이터가 UI 트리를 따라 흐르는데, 색상, 테마 같은 공통 데이터는 계속 전달하기가 불편합니다. `CompositionLocal`을 사용하면 이러한 데이터를 암시적으로 전달할 수 있습니다.

## CompositionLocal 예제

```kotlin
@Composable
fun SomeTextLabel(labelText: String) {
    Text(
        text = labelText,
        color = MaterialTheme.colorScheme.primary
    )
}
```

note:

위 코드에서 MaterialTheme.colorScheme.primary는 CompositionLocal을 통해 값을 가져옵니다. 즉, MaterialTheme의 colorScheme이 어디에 정의되어 있든 자동으로 참조됩니다.

## CompositionLocal의 동작 방식

• CompositionLocal 인스턴스는 UI 트리에서 가장 가까운 제공된 값을 사용합니다
• CompositionLocalProvider를 사용해 특정 UI 계층에서 다른 값을 제공할 수 있습니다
• 값을 변경하면 해당 값을 읽는 부분만 다시 구성됩니다

note:

CompositionLocal은 컴포지션을 통해 데이터를 전달합니다. 만약 CompositionLocalProvider를 사용해 값을 변경하면, 그 값을 사용하는 부분만 다시 구성됩니다.

## CompositionLocalProvider 사용

```kotlin
CompositionLocalProvider(LocalContentColor provides Color.Red) {
    Text("이 텍스트는 빨간색으로 표시됩니다.")
}
```

note:

위 코드에서 LocalContentColor에 빨간색을 설정했습니다. 따라서 이 내부에 있는 Text는 기본적으로 빨간색을 사용하게 됩니다.

## 나만의 CompositionLocal 만들기

```kotlin
val LocalElevations = compositionLocalOf { Elevations() }
```

note:

compositionLocalOf를 사용하면 나만의 CompositionLocal을 만들 수 있습니다. 예를 들어, UI에서 공통적으로 사용되는 높이 값(Elevation)을 관리할 수 있습니다.

## CompositionLocal의 단점

- 암시적으로 데이터를 전달하므로 이해하기 어려울 수 있습니다
- 종속성이 명확하지 않아 디버깅이 어려울 수 있습니다
- 과도하게 사용하면 코드 가독성이 떨어질 수 있습니다

note:
CompositionLocal은 강력한 도구이지만, 남용하면 코드 가독성이 나빠질 수 있습니다. 특히 너무 많은 값을 CompositionLocal로 전달하면 관리가 어려워질 수 있습니다.

## CompositionLocal 사용 여부 결정

✅ 사용할 때

- 앱의 테마, 언어 설정 등 크로스 커팅한 데이터를 전달할 때 사용합니다

❌ 사용하지 않을 때

- 특정 UI 트리에서만 필요한 데이터를 전달할 때는 사용하지 않습니다
- ViewModel과 같은 비즈니스 로직을 전달할 때는 사용하지 않습니다

note:

모든 데이터에 CompositionLocal을 사용하는 것은 좋은 방법이 아닙니다. 특히 ViewModel을 CompositionLocal로 전달하는 것은 피해야 합니다.

## 고려할 대안

**1. 명시적 매개변수 전달**

```kotlin
@Composable
fun MyDescendant(data: DataToDisplay) {
    Text(text = data.title)
}
```

**2. 컨트롤 역전(Inversion of Control)**

```kotlin
@Composable
fun ReusableLoadDataButton(onLoadClick: () -> Unit) {
    Button(onClick = onLoadClick) {
        Text("Load data")
    }
}
```

note:
CompositionLocal 대신, 필요한 데이터만 명시적으로 전달하거나, onLoadClick과 같은 이벤트 핸들러를 활용하면 코드의 재사용성이 더 높아질 수 있습니다.

- CompositionLocal은 데이터를 UI 트리를 통해 암시적으로 전달하는 도구입니다
- 테마나 전역적인 상태에는 유용하지만, 남용하면 코드 가독성이 나빠질 수 있습니다
- 명시적 매개변수 전달이나 컨트롤 역전과 같은 대안을 고려해야 합니다
