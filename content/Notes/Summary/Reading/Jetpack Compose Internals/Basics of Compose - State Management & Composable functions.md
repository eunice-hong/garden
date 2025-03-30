---
title: "Basics of Compose: State Management"
description: Jetpack Compose의 UI 설계 원칙과 단방향 데이터 흐름(UDF), 상태 관리, ViewModel 활용법을 설명하는 가이드입니다. UI 트리의 재구성 원리를 이해하고, remember와 mutableStateOf를 활용한 상태 유지 방법을 배울 수 있습니다. 또한 Modifier를 활용한 UI 커스터마이징, CompositionLocal을 통한 전역 데이터 전달 방식, 그리고 Modifier.Node를 사용한 맞춤 수정자 구현까지 다룹니다. Compose의 아키텍처를 체계적으로 익히고 최적의 UI 설계를 위한 핵심 개념을 정리합니다.
date: 2025-02-23T22:00:00
draft: true
noindex: false
tags:
  - JetpackCompose
---

# 상태 관리

앱의 상태는 시간이 지남에 따라 변할 수 있는 값입니다. 이는 매우 광범위한 정의로서 Room 데이터베이스부터 클래스 변수까지 모든 항목이 포함됩니다.

모든 Android 앱에서는 사용자에게 상태가 표시됩니다. 다음은 Android 앱 상태의 몇 가지 예입니다.

- 네트워크 연결을 설정할 수 없을 때 표시되는 스낵바
- 블로그 게시물 및 관련 댓글
- 사용자가 클릭하면 버튼에서 재생되는 물결 애니메이션
- 사용자가 이미지 위에 그릴 수 있는 스티커

Jetpack Compose를 사용하면 Android 앱에서 상태를 저장하고 사용하는 위치와 방법을 명시적으로 나타낼 수 있습니다. 이 가이드에서는 상태와 컴포저블 간의 관계, 그리고 보다 손쉬운 상태 처리를 위해 Jetpack Compose에서 제공되는 API에 관해 집중적으로 설명합니다.

## 상태 및 구성

Compose는 선언적이므로 Compose를 업데이트하는 유일한 방법은 새 인수로 동일한 컴포저블을 호출하는 것입니다. 이러한 인수는 UI 상태를 표현합니다. 상태가 업데이트될 때마다 *재구성*이 실행됩니다. 따라서 `TextField`와 같은 항목은 명령형 XML 기반 뷰에서처럼 자동으로 업데이트되지 않습니다. 컴포저블이 새 상태에 따라 업데이트되려면 새 상태를 명시적으로 알려야 합니다.

```
@Composable
private fun HelloContent() {
    Column(modifier = Modifier.padding(16.dp)) {
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

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L53-L67)

이 코드를 실행하고 텍스트를 입력하려고 하면 아무 일도 일어나지 않습니다. `TextField`가 자체적으로 업데이트되지 않기 때문입니다. `value` 매개변수가 변경될 때 업데이트됩니다. 이는 Compose에서의 컴포지션 및 리컴포지션 작동 방식 때문입니다.

**핵심 용어:** **컴포지션:** Jetpack Compose가 컴포저블을 실행할 때 빌드한 UI에 관한 설명

**초기 컴포지션:** 처음 컴포저블을 실행하여 생성된 컴포지션입니다.

**리컴포지션:** 데이터가 변경될 때 컴포지션을 업데이트하기 위해 컴포저블을 다시 실행하는 것을 말합니다.

초기 컴포지션 및 리컴포지션에 관한 자세한 내용은 [Compose 이해](https://developer.android.com/develop/ui/compose/mental-model?hl=ko)를 참고하세요.

## 컴포저블의 상태

구성 가능한 함수는 [`remember`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#remember(kotlin.Function0)>) API를 사용하여 메모리에 객체를 저장할 수 있습니다. `remember`에 의해 계산된 값은 초기 컴포지션 중에 컴포지션에 저장되고 저장된 값은 리컴포지션 중에 반환됩니다. `remember`는 변경 가능한 객체뿐만 아니라 변경할 수 없는 객체를 저장하는 데 사용할 수 있습니다.

**참고:** `remember`는 객체를 컴포지션에 저장하고, `remember`를 호출한 컴포저블이 컴포지션에서 삭제되면 그 객체를 잊습니다.

[`mutableStateOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#mutableStateOf(kotlin.Any,androidx.compose.runtime.SnapshotMutationPolicy)>)는 관찰 가능한 [`MutableState<T>`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState?hl=ko)를 생성하는데, 이는 런타임 시 Compose에 통합되는 관찰 가능한 유형입니다.

```
interface MutableState<T> : State<T> {
    override var value: T
}
```

`value`가 변경되면 `value`를 읽는 구성 가능한 함수의 리컴포지션이 예약됩니다.

컴포저블에서 `MutableState` 객체를 선언하는 데는 세 가지 방법이 있습니다.

- `val mutableState = remember { mutableStateOf(default) }`
- `var value by remember { mutableStateOf(default) }`
- `val (value, setValue) = remember { mutableStateOf(default) }`

이러한 선언은 동일한 것이며 서로 다른 용도의 상태를 사용하기 위한 구문 슈가로 제공됩니다. 작성 중인 컴포저블에서 가장 읽기 쉬운 코드를 생성하는 선언을 선택해야 합니다.

`by` 위임 구문에는 다음 가져오기가 필요합니다.

```
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
```

기억된 값을 다른 컴포저블의 매개변수로 사용하거나 문의 로직으로 사용하여 표시할 컴포저블을 변경할 수 있습니다. 예를 들어 이름이 비어 있는 경우 인사말을 표시하지 않으려면 `if` 문에 상태를 사용합니다.

```kotlin
@Composable
fun HelloContent() {
    Column(modifier = Modifier.padding(16.dp)) {
        var name by remember { mutableStateOf("") }
        if (name.isNotEmpty()) {
            Text(
                text = "Hello, $name!",
                modifier = Modifier.padding(bottom = 8.dp),
                style = MaterialTheme.typography.bodyMedium
            )
        }
        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Name") }
        )
    }
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L72-L89)

`remember`가 재구성 과정 전체에서 상태를 유지하는 데 도움은 되지만 구성 변경 전반에서는 상태가 유지되지 않습니다. 이 경우에는 `rememberSaveable`을 사용해야 합니다. `rememberSaveable`은 `Bundle`에 저장할 수 있는 모든 값을 자동으로 저장합니다. 다른 값의 경우에는 맞춤 Saver 객체를 전달할 수 있습니다.

**주의:** Compose에서 `ArrayList<T>` 또는 `mutableListOf()` 같은 변경 가능 객체를 상태로 사용하면 앱에 잘못되었거나 오래된 데이터가 표시될 수 있습니다. 변경 가능한 객체 중 ArrayList 또는 변경 가능한 데이터 클래스 같은 관찰 불가능한 객체는 Compose에서 관찰할 수 없으며 객체가 변경될 때 리컴포지션을 트리거하지 않습니다. 관찰 불가능하면서 변경 가능한 객체를 사용하는 대신 `State<List<T>>` 및 변경 불가능한 `listOf()` 같은 관찰 가능한 데이터 홀더를 사용하는 것이 좋습니다.

## 지원되는 기타 상태 유형

Compose에서는 상태를 보존하기 위해 `MutableState<T>`를 사용할 필요가 없습니다. Compose는 다른 관찰 가능한 유형을 지원합니다. Compose에서 관찰 가능한 다른 유형을 읽으려면 상태가 변할 때 컴포저블이 자동으로 재구성될 수 있도록 `State<T>`로 변환해야 합니다.

Compose에는 Android 앱에 사용되는 관찰 가능한 일반 유형에서 [`State<T>`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)를 만들 수 있는 함수가 내장되어 있습니다. 이러한 통합을 사용하기 전에 아래에 설명된 대로 적절한 [아티팩트](https://developer.android.com/jetpack/androidx/releases/compose-runtime?hl=ko#declaring_dependencies)를 추가하세요.

- [`Flow`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html): [`collectAsStateWithLifecycle()`](https://developer.android.com/reference/kotlin/androidx/lifecycle/compose/package-summary?hl=ko#extension-functions)
  [`collectAsStateWithLifecycle()`](https://developer.android.com/reference/kotlin/androidx/lifecycle/compose/package-summary?hl=ko#extension-functions)은 수명 주기를 인식하는 방식으로 [`Flow`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html)의 값을 수집하므로 앱에서 앱 리소스를 보존할 수 있습니다. 이는 Compose [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)에서 마지막으로 내보낸 값을 나타냅니다. Android 앱에서 흐름을 수집하는 데 이 API를 사용하는 것이 좋습니다.
  **참고:** `collectAsStateWithLifecycle()` API를 사용하여 Android에서 흐름을 안전하게 수집하는 방법을 자세히 알아보려면 [이 블로그 게시물](https://medium.com/androiddevelopers/consuming-flows-safely-in-jetpack-compose-cde014d0d5a3)을 참고하세요.
  `build.gradle` 파일(2.6.0-beta01 이상이어야 함)에는 다음 [종속 항목](https://developer.android.com/jetpack/androidx/releases/lifecycle?hl=ko)이 필요합니다.

[Kotlin](https://developer.android.com/develop/ui/compose/state?hl=ko#kotlin)[Groovy](https://developer.android.com/develop/ui/compose/state?hl=ko#groovy)

```kotlin
dependencies {
      ...
      implementation("androidx.lifecycle:lifecycle-runtime-compose:2.8.7")
}
```

- [`Flow`](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-flow/index.html): [`collectAsState()`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#(kotlinx.coroutines.flow.StateFlow).collectAsState(kotlin.coroutines.CoroutineContext)>)
  `collectAsState`도 `Flow`에서 값을 수집하여 Compose [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)로 변환한다는 점에서 `collectAsStateWithLifecycle`과 유사합니다.
  플랫폼 제약이 없는 코드에는 Android 전용인 `collectAsStateWithLifecycle` 대신 `collectAsState`를 사용하세요.
  `collectAsState`의 경우 `compose-runtime`에서 사용할 수 있으므로 추가 종속 항목이 필요하지 않습니다.
- [`LiveData`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/livedata/package-summary?hl=ko): [`observeAsState()`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/livedata/package-summary?hl=ko#(androidx.lifecycle.LiveData).observeAsState(kotlin.Any)>)
  `observeAsState()`는 이 [`LiveData`](https://developer.android.com/reference/kotlin/androidx/lifecycle/LiveData?hl=ko)를 관찰하기 시작하고 [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)를 통해 값을 나타냅니다.
  `build.gradle` 파일에는 다음 [종속 항목](https://developer.android.com/jetpack/androidx/releases/compose-runtime?hl=ko)이 필요합니다.

```
dependencies {
      ...
      implementation("androidx.compose.runtime:runtime-livedata:1.7.5")
}
```

- [`RxJava2`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/rxjava2/package-summary?hl=ko): [`subscribeAsState()`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/rxjava2/package-summary?hl=ko#extension-functions)
  `subscribeAsState()`는 RxJava2의 반응형 스트림(예: [`Single`](http://reactivex.io/RxJava/2.x/javadoc/2.0.8/io/reactivex/Single.html), [`Observable`](http://reactivex.io/RxJava/2.x/javadoc/2.0.8/io/reactivex/Observable.html) , [`Completable`](http://reactivex.io/RxJava/2.x/javadoc/2.0.8/io/reactivex/Completable.html))을 Compose [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)로 변환하는 확장 함수입니다.
  `build.gradle` 파일에는 다음 [종속 항목](https://developer.android.com/jetpack/androidx/releases/compose-runtime?hl=ko)이 필요합니다.

[Kotlin](https://developer.android.com/develop/ui/compose/state?hl=ko#kotlin)[Groovy](https://developer.android.com/develop/ui/compose/state?hl=ko#groovy)

```
dependencies {
      ...
      implementation("androidx.compose.runtime:runtime-rxjava2:1.7.5")
}
```

- [`RxJava3`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/rxjava3/package-summary?hl=ko): [`subscribeAsState()`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/rxjava3/package-summary?hl=ko#extension-functions)
  `subscribeAsState()`는 RxJava3의 반응형 스트림(예: [`Single`](http://reactivex.io/RxJava/3.x/javadoc/io/reactivex/rxjava3/core/Single.html), [`Observable`](http://reactivex.io/RxJava/3.x/javadoc/io/reactivex/rxjava3/core/Observable.html) , [`Completable`](http://reactivex.io/RxJava/3.x/javadoc/io/reactivex/rxjava3/core/Completable.html))을 Compose [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko)로 변환하는 확장 함수입니다.
  `build.gradle` 파일에는 다음 [종속 항목](https://developer.android.com/jetpack/androidx/releases/compose-runtime?hl=ko)이 필요합니다.

[Kotlin](https://developer.android.com/develop/ui/compose/state?hl=ko#kotlin)[Groovy](https://developer.android.com/develop/ui/compose/state?hl=ko#groovy)

```
dependencies {
      ...
      implementation("androidx.compose.runtime:runtime-rxjava3:1.7.5")
}
```

**핵심 사항:** Compose는 `State` 객체를 읽어오는 과정에서 자동으로 재구성됩니다. Compose에서 `LiveData`와 같은 관찰 가능한 다른 유형을 사용할 경우 이를 읽어오려면 먼저 `State`로 변환해야 합니다. 컴포저블에서 `LiveData<T>.observeAsState()`와 같은 구성 가능한 확장 함수를 사용하여 유형 전환이 이루어지는지 확인해야 합니다.

**참고:** 이러한 통합으로만 국한되는 것은 아닙니다. 관찰 가능한 다른 유형을 읽어오기 위한 Jetpack Compose용 확장 함수를 빌드할 수도 있습니다. 앱에서 관찰 가능한 맞춤 클래스를 사용하는 경우 [`produceState`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#produceState(kotlin.Any,kotlin.coroutines.SuspendFunction1)>) API를 사용하여 `State<T>`를 생성하도록 변환하세요.

이를 실행하는 방법의 예는 내장 구현 [collectAsStateWithLifecycle](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:lifecycle/lifecycle-runtime-compose/src/main/java/androidx/lifecycle/compose/FlowExt.kt;l=168?q=collectAsStateWithLifecycle&hl=ko)을 참고하세요. Jetpack Compose가 모든 변경사항을 수신하도록 허용하는 모든 객체를 `State<T>`로 변환하고 컴포저블을 통해 읽어올 수 있습니다.

### 스테이트풀(Stateful)과 스테이트리스(Stateless)

`remember`를 사용하여 객체를 저장하는 컴포저블은 내부 상태를 생성하여 컴포저블을 *스테이트풀(Stateful)*로 만듭니다. `HelloContent`는 내부적으로 `name` 상태를 보존하고 수정하므로 스테이트풀(Stateful) 컴포저블의 한 예가 됩니다. 이는 호출자가 상태를 제어할 필요가 없고 상태를 직접 관리하지 않아도 상태를 사용할 수 있는 경우에 유용합니다. 그러나 내부 상태를 갖는 컴포저블은 재사용 가능성이 적고 테스트하기가 더 어려운 경향이 있습니다.

*스테이트리스(Stateless)* 컴포저블은 상태를 갖지 않는 컴포저블입니다. 스테이트리스(Stateless)를 달성하는 한 가지 쉬운 방법은 [상태 호이스팅](https://developer.android.com/develop/ui/compose/state?hl=ko#state-hoisting)을 사용하는 것입니다.

재사용 가능한 컴포저블을 개발할 때는 동일한 컴포저블의 스테이트풀(Stateful) 버전과 스테이트리스(Stateless) 버전을 모두 노출해야 하는 경우가 있습니다. 스테이트풀(Stateful) 버전은 상태를 염두에 두지 않는 호출자에게 편리하며, 스테이트리스(Stateless) 버전은 상태를 제어하거나 끌어올려야 하는 호출자에게 필요합니다.

## 상태 호이스팅

Compose에서 상태 호이스팅은 컴포저블을 스테이트리스(Stateless)로 만들기 위해 상태를 컴포저블의 호출자로 옮기는 패턴입니다. Jetpack Compose에서 상태 호이스팅을 하는 일반적 패턴은 상태 변수를 다음 두 개의 매개변수로 바꾸는 것입니다.

- **`value: T`:** 표시할 현재 값
- **`onValueChange: (T) -> Unit`:** `T`가 제안된 새 값인 경우 값을 변경하도록 요청하는 이벤트

하지만 `onValueChange`로만 제한되지 않습니다. 컴포저블에 더 구체적인 이벤트가 어울리는 경우 람다를 사용하여 그 이벤트를 정의해야 합니다.

이러한 방식으로 끌어올린 상태에는 중요한 속성이 몇 가지 있습니다.

- **단일 정보 소스:** 상태를 복제하는 대신 옮겼기 때문에 정보 소스가 하나만 있습니다. 버그 방지에 도움이 됩니다.
- **캡슐화됨:** 스테이트풀(Stateful) 컴포저블만 상태를 수정할 수 있습니다. 철저히 내부적 속성입니다.
- **공유 가능함:** 호이스팅한 상태를 여러 컴포저블과 공유할 수 있습니다. 다른 컴포저블에서 `name`을 읽으려는 경우 호이스팅을 통해 그렇게 할 수 있습니다.
- **가로채기 가능함:** 스테이트리스(Stateless) 컴포저블의 호출자는 상태를 변경하기 전에 이벤트를 무시할지 수정할지 결정할 수 있습니다.
- **분리됨:** 스테이트리스(Stateless) 컴포저블의 상태는 어디에나 저장할 수 있습니다. 예를 들어 이제는 `name`을 `ViewModel`로 옮길 수 있습니다.

이 예에서는 `HelloContent`에서 `name`과 `onValueChange`를 추출한 다음, 이러한 항목을 트리 상단을 거쳐 `HelloContent`를 호출하는 `HelloScreen` 컴포저블로 옮깁니다.

```kotlin
@Composable
fun HelloScreen() {
    var name by rememberSaveable { mutableStateOf("") }

    HelloContent(name = name, onNameChange = { name = it })
}

@Composable
fun HelloContent(name: String, onNameChange: (String) -> Unit) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "Hello, $name",
            modifier = Modifier.padding(bottom = 8.dp),
            style = MaterialTheme.typography.bodyMedium
        )
        OutlinedTextField(value = name, onValueChange = onNameChange, label = { Text("Name") })
    }
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L95-L112)

`HelloContent`에서 상태를 끌어올리면 더 쉽게 컴포저블을 추론하고 여러 상황에서 재사용하며 테스트할 수 있습니다. `HelloContent`는 상태의 저장 방식과 분리됩니다. 분리된다는 것은 `HelloScreen`을 수정하거나 교체할 경우 `HelloContent`의 구현 방식을 변경할 필요가 없다는 의미입니다.

![](https://developer.android.com/static/develop/ui/compose/images/udf-hello-screen.png?hl=ko)

상태가 내려가고 이벤트가 올라가는 패턴을 *단방향 데이터 흐름*이라고 합니다. 이 경우 상태는 `HelloScreen`에서 `HelloContent`로 내려가고 이벤트는 `HelloContent`에서 `HelloScreen`으로 올라갑니다. 단방향 데이터 흐름을 따르면 UI에 상태를 표시하는 컴포저블과 상태를 저장하고 변경하는 앱 부분을 서로 분리할 수 있습니다.

**핵심 사항:** 상태를 끌어올릴 때 상태의 이동 위치를 쉽게 파악할 수 있는 세 가지 규칙이 있습니다.

1. 상태는 *적어도* 그 상태를 사용하는 모든 컴포저블의 **가장 낮은 공통 상위 요소**로 끌어올려야 합니다(읽기).
2. 상태는 *최소한* **변경될 수 있는 가장 높은 수준**으로 끌어올려야 합니다(쓰기).
3. **동일한 이벤트에 대한 응답으로 두 상태가 변경**되는 경우 두 상태를 **함께 끌어올려야** 합니다.

이러한 규칙에서 요구하는 것보다 상태를 더 높은 수준으로 끌어올릴 수 있습니다. 하지만 상태를 끌어내리면 단방향 데이터 흐름을 따르기가 어렵거나 불가능할 수 있습니다.

자세한 내용은 [상태를 호이스팅할 대상 위치](https://developer.android.com/develop/ui/compose/state-hoisting?hl=ko) 페이지를 참고하세요.

## Compose에서 상태 복원

[`rememberSaveable`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#rememberSaveable(kotlin.Array,androidx.compose.runtime.saveable.Saver,kotlin.String,kotlin.Function0)>) API는 저장된 인스턴스 상태 메커니즘을 사용하여 리컴포지션 전반에서, 그리고 활동 또는 프로세스 재생성 전반에서 상태를 유지하므로 `remember`와 유사하게 동작합니다. 예를 들어 화면이 회전하면 이러한 문제가 발생합니다.

**참고:** 활동이 [사용자에 의해 완전히 닫힌](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#ui-dismissal-user) 경우 `rememberSaveable`는 상태를 유지하지 않습니다. 예를 들어 사용자가 [최근 화면](https://developer.android.com/guide/components/activities/recents?hl=ko)에서 현재 활동을 위로 스와이프하면 상태가 유지되지 않습니다.

### 상태를 저장하는 방법

`Bundle`에 추가되는 모든 데이터 유형은 자동으로 저장됩니다. `Bundle`에 추가할 수 없는 항목을 저장하려는 경우 몇 가지 옵션이 있습니다.

#### Parcelize

가장 간단한 해결 방법은 객체에 [`@Parcelize`](https://github.com/Kotlin/KEEP/blob/master/proposals/extensions/android-parcelable.md) 주석을 추가하는 것입니다. 그러면 객체가 parcelable이 되며 번들로 제공될 수 있습니다. 예를 들어 다음 코드는 parcelable `City` 데이터 유형을 만들어 상태에 저장합니다.

@Parcelize
data class City(val name: String, val country: String) : Parcelable

@Composable
fun CityScreen() {
var selectedCity = rememberSaveable {
mutableStateOf(City("Madrid", "Spain"))
}
}

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L118-L126)

#### MapSaver

어떤 이유로 `@Parcelize`가 적합하지 않을 경우 `mapSaver`를 사용하여 시스템이 `Bundle`에 저장할 수 있는 값 집합으로 객체를 변환하는 고유한 규칙을 정의할 수 있습니다.

```
data class City(val name: String, val country: String)

val CitySaver = run {
    val nameKey = "Name"
    val countryKey = "Country"
    mapSaver(
        save = { mapOf(nameKey to it.name, countryKey to it.country) },
        restore = { City(it[nameKey] as String, it[countryKey] as String) }
    )
}

@Composable
fun CityScreen() {
    var selectedCity = rememberSaveable(stateSaver = CitySaver) {
        mutableStateOf(City("Madrid", "Spain"))
    }
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L132-L148)

#### ListSaver

`listSaver`를 사용하고 색인을 키로 사용하면 맵의 키를 정의할 필요가 없습니다.

```
data class City(val name: String, val country: String)

val CitySaver = listSaver<City, Any>(
    save = { listOf(it.name, it.country) },
    restore = { City(it[0] as String, it[1] as String) }
)

@Composable
fun CityScreen() {
    var selectedCity = rememberSaveable(stateSaver = CitySaver) {
        mutableStateOf(City("Madrid", "Spain"))
    }
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L155-L167)

## Compose의 상태 홀더

간단한 상태 끌어올리기는 구성 가능한 함수 자체에서 관리 가능합니다. 그러나 추적할 상태의 양이 늘어나거나 구성 가능한 함수에서 실행할 로직이 발생하는 경우 로직과 상태 책임을 다른 클래스, 즉 **상태 홀더**에 위임하는 것이 좋습니다.

**핵심 용어:** **상태 홀더**는 컴포저블의 로직과 상태를 관리합니다.

참고로, 다른 자료에서는 상태 홀더를 *호이스팅한 상태 객체* 라고도 합니다.

자세히 알아보려면 [Compose의 상태 끌어올리기](https://developer.android.com/develop/ui/compose/state-hoisting?hl=ko) 문서 또는 더 일반적으로는 아키텍처 가이드의 [상태 홀더 및 UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko) 페이지를 참고하세요.

## 키가 변경될 경우 계산 기억 다시 트리거

[`remember`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#remember(kotlin.Any,kotlin.Any,kotlin.Any,kotlin.Function0)>) API는 [`MutableState`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MutableState?hl=ko)와 함께 자주 사용됩니다.

```kotlin
var name by remember { mutableStateOf("") }
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L174-L174)

여기서 `remember` 함수를 사용하면 리컴포지션 후에도 `MutableState` 값이 유지됩니다.

일반적으로 `remember`는 `calculation` 람다 매개변수를 취합니다. `remember`가 처음 실행되면 `calculation` 람다를 호출하고 그 결과를 저장합니다. 리컴포지션 중에 `remember`는 마지막으로 저장된 값을 반환합니다.

캐싱 상태 외에도 `remember`를 사용하여 초기화하거나 계산하는 데 비용이 많이 드는 객체 또는 작업의 결과를 컴포지션중에 저장할 수도 있습니다. 매 리컴포지션마다 이 계산을 반복하지 않는 것이 좋습니다. 한 가지 예는 비용이 많이 드는 작업인 이 [`ShaderBrush`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ShaderBrush?hl=ko) 객체를 만드는 경우입니다.

```
val brush = remember {
    ShaderBrush(
        BitmapShader(
            ImageBitmap.imageResource(res, avatarRes).asAndroidBitmap(),
            Shader.TileMode.REPEAT,
            Shader.TileMode.REPEAT
        )
    )
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L183-L191)

`remember`는 컴포지션을 종료할 때까지 값을 저장합니다. 하지만 캐시된 값을 무효화하는 방법이 있습니다. `remember` API는 `key` 또는 `keys` 매개변수도 취합니다. *이러한 키 중 하나라도 변경될 경우 다음번에 함수가 재구성될 때* `remember`는 *캐시를 무효화하고 계산 람다 블록을 다시 실행*합니다. 이 메커니즘을 통해 컴포지션 내 객체의 전체 기간을 제어할 수 있습니다. 계산은 기억된 값이 컴포지션을 종료할 때까지가 아니라 입력이 변경될 때까지 유효합니다.

다음 예는 이 메커니즘의 작동 방식을 보여줍니다.

이 스니펫에서 [`ShaderBrush`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ShaderBrush?hl=ko)가 생성되고 `Box` 컴포저블의 배경 페인트로 사용됩니다. `remember`는 앞에서 설명한 대로 [`ShaderBrush`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/ShaderBrush?hl=ko) 인스턴스를 저장합니다. 이 인스턴스를 다시 만드는 데 비용이 많이 들기 때문입니다. `remember`는 `avatarRes`를 선택된 배경 이미지인 `key1` 매개변수로 사용합니다. `avatarRes`가 변경되면 브러시는 새 이미지로 재구성되고 `Box`에 다시 적용됩니다. 이는 사용자가 선택 도구에서 배경으로 할 다른 이미지를 선택할 때 발생할 수 있습니다.

```
@Composable
private fun BackgroundBanner(
    @DrawableRes avatarRes: Int,
    modifier: Modifier = Modifier,
    res: Resources = LocalContext.current.resources
) {
    val brush = remember(key1 = avatarRes) {
        ShaderBrush(
            BitmapShader(
                ImageBitmap.imageResource(res, avatarRes).asAndroidBitmap(),
                Shader.TileMode.REPEAT,
                Shader.TileMode.REPEAT
            )
        )
    }

    Box(
        modifier = modifier.background(brush)
    ) {
        /* ... */
    }
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L196-L217)

다음 스니펫에서는 상태가 [일반 상태 홀더 클래스](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#choose_between_a_viewmodel_and_plain_class_for_a_state_holder) `MyAppState`로 호이스팅됩니다. 이 클래스는 `rememberMyAppState` 함수를 노출하여 `remember`로 클래스의 인스턴스를 초기화합니다. 이러한 함수를 노출하여 리컴포지션에도 유지되는 인스턴스를 만드는 것은 Compose의 일반적인 패턴입니다. `rememberMyAppState` 함수는 `remember`의 `key` 매개변수 역할을 하는 [`windowSizeClass`](https://developer.android.com/reference/kotlin/androidx/compose/material3/windowsizeclass/WindowSizeClass?hl=ko)를 받습니다. 이 매개변수가 변경되면 앱은 최신 값으로 일반 상태 홀더 클래스를 다시 만들어야 합니다. 예를 들어 사용자가 기기를 회전하는 경우 이러한 상황이 발생할 수 있습니다.

```
@Composable
private fun rememberMyAppState(
    windowSizeClass: WindowSizeClass
): MyAppState {
    return remember(windowSizeClass) {
        MyAppState(windowSizeClass)
    }
}

@Stable
class MyAppState(
    private val windowSizeClass: WindowSizeClass
) { /* ... */ }
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L221-L233)

**참고:** 일반 상태 홀더 클래스에 관한 자세한 내용은 [상태 소유자로서의 일반 상태 홀더 클래스](https://developer.android.com/develop/ui/compose/state-hoisting?hl=ko#plain-state) 문서나 [상태 홀더 및 UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko) 문서를 참고하세요.

Compose는 클래스의 [같음](<https://developer.android.com/reference/java/lang/Object?hl=ko#equals(java.lang.Object)>) 구현을 사용하여 키가 변경되었는지 확인하고 저장된 값을 무효화합니다.

**참고:** 언뜻 보기에는 키와 함께 `remember`를 사용하는 것이 [`derivedStateOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#derivedStateOf(kotlin.Function0)>) 같은 다른 Compose API를 사용하는 것과 유사하게 보일 수 있습니다. 차이점에 관한 자세한 내용은 [Jetpack Compose - derivedStateOf를 사용해야 하는 경우](https://medium.com/androiddevelopers/jetpack-compose-when-should-i-use-derivedstateof-63ce7954c11b) 블로그 게시물을 참고하세요.

### 리컴포지션 외에 키와 함께 상태 저장

[`rememberSaveable`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#rememberSaveable(kotlin.Array,androidx.compose.runtime.saveable.Saver,kotlin.String,kotlin.Function0)>) API는 [`Bundle`](https://developer.android.com/reference/android/os/Bundle?hl=ko)에 데이터를 저장할 수 있는 `remember` 코드의 래퍼입니다. 이 API를 사용하면 재구성뿐만 아니라 활동 재생성 및 시스템에서 시작된 프로세스 종료 시에도 상태를 유지할 수 있습니다. `rememberSaveable`는 `remember`가 `keys`를 받는 것과 같은 목적으로 `input` 매개변수를 받습니다. *입력이 변경되면 캐시는 무효화됩니다*. 다음에 함수가 재구성될 경우 `rememberSaveable`는 계산 람다 블록을 다시 실행합니다.

**참고:** API 이름 지정에는 유념해야 할 차이점이 있습니다. `remember` API에서는 매개변수 이름 `keys`를 사용하고 `rememberSaveable`에서는 같은 용도로 `inputs`를 사용합니다. 이러한 매개변수 중 하나라도 변경되면 캐시된 값은 무효화됩니다.

다음 예에서 `rememberSaveable`는 `typedQuery`가 변경될 때까지 `userTypedQuery`를 저장합니다.

```
var userTypedQuery by rememberSaveable(typedQuery, stateSaver = TextFieldValue.Saver) {
    mutableStateOf(
        TextFieldValue(text = typedQuery, selection = TextRange(typedQuery.length))
    )
}
```

[StateOverviewSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/StateOverviewSnippets.kt#L240-L244)

# 상태를 호이스팅할 대상 위치 

bookmark_border

Compose 애플리케이션에서 [UI 상태](https://developer.android.com/topic/architecture/ui-layer?hl=ko#define-ui-state)를 어디로 호이스팅해야 하는지는 UI 상태가 UI 로직과 비즈니스 로직 중 어느 쪽에서 필요한지에 따라 달라집니다. 이 문서에서는 이러한 두 가지 기본 시나리오를 설명합니다.

## 권장사항

UI 상태는 UI 상태를 읽고 쓰는 모든 컴포저블의 **가장 낮은 공통 상위 요소**로 호이스팅해야 합니다. 상태는 상태가 소비되는 위치에서 가장 가까운 곳에 유지해야 합니다. 상태 소유자로부터 소비자에게 변경 불가능한 상태 및 이벤트를 노출하여 상태를 수정합니다.

가장 낮은 공통 상위 요소가 컴포지션 외부에 있을 수도 있습니다. 비즈니스 로직이 관련되어 있기 때문에 `ViewModel`에서 상태를 호이스팅하는 경우를 예로 들 수 있습니다.

이 페이지에서는 이 권장사항 및 주의사항을 자세히 설명합니다.

## UI 상태 및 UI 로직의 유형

다음은 이 문서에서 사용되는 UI 상태 및 로직 유형의 정의입니다.

### UI 상태

[UI 상태](https://developer.android.com/topic/architecture/ui-layer?hl=ko#define-ui-state)는 UI를 설명하는 속성입니다. UI 상태에는 두 가지 유형이 있습니다.

- **화면 UI 상태**: 화면에 표시해야 하는 *항목*입니다. 예를 들어 `NewsUiState` 클래스에는 UI를 렌더링하는 데 필요한 뉴스 기사와 기타 정보가 포함될 수 있습니다. 이 상태는 앱 데이터를 포함하므로 대개 계층 구조의 다른 레이어에 연결됩니다.
- **UI 요소 상태**: 렌더링 방식에 영향을 주는 UI 요소에 고유한 속성을 나타냅니다. UI 요소는 표시하거나 숨길 수 있으며 특정 글꼴이나 글꼴 크기, 글꼴 색상을 적용할 수 있습니다. Android 뷰에서 뷰는 기본적으로 스테이트풀(Stateful)이므로 이 상태 자체를 관리하여 상태를 수정하거나 쿼리하는 메서드를 노출합니다. 텍스트에 관한 [`TextView`](https://developer.android.com/reference/android/widget/TextView?hl=ko) 클래스의 [`get`](<https://developer.android.com/reference/android/widget/TextView?hl=ko#getText()>) 및 [`set`](<https://developer.android.com/reference/android/widget/TextView?hl=ko#setText(java.lang.CharSequence)>) 메서드를 예로 들 수 있습니다. Jetpack Compose에서 상태는 컴포저블의 외부에 있으며 컴포저블 아주 가까이에서 호출 구성 가능한 함수나 상태 홀더로 호이스팅할 수도 있습니다. [`Scaffold`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#Scaffold(androidx.compose.ui.Modifier,androidx.compose.material.ScaffoldState,kotlin.Function0,kotlin.Function0,kotlin.Function1,kotlin.Function0,androidx.compose.material.FabPosition,kotlin.Boolean,kotlin.Function1,kotlin.Boolean,androidx.compose.ui.graphics.Shape,androidx.compose.ui.unit.Dp,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,kotlin.Function1)>) 컴포저블의 [`ScaffoldState`](https://developer.android.com/reference/kotlin/androidx/compose/material/ScaffoldState?hl=ko)를 예로 들 수 있습니다.

### 로직

애플리케이션 로직은 비즈니스 로직 또는 UI 로직일 수 있습니다.

- **비즈니스 로직**은 앱 데이터에 대한 제품 요구사항의 구현입니다. 예를 들어 사용자가 버튼을 탭할 때 뉴스 리더 앱에서 기사를 북마크에 추가합니다. 북마크를 파일이나 데이터베이스에 저장하는 이 로직은 일반적으로 도메인 또는 데이터 레이어에 배치됩니다. 상태 홀더는 일반적으로 노출되는 메서드를 호출하여 이 로직을 이러한 레이어에 위임합니다.
- **UI 로직**은 화면에 UI 상태를 표시하는 *방법*과 관련이 있습니다. 사용자가 카테고리를 선택했을 때 올바른 검색창 힌트를 가져오는 것, 목록의 특정 항목으로 스크롤하는 것, 또는 사용자가 버튼을 클릭할 때 특정 화면으로의 탐색 로직을 예로 들 수 있습니다.

## UI 로직

[UI 로직](https://developer.android.com/topic/architecture/ui-layer?hl=ko#logic-types)에서 상태를 읽거나 써야 하는 경우 UI의 수명 주기에 따라 UI 상태 범위를 지정해야 합니다. 이렇게 하려면 구성 가능한 함수에서 상태를 올바른 수준으로 호이스팅해야 합니다. 또는 UI 수명 주기로 범위가 지정된 [일반 상태 홀더 클래스](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-logic)에서 상태를 호이스팅할 수도 있습니다.

다음은 이 두 가지 방법과 각각을 사용해야 하는 경우에 대한 설명입니다.

### 상태 소유자로서의 컴포저블

상태와 로직이 간단하다면 컴포저블에 UI 로직과 UI 요소 상태를 사용하는 것이 좋습니다. 필요에 따라 상태를 컴포저블 내부에 유지하거나 호이스팅할 수 있습니다.

### 상태 호이스팅 불필요

상태를 항상 호이스팅할 필요는 없습니다. 상태를 제어해야 하는 다른 컴포저블이 없는 경우 상태를 컴포저블 내부에 유지할 수 있습니다. 다음 스니펫에는 탭하면 펼쳐지거나 접히는 컴포저블이 있습니다.

```

@Composable
fun ChatBubble(
    message: Message
) {
    var showDetails by rememberSaveable { mutableStateOf(false) } // Define the UI element expanded state

    ClickableText(
        text = AnnotatedString(message.content),
        onClick = { showDetails = !showDetails } // Apply simple UI logic
    )

    if (showDetails) {
        Text(message.timestamp)
    }
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L57-L71)

변수 `showDetails`는 이 UI 요소의 내부 상태입니다. 이 변수는 이 컴포저블에서만 읽고 수정되며, 적용된 로직은 매우 단순합니다. 따라서 이 경우에는 상태를 호이스팅해도 별다른 이익이 없으므로 내부에 유지할 수 있습니다. 이렇게 하면 이 컴포저블이 확장 상태의 소유자이자 단일 정보 소스가 됩니다.

**핵심 사항:** 구성 가능한 함수 내부에 UI 요소 상태를 유지하는 것은 허용됩니다. 상태와 상태에 적용하는 로직이 단순하고 UI 계층 구조의 다른 부분에서 상태가 필요하지 않은 경우에 유용한 방식입니다. 보통 애니메이션 상태에서 이 방식이 사용됩니다.

### 컴포저블 내부에서 호이스팅

UI 요소 상태를 다른 컴포저블과 공유하고 여러 위치에서 상태에 UI 로직을 적용해야 하는 경우 상태를 UI 계층 구조의 상단으로 호이스팅할 수 있습니다. 이렇게 하면 컴포저블을 재사용하고 테스트하기가 쉬워집니다.

다음 예는 두 가지 기능을 구현하는 채팅 앱입니다.

- `JumpToBottom` 버튼은 메시지 목록을 하단으로 스크롤합니다. 이 버튼은 목록 상태를 대상으로 UI 로직을 실행합니다.
- `MessagesList` 목록은 사용자가 새 메시지를 보낸 후에 하단으로 스크롤됩니다. UserInput은 목록 상태를 대상으로 UI 로직을 실행합니다.

![JumpToBottom 버튼과 새 메시지의 아래로 스크롤 기능이 있는 채팅 앱](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-chat.png?hl=ko)

**그림 1.** `JumpToBottom` 버튼이 있는 채팅 앱 및 새 메시지를 하단으로 스크롤

컴포저블 계층 구조는 다음과 같습니다.

![Chat 컴포저블 트리](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-initial-tree.png?hl=ko)

**그림 2.** Chat 컴포저블 트리

앱이 UI 로직을 실행하고 상태를 필요로 하는 모든 컴포저블에서 상태를 읽을 수 있도록 [`LazyColumn`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyColumn(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean,kotlin.Function1)>) 상태가 대화 화면으로 호이스팅됩니다.

![LazyColumn 상태를 LazyColumn에서 ConversationScreen으로 호이스팅](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-animated.gif?hl=ko)

**그림 3.** `LazyColumn` 상태를 `LazyColumn`에서 `ConversationScreen`로 호이스팅

최종적으로 컴포저블은 다음과 같습니다.

![LazyListState가 ConversationScreen으로 호이스팅된 Chat 컴포저블 트리](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-passing-state.png?hl=ko)

**그림 4.** `LazyListState`가 `ConversationScreen`로 호이스팅된 Chat 컴포저블 트리

코드는 다음과 같습니다.

```
@Composable
private fun ConversationScreen(/*...*/) {
    val scope = rememberCoroutineScope()

    val lazyListState = rememberLazyListState() // State hoisted to the ConversationScreen

    MessagesList(messages, lazyListState) // Reuse same state in MessageList

    UserInput(
        onMessageSent = { // Apply UI logic to lazyListState
            scope.launch {
                lazyListState.scrollToItem(0)
            }
        },
    )
}

@Composable
private fun MessagesList(
    messages: List<Message>,
    lazyListState: LazyListState = rememberLazyListState() // LazyListState has a default value
) {

    LazyColumn(
        state = lazyListState // Pass hoisted state to LazyColumn
    ) {
        items(messages, key = { message -> message.id }) { item ->
            Message(/*...*/)
        }
    }

    val scope = rememberCoroutineScope()

    JumpToBottom(onClicked = {
        scope.launch {
            lazyListState.scrollToItem(0) // UI logic being applied to lazyListState
        }
    })
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L85-L123)

`LazyListState`는 적용될 UI 로직에 필요한 수준만큼 상단으로 호이스팅됩니다. LazyListState는 구성 가능한 함수에서 초기화되므로 수명 주기에 따라 컴포지션에 저장됩니다.

`lazyListState`는 `MessagesList` 메서드에서 기본값 `rememberLazyListState()`로 정의되는 것을 볼 수 있습니다. 이는 Compose에서 일반적인 패턴으로, 이로 인해 컴포저블의 재사용과 유연성이 향상됩니다. 그러면 앱의 여러 곳에서 컴포저블을 사용할 수 있습니다. 이 중에는 상태를 제어할 필요가 없는 곳도 있을 수 있습니다. 주로 컴포저블을 테스트하거나 미리 보는 경우에 그렇습니다. 이것이 바로 `LazyColumn`는 상태를 정의합니다.

**핵심 사항:** 상태를 가장 낮은 공통 상위 요소로 호이스팅하고, 상태를 필요로 하지 않는 컴포저블에 전달하지 않습니다.

![LazyListState의 가장 낮은 공통 상위 요소는 ConversationScreen입니다](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-lca.png?hl=ko)

**그림 5.** `LazyListState`의 가장 낮은 공통 상위 요소는 `ConversationScreen`입니다.

### 상태 소유자로서의 일반 상태 홀더 클래스

컴포저블에 UI 요소의 하나 또는 여러 개의 상태 필드가 사용되는 복잡한 UI 로직이 포함되어 있다면 일반 상태 홀더 클래스와 같은 [상태 홀더](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-logic)로 그 책임을 위임해야 합니다. 이렇게 하면 컴포저블의 로직을 격리된 상태에서 더 쉽게 테스트할 수 있고 복잡성이 줄어듭니다. 이 접근 방식은 [관심사 분리 원칙](https://en.wikipedia.org/wiki/Separation_of_concerns)을 따릅니다. 즉, **컴포저블이 UI 요소를 방출하고 상태 홀더가 UI 로직과 UI 요소의 상태를 포함합니다.**.

일반 상태 홀더 클래스는 구성 가능한 함수의 호출자가 로직을 직접 작성할 필요가 없도록 편리한 함수를 제공합니다.

이러한 일반 클래스는 컴포지션에서 생성되고 기억됩니다. 일반 클래스는 [컴포저블의 수명 주기](https://developer.android.com/develop/ui/compose/lifecycle?hl=ko)를 따르므로 [`rememberNavController()`](<https://developer.android.com/reference/kotlin/androidx/navigation/compose/package-summary?hl=ko#rememberNavController(kotlin.Array)>), [`rememberLazyListState()`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#rememberLazyListState(kotlin.Int,kotlin.Int)>)와 같이 Compose 라이브러리에서 제공하는 형식을 받을 수 있습니다.

[`LazyColumn`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyColumn(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean,kotlin.Function1)>) 또는 [`LazyRow`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#lazyrow)의 UI 복잡성을 제어하기 위해 Compose에서 구현되는 [`LazyListState`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/LazyListState.kt;l=82?q=LazyListState.kt&%3Bss=androidx%2Fplatform%2Fframeworks%2Fsupport&hl=ko) 일반 상태 홀더 클래스를 예로 들 수 있습니다.

```
// LazyListState.kt

@Stable
class LazyListState constructor(
    firstVisibleItemIndex: Int = 0,
    firstVisibleItemScrollOffset: Int = 0
) : ScrollableState {
    /**
     *   The holder class for the current scroll position.
     */
    private val scrollPosition = LazyListScrollPosition(
        firstVisibleItemIndex, firstVisibleItemScrollOffset
    )

    suspend fun scrollToItem(/*...*/) { /*...*/ }

    override suspend fun scroll() { /*...*/ }

    suspend fun animateScrollToItem() { /*...*/ }
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L129-L148)

`LazyListState`는 이 UI 요소의 `scrollPosition`을 저장하는 [`LazyColumn`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyColumn(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean,kotlin.Function1)>)의 상태를 캡슐화합니다. 또한 특정 항목으로 스크롤하는 등의 방식으로 스크롤 위치를 수정하는 메서드도 노출합니다.

**참고:** 이 클래스는 [`Stable`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Stable?hl=ko)로 주석 처리됩니다. 자세한 내용은 Compose의 안정성에 관한 자세한 내용은 이 [블로그 게시물](https://medium.com/androiddevelopers/jetpack-compose-stability-explained-79c10db270c8)을 참고하세요.

보시다시피 **컴포저블의 책임을 늘리면 상태 홀더의 필요성이 증가**합니다. 책임은 UI 로직이거나, 단순히 추적할 상태의 양일 수 있습니다.

**참고:** 일반 상태 홀더 클래스가 활동 또는 프로세스가 다시 생성된 후에 보존해야 하는 상태를 포함하는 경우 `rememberSaveable`을 사용하고 맞춤 `Saver`를 생성하세요.

또 다른 일반적인 패턴은 일반 상태 홀더 클래스를 사용하여 앱에서 루트 구성 가능한 함수의 복잡성을 처리하는 것입니다. 이러한 클래스를 사용하여 탐색 상태 및 화면 크기 조정과 같은 앱 수준 상태를 캡슐화할 수 있습니다. 자세한 내용은 [UI 로직 및 상태 홀더 페이지](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-logic)에서 확인할 수 있습니다.

## 비즈니스 로직

컴포저블과 일반 상태 홀더 클래스가 UI 로직과 UI 요소의 상태를 담당하는 경우 화면 수준 상태 홀더가 다음 작업을 담당합니다.

- 비즈니스 레이어, 데이터 레이어 등 주로 계층 구조의 다른 레이어에 배치되는 애플리케이션의 [비즈니스 로직](https://developer.android.com/topic/architecture/ui-layer?hl=ko#logic-types)에 대한 액세스 권한 제공
- 특정 화면에 표시하기 위한 애플리케이션 데이터 준비(화면 UI 상태가 됨)

### 상태 소유자로서의 ViewModel

Android 개발에서 AAC ViewModel이 가진 [이점](https://developer.android.com/topic/libraries/architecture/viewmodel?hl=ko#best-practices)이 있으므로, 비즈니스 로직에 대한 액세스 권한을 제공하고 화면에 표시하기 위한 애플리케이션 데이터를 준비하는 데는 ViewModel이 적합합니다.

**핵심 사항:** `ViewModel`은 특정 책임을 갖는 상태 홀더의 구현 세부정보일 뿐입니다. 프로젝트의 모듈을 Android 종속 항목에서 사용하지 않으려면 인터페이스를 사용하여 다양한 컨텍스트에서 구현을 교체 가능하도록 만들 수 있습니다. 예를 들어, Android 관련 모듈에서는 `ViewModel`을 사용하고 다른 모듈에서는 일반 상태 홀더 클래스와 같은 더 간단하고 플랫폼에 구애받지 않는 구현을 사용할 수 있습니다.

`ViewModel`에서 UI 상태를 호이스팅하면 상태가 컴포지션 외부로 이동됩니다.

![ViewModel로 호이스팅된 상태는 컴포지션 외부에 저장됩니다.](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-vm.png?hl=ko)

**그림 6.** `ViewModel`로 호이스팅된 상태는 컴포지션 외부에 저장됩니다.

ViewModel은 컴포지션의 일부로 저장되지 않습니다. ViewModel은 프레임워크에 의해 제공되며, [`ViewModelStoreOwner`](https://developer.android.com/reference/androidx/lifecycle/ViewModelStoreOwner?hl=ko)(활동, 프래그먼트, 탐색 그래프 또는 탐색 그래프의 대상)로 범위 지정됩니다. [`ViewModel` 범위](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-apis?hl=ko)에 관한 자세한 내용은 문서를 참고하세요.

그러면 `ViewModel`이 정보 소스이자 UI 상태의 **가장 낮은 공통 상위 요소**가 됩니다.

### 화면 UI 상태

위의 정의에 따라 화면 UI 상태는 비즈니스 규칙을 적용하여 생성됩니다. 화면 UI 상태는 화면 수준 상태 홀더가 담당한다는 사실을 고려하면 이는 [화면 UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)는 일반적으로 화면 수준 상태 홀더(여기서는 `ViewModel`)에서 호이스팅됨을 의미합니다.

채팅 앱의 `ConversationViewModel`과 이것이 화면 UI 상태 및 이벤트를 노출하여 수정하는 방식을 살펴보겠습니다.

```
class ConversationViewModel(
    channelId: String,
    messagesRepository: MessagesRepository
) : ViewModel() {

    val messages = messagesRepository
        .getLatestMessages(channelId)
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5_000),
            initialValue = emptyList()
        )

    // Business logic
    fun sendMessage(message: Message) { /* ... */ }
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L158-L173)

컴포저블은 `ViewModel`에서 호이스팅된 화면 UI 상태를 소비합니다. 화면 수준 컴포저블에 `ViewModel` 인스턴스를 삽입하여 비즈니스 로직에 대한 액세스를 제공해야 합니다.

**참고:** `ViewModel` 인스턴스를 다른 컴포저블에 전달해서는 안 됩니다. 자세한 내용은 [아키텍처 상태 홀더 문서](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#business-logic)를 참고하세요.

다음은 화면 수준 컴포저블에 사용된 `ViewModel`의 예입니다. 여기서 컴포저블 `ConversationScreen()`은 `ViewModel`에서 호이스팅된 화면 UI 상태를 소비합니다.

```
@Composable
private fun ConversationScreen(
    conversationViewModel: ConversationViewModel = viewModel()
) {

    val messages by conversationViewModel.messages.collectAsStateWithLifecycle()

    ConversationScreen(
        messages = messages,
        onSendMessage = { message: Message -> conversationViewModel.sendMessage(message) }
    )
}

@Composable
private fun ConversationScreen(
    messages: List<Message>,
    onSendMessage: (Message) -> Unit
) {

    MessagesList(messages, onSendMessage)
    /* ... */
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L177-L198)

**참고:** `viewModel()` 함수를 사용하려면 `build.gradle` 파일에 [`androidx.lifecycle:lifecycle-viewmodel-compose`](https://developer.android.com/jetpack/androidx/releases/lifecycle?hl=ko) 종속 항목을 추가하세요. 이 함수에 관한 자세한 내용은 Compose의 [다른 라이브러리 사용](https://developer.android.com/develop/ui/compose/libraries?hl=ko#viewmodel) 문서를 참고하세요.

**참고:** 시스템에서 시작된 프로세스의 재생성 후 보존할 상태가 ViewModel에 포함되어 있다면 [`SavedStateHandle`](https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko)을 사용하여 상태를 지속하세요. 자세한 내용은 [UI 상태 저장 페이지](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko)를 참고하세요.

#### 속성 드릴

'속성 드릴'은 여러 중첩된 하위 구성요소를 통과하여 데이터를 데이터가 읽힌 위치로 전달하는 것을 의미합니다.

Compose에서 속성 드릴이 나타날 수 있는 일반적인 예로 최상위 수준에서 화면 수준 상태 홀더를 삽입하고 상태와 이벤트를 하위 컴포저블에 전달하는 경우를 들 수 있습니다. 이로 인해 추가로 구성 가능한 함수 서명의 오버로드가 추가로 생성될 수 있습니다.

이벤트를 개별 람다 매개변수로 노출하면 함수 서명이 오버로드될 수 있지만 구성 가능한 함수 책임의 가시성이 극대화됩니다. 함수의 기능을 한눈에 확인할 수 있습니다.

래퍼 클래스를 만드는 것보다 속성 드릴을 사용하여 한곳에서 상태 및 이벤트를 캡슐화하는 것이 좋습니다. 이렇게 하면 컴포저블이 갖는 책임의 가시성이 줄어들기 때문입니다. 게다가 래퍼 클래스가 없으면 컴포저블에 꼭 필요한 매개변수만 전달할 가능성이 커집니다. 이렇게 하는 것이 [권장사항](https://developer.android.com/develop/ui/compose/architecture?hl=ko#composable-parameters)입니다.

이러한 이벤트가 탐색 이벤트인 경우에도 동일한 권장사항이 적용됩니다. 자세한 내용은 [탐색 문서](https://developer.android.com/develop/ui/compose/navigation?hl=ko#nav-calls-best-practices)를 참고하세요.

성능 문제를 발견했다면 상태의 읽기를 연기할 수도 있습니다. 자세한 내용은 [성능 문서](https://developer.android.com/develop/ui/compose/performance/bestpractices?hl=ko#defer-reads)를 참고하세요.

### UI 요소 상태

UI 요소 상태를 읽거나 써야 하는 비즈니스 로직이 있다면 상태를 화면 수준 상태 홀더로 호이스팅할 수 있습니다.

채팅 앱은 사용자가 `@` 기호를 입력하고 힌트를 입력하면 그룹 채팅에 사용자 제안을 표시합니다. 이러한 제안은 데이터 레이어에서 제공되며, 사용자 제안 목록을 계산하는 로직은 비즈니스 로직으로 간주됩니다. 이 기능은 다음과 같습니다.

![사용자가 `@` 기호와 힌트를 입력하면 그룹 채팅에 사용자 제안을 표시하는 기능](https://developer.android.com/static/develop/ui/compose/images/state-hoisting-suggestions.png?hl=ko)

**그림 7.** 사용자가 `@`와 힌트를 입력하면 그룹 채팅에 사용자 제안을 표시하는 기능

이 기능을 구현하는 `ViewModel`은 다음과 같습니다.

```
class ConversationViewModel(/*...*/) : ViewModel() {

    // Hoisted state
    var inputMessage by mutableStateOf("")
        private set

    val suggestions: StateFlow<List<Suggestion>> =
        snapshotFlow { inputMessage }
            .filter { hasSocialHandleHint(it) }
            .mapLatest { getHandle(it) }
            .mapLatest { repository.getSuggestions(it) }
            .stateIn(
                scope = viewModelScope,
                started = SharingStarted.WhileSubscribed(5_000),
                initialValue = emptyList()
            )

    fun updateInput(newInput: String) {
        inputMessage = newInput
    }
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L213-L233)

`inputMessage`는 [`TextField`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#TextField(kotlin.String,kotlin.Function1,androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.Boolean,androidx.compose.ui.text.TextStyle,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Boolean,androidx.compose.ui.text.input.VisualTransformation,androidx.compose.foundation.text.KeyboardOptions,androidx.compose.foundation.text.KeyboardActions,kotlin.Boolean,kotlin.Int,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.ui.graphics.Shape,androidx.compose.material.TextFieldColors)>) 상태를 저장하는 변수입니다. 사용자가 새 입력을 입력할 때마다 앱이 비즈니스 로직을 호출하여 `suggestions`를 생성합니다.

**참고:** 이 예에서는 사용자 제안을 생성하는 데 비즈니스가 로직에 이 변수가 필요하지만, 실제로 비즈니스 로직에 이 변수가 필요하지 않은 경우에는 화면 수준 상태 홀더로 호이스팅하지 않아야 합니다. 이 경우 변수를 필요로 하는 구성 가능한 함수와 더 가까운 위치인 UI에서 변수를 정의하고 저장해야 합니다.

`suggestions`는 화면 UI 상태로, [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)에서 수집하여 Compose UI에서 사용됩니다.

**참고:** 화면 수준 컴포저블이 비즈니스 로직에 대한 액세스 권한을 제공하는 `ViewModel`과 UI 로직 및 UI 요소의 상태를 관리하는 일반 상태 홀더 클래스를 모두 갖는 것도 가능합니다.

#### 주의

일부 Compose UI 요소 상태의 경우 `ViewModel`로 호이스팅하려면 특별한 고려사항이 필요할 수 있습니다. 예를 들어 Compose UI 요소의 일부 상태 홀더는 상태를 수정하는 메서드를 노출합니다. 그중 일부는 애니메이션을 트리거하는 정지 함수일 수 있습니다. 이러한 정지 함수는 컴포지션으로 범위가 지정되지 않은 [`CoroutineScope`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-scope/)에서 호출하는 경우 예외를 발생시킬 수 있습니다.

앱 검색 창의 콘텐츠가 동적이며 앱 검색 창이 닫힌 후에 데이터 레이어에서 콘텐츠를 가져와서 새로고침해야 한다고 가정하겠습니다. 이 요소에서 상태 소유자로부터 UI와 비즈니스 로직을 모두 호출할 수 있도록 검색 창 상태를 `ViewModel`로 호이스팅해야 합니다.

그러나 Compose UI에서 [`viewModelScope`](https://developer.android.com/topic/libraries/architecture/coroutines?hl=ko#viewmodelscope)를 사용하여 [`DrawerState`](https://developer.android.com/reference/kotlin/androidx/compose/material/DrawerState?hl=ko)의 [`close()`](<https://developer.android.com/reference/kotlin/androidx/compose/material/DrawerState?hl=ko#close()>) 메서드를 호출하면 [`IllegalStateException`](https://docs.oracle.com/javase/7/docs/api/java/lang/IllegalStateException.html) 형식의 런타임 예외가 발생하고 '이 [`CoroutineContext”`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.coroutines/-coroutine-context/)에서 [`MonotonicFrameClock`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/MonotonicFrameClock?hl=ko)을 사용할 수 없음'이라는 메시지가 표시됩니다.

이 문제를 해결하려면 컴포지션으로 범위가 지정된 `CoroutineScope`를 사용하세요. CoroutineScope는 `CoroutineContext`에서 정지 함수가 작동하는 데 필요한 `MonotonicFrameClock`을 제공합니다.

**경고:** Compose UI 요소 상태에서 노출되었으며 애니메이션을 트리거하는 일부 정지 함수를 호출할 경우 컴포지션으로 범위가 지정되지 않은 `CoroutineScope`에서 호출되면 예외가 발생합니다. 이러한 함수의 예로 [`LazyListState.animateScrollTo()`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/LazyListState?hl=ko#animateScrollToItem(kotlin.Int,kotlin.Int)>)와 [`DrawerState.close()`](<https://developer.android.com/reference/kotlin/androidx/compose/material/DrawerState?hl=ko#close()>)를 들 수 있습니다.

이 비정상 종료를 해결하려면 `ViewModel`에 있는 코루틴의 `CoroutineContext`를 컴포지션으로 범위가 지정된 컨텍스트를 전환하세요. 다음을 참고하세요.

```
class ConversationViewModel(/*...*/) : ViewModel() {

    val drawerState = DrawerState(initialValue = DrawerValue.Closed)

    private val _drawerContent = MutableStateFlow(DrawerContent.Empty)
    val drawerContent: StateFlow<DrawerContent> = _drawerContent.asStateFlow()

    fun closeDrawer(uiScope: CoroutineScope) {
        viewModelScope.launch {
            withContext(uiScope.coroutineContext) { // Use instead of the default context
                drawerState.close()
            }
            // Fetch drawer content and update state
            _drawerContent.update { content }
        }
    }
}

// in Compose
@Composable
private fun ConversationScreen(
    conversationViewModel: ConversationViewModel = viewModel()
) {
    val scope = rememberCoroutineScope()

    ConversationScreen(onCloseDrawer = { conversationViewModel.closeDrawer(uiScope = scope) })
}
```

[StateHoistingSnippets.kt](https://github.com/android/snippets/blob/cd04e0b6f01991a66e2749ed0ae20cf2debc70ef/compose/snippets/src/main/java/com/example/compose/snippets/state/StateHoistingSnippets.kt#L246-L272)

# Compose에 UI 상태 저장 

bookmark_border

상태가 호이스팅된 위치와 필요한 로직에 따라 서로 다른 API를 사용하여 [UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)를 저장하고 복원할 수 있습니다. 모든 앱은 이를 가장 효과적으로 달성하기 위한 API 조합을 사용합니다.

**참고:** 상태를 호이스팅할 대상 위치에 관한 자세한 내용은 [상태를 호이스팅할 대상 위치](https://developer.android.com/develop/ui/compose/state-hoisting?hl=ko) 문서를 참고하세요.

모든 Android 앱은 활동 또는 프로세스 재생성으로 인해 [UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)가 손실될 수 있습니다. 이러한 상태 손실은 다음과 같은 이벤트로 인해 발생할 수 있습니다.

- [구성 변경](https://developer.android.com/guide/topics/resources/runtime-changes?hl=ko). 구성 변경이 [수동으로 처리](https://developer.android.com/guide/topics/resources/runtime-changes?hl=ko#HandlingTheChange)되지 않는 한 활동이 소멸되고 재생성됩니다.
- [시스템에서 시작된 프로세스 종료](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#ui-dismissal-system). 앱이 백그라운드에 있고 기기가 리소스(메모리 등)를 다른 프로세스에서 사용할 수 있도록 확보합니다.

**참고:** [시스템에서 시작된 프로세스 종료](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#ui-dismissal-system)는 사용자가 명시적으로 활동을 닫는 [사용자가 시작한 프로세스 종료](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#ui-dismissal-user)와 다릅니다. 사용자가 시작한 프로세스 종료에서는 일시적인 상태의 손실이 대체적으로 합리적입니다(예: 양식을 작성하는 중에 [`TextField`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#TextField(kotlin.String,kotlin.Function1,androidx.compose.ui.Modifier,kotlin.Boolean,kotlin.Boolean,androidx.compose.ui.text.TextStyle,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Boolean,androidx.compose.ui.text.input.VisualTransformation,androidx.compose.foundation.text.KeyboardOptions,androidx.compose.foundation.text.KeyboardActions,kotlin.Boolean,kotlin.Int,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.ui.graphics.Shape,androidx.compose.material.TextFieldColors)>)의 애니메이션 상태 또는 콘텐츠 손실).

이러한 이벤트 후에 상태를 보존하는 것은 긍정적인 사용자 경험을 제공하는 데 있어 중요합니다. 어느 상태가 보존되도록 선택해야 하는지는 앱의 고유한 사용자 흐름에 따라 달라집니다. 권장사항은 적어도 사용자 입력 및 탐색 관련 상태는 유지하는 것입니다. 목록의 스크롤 위치, 사용자가 더 자세히 알고자 하는 항목의 ID, 진행 중인 사용자 환경설정 선택, 텍스트 필드의 입력 등을 예로 들 수 있습니다.

이 페이지에서는 상태가 호이스팅되는 대상 위치와 상태를 필요로 하는 로직에 따라 UI 상태를 저장하는 데 사용할 수 있는 API를 요약합니다.

## UI 로직

상태가 UI에서 구성 가능한 함수나 컴포지션으로 범위가 지정된 일반 상태 홀더 클래스로 호이스팅되는 경우 [`rememberSaveable`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#rememberSaveable(kotlin.Array,androidx.compose.runtime.saveable.Saver,kotlin.String,kotlin.Function0)>)을 사용하여 여러 활동에서, 그리고 프로세스 재생성 후에도 상태를 유지할 수 있습니다.

다음 스니펫에서 `rememberSaveable`은 단일 불리언 UI 요소 상태를 저장하는 데 사용됩니다.

```kotlin
@Composable
fun ChatBubble(    message: Message
) {    var showDetails by rememberSaveable { mutableStateOf(false) }    ClickableText(        text = AnnotatedString(message.content),        onClick = { showDetails = !showDetails }    )    if (showDetails) {        Text(message.timestamp)    }
}
```

[SavingUIStateSnippets.kt](https://github.com/android/snippets/blob/1a6cb36c4bfc4e5c179333e436c8940b612303ba/compose/snippets/src/main/java/com/example/compose/snippets/state/SavingUIStateSnippets.kt#L44-L58)

**그림 1**. 탭하면 펼쳐지고 접히는 채팅 메시지 대화창

`showDetails`은 채팅 풍선이 접혔는지 아니면 펼쳐졌는지를 저장하는 불리언 변수입니다.

**중요:** 저장된 인스턴스 상태에 저장된 데이터는 보통 일시적인 상태이며 사용자 입력이나 탐색에 따라 달라집니다. 목록의 스크롤 위치, 사용자가 더 자세히 알고자 하는 항목의 ID, 진행 중인 사용자 환경설정 선택, 텍스트 필드의 입력 등을 예로 들 수 있습니다.

`rememberSaveable`은 저장된 인스턴스 상태 메커니즘을 통해 [UI 요소 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)를 [`Bundle`](https://developer.android.com/reference/android/os/Bundle?hl=ko)에 저장합니다.

기본 유형을 자동으로 번들에 저장할 수 있습니다. 상태가 데이터 클래스와 같이 기본 유형이 아닌 유형에 저장되어 있다면 [`Parcelize`](https://developer.android.com/kotlin/parcelize?hl=ko) 주석을 사용하거나, [`listSaver`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#listSaver(kotlin.Function2,kotlin.Function1)>) 및 [`mapSaver`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#mapSaver(kotlin.Function2,kotlin.Function1)>) 등의 Compose API를 사용하거나, Compose 런타임 [`Saver`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/Saver?hl=ko) 클래스를 확장하여 맞춤 Saver 클래스를 구현하는 등의 다른 저장 메커니즘을 사용할 수 있습니다. 이러한 메서드에 관한 자세한 내용은 [상태 저장 방법](https://developer.android.com/develop/ui/compose/state?hl=ko#ways-to-store) 문서를 참고하세요.

다음 스니펫에서 [`rememberLazyListState`](https://cs.android.com/androidx/platform/tools/dokka-devsite-plugin/+/master:testData/compose/source/androidx/compose/foundation/lazy/LazyListState.kt;l=49?q=LazyListState&hl=ko) Compose API는 `rememberSaveable`을 사용하여 [`LazyColumn`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyColumn(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean,kotlin.Function1)>) 또는 [`LazyRow`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyRow(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Horizontal,androidx.compose.ui.Alignment.Vertical,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Boolean,kotlin.Function1)>)의 스크롤 상태로 구성되는 [`LazyListState`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/LazyListState?hl=ko)를 저장합니다. 또한 스크롤 상태를 저장하고 복원할 수 있는 맞춤 Saver인 [`LazyListState.Saver`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/lazy/LazyListState.kt;l=413?q=LazyListState.kt&hl=ko)를 사용합니다. 활동 또는 프로세스가 재생성된 후(예: 기기 방향 변경과 같은 구성 변경 후) 스크롤 상태가 보존됩니다.

@Composable  
fun rememberLazyListState(    initialFirstVisibleItemIndex: Int = 0,    initialFirstVisibleItemScrollOffset: Int = 0  
): LazyListState {    return rememberSaveable(saver = LazyListState.Saver) {        LazyListState(            initialFirstVisibleItemIndex, initialFirstVisibleItemScrollOffset        )    }  
}

[SavingUIStateSnippets.kt](https://github.com/android/snippets/blob/1a6cb36c4bfc4e5c179333e436c8940b612303ba/compose/snippets/src/main/java/com/example/compose/snippets/state/SavingUIStateSnippets.kt#L64-L74)

### 권장사항

`rememberSaveable`은 [`Bundle`](https://developer.android.com/reference/android/os/Bundle?hl=ko)을 사용하여 UI 상태를 저장합니다. Bundle은 활동에서 이루어지는 [`onSaveInstanceState()`](<https://developer.android.com/reference/android/app/Activity?hl=ko#onSaveInstanceState(android.os.Bundle)>) 호출과 같이 Bundle에 쓰기를 수행하기도 하는 다른 API와 공유됩니다. 단, 이 `Bundle`의 크기는 제한적이므로 여기에 큰 객체를 저장하면 런타임에서 [`TransactionTooLarge`](https://developer.android.com/reference/android/os/TransactionTooLargeException?hl=ko) 예외가 발생할 수 있습니다. 특히 앱 전체에서 동일한 `Bundle`이 사용되는 단일 `Activity` 앱에서 문제가 될 수 있습니다.

이러한 유형의 비정상 종료를 방지하려면 *번들에 크고 복잡한 객체나 객체 목록을 저장하지 않아야 합니다*.

대신 ID나 키와 같이 필요한 최소 상태를 저장하고 더 복잡한 UI 상태의 복원을 [영구 저장소](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#local)와 같은 다른 메커니즘에 위임하는 데 이 데이터를 사용합니다.

**참고:** 모든 UI 요소의 상태를 저장하지 않아도 괜찮은 경우가 있을 수 있습니다.

이러한 디자인 옵션은 앱의 구체적인 사용 사례와 사용자가 앱에 기대하는 동작 방식에 따라 달라집니다.

### 상태 복원 확인

활동 또는 프로세스가 재생성되었을 때 [`rememberSaveable`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/saveable/package-summary?hl=ko#rememberSaveable(kotlin.Array,androidx.compose.runtime.saveable.Saver,kotlin.String,kotlin.Function0)>)을 사용하여 Compose 요소에 저장된 상태가 올바르게 복원되는지 확인할 수 있습니다. 이를 위한 API가 있습니다(예: [`StateRestorationTester`](https://developer.android.com/reference/kotlin/androidx/compose/ui/test/junit4/StateRestorationTester?hl=ko)). 자세한 내용은 [테스트](https://developer.android.com/develop/ui/compose/testing?hl=ko#verify_state_restoration) 문서를 참고하세요.

## 비즈니스 로직

[UI 요소 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)가 비즈니스 로직에서 필요하기 때문에 `ViewModel`로 호이스팅된 경우 `ViewModel`의 API를 사용할 수 있습니다.

Android 애플리케이션에서 `ViewModel`을 사용하는 것의 주요 이점 중 하나는 구성 변경을 무료로 처리한다는 것입니다. 구성 변경이 발생하여 활동이 소멸되었다가 재생성된 경우 `ViewModel`로 호이스팅된 UI 상태는 메모리에 유지됩니다. 재생성 후에는 기존 `ViewModel` 인스턴스가 새 활동 인스턴스에 연결됩니다.

**참고:** 화면 수준 상태 홀더의 구현인 `ViewModel`은 [화면 UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)를 생성하는 데 사용되는 비즈니스 로직을 처리합니다. ViewModel이 구성 변경을 무료로 처리하기 때문이 아니라, 아키텍처에서 그렇게 하는 것이 적합한 경우에만 UI 상태를 `ViewModel`로 호이스팅해야 합니다.

그러나 `ViewModel` 인스턴스는 시스템에서 시작된 프로세스 종료가 발생한 경우에는 유지되지 않습니다. UI 상태가 유지되도록 하려면 [`SavedStateHandle`](https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko) API를 포함하는 [ViewModel의 저장된 상태 모듈](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate?hl=ko#savedstate-compose-state)을 사용하세요.

### 권장사항

[`SavedStateHandle`](https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko)은 UI 상태를 저장하기 위해 `Bundle` 메커니즘도 사용하므로 간단한 [UI 요소 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)를 저장하는 데만 사용해야 합니다.

비즈니스 규칙을 적용하고 UI 이외의 애플리케이션 레이어에 액세스함으로써 생성되는 [화면 UI 상태](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#ui-state)는 그 복잡도와 크기 때문에 `SavedStateHandle`에 저장해서는 안 됩니다. 복잡하거나 큰 데이터를 저장할 때는 [로컬 영구 스토리지](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko#local)를 비롯한 여러 메커니즘을 사용할 수 있습니다. 프로세스가 재생성된 후에는 `SavedStateHandle`에 저장되었던 복원된 임시 상태(있는 경우)를 사용하여 화면이 재생성되고 화면 UI 상태가 데이터 영역으로부터 다시 생성됩니다.

**참고:** UI 상태를 저장하는 다양한 방법에 관한 자세한 내용은 [UI 상태 저장](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko) 문서를 참고하세요.

### `SavedStateHandle` API

[`SavedStateHandle`](https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko)에는 UI 요소 상태를 저장하는 여러 API가 있습니다. 그중에서도 다음 API가 중요합니다.

| | |
| - | |
| Compose [`State`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/State?hl=ko) | [`saveable()`](<https://developer.android.com/reference/kotlin/androidx/lifecycle/viewmodel/compose/package-summary?hl=ko#(androidx.lifecycle.SavedStateHandle).saveable(kotlin.String,androidx.compose.runtime.saveable.Saver,kotlin.Function0)>) |
| [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/) | [`getStateFlow()`](<https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko#getStateFlow(kotlin.String,kotlin.Any)>) |

#### Compose `State`

`SavedStateHandle`의 `saveable` API를 사용하여 UI 요소 상태를 `MutableState`로 읽고 씁니다. 그러면 여러 활동에서, 그리고 프로세스 재생성 후에도 최소한의 코드 설정으로 UI 요소 상태가 유지됩니다.

`saveable` API는 추가 설정 없이 기본 유형을 지원하며, `rememberSaveable()`처럼 맞춤 Saver를 사용하기 위해 `stateSaver` 매개변수를 받습니다.

다음 스니펫에서 `message`는 사용자 입력 유형을 `TextField`에 저장합니다.

```
class ConversationViewModel(    savedStateHandle: SavedStateHandle
) : ViewModel() {    var message by savedStateHandle.saveable(stateSaver = TextFieldValue.Saver) {        mutableStateOf(TextFieldValue(""))    }        private set    fun update(newMessage: TextFieldValue) {        message = newMessage    }    /*...*/
}

val viewModel = ConversationViewModel(SavedStateHandle())

@Composable
fun UserInput(/*...*/) {    TextField(        value = viewModel.message,        onValueChange = { viewModel.update(it) }    )
}
```

[SavingUIStateSnippets.kt](https://github.com/android/snippets/blob/1a6cb36c4bfc4e5c179333e436c8940b612303ba/compose/snippets/src/main/java/com/example/compose/snippets/state/SavingUIStateSnippets.kt#L81-L105)

`saveable` API 사용에 관한 자세한 내용은 [`SavedStateHandle`](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate?hl=ko#savedstate-compose-state) 문서를 참고하세요.

**주의:** [saveable](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate?hl=ko#savedstate-compose-state) API는 실험용입니다.

#### `StateFlow`

[`getStateFlow()`](<https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko#getStateFlow(kotlin.String,kotlin.Any)>)를 사용하여 UI 요소 상태를 저장하고 [`SavedStateHandle`](https://developer.android.com/reference/androidx/lifecycle/SavedStateHandle?hl=ko)에서의 흐름으로 사용합니다. [`StateFlow`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/-state-flow/)는 읽기 전용이며, 이 API에서는 개발자가 키를 지정해야 흐름을 대체하여 새 값을 내보낼 수 있습니다. 키를 구성했으면 `StateFlow`를 검색하여 최신 값을 수집할 수 있습니다.

다음 스니펫에서 `savedFilterType`은 채팅 앱의 채팅 채널 목록에 적용된 필터 유형을 저장하는 `StateFlow` 변수입니다.

```kotlin
private const val CHANNEL_FILTER_SAVED_STATE_KEY = "ChannelFilterKey"

class ChannelViewModel(    channelsRepository: ChannelsRepository,    private val savedStateHandle: SavedStateHandle
) : ViewModel() {    private val savedFilterType: StateFlow<ChannelsFilterType> = savedStateHandle.getStateFlow(        key = CHANNEL_FILTER_SAVED_STATE_KEY, initialValue = ChannelsFilterType.ALL_CHANNELS    )    private val filteredChannels: Flow<List<Channel>> =        combine(channelsRepository.getAll(), savedFilterType) { channels, type ->            filter(channels, type)        }.onStart { emit(emptyList()) }    fun setFiltering(requestType: ChannelsFilterType) {        savedStateHandle[CHANNEL_FILTER_SAVED_STATE_KEY] = requestType    }    /*...*/
}

enum class ChannelsFilterType {    ALL_CHANNELS, RECENT_CHANNELS, ARCHIVED_CHANNELS
}
```

[SavingUIStateSnippets.kt](https://github.com/android/snippets/blob/1a6cb36c4bfc4e5c179333e436c8940b612303ba/compose/snippets/src/main/java/com/example/compose/snippets/state/SavingUIStateSnippets.kt#L117-L142)

사용자가 새 필터 유형을 선택할 때마다 `setFiltering`이 호출됩니다. 이렇게 하면 `SavedStateHandle`에 키 `_CHANNEL_FILTER_SAVED_STATE_KEY_`와 함께 새 값이 저장됩니다. `savedFilterType`은 키에 저장된 최신 값을 내보내는 흐름입니다. `filteredChannels`는 채널 필터링을 수행하기 위해 흐름을 수신합니다.

`getStateFlow()` API에 관한 자세한 내용은 [`SavedStateHandle`](https://developer.android.com/topic/libraries/architecture/viewmodel/viewmodel-savedstate?hl=ko#savedstate-stateflow) 문서를 참고하세요.

### 요약

다음 표에는 이 섹션에서 다룬 API와 각 API를 사용하여 UI 상태를 저장해야 하는 경우가 요약되어 있습니다.

| 이벤트 | UI 로직 | `ViewModel`의 비즈니스 로직 |
| - | | |
| 구성 변경 | `rememberSaveable` | 자동 |
| 시스템에서 시작된 프로세스 종료 | `rememberSaveable` | `SavedStateHandle` |

사용할 API는 상태가 저장된 위치와 상태를 필요로 하는 로직에 따라 달라집니다. [UI 로직](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#logic)에서 사용되는 상태의 경우 `rememberSaveable`을 사용합니다. [비즈니스 로직](https://developer.android.com/topic/architecture/ui-layer/stateholders?hl=ko#logic)에서 사용되는 상태의 경우 `ViewModel`에 저장한다면 `SavedStateHandle`을 사용하여 저장합니다.

번들 API(`rememberSaveable` 및 `SavedStateHandle`)는 적은 양의 UI 상태를 저장하는 데 사용해야 합니다. 이 데이터는 다른 저장 메커니즘과 함께 UI를 이전 상태로 복원하는 데 필요한 최소한의 데이터입니다. 예를 들어 사용자가 번들에서 보고 있는 프로필의 ID를 저장하면 프로필 세부정보와 같은 대용량 데이터는 데이터 영역에서 가져올 수 있습니다.

UI 상태를 저장하는 다양한 방법에 관한 자세한 내용은 아키텍처 가이드의 [UI 상태 저장 문서](https://developer.android.com/topic/libraries/architecture/saving-states?hl=ko) 및 [데이터 영역](https://developer.android.com/topic/architecture/data-layer?hl=ko) 페이지를 참고하세요.

# Compose UI 설계 

Compose의 UI는 변경할 수 없습니다. UI를 설계한 후 업데이트할 수 없습니다. UI 상태는 제어할 수 있습니다. UI 상태가 변경될 때마다 Compose는 [변경된 UI 트리 부분을 다시 만듭니다](https://developer.android.com/develop/ui/compose/mental-model?hl=ko#recomposition). 컴포저블은 상태를 수락하고 이벤트를 노출할 수 있습니다. 예를 들어 `TextField`는 값을 수락하고 콜백 `onValueChange`를 노출합니다. 이 콜백은 값을 변경하기 위해 콜백 핸들러를 요청합니다.

var name by remember { mutableStateOf("") }  
OutlinedTextField(    value = name,    onValueChange = { name = it },    label = { Text("Name") }  
)

[ArchitectureSnippets.kt](https://github.com/android/snippets/blob/5bbe6402691d75a16634d5e23d4a2ac16ede9b3d/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureSnippets.kt#L46-L51)

컴포저블이 상태를 수락하고 이벤트를 노출하기 때문에 단방향 데이터 흐름 패턴은 Jetpack Compose에 적합합니다. 이 가이드에서는 Compose에서 단방향 데이터 흐름 패턴을 구현하는 방법, 이벤트 및 상태 홀더를 구현하는 방법, Compose에서 ViewModel을 사용하는 방법을 중점적으로 설명합니다.

**참고:** Jetpack Compose를 채택해도 앱의 다른 레이어(데이터 레이어 및 비즈니스 레이어)는 영향을 받지 않습니다. 앱의 모든 레이어 설계에 관한 자세한 내용은 [앱 아키텍처 가이드](https://developer.android.com/jetpack/guide?hl=ko)를 참고하세요.

## 단방향 데이터 흐름

_단방향 데이터 흐름_(UDF)은 상태는 아래로 이동하고 이벤트는 위로 이동하는 디자인 패턴입니다. 단방향 데이터 흐름을 따라 UI에 상태를 표시하는 컴포저블과 상태를 저장하고 변경하는 앱 부분을 서로 분리할 수 있습니다.

단방향 데이터 흐름을 사용하는 앱의 UI 업데이트 루프는 다음과 같습니다.

- **이벤트**: UI의 일부가 이벤트를 생성하여 위쪽으로 전달하거나(예: 처리하기 위해 ViewModel에 전달되는 버튼 클릭) 앱의 다른 레이어에서 이벤트가 전달됩니다(예: 사용자 세션이 종료되었음을 표시).
- **상태 업데이트**: 이벤트 핸들러가 상태를 변경할 수도 있습니다.
- **상태 표시**: 상태 홀더가 상태를 아래로 전달하고 UI가 상태를 표시합니다.

<ph type="x-smartling-placeholder">

</ph> <ph type="x-smartling-placeholder">

</ph> <ph type="x-smartling-placeholder">![](https://developer.android.com/static/develop/ui/compose/images/state-unidirectional-flow.png?hl=ko)</ph>

**그림 1.** 단방향 데이터 흐름

Jetpack Compose를 사용할 때 이 패턴을 따르면 몇 가지 이점이 있습니다.

- **테스트 가능성**: 상태와 상태를 표시하는 UI를 분리하여 격리 상태에서 더 쉽게 테스트할 수 있습니다.
- **상태 캡슐화**: 상태는 한 곳에서만 업데이트할 수 있고 컴포저블의 상태에 관한 정보 소스가 하나뿐이므로 일관되지 않은 상태로 인해 버그를 만들 가능성이 작습니다.
- **UI 일관성**: 관찰 가능한 상태 홀더(`StateFlow` 또는 `LiveData`)를 사용함으로써 모든 상태 업데이트가 UI에 즉시 반영됩니다.

### Jetpack Compose의 단방향 데이터 흐름

컴포저블은 상태 및 이벤트를 기반으로 작동합니다. 예를 들어 `TextField`는 `value` 매개변수가 업데이트되고 `onValueChange` 콜백(값을 새 값으로 변경하도록 요청하는 이벤트)을 노출할 때만 업데이트됩니다. Compose는 `State` 객체를 값 홀더로 정의하며 상태 값이 변경되면 리컴포지션이 트리거됩니다. 값을 저장해야 하는 기간에 따라 `remember { mutableStateOf(value) }` 또는 `rememberSaveable { mutableStateOf(value)`에 상태를 유지할 수 있습니다.

`TextField` 컴포저블 값의 유형은 `String`이므로 하드코딩된 값, ViewModel, 상위 컴포저블에서 전달된 값 등 어디서나 가져올 수 있습니다. `State` 객체에 값을 유지할 필요는 없지만 `onValueChange`가 호출될 때 값을 업데이트해야 합니다.

**핵심 사항:**

`mutableStateOf(value)`는 Compose에서 관찰 가능한 유형인 `MutableState`를 만듭니다. 관련 값이 변경되면 그 값을 읽는 구성 가능한 함수의 리컴포지션이 예약됩니다.

`remember`는 객체를 컴포지션에 저장하고 `remember`를 호출한 컴포저블이 컴포지션에서 삭제되면 그 객체를 삭제합니다.

`rememberSaveable`은 상태를 `Bundle`에 저장하여 구성 변경 간에 상태를 유지합니다.

**참고:** Compose의 상태 및 상태 호이스팅에 관한 자세한 내용은 [상태 및 Jetpack Compose](https://developer.android.com/develop/ui/compose/state?hl=ko)를 참고하세요.

### 컴포저블 매개변수 정의

컴포저블의 상태 매개변수를 정의할 때는 다음 사항을 고려해야 합니다.

- 컴포저블의 재사용 가능성 또는 유연성
- 상태 매개변수가 컴포저블의 성능에 미치는 영향

분리 및 재사용을 유도하기 위해 각 컴포저블에는 가능한 한 최소한의 정보를 포함해야 합니다. 예를 들어 뉴스 기사의 헤더를 저장하는 컴포저블을 빌드하는 경우 전체 뉴스 기사가 아니라 표시해야 하는 정보만 전달합니다.

@Composable  
fun Header(title: String, subtitle: String) {    // Recomposes when title or subtitle have changed.  
}

@Composable  
fun Header(news: News) {    // Recomposes when a new instance of News is passed in.  
}

[ArchitectureSnippets.kt](https://github.com/android/snippets/blob/5bbe6402691d75a16634d5e23d4a2ac16ede9b3d/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureSnippets.kt#L59-L67)

개별 매개변수를 사용하면 성능이 향상되는 경우도 있습니다. 예를 들어 `News`에 `title` 및 `subtitle`보다 더 많은 정보가 포함된 경우 `title` 및 `subtitle`이 변경되지 않았더라도 `News`의 새 인스턴스가 `Header(news)`에 전달될 때마다 컴포저블이 재구성됩니다.

전달하는 매개변수의 수를 신중하게 고려하세요. 함수에 매개변수가 너무 많으면 함수의 인체공학적 특성이 감소하므로 이 경우 매개변수를 클래스로 그룹화하는 것이 좋습니다.

## Compose의 이벤트

앱의 모든 입력은 탭, 텍스트 변경, 타이머 또는 기타 업데이트와 같은 이벤트로 표시해야 합니다. 이러한 이벤트로 인해 UI 상태가 변경되면 `ViewModel`가 이를 처리하고 UI 상태를 업데이트해야 합니다.

UI 레이어가 이벤트 핸들러 외부에서 상태를 변경하면 안 됩니다. 이렇게 하면 애플리케이션에 불일치 및 버그가 발생할 수 있습니다.

상태 및 이벤트 핸들러 람다에 변경할 수 없는 값을 전달하는 것이 좋습니다. 이 접근 방식에는 다음과 같은 이점이 있습니다.

- 재사용 가능성이 개선됩니다.
- UI가 상태의 값을 직접 변경하지 않습니다.
- 상태가 다른 스레드에서 변경되지 않기 때문에 동시 실행 문제가 발생하지 않습니다.
- 보통 코드 복잡성이 감소합니다.

예를 들어 `String` 및 람다를 매개변수로 사용할 수 있는 컴포저블은 많은 컨텍스트에서 호출할 수 있으며 재사용 가능성이 높습니다. 앱의 상단 앱 바에 항상 텍스트가 표시되고 뒤로 버튼이 있다고 가정해 보겠습니다. 텍스트 및 뒤로 버튼 핸들을 매개변수로 수신하는 더 일반적인 `MyAppTopAppBar` 컴포저블을 정의할 수 있습니다.

@Composable  
fun MyAppTopAppBar(topAppBarText: String, onBackPressed: () -> Unit) {    TopAppBar(        title = {            Text(                text = topAppBarText,                textAlign = TextAlign.Center,                modifier = Modifier                    .fillMaxSize()                    .wrapContentSize(Alignment.Center)            )        },        navigationIcon = {            IconButton(onClick = onBackPressed) {                Icon(                    Icons.Filled.ArrowBack,                    contentDescription = localizedString                )            }        },        // ...    )  
}

[ArchitectureSnippets.kt](https://github.com/android/snippets/blob/5bbe6402691d75a16634d5e23d4a2ac16ede9b3d/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureSnippets.kt#L75-L97)

### ViewModel, 상태 및 이벤트: 예

다음 중 하나가 참인 경우 `ViewModel` 및 `mutableStateOf`를 사용하여 앱에 단방향 데이터 흐름을 도입할 수도 있습니다.

- UI의 상태는 관찰 가능한 상태 홀더(예: `StateFlow` 또는 `LiveData`)를 통해 노출됩니다.
- `ViewModel`은 앱의 UI 또는 다른 레이어에서 발생하는 이벤트를 처리하고 이벤트를 기반으로 상태 홀더를 업데이트합니다.

예를 들어 로그인 화면을 구현할 때 *로그인* 버튼을 탭하면 앱에 진행률 스피너 및 네트워크 호출이 표시됩니다. 로그인에 성공하면 앱이 다른 화면으로 이동합니다. 오류가 발생한 경우 앱에 스낵바가 표시됩니다. 다음은 화면 상태와 이벤트를 모델링하는 방법입니다.

화면에는 네 가지 상태가 있습니다.

- **로그아웃됨**: 사용자가 아직 로그인하지 않음
- **진행 중**: 앱에서 현재 네트워크를 호출하여 사용자를 로그인하려고 하는 중임
- **오류**: 로그인하는 중에 오류가 발생함
- **로그인됨**: 사용자가 로그인함

이러한 상태를 봉인 클래스로 모델링할 수 있습니다. `ViewModel`는 상태를 다음과 같이 노출합니다. `State`로 초기 상태를 설정하고 필요에 따라 상태를 업데이트합니다. 이 `ViewModel`는 `onSignIn()` 메서드를 노출하여 로그인 이벤트도 처리합니다.

```
class MyViewModel : ViewModel() {    private val _uiState = mutableStateOf<UiState>(UiState.SignedOut)    val uiState: State<UiState>        get() = _uiState    // ...
}
```

[ArchitectureSnippets.kt](https://github.com/android/snippets/blob/5bbe6402691d75a16634d5e23d4a2ac16ede9b3d/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureSnippets.kt#L110-L117)

`mutableStateOf` API 외에 Compose는 `LiveData`, `Flow`, `Observable`이 리스너로 등록하고 값을 상태로 표시할 수 있는 [확장 프로그램](https://developer.android.com/develop/ui/compose/interop?hl=ko#streams)을 제공합니다.

```
class MyViewModel : ViewModel() {    private val _uiState = MutableLiveData<UiState>(UiState.SignedOut)    val uiState: LiveData<UiState>        get() = _uiState    // ...
}

@Composable
fun MyComposable(viewModel: MyViewModel) {    val uiState = viewModel.uiState.observeAsState()    // ...
}
```

[ArchitectureSnippets.kt](https://github.com/android/snippets/blob/5bbe6402691d75a16634d5e23d4a2ac16ede9b3d/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureSnippets.kt#L123-L135)

# Jetpack Compose 아키텍처 레이어링 

이 페이지에서는 Jetpack Compose를 구성하는 아키텍처 레이어와 관련 디자인에 큰 영향을 주는 핵심 원칙을 간략하게 설명합니다.

Jetpack Compose는 단일 모놀리식 프로젝트가 아닙니다. 완전한 스택을 만들기 위해 함께 조합된 다수의 모듈로 만들어졌습니다. Jetpack Compose를 구성하는 여러 모듈을 이해하면 다음이 가능합니다.

- 적절한 수준의 추상화를 사용하여 앱 또는 라이브러리 빌드
- 보다 세부적인 제어나 맞춤설정을 위해 낮은 수준으로 '드롭다운할' 수 있는 경우 파악
- 종속 항목 최소화

## 레이어

Jetpack Compose의 기본 레이어는 다음과 같습니다.

![](https://developer.android.com/static/develop/ui/compose/images/layering-major-layers.svg?hl=ko)

**그림 1.** Jetpack Compose의 기본 레이어

각 레이어는 하위 수준에 기반하고, 상위 수준의 구성요소를 만들기 위해 기능을 결합합니다. 각 레이어는 하위 레이어의 공개 API를 기반으로 하여 모듈 경계를 확인하고 필요한 경우 레이어를 대체할 수 있게 해줍니다. 이러한 레이어를 아래부터 살펴보겠습니다.

[런타임](https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko)

이 모듈은 [`remember`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#remember(kotlin.Function0)>), [`mutableStateOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#mutableStateOf(kotlin.Any,androidx.compose.runtime.SnapshotMutationPolicy)>), [`@Composable`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/Composable?hl=ko) 주석, [`SideEffect`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#SideEffect(kotlin.Function0)>) 같은 Compose 런타임의 기초를 제공합니다. UI가 아닌 Compose의 트리 관리 기능만 필요한 경우 이 레이어에 바로 빌드하는 것이 좋습니다.

[UI](https://developer.android.com/reference/kotlin/androidx/compose/ui/package-summary?hl=ko)

UI 레이어는 여러 개의 모듈([`ui-text`](https://developer.android.com/reference/kotlin/androidx/compose/ui/text/package-summary?hl=ko), [`ui-graphics`](https://developer.android.com/reference/kotlin/androidx/compose/ui/graphics/package-summary?hl=ko), [`ui-tooling`](https://developer.android.com/reference/kotlin/androidx/compose/ui/tooling/package-summary?hl=ko))로 구성됩니다. 그러한 모듈은 `LayoutNode`, [`Modifier`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko), 입력 핸들러, 맞춤 레이아웃, 그리기 같은 UI 툴킷의 기본 사항을 구현합니다. UI 툴킷의 기본 개념만 필요한 경우 이 레이어를 기반으로 빌드하는 것이 좋습니다.

[기초](https://developer.android.com/reference/kotlin/androidx/compose/foundation/package-summary?hl=ko)

이 모듈은 Compose UI에 [`Row`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#Row(androidx.compose.ui.Modifier,androidx.compose.foundation.layout.Arrangement.Horizontal,androidx.compose.ui.Alignment.Vertical,kotlin.Function1)>), [`Column`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#Column(androidx.compose.ui.Modifier,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,kotlin.Function1)>), [`LazyColumn`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/lazy/package-summary?hl=ko#LazyColumn(androidx.compose.ui.Modifier,androidx.compose.foundation.lazy.LazyListState,androidx.compose.foundation.layout.PaddingValues,kotlin.Boolean,androidx.compose.foundation.layout.Arrangement.Vertical,androidx.compose.ui.Alignment.Horizontal,androidx.compose.foundation.gestures.FlingBehavior,kotlin.Function1)>), 특정 동작 인식 같은 디자인 시스템에 구속되지 않는 구성요소를 제공합니다. 자체 디자인 시스템을 만들 때는 기초 레이어를 기반으로 빌드하는 것이 좋습니다.

[Material](https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko)

이 모듈은 Compose UI에 Material Design 시스템의 구현을 제공하고 테마 설정 시스템, 스타일 적용된 구성요소, 물결 표시, 아이콘도 제공합니다. 앱에 머티리얼 디자인을 사용할 때는 이 레이어를 기반으로 빌드합니다.

## 디자인 원칙

Jetpack Compose의 기본 원칙은 몇 가지 모놀리식 구성요소를 제공하는 것보다 함께 조립(또는 구성)할 수 있는 작고 집중된 기능을 제공하는 것입니다. 이 접근방식에는 여러 가지 장점이 있습니다.

### 컨트롤

상위 수준의 구성요소는 자동으로 더 많은 작업을 실행하지만 개발자가 직접 제어할 수 있는 정도를 제한합니다. 더 많은 제어가 필요하면 하위 수준의 구성요소를 사용하도록 '드롭다운'하면 됩니다.

예를 들어 구성요소 색상을 애니메이션으로 표시하려면 [`animateColorAsState`](<https://developer.android.com/reference/kotlin/androidx/compose/animation/package-summary?hl=ko#animateColorAsState(androidx.compose.ui.graphics.Color,androidx.compose.animation.core.AnimationSpec,kotlin.Function1)>) API를 사용하면 됩니다.

```
val color = animateColorAsState(if (condition) Color.Green else Color.Red)
```

[ArchitectureLayering.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureLayering.kt#L39-L39)

그러나 구성요소를 항상 회색으로 시작해야 하는 경우에는 이 API에서 가능하지 않습니다. 대신 하위 수준의 [`Animatable`](<https://developer.android.com/reference/kotlin/androidx/compose/animation/core/package-summary?hl=ko#Animatable(kotlin.Float,kotlin.Float)>) API를 사용하도록 드롭다운하면 됩니다.

```
val color = remember { Animatable(Color.Gray) }
LaunchedEffect(condition) {
    color.animateTo(if (condition) Color.Green else Color.Red)
}
```

[ArchitectureLayering.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureLayering.kt#L46-L49)

상위 수준의 `animateColorAsState` API 자체는 하위 수준의 `Animatable` API를 기반으로 빌드됩니다. 하위 수준의 API 사용이 좀 더 복잡하지만 보다 세부적인 제어가 가능합니다. 필요에 가장 적합한 추상화 수준을 선택하세요.

### 맞춤설정

작은 구성요소에서 상위 수준의 구성요소를 조합하면 필요할 때 훨씬 더 쉽게 구성요소를 맞춤설정할 수 있습니다. 예를 들어 Material 레이어에서 제공하는 [`Button`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#Button(kotlin.Function0,androidx.compose.ui.Modifier,kotlin.Boolean,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.material.ButtonElevation,androidx.compose.ui.graphics.Shape,androidx.compose.foundation.BorderStroke,androidx.compose.material.ButtonColors,androidx.compose.foundation.layout.PaddingValues,kotlin.Function1)>)의 [구현](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/material/material/src/commonMain/kotlin/androidx/compose/material/Button.kt?hl=ko)을 살펴보겠습니다.

```
@Composable
fun Button(
    // …
    content: @Composable RowScope.() -> Unit
) {
    Surface(/* … */) {
        CompositionLocalProvider(/* … */) { // set LocalContentAlpha
            ProvideTextStyle(MaterialTheme.typography.button) {
                Row(
                    // …
                    content = content
                )
            }
        }
    }
}
```

[ArchitectureLayering.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureLayering.kt#L54-L69)

`Button`은 4가지 구성요소로 조합되었습니다.

4. 배경, 도형, 클릭 처리 등을 제공하는 머티리얼 [`Surface`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#Surface(kotlin.Function0,androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Shape,androidx.compose.ui.graphics.Color,androidx.compose.ui.graphics.Color,androidx.compose.foundation.BorderStroke,androidx.compose.ui.unit.Dp,androidx.compose.foundation.interaction.MutableInteractionSource,androidx.compose.foundation.Indication,kotlin.Boolean,kotlin.String,androidx.compose.ui.semantics.Role,kotlin.Function0)>)
5. 버튼이 사용되거나 중지될 때 콘텐츠의 알파를 변경하는 [`CompositionLocalProvider`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#CompositionLocalProvider(kotlin.Array,kotlin.Function0)>)
6. 사용할 기본 텍스트 스타일을 설정하는 [`ProvideTextStyle`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#ProvideTextStyle(androidx.compose.ui.text.TextStyle,kotlin.Function0)>)
7. 버튼 콘텐츠의 기본 레이아웃 정책을 제공하는 `Row`

구조를 좀 더 명확히 하기 위해 일부 매개변수와 주석을 생략했습니다. 하지만 전체 구성요소는 버튼 구현을 위해 이러한 4개 구성요소를 조합하는 역할만 하기 때문에 약 40개의 코드 줄에 불과합니다. `Button`과 같은 구성요소는 노출되는 매개변수에 관해 편향적이고, 구성요소의 사용을 더 어렵게 만들 수 있는 매개변수의 증가와 관련해 사용 설정된 일반 맞춤설정의 균형을 잡습니다. 예를 들어 Material 구성요소는 Material Design 시스템에 지정된 맞춤설정을 제공하기 때문에 Material Design 원칙을 쉽게 따를 수 있습니다.

하지만 구성요소의 매개변수 이외의 요소를 맞춤설정하려면 수준을 '드롭다운'하고 구성요소를 포크하면 됩니다. 예를 들어, 머티리얼 디자인에는 버튼 배경이 단색이어야 한다고 지정되어 있습니다. 그라데이션 배경이 필요한 경우 이는 `Button` 매개변수에서 지원되지 않습니다. 이 경우 Material `Button` 구현을 참조로 사용하고 자체 구성요소를 빌드할 수 있습니다.

```
@Composable
fun GradientButton(
    // …
    background: List<Color>,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit
) {
    Row(
        // …
        modifier = modifier
            .clickable(onClick = {})
            .background(
                Brush.horizontalGradient(background)
            )
    ) {
        CompositionLocalProvider(/* … */) { // set material LocalContentAlpha
            ProvideTextStyle(MaterialTheme.typography.button) {
                content()
            }
        }
    }
}
```

[ArchitectureLayering.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureLayering.kt#L73-L94)

위 구현에서는 머티리얼의 [현재 콘텐츠 알파](https://developer.android.com/develop/ui/compose/designsystems/material3?hl=ko#emphasis) 개념과 현재 텍스트 스타일 개념 같은 머티리얼 레이어의 구성요소를 계속 사용하고 있습니다. 하지만 머티리얼 `Surface`를 `Row`로 대체하고 스타일을 지정하여 원하는 모양을 만듭니다.

**주의:** 구성요소를 맞춤설정하기 위해 하위 레이어로 드롭다운할 때 접근성 지원을 무시하는 등 기능을 저하시키지 않도록 합니다. 포크하는 구성요소를 가이드로 삼으세요.

맞춤 디자인 시스템을 빌드하는 등 Material 개념을 전혀 사용하지 않으려는 경우 기반 레이어 구성요소만 순수하게 사용하도록 드롭다운할 수 있습니다.

```
@Composable
fun BespokeButton(
    // …
    backgroundColor: Color,
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit
) {
    Row(
        // …
        modifier = modifier
            .clickable(onClick = {})
            .background(backgroundColor)
    ) {
        // No Material components used
        content()
    }
}
```

[ArchitectureLayering.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/architecture/ArchitectureLayering.kt#L98-L114)

Jetpack Compose는 최상위 수준의 구성요소에는 가장 단순한 이름을 예약합니다. 예를 들어 [`androidx.compose.material.Text`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#Text(kotlin.String,androidx.compose.ui.Modifier,androidx.compose.ui.graphics.Color,androidx.compose.ui.unit.TextUnit,androidx.compose.ui.text.font.FontStyle,androidx.compose.ui.text.font.FontWeight,androidx.compose.ui.text.font.FontFamily,androidx.compose.ui.unit.TextUnit,androidx.compose.ui.text.style.TextDecoration,androidx.compose.ui.text.style.TextAlign,androidx.compose.ui.unit.TextUnit,androidx.compose.ui.text.style.TextOverflow,kotlin.Boolean,kotlin.Int,kotlin.Function1,androidx.compose.ui.text.TextStyle)>)는 [`androidx.compose.foundation.text.BasicText`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/text/package-summary?hl=ko#BasicText(kotlin.String,androidx.compose.ui.Modifier,androidx.compose.ui.text.TextStyle,kotlin.Function1,androidx.compose.ui.text.style.TextOverflow,kotlin.Boolean,kotlin.Int)>)를 기반으로 합니다. 이렇게 하면 상위 수준을 대체하려고 할 때 자체 구현에 가장 쉽게 찾을 수 있는 이름을 제공할 수 있습니다.

**주의:** 구성요소를 포크하면 업스트림 구성요소의 향후 추가사항이나 버그 수정을 활용하지 못하게 됩니다.

### 정확한 추상화 선택

재사용 가능한 계층화된 구성요소를 빌드한다는 Compose 철학의 의미는 항상 하위 수준의 구성요소만 추구해서는 안 된다는 뜻을 담고 있습니다. 대다수 상위 수준 구성요소가 더 많은 기능을 제공할 뿐만 아니라 접근성 지원과 같은 권장사항을 구현하는 경우도 많습니다.

예를 들어 맞춤 구성요소에 동작 지원을 추가하려면 [`Modifier.pointerInput`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/input/pointer/package-summary?hl=ko#(androidx.compose.ui.Modifier).pointerInput(kotlin.Any,kotlin.coroutines.SuspendFunction1)>)을 사용하여 처음부터 이를 빌드해도 됩니다. 하지만 이 구성요소를 기반으로 빌드된 다른 상위 수준 구성요소가 있고 이러한 구성요소가 좀 더 나은 시작점을 제공할 수 있습니다. [`Modifier.draggable`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/gestures/package-summary?hl=ko#(androidx.compose.ui.Modifier).draggable(androidx.compose.foundation.gestures.DraggableState,androidx.compose.foundation.gestures.Orientation,kotlin.Boolean,androidx.compose.foundation.interaction.MutableInteractionSource,kotlin.Boolean,kotlin.coroutines.SuspendFunction2,kotlin.coroutines.SuspendFunction2,kotlin.Boolean)>), [`Modifier.scrollable`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/gestures/package-summary?hl=ko#(androidx.compose.ui.Modifier).scrollable(androidx.compose.foundation.gestures.ScrollableState,androidx.compose.foundation.gestures.Orientation,kotlin.Boolean,kotlin.Boolean,androidx.compose.foundation.gestures.FlingBehavior,androidx.compose.foundation.interaction.MutableInteractionSource)>), [`Modifier.swipeable`](<https://developer.android.com/reference/kotlin/androidx/compose/material/package-summary?hl=ko#(androidx.compose.ui.Modifier).swipeable(androidx.compose.material.SwipeableState,kotlin.collections.Map,androidx.compose.foundation.gestures.Orientation,kotlin.Boolean,kotlin.Boolean,androidx.compose.foundation.interaction.MutableInteractionSource,kotlin.Function2,androidx.compose.material.ResistanceConfig,androidx.compose.ui.unit.Dp)>) 등이 그 예입니다.

일반적으로 *최상위 수준* 구성요소를 기반으로 하는 것이 좋습니다. 이러한 구성요소가 권장사항의 이점을 누리는 데 필요한 기능을 제공합니다.

# CompositionLocal을 사용한 로컬 범위 지정 데이터 

[`CompositionLocal`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal?hl=ko)은 암시적으로 컴포지션을 통해 데이터를 전달하는 도구입니다. 이 페이지에서는 `CompositionLocal`의 자세한 내용과 자체 `CompositionLocal`을 만드는 방법, `CompositionLocal`이 사용 사례에 적합한 솔루션인지 확인하는 방법을 알아봅니다.

## `CompositionLocal` 소개

일반적으로 Compose에서 [데이터는 각 구성 가능한 함수의 매개변수로 UI 트리를 통해 아래로 흐릅니다](https://developer.android.com/develop/ui/compose/architecture?hl=ko). 따라서 컴포저블의 종속 항목이 명시적으로 됩니다. 그러나 이 방법은 색상이나 유형 스타일과 같이 매우 자주 널리 사용되는 데이터의 경우에는 번거로울 수 있습니다. 아래 예를 참고하세요.

```kotlin
@Composable
fun MyApp() {
    // Theme information tends to be defined near the root of the application
    val colors = colors()
}

// Some composable deep in the hierarchy
@Composable
fun SomeTextLabel(labelText: String) {
    Text(
        text = labelText,
        color = colors.onPrimary // ← need to access colors here
    )
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L46-L59)

색상을 대부분의 컴포저블에 명시적 매개변수 종속 항목으로 전달할 필요가 없도록 지원하기 위해 **Compose는 [`CompositionLocal`](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal?hl=ko)을 제공합니다. 이를 통해 UI 트리를 통해 데이터 흐름이 발생하는 암시적 방법으로 사용할 수 있는 트리 범위의 명명된 객체를 만들 수 있습니다.**

`CompositionLocal` 요소는 일반적으로 UI 트리의 특정 노드의 값과 함께 제공됩니다. 이 값은 구성 가능한 함수에서 `CompositionLocal`을 매개변수로 선언하지 않아도, 구성 가능한 하위 요소에 사용할 수 있습니다.

**주요 용어:** 이 가이드에서는 **컴포지션**과 **UI 트리**, **UI 계층 구조**라는 용어를 사용합니다. 다른 가이드에서 교체하여 사용할 수 있지만 의미는 다릅니다.

**컴포지션**은 구성 가능한 함수의 호출 그래프 레코드입니다.

**UI 트리**나 **UI 계층 구조**는 컴포지션 프로세스로 구성되고 업데이트되며 유지되는 [LayoutNode](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/LayoutNode.kt?hl=ko)의 트리입니다.

`CompositionLocal`은 Material 테마에서 내부적으로 사용하는 것입니다. [`MaterialTheme`](https://developer.android.com/reference/kotlin/androidx/compose/material3/MaterialTheme?hl=ko)은 나중에 컴포지션의 하위 부분에서 가져올 수 있는 세 개의 `CompositionLocal` 인스턴스(`colorScheme`, `typography`, `shapes`)를 제공하는 객체입니다. 이러한 인스턴스는 구체적으로 `LocalColorScheme`, `LocalShapes`, `LocalTypography` 속성으로, `MaterialTheme` `colorScheme`, `shapes`, `typography` 속성을 통해 액세스할 수 있습니다.

```kotlin
@Composable
fun MyApp() {
    // Provides a Theme whose values are propagated down its `content`
    MaterialTheme {
        // New values for colorScheme, typography, and shapes are available
        // in MaterialTheme's content lambda.

        // ... content here ...
    }
}

// Some composable deep in the hierarchy of MaterialTheme
@Composable
fun SomeTextLabel(labelText: String) {
    Text(
        text = labelText,
        // `primary` is obtained from MaterialTheme's
        // LocalColors CompositionLocal
        color = MaterialTheme.colorScheme.primary
    )
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L65-L85)

**`CompositionLocal` 인스턴스는 컴포지션의 일부로 범위가 지정**되므로 트리의 여러 수준에서 다양한 값을 제공할 수 있습니다. `CompositionLocal`의 [`current`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal?hl=ko#current()>) 값은 컴포지션에서 범위가 지정된 부분의 상위 요소가 제공한 가장 가까운 값에 대응합니다.

**새 값을 `CompositionLocal`에 제공하려면 [`CompositionLocalProvider`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#CompositionLocalProvider(kotlin.Array,kotlin.Function0)>)**와 `CompositionLocal` 키를 `value`에 연결하는 [`provides`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/ProvidableCompositionLocal?hl=ko#provides(kotlin.Any)>) 중위 함수를 사용합니다. `CompositionLocalProvider`의 `content` 람다는 `CompositionLocal`의 `current` 속성에 액세스할 때 제공된 값을 가져옵니다. 새 값이 제공되면 Compose는 `CompositionLocal`을 읽는 컴포지션의 부분을 재구성합니다.

예를 들어 [`LocalContentColor`](<https://developer.android.com/reference/kotlin/androidx/compose/material3/package-summary?hl=ko#LocalContentColor()>) `CompositionLocal`에는 텍스트와 아이콘에 사용되는 기본 콘텐츠 색상이 포함되어 있어 현재 배경색과 대비되도록 합니다. 다음 예에서 `CompositionLocalProvider`는 컴포지션의 여러 부분에 다양한 값을 제공하는 데 사용됩니다.

```kotlin
@Composable
fun CompositionLocalExample() {
    MaterialTheme {
        // Surface provides contentColorFor(MaterialTheme.colorScheme.surface) by default
        // This is to automatically make text and other content contrast to the background
        // correctly.
        Surface {
            Column {
                Text("Uses Surface's provided content color")
                CompositionLocalProvider(LocalContentColor provides MaterialTheme.colorScheme.primary) {
                    Text("Primary color provided by LocalContentColor")
                    Text("This Text also uses primary as textColor")
                    CompositionLocalProvider(LocalContentColor provides MaterialTheme.colorScheme.error) {
                        DescendantExample()
                    }
                }
            }
        }
    }
}

@Composable
fun DescendantExample() {
    // CompositionLocalProviders also work across composable functions
    Text("This Text uses the error color now")
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L91-L116)

![](https://developer.android.com/static/develop/ui/compose/images/compositionlocal-color.png?hl=ko)

**그림 1.** `CompositionLocalExample` 컴포저블의 미리보기

마지막 예에서 `CompositionLocal` 인스턴스는 머티리얼 컴포저블에서 내부적으로 사용되었습니다. `CompositionLocal`의 현재 값에 액세스하려면 [`current`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal?hl=ko#current()>) 속성을 사용합니다. 다음 예에서는 Android 앱에서 흔히 사용되는 [`LocalContext`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/platform/package-summary?hl=ko#LocalContext()>) `CompositionLocal`의 현재 [`Context`](https://developer.android.com/reference/android/content/Context?hl=ko) 값을 사용하여 텍스트의 형식을 지정합니다.

```
@Composable
fun FruitText(fruitSize: Int) {
    // Get `resources` from the current value of LocalContext
    val resources = LocalContext.current.resources
    val fruitText = remember(resources, fruitSize) {
        resources.getQuantityString(R.plurals.fruit_title, fruitSize)
    }
    Text(text = fruitText)
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L122-L130)

**참고:** `CompositionLocal` 객체나 상수에는 일반적으로 `Local` 접두사가 붙어 IDE에서 자동 완성 기능을 통한 검색 가능성을 개선할 수 있습니다.

## 나만의 `CompositionLocal` 만들기

`CompositionLocal`은 **암시적으로 컴포지션을 통해 데이터를 전달하는 도구**입니다.

**`CompositionLocal` 사용을 위한 또 다른 주요 신호는 매개변수가 크로스 커팅이고 구현의 중간 레이어가 그 존재를 인식해서는 안 되는 경우입니다.** 이러한 중간 레이어가 인식하도록 하면 컴포저블의 유틸리티가 제한될 수 있기 때문입니다. 예를 들어 Android 권한 쿼리는 내부적으로 `CompositionLocal`에서 제공됩니다. 미디어 선택 도구 컴포저블은 API를 변경하지 않고 미디어 선택 도구 호출자가 환경에서 사용하는 이러한 추가 컨텍스트를 인식하도록 요구하지 않고도 기기에서 권한으로 보호되는 콘텐츠에 액세스하는 새로운 기능을 추가할 수 있습니다.

그러나 `CompositionLocal`이 항상 최선의 솔루션은 아닙니다. `CompositionLocal`을 *과도하게 사용*하지 않는 것이 좋습니다. 다음과 같은 단점이 있기 때문입니다.

**`CompositionLocal`은 컴포저블의 동작을 추론하기 어렵게 합니다**. 암시적 종속 항목을 만들 때 이를 사용하는 컴포저블의 호출자는 모든 `CompositionLocal`의 값이 충족되는지 확인해야 합니다.

또한 이 종속 항목은 컴포지션의 모든 부분에서 변경될 수 있으므로 종속 항목에 관한 명확한 정보 소스가 없을 수도 있습니다. 따라서 **문제가 발생할 때 앱을 디버깅하는 것이 더 어려울 수 있습니다**. 컴포지션을 탐색하여 `current` 값이 제공된 위치를 확인해야 하기 때문입니다. IDE의 *Find usages*나 [Compose 레이아웃 검사기](https://developer.android.com/develop/ui/compose/tooling?hl=ko#layout-inspector)와 같은 도구에서는 이 문제를 완화할 정보를 충분히 제공합니다.

**참고:** `CompositionLocal`은 기본 아키텍처에 적합하고 Jetpack Compose에서 많이 사용합니다.

### `CompositionLocal` 사용 여부 결정

특정 조건에서는 사용 사례에 `CompositionLocal`이 적합한 솔루션이 될 수 있습니다.

**`CompositionLocal`에는 적절한 기본값이 있어야** 합니다. 기본값이 없으면 개발자가 `CompositionLocal`의 값이 제공되지 않는 매우 곤란한 상황에 처할 수 있다는 것을 확실하게 해야 합니다. 기본값을 제공하지 않으면 테스트를 만들거나 `CompositionLocal`을 사용하는 컴포저블을 미리 볼 때 항상 명시적으로 제공되도록 기본값을 요구해야 하는 문제와 불만이 발생할 수 있습니다.

***트리 범위 또는 하위 계층 구조 범위*로 간주되지 않는 개념에는 `CompositionLocal`을 사용하지 않습니다.** `CompositionLocal`은 잠재적으로 일부 하위 요소가 아닌 모든 하위 요소에서 사용할 수 있을 때 적합합니다.

사용 사례가 이러한 요구사항을 충족하지 않는다면 `CompositionLocal`을 만들기 전에 [고려할 대안](https://developer.android.com/develop/ui/compose/compositionlocal?hl=ko#alternatives) 섹션을 확인하세요.

좋지 않은 방법의 예는 특정 화면의 `ViewModel`을 보유하는 `CompositionLocal`을 만들어 이 화면의 모든 컴포저블이 일부 로직을 실행하는 `ViewModel`을 참조할 수 있도록 하는 것입니다. 이 방법이 좋지 않은 이유는 특정 UI 트리 아래의 모든 컴포저블이 `ViewModel`에 관해 알 필요는 없기 때문입니다. [상태는 아래로 흐르고 이벤트는 위로 흐르는](https://developer.android.com/develop/ui/compose/architecture?hl=ko) 패턴에 따라 필요한 정보만 컴포저블에 전달하는 것이 좋습니다. 이 방법을 통해 컴포저블을 재사용하고 테스트하기가 더 쉬워집니다.

### `CompositionLocal` 만들기

`CompositionLocal`을 만드는 두 가지 API가 있습니다.

- [`compositionLocalOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#compositionLocalOf(androidx.compose.runtime.SnapshotMutationPolicy,kotlin.Function0)>): 재구성 중에 제공된 값을 변경하면 [`current`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal?hl=ko#current()>) 값을 읽는 콘텐츠*만* 무효화됩니다.
- [`staticCompositionLocalOf`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#staticCompositionLocalOf(kotlin.Function0)>): `compositionLocalOf`와 달리 `staticCompositionLocalOf` 읽기는 Compose에서 추적하지 않습니다. 값을 변경하면 컴포지션에서 `current` 값을 읽는 위치만이 아니라 `CompositionLocal`이 제공된 `content` 람다 전체가 재구성됩니다.

`CompositionLocal`에 제공된 값이 변경될 가능성이 거의 없거나 변경되지 않는다면 `staticCompositionLocalOf`를 사용하여 성능 이점을 얻으세요.

예를 들어 앱의 디자인 시스템은 컴포저블이 UI 구성요소의 그림자를 사용하여 높아지는 방식으로 독단적일 수 있습니다. 앱의 다양한 고도는 UI 트리 전체에 전파되어야 하므로 `CompositionLocal`을 사용합니다. `CompositionLocal` 값은 시스템 테마에 기반하여 조건부로 파생되므로 `compositionLocalOf` API를 사용합니다.

```
// LocalElevations.kt file

data class Elevations(val card: Dp = 0.dp, val default: Dp = 0.dp)

// Define a CompositionLocal global object with a default
// This instance can be accessed by all composables in the app
val LocalElevations = compositionLocalOf { Elevations() }
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L136-L142)

### `CompositionLocal`에 값 제공

**[`CompositionLocalProvider`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/package-summary?hl=ko#CompositionLocalProvider(kotlin.Array,kotlin.Function0)>) 컴포저블은 주어진 계층 구조의 `CompositionLocal` 인스턴스에 값을 바인딩합니다**. `CompositionLocal`에 새 값을 제공하려면 다음과 같이 `CompositionLocal` 키를 `value`에 연결하는 [`provides`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/ProvidableCompositionLocal?hl=ko#provides%0A(kotlin.Any)>) 중위 함수를 사용하세요.

```
// MyActivity.kt file

class MyActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            // Calculate elevations based on the system theme
            val elevations = if (isSystemInDarkTheme()) {
                Elevations(card = 1.dp, default = 1.dp)
            } else {
                Elevations(card = 0.dp, default = 0.dp)
            }

            // Bind elevation as the value for LocalElevations
            CompositionLocalProvider(LocalElevations provides elevations) {
                // ... Content goes here ...
                // This part of Composition will see the `elevations` instance
                // when accessing LocalElevations.current
            }
        }
    }
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L146-L168)

### `CompositionLocal` 소비

[`CompositionLocal.current`](<https://developer.android.com/reference/kotlin/androidx/compose/runtime/ProvidableCompositionLocal?hl=ko#current()>)는 `CompositionLocal`에 값을 제공하는 가장 가까운 `CompositionLocalProvider`에서 제공한 값을 반환합니다.

```
@Composable
fun SomeComposable() {
    // Access the globally defined LocalElevations variable to get the
    // current Elevations in this part of the Composition
    MyCard(elevation = LocalElevations.current.card) {
        // Content
    }
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L172-L179)

## 고려할 대안

일부 사용 사례에서는 `CompositionLocal`이 지나친 솔루션일 수 있습니다. 사용 사례가 [CompositionLocal 사용 여부 결정](https://developer.android.com/develop/ui/compose/compositionlocal?hl=ko#deciding) 섹션에 지정된 기준을 충족하지 않으면 다른 솔루션이 사용 사례에 더 적합할 수 있습니다.

### 명시적 매개변수 전달

컴포저블의 종속 항목에 관해 명시적인 것이 좋습니다. **컴포저블에는 필요한 것*만* 전달**하는 것이 좋습니다. 컴포저블의 분리와 재사용을 촉진하려면 각 컴포저블이 가능한 가장 적은 정보를 보유해야 합니다.

```
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel.data)
}

// Don't pass the whole object! Just what the descendant needs.
// Also, don't  pass the ViewModel as an implicit dependency using
// a CompositionLocal.
@Composable
fun MyDescendant(myViewModel: MyViewModel) { /* ... */ }

// Pass only what the descendant needs
@Composable
fun MyDescendant(data: DataToDisplay) {
    // Display data
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L189-L205)

### 컨트롤 역전

불필요한 종속 항목을 컴포저블에 전달하지 않는 또 다른 방법은 *컨트롤 역전*을 사용하는 것입니다. 하위 요소가 일부 로직을 실행하는 종속 항목을 가져오지 않고 대신 상위 요소가 실행합니다.

다음 예는 하위 요소가 일부 데이터 로드 요청을 트리거해야 하는 경우를 보여줍니다.

```
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    MyDescendant(myViewModel)
}

@Composable
fun MyDescendant(myViewModel: MyViewModel) {
    Button(onClick = { myViewModel.loadData() }) {
        Text("Load data")
    }
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L211-L222)

경우에 따라 `MyDescendant`에는 많은 책임이 있을 수 있습니다. `MyViewModel`을 종속 항목으로 전달하면 두 컴포저블이 함께 결합되기 때문에 `MyDescendant`의 재사용성도 줄어듭니다. 종속 항목을 하위 요소에 전달하지 않고 상위 요소가 로직 실행을 담당하도록 하는 제어 역전 원칙을 사용하는 대안을 고려해보세요.

```
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusableLoadDataButton(
        onLoadClick = {
            myViewModel.loadData()
        }
    )
}

@Composable
fun ReusableLoadDataButton(onLoadClick: () -> Unit) {
    Button(onClick = onLoadClick) {
        Text("Load data")
    }
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L228-L243)

이 접근 방식은 일부 사용 사례에 더 적합할 수 있습니다. **하위 요소를 직계 상위 요소에서 분리**하기 때문입니다. 상위 컴포저블은 더 유연한 하위 수준 컴포저블을 보유하기 위해 더 복잡해지는 경향이 있습니다.

마찬가지로 **`@Composable` 콘텐츠 람다를 같은 방식으로 사용하여 동일한 이점을 얻을 수 있습니다**.

```
@Composable
fun MyComposable(myViewModel: MyViewModel = viewModel()) {
    // ...
    ReusablePartOfTheScreen(
        content = {
            Button(
                onClick = {
                    myViewModel.loadData()
                }
            ) {
                Text("Confirm")
            }
        }
    )
}

@Composable
fun ReusablePartOfTheScreen(content: @Composable () -> Unit) {
    Column {
        // ...
        content()
    }
}
```

[CompositionLocalSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/state/CompositionLocalSnippets.kt#L249-L271)

# Compose 수정자 

수정자를 사용하면 컴포저블을 장식하거나 강화할 수 있습니다. 수정자를 통해 다음과 같은 종류의 작업을 실행할 수 있습니다.

- 컴포저블의 크기, 레이아웃, 동작 및 모양 변경
- 접근성 라벨과 같은 정보 추가
- 사용자 입력 처리
- 요소를 클릭 가능, 스크롤 가능, 드래그 가능 또는 확대/축소 가능하게 만드는 높은 수준의 상호작용 추가

수정자는 표준 Kotlin 객체입니다. [`Modifier`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko) 클래스 함수 중 하나를 호출하여 수정자를 만듭니다.

```
@Composable
private fun Greeting(name: String) {
    Column(modifier = Modifier.padding(24.dp)) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L47-L53)

![컬러 배경에 텍스트 두 줄이 있고 텍스트 주위에 패딩이 있습니다.](https://developer.android.com/static/develop/ui/compose/images/modifier-1-modifier.png?hl=ko)

다음과 같이 이러한 함수를 함께 연결하여 구성할 수 있습니다.

```
@Composable
private fun Greeting(name: String) {
    Column(
        modifier = Modifier
            .padding(24.dp)
            .fillMaxWidth()
    ) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L59-L69)

![이제 텍스트 뒤의 컬러 배경이 기기의 전체 너비로 확장합니다.](https://developer.android.com/static/develop/ui/compose/images/modifier-chained.png?hl=ko)

위의 코드에서 다양한 수정자 함수가 함께 사용된 것을 확인할 수 있습니다.

- `padding`: 요소 주위에 공간을 배치합니다.
- `fillMaxWidth`: 컴포저블이 상위 요소로부터 부여받은 최대 너비를 채우도록 합니다.

*모든* 컴포저블이 `modifier` 매개변수를 허용하고 UI를 내보내는 첫 번째 하위 요소에 이 수정자를 전달하는 것이 좋습니다. 이렇게 하면 코드의 재사용 가능성이 커지며 코드 동작이 더 예측 가능해지고 이해하기 쉬워집니다. 자세한 내용은 Compose API 가이드라인, [수정자 매개변수를 허용 및 준수하는 요소](https://android.googlesource.com/platform/frameworks/support/+/androidx-main/compose/docs/compose-api-guidelines.md#elements-accept-and-respect-a-modifier-parameter)를 참고하세요.

## 수정자의 순서가 중요

수정자 함수의 순서는 **중요**합니다. 각 함수는 이전 함수에서 반환한 `Modifier`를 변경하므로 순서는 최종 결과에 영향을 줍니다. 다음 예를 살펴보겠습니다.

```
@Composable
fun ArtistCard(/*...*/) {
    val padding = 16.dp
    Column(
        Modifier
            .clickable(onClick = onClick)
            .padding(padding)
            .fillMaxWidth()
    ) {
        // rest of the implementation
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L77-L88)

![가장자리 주변의 패딩을 포함한 영역 전체가 클릭에 반응함](https://developer.android.com/static/develop/ui/compose/images/layout-padding-clickable.gif?hl=ko)

위의 코드에서는 `padding` 수정자가 `clickable` 수정자 *뒤에* 적용되었기 때문에 주변 패딩을 포함하여 전체 영역을 클릭할 수 있습니다. 수정자 순서가 뒤집히면 다음과 같이 `padding`으로 추가된 공간은 사용자 입력에 반응하지 않습니다.

```
@Composable
fun ArtistCard(/*...*/) {
    val padding = 16.dp
    Column(
        Modifier
            .padding(padding)
            .clickable(onClick = onClick)
            .fillMaxWidth()
    ) {
        // rest of the implementation
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L96-L107)

![레이아웃 가장자리 주변의 패딩이 더 이상 클릭에 반응하지 않음](https://developer.android.com/static/develop/ui/compose/images/layout-padding-not-clickable.gif?hl=ko)

**참고:** 명시적인 순서는 다양한 수정자가 상호작용하는 방식을 추론하는 데 도움이 됩니다. 박스 모델을 학습해야 했던 뷰 기반 시스템과 이를 비교해 보세요. 박스 모델의 경우 여백은 요소 '외부'에 적용되었지만 패딩은 '내부'에 적용되었으며 백그라운드 요소는 그에 따라 크기가 조정되었습니다. 수정자 디자인을 사용하면 이러한 종류의 동작이 명확해지고 예측 가능하게 되며 원하는 동작을 정확하게 달성할 수 있도록 추가적으로 제어할 수 있습니다. `padding` 수정자를 제외한 여백 수정자가 없는 이유도 설명할 수 있습니다.

## 내장 수정자

Jetpack Compose는 컴포저블을 장식하거나 강화하는 데 도움이 되는 내장 수정자 목록을 제공합니다. 다음은 레이아웃을 조정하는 데 사용하는 몇 가지 일반적인 수정자입니다.

**참고:** 이러한 수정자 중 다수는 UI 레이아웃을 필요한 방식으로 정렬하는 데 도움이 되도록 설계되었습니다. 레이아웃에서 수정자가 작동하는 방법에 관한 자세한 내용은 [Compose 레이아웃 기본사항](https://developer.android.com/develop/ui/compose/layouts/basics?hl=ko) 문서를 참고하세요.

### `padding` 및 `size`

기본적으로 Compose에서 제공되는 레이아웃은 하위 요소를 래핑합니다. 하지만 [`size`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#(androidx.compose.ui.Modifier).size(androidx.compose.ui.unit.Dp)>) 수정자를 사용하여 크기를 설정할 수 있습니다.

```
@Composable
fun ArtistCard(/*...*/) {
    Row(
        modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(/*...*/)
        Column { /*...*/ }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L113-L121)

지정한 크기가 레이아웃의 상위 요소에서 수신된 제약 조건을 충족하지 않는 경우 적용되지 않을 수 있습니다. 수신된 제약 조건과 관계없이 컴포저블의 크기를 고정해야 하는 경우 `requiredSize` 수정자를 사용하세요.

```
@Composable
fun ArtistCard(/*...*/) {
    Row(
        modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            /*...*/
            modifier = Modifier.requiredSize(150.dp)
        )
        Column { /*...*/ }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L127-L138)

![하위 이미지가 상위 이미지의 제약 조건보다 큼](https://developer.android.com/static/develop/ui/compose/images/layout-requiredsize-new.png?hl=ko)

이 예에서는 상위 요소 `height`가 `100.dp`로 설정되더라도 `Image` 높이는 `150.dp`가 됩니다. `requiredSize` 수정자가 우선하기 때문입니다.

**참고:** 레이아웃은 제약 조건에 기반하고 일반적으로 상위 요소가 제약 조건을 하위 요소에 전달합니다. 하위 요소는 이 제약 조건을 *준수해야 합니다*. 그러나 UI의 경우 항상 그래야 하는 것은 아닙니다. 이러한 하위 요소 동작을 우회하는 방법이 있습니다. 예를 들어 `requiredSize`와 같은 수정자를 하위 요소에 직접 전달하여 상위 요소로부터 하위 요소가 수신한 제약 조건을 재정의하거나 다양한 동작이 있는 맞춤 레이아웃을 사용할 수 있습니다. 하위 요소가 제약 조건을 따르지 않으면 레이아웃 시스템은 상위 요소로부터 이를 숨깁니다. 상위 요소에는 마치 상위 요소에서 제공한 제약 조건으로 강제된 것처럼 하위 요소의 `width` 및 `height` 값이 표시됩니다. 그러면 레이아웃 시스템은 하위 요소가 제약 조건을 준수한다고 가정하고 하위 요소를 상위 요소에서 할당한 공간 내에서 중앙에 배치합니다. 개발자는 `wrapContentSize` 수정자를 하위 요소에 적용하여 이 중앙 배치 동작을 재정의할 수 있습니다.

하위 레이아웃이 상위 요소에 의해 허용된 모든 가용 높이를 채우도록 하려면 `fillMaxHeight` 수정자를 추가합니다(Compose는 `fillMaxSize` 및 `fillMaxWidth`도 제공함).

```
@Composable
fun ArtistCard(/*...*/) {
    Row(
        modifier = Modifier.size(width = 400.dp, height = 100.dp)
    ) {
        Image(
            /*...*/
            modifier = Modifier.fillMaxHeight()
        )
        Column { /*...*/ }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L144-L155)

![이미지 높이가 상위 요소만큼 큼](https://developer.android.com/static/develop/ui/compose/images/layout-fillmaxheight.png?hl=ko)

요소 주위에 패딩을 추가하려면 [`padding`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#(androidx.compose.ui.Modifier).padding(androidx.compose.ui.unit.Dp)>) 수정자를 설정합니다.

레이아웃 상단에서 기준선까지 특정 거리가 유지되도록 텍스트 기준선 위에 패딩을 추가하려면 `paddingFromBaseline` 수정자를 사용합니다.

```
@Composable
fun ArtistCard(artist: Artist) {
    Row(/*...*/) {
        Column {
            Text(
                text = artist.name,
                modifier = Modifier.paddingFromBaseline(top = 50.dp)
            )
            Text(artist.lastSeenOnline)
        }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L161-L172)

![위에 패딩이 있는 텍스트](https://developer.android.com/static/develop/ui/compose/images/layout-paddingfrombaseline-new.png?hl=ko)

### 오프셋

원래 위치를 기준으로 레이아웃을 배치하려면 [`offset`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#(androidx.compose.ui.Modifier).offset(androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp)>) 수정자를 추가하고 **x**축 및 **y**축에 오프셋을 설정합니다. 오프셋은 양수일 수도 있고 양수가 아닐 수도 있습니다. `padding`과 `offset`의 차이점은 컴포저블에 `offset`을 추가해도 측정값이 변경되지 않는다는 것입니다.

```
@Composable
fun ArtistCard(artist: Artist) {
    Row(/*...*/) {
        Column {
            Text(artist.name)
            Text(
                text = artist.lastSeenOnline,
                modifier = Modifier.offset(x = 4.dp)
            )
        }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L178-L189)

![텍스트가 상위 컨테이너의 오른쪽으로 이동함](https://developer.android.com/static/develop/ui/compose/images/layout-offset-new.png?hl=ko)

`offset` 수정자는 레이아웃 방향에 따라 가로로 적용됩니다. **왼쪽에서 오른쪽으로** 컨텍스트에서 양수 `offset`은 요소를 오른쪽으로 이동하고 **오른쪽에서 왼쪽으로** 컨텍스트에서는 요소를 오른쪽으로 이동합니다. 레이아웃 방향을 고려하지 않고 오프셋을 설정해야 하는 경우 양의 오프셋 값이 항상 요소를 오른쪽으로 이동시키는 [`absoluteOffset`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#absoluteOffset(androidx.compose.ui.Modifier,androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp)>) 수정자를 확인하세요.

`offset` 수정자는 오버로드 두 개를 제공합니다. 오프셋을 매개변수로 사용하는 [`offset`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#(androidx.compose.ui.Modifier).offset(androidx.compose.ui.unit.Dp,androidx.compose.ui.unit.Dp)>)과 람다를 사용하는 [`offset`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#(androidx.compose.ui.Modifier).offset(kotlin.Function1)>)입니다. 각각을 사용하는 시기와 성능을 위해 이를 최적화하는 방법에 관한 자세한 내용은 [Compose 성능 - 최대한 읽기 연기](https://developer.android.com/develop/ui/compose/performance?hl=ko#defer-reads) 섹션을 참고하세요.

## Compose의 범위 안전성

Compose에는 특정 컴포저블의 하위 요소에 적용될 때만 사용할 수 있는 수정자가 있습니다. Compose는 맞춤 범위를 통해 이를 적용합니다.

예를 들어 하위 요소를 `Box` 크기에 영향을 미치지 않고 상위 `Box`만큼 크게 만들려면 [`matchParentSize`](<https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/BoxScope?hl=ko#(androidx.compose.ui.Modifier).matchParentSize()>) 수정자를 사용합니다. `matchParentSize`는 [`BoxScope`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/BoxScope?hl=ko)에서만 사용할 수 있습니다. 따라서 `Box` 상위 요소 내 하위 요소에만 사용할 수 있습니다.

범위 안전성을 사용하면 다른 컴포저블 및 범위에서 작동하지 않는 수정자를 추가할 수 없으며 시행착오로부터 시간을 절약할 수 있습니다.

**참고:** Android 뷰 시스템에는 범위 안전성이 없습니다. 개발자는 일반적으로 여러 레이아웃 매개변수를 사용하여 특정 상위 요소의 컨텍스트에서 어떤 매개변수가 고려되고 그 의미가 무엇인지 확인하려고 합니다.

범위 지정 수정자는 상위 요소가 하위 요소에 관해 알아야 하는 정보를 상위 요소에 알립니다. 일반적으로 *상위 데이터 수정자*라고도 합니다. 내부 요소는 범용 수정자와 다르지만 사용 관점에서 이러한 차이는 중요하지 않습니다.

### `Box`의 `matchParentSize`

위에서 언급했듯이 하위 레이아웃이 `Box` 크기에 영향을 미치지 않고 상위 `Box`와 크기가 같이지도록 하려면 `matchParentSize` 수정자를 사용하세요.

`matchParentSize`는 `Box` 범위 내에서만 사용할 수 있습니다. 즉 `Box` 컴포저블의 *직접* 하위 요소에만 적용됩니다.

아래 예에서 하위 `Spacer`는 상위 `Box`에서 크기를 가져오고 결과적으로 가장 큰 하위 요소(이 경우에는 `ArtistCard`)에서 크기를 가져옵니다.

```
@Composable
fun MatchParentSizeComposable() {
    Box {
        Spacer(
            Modifier
                .matchParentSize()
                .background(Color.LightGray)
        )
        ArtistCard()
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L195-L205)

![컨테이너를 채우는 회색 배경](https://developer.android.com/static/develop/ui/compose/images/layout-matchparentsize-new.png?hl=ko)

`matchParentSize` 대신 `fillMaxSize`가 사용된 경우 `Spacer`는 허용된 모든 가용 공간을 상위 요소로 가져온 다음 상위 요소에서 모든 가용 공간을 확장하고 채웁니다.

![화면을 채우는 회색 배경](https://developer.android.com/static/develop/ui/compose/images/layout-fillmaxsize.png?hl=ko)

### `Row` 및 `Column`의 `weight`

이전 [패딩 및 크기](https://developer.android.com/develop/ui/compose/modifiers?hl=ko#padding-and-size) 섹션에서 확인했듯이 기본적으로 컴포저블 크기는 컴포저블이 래핑하는 콘텐츠로 정의됩니다. `RowScope` 및 `ColumnScope`에서만 사용할 수 있는 `weight` 수정자를 사용하여 컴포저블 크기를 상위 요소 내에서 유연하게 설정할 수 있습니다.

두 `Box` 컴포저블이 포함된 `Row`를 사용해 보겠습니다. 첫 번째 상자의 `weight`가 두 번째 상자의 두 배로 지정되므로 너비가 두 배로 지정됩니다. `Row`의 너비가 `210.dp`이므로 첫 번째 `Box`의 너비는 `140.dp`이고 두 번째는`70.dp`입니다.

```
@Composable
fun ArtistCard(/*...*/) {
    Row(
        modifier = Modifier.fillMaxWidth()
    ) {
        Image(
            /*...*/
            modifier = Modifier.weight(2f)
        )
        Column(
            modifier = Modifier.weight(1f)
        ) {
            /*...*/
        }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L211-L226)

![이미지 너비가 텍스트 너비의 두 배임](https://developer.android.com/static/develop/ui/compose/images/layout-weight.png?hl=ko)

## 수정자 추출 및 재사용

여러 수정자를 함께 체이닝하여 컴포저블을 장식하거나 강화할 수 있습니다. 이 체인은 단일 [`Modifier.Elements`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier.Element?hl=ko)의 순서가 지정된 변경 불가능한 목록을 나타내는 [`Modifier`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko) 인터페이스를 통해 생성됩니다.

각 `Modifier.Element`는 레이아웃, 그리기 및 그래픽 동작, 모든 동작 관련, 포커스 및 시맨틱 동작 등의 개별 동작과 기기 입력 이벤트를 나타냅니다. 순서가 중요합니다. 먼저 추가된 수정자 요소가 먼저 적용됩니다.

변수로 추출하고 더 높은 범위로 끌어올리는 방식으로 동일한 수정자 체인 인스턴스를 여러 컴포저블에서 재사용하는 것이 유용할 수도 있습니다. 이는 다음과 같은 이유로 코드 가독성을 개선하거나 앱의 성능 개선에 도움이 될 수 있습니다.

- 수정자를 사용하는 컴포저블에 리컴포지션이 발생할 때 수정자의 재할당이 반복되지 않습니다.
- 수정자 체인은 매우 길고 복잡할 수 있으므로 동일한 체인 인스턴스를 재사용하면 Compose 런타임이 이를 비교할 때 해야 하는 워크로드를 줄일 수 있습니다.
- 이러한 추출을 통해 코드베이스 전체에서 코드 청결도, 일관성, 유지관리성이 향상됩니다.

### 수정자 재사용 권장사항

자체 `Modifier` 체인을 만들고 추출하여 여러 컴포저블 구성요소에서 재사용합니다. 수정자는 데이터와 같은 객체이므로 저장해도 괜찮습니다.

```
val reusableModifier = Modifier
    .fillMaxWidth()
    .background(Color.Red)
    .padding(12.dp)
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L232-L235)

#### 자주 변경되는 상태를 관찰할 때 수정자 추출 및 재사용

애니메이션 상태나 `scrollState`처럼 컴포저블 내에서 자주 변경되는 상태를 관찰할 때 리컴포지션이 상당히 많이 발생할 수 있습니다. 이 경우 모든 리컴포지션 및 잠재적으로 모든 프레임에 수정자가 할당됩니다.

```
@Composable
fun LoadingWheelAnimation() {
    val animatedState = animateFloatAsState(/*...*/)

    LoadingWheel(
        // Creation and allocation of this modifier will happen on every frame of the animation!
        modifier = Modifier
            .padding(12.dp)
            .background(Color.Gray),
        animatedState = animatedState
    )
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L241-L252)

대신 다음과 같이 수정자의 동일한 인스턴스를 생성, 추출, 재사용한 후 컴포저블에 전달할 수 있습니다.

```
// Now, the allocation of the modifier happens here:
val reusableModifier = Modifier
    .padding(12.dp)
    .background(Color.Gray)

@Composable
fun LoadingWheelAnimation() {
    val animatedState = animateFloatAsState(/*...*/)

    LoadingWheel(
        // No allocation, as we're just reusing the same instance
        modifier = reusableModifier,
        animatedState = animatedState
    )
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L258-L272)

#### 범위가 지정되지 않은 수정자 추출 및 재사용

수정자는 범위가 지정되지 않거나 특정 컴포저블로 범위가 지정될 수 있습니다. 범위가 지정되지 않은 수정자의 경우 컴포저블 외부에서 수정자를 간단한 변수로 쉽게 추출할 수 있습니다.

```
val reusableModifier = Modifier
    .fillMaxWidth()
    .background(Color.Red)
    .padding(12.dp)

@Composable
fun AuthorField() {
    HeaderText(
        // ...
        modifier = reusableModifier
    )
    SubtitleText(
        // ...
        modifier = reusableModifier
    )
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L278-L293)

이는 Lazy 레이아웃과 함께 사용하면 특히 유용합니다. 대부분의 경우 잠재적으로 중요한 항목에 모두 정확히 동일한 수정자를 사용하는 것이 좋습니다.

```
val reusableItemModifier = Modifier
    .padding(bottom = 12.dp)
    .size(216.dp)
    .clip(CircleShape)

@Composable
private fun AuthorList(authors: List<Author>) {
    LazyColumn {
        items(authors) {
            AsyncImage(
                // ...
                modifier = reusableItemModifier,
            )
        }
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L299-L314)

#### 범위 지정 수정자 추출 및 재사용

특정 컴포저블로 범위가 지정된 수정자를 처리할 때 가능한 한 가장 높은 수준으로 수정자를 추출하고 적절한 경우 재사용할 수 있습니다.

```
Column(/*...*/) {
    val reusableItemModifier = Modifier
        .padding(bottom = 12.dp)
        // Align Modifier.Element requires a ColumnScope
        .align(Alignment.CenterHorizontally)
        .weight(1f)
    Text1(
        modifier = reusableItemModifier,
        // ...
    )
    Text2(
        modifier = reusableItemModifier
        // ...
    )
    // ...
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L321-L336)

추출된 범위 지정 수정자는 동일한 범위의 직접 하위 요소에만 전달해야 합니다. 이것이 중요한 이유를 자세히 알아보려면 [Compose의 범위 안전성](https://developer.android.com/develop/ui/compose/modifiers?hl=ko#scope-safety) 섹션을 참고하세요.

```
Column(modifier = Modifier.fillMaxWidth()) {
    // Weight modifier is scoped to the Column composable
    val reusableItemModifier = Modifier.weight(1f)

    // Weight will be properly assigned here since this Text is a direct child of Column
    Text1(
        modifier = reusableItemModifier
        // ...
    )

    Box {
        Text2(
            // Weight won't do anything here since the Text composable is not a direct child of Column
            modifier = reusableItemModifier
            // ...
        )
    }
}
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L343-L360)

#### 추출된 수정자의 추가 체이닝

추출된 수정자 체인은 [`.then()`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#then(androidx.compose.ui.Modifier)>) 함수를 호출하여 더 체이닝하거나 추가할 수 있습니다.

```
val reusableModifier = Modifier
    .fillMaxWidth()
    .background(Color.Red)
    .padding(12.dp)

// Append to your reusableModifier
reusableModifier.clickable { /*...*/ }

// Append your reusableModifier
otherModifier.then(reusableModifier)
```

[ModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/ModifierSnippets.kt#L372-L381)

[수정자 순서가 중요](https://developer.android.com/develop/ui/compose/modifiers?hl=ko#order-modifier-matters)하다는 점을 유의해야 합니다.

# 제약 조건 및 수정자 순서 

Compose에서는 여러 수정자를 함께 체이닝하여 컴포저블의 디자인과 분위기를 변경할 수 있습니다. 이러한 수정자 체인은 너비 및 높이 경계를 정의하는 컴포저블에 전달된 *제약 조건*에 영향을 줄 수 있습니다.

이 페이지에서는 체이닝된 수정자가 제약 조건에 미치는 영향과 그에 따라 컴포저블의 측정 및 배치에 미치는 영향을 설명합니다.

## UI 트리의 수정자

수정자가 서로에게 어떤 영향을 미치는지 이해하려면 컴포지션 단계에서 생성되는 UI 트리에 어떻게 표시되는지 시각화하는 것이 좋습니다. 자세한 내용은 [구성](https://developer.android.com/develop/ui/compose/phases?hl=ko#composition) 섹션을 참고하세요.

UI 트리에서 수정자를 레이아웃 노드의 래퍼 노드로 시각화할 수 있습니다.

![컴포저블 및 수정자의 코드와 UI 트리로의 시각적 표현](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/modifier-wrapping.png?hl=ko)

**그림 1.** UI 트리의 레이아웃 노드를 래핑하는 수정자

컴포저블에 두 개 이상의 수정자를 추가하면 수정자 체인이 생성됩니다. 여러 수정자를 체이닝하면 각 수정자 노드는 *나머지 체인과 내부 레이아웃 노드를 래핑*합니다. 예를 들어 [`clip`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).clip(androidx.compose.ui.graphics.Shape)>) 수정자와 [`size`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).size(androidx.compose.ui.unit.Dp)>) 수정자를 연결하면 `clip` 수정자 노드가 `size` 수정자 노드를 래핑하고 `size` 수정자 노드는 `Image` 레이아웃 노드를 래핑합니다.

레이아웃 단계에서 [트리를 탐색하는 알고리즘](https://developer.android.com/develop/ui/compose/phases?hl=ko#layout)은 동일하게 유지되지만 각 수정자 노드도 방문됩니다. 이렇게 하면 수정자가 래핑하는 수정자 또는 레이아웃 노드의 크기 요구사항과 배치를 변경할 수 있습니다.

그림 2와 같이 `Image` 및 `Text` 컴포저블의 구현 자체는 단일 레이아웃 노드를 래핑하는 수정자 체인으로 구성됩니다. `Row` 및 `Column`의 구현은 단순히 하위 요소를 배치하는 방법을 설명하는 레이아웃 노드입니다.

![이전의 트리 구조이지만 이제 각 노드는 수정자가 노드를 둘러싸는 단순한 레이아웃일 뿐입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/composables-modifiers.png?hl=ko)

**그림 2.** 그림 1과 동일한 트리 구조이지만 UI 트리의 컴포저블이 수정자의 체인으로 시각화되어 있습니다.

요약:

- 수정자는 단일 수정자 또는 레이아웃 노드를 래핑합니다.
- 레이아웃 노드는 여러 하위 노드를 배치할 수 있습니다.

다음 섹션에서는 이 멘탈 모델을 사용하여 수정자 체이닝을 추론하고 컴포저블 크기에 미치는 영향을 설명합니다.

## 레이아웃 단계의 제약조건

[레이아웃 단계](https://developer.android.com/develop/ui/compose/phases?hl=ko#layout)는 3단계 알고리즘에 따라 각 레이아웃 노드의 너비, 높이, x, y 좌표를 찾습니다.

8. **하위 요소 측정**: 노드가 하위 요소(있는 경우)를 측정합니다.
9. **자체 크기 결정**: 노드는 이러한 측정치를 기반으로 자체 크기를 결정합니다.
10. **하위 요소 배치**: 각 하위 노드는 노드의 자체 위치를 기준으로 배치됩니다.

[`Constraints`](https://developer.android.com/reference/kotlin/androidx/compose/ui/unit/Constraints?hl=ko)는 알고리즘의 처음 두 단계에서 노드의 적절한 크기를 찾는 데 도움이 됩니다. 제약 조건은 노드의 너비와 높이에 대한 최소 및 최대 경계를 정의합니다. 노드가 크기를 결정할 때 측정된 크기는 이 크기 범위 내에 있어야 합니다.

### 제약조건 유형

제약 조건은 다음 중 하나일 수 있습니다.

- **Bounded**: 노드에 최대 및 최소 너비와 높이가 있습니다.

![컨테이너 내에서 크기가 다른 제약 조건이 제한됩니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/bounded-constraints.png?hl=ko)

**그림 3.** 제한된 제약 조건

- **제한되지 않음**: 노드가 크기로 제한되지 않습니다. 최대 너비 및 높이 경계는 무한대로 설정됩니다.

![너비와 높이가 무한대로 설정된 제한되지 않은 제약조건입니다. 제약 조건이 컨테이너를 넘어갑니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/unbounded-constraints.png?hl=ko)

**그림 4.** 제한되지 않은 제약조건

- **정확함**: 노드에 정확한 크기 요구사항을 따르라는 메시지가 표시됩니다. 최솟값과 최댓값 경계는 동일한 값으로 설정됩니다.

![컨테이너 내의 정확한 크기 요구사항을 준수하는 정확한 제약조건입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/exact-constraints.png?hl=ko)

**그림 5.** 정확한 제약 조건

- **조합**: 노드가 위의 제약 조건 유형 조합을 따릅니다. 예를 들어 제약 조건은 너비를 제한하면서 최대 높이를 제한하지 않거나 정확한 너비를 설정하지만 제한된 높이를 제공할 수 있습니다.

![제한된 제약 조건과 제한되지 않은 제약 조건 및 정확한 너비와 높이의 조합을 보여주는 두 개의 컨테이너](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/combination-constraints.png?hl=ko)

**그림 6.** 제한된 제약조건과 제한되지 않은 제약조건, 정확한 너비 및 높이의 조합입니다.

다음 섹션에서는 이러한 제약 조건이 상위 요소에서 하위 요소로 전달되는 방법을 설명합니다.

### 제약 조건이 상위 요소에서 하위 요소로 전달되는 방식

[레이아웃 단계의 제약조건](https://developer.android.com/develop/ui/compose/layouts/constraints-modifiers?hl=ko#constraints-layout)에 설명된 알고리즘의 첫 번째 단계에서 제약조건은 UI 트리의 상위 요소에서 하위 요소로 전달됩니다.

상위 노드가 하위 요소를 측정할 때 각 하위 요소에 이러한 제약 조건을 제공하여 허용되는 크기를 알려줍니다. 그런 다음 자체 크기를 결정할 때 자체 상위 요소에서 전달된 제약 조건도 준수합니다.

대략적으로 알고리즘은 다음과 같이 작동합니다.

11. 실제로 차지하려는 크기를 결정하기 위해 UI 트리의 루트 노드는 하위 요소를 측정하고 동일한 제약 조건을 첫 번째 하위 요소에 전달합니다.
12. 하위 요소가 측정에 영향을 미치지 않는 수정자인 경우 다음 수정자에게 제약 조건을 전달합니다. 측정에 영향을 미치는 수정자에 도달하지 않는 한 제약 조건은 수정자 체인을 통해 있는 그대로 전달됩니다. 그러면 제약 조건의 크기가 적절하게 조정됩니다.
13. 하위 요소가 없는 노드('리프 노드'라고 함)에 도달하면 전달된 제약 조건에 따라 크기를 결정하고 이 확인된 크기를 상위 요소에 반환합니다.
14. 상위 요소는 이 하위 요소의 측정치를 기반으로 제약 조건을 조정하고 조정된 제약 조건으로 다음 하위 요소를 호출합니다.
15. 상위 요소의 모든 하위 요소가 측정되면 상위 노드는 자체 크기를 결정하고 이를 자체 상위 요소에 전달합니다.
16. 이렇게 하면 전체 트리가 깊이 우선으로 탐색됩니다. 결국 모든 노드의 크기가 결정되고 측정 단계가 완료됩니다.

자세한 예는 [제약 조건 및 수정자 순서](https://www.youtube.com/watch?v=OeC5jMV342A&%3Bt=204s&hl=ko) 동영상을 참고하세요.

## 제약조건에 영향을 미치는 수정자

이전 섹션에서는 일부 수정자가 제약 조건 크기에 영향을 줄 수 있다는 것을 알아봤습니다. 다음 섹션에서는 제약 조건에 영향을 미치는 특정 수정자를 설명합니다.

### `size` 수정자

[`size`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).size(androidx.compose.ui.unit.Dp)>) 수정자는 콘텐츠의 기본 크기를 선언합니다.

예를 들어 다음 UI 트리는 `200dp`에 의해 `300dp` 컨테이너에 렌더링되어야 합니다. 제약조건은 너비가 `100dp`~`300dp`이고 높이가 `100dp`~`200dp`이 되도록 제한됩니다.

![크기 수정자가 레이아웃 노드를 래핑하는 UI 트리의 일부와 컨테이너에서 크기 수정자에 의해 설정된 제약 조건의 표현입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/size-modifier.png?hl=ko)

**그림 7.** UI 트리의 제약 조건과 컨테이너의 표현이 제한됩니다.

`size` 수정자는 전달된 값과 일치하도록 수신되는 제약 조건을 조정합니다. 이 예시에서 값은 `150dp`입니다.

![수신되는 제약조건을 전달된 값과 일치하도록 조정하는 크기 수정자를 제외하고 그림 7과 동일합니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/size-modifier-2.png?hl=ko)

**그림 8.** 제약 조건을 `150dp`로 조정하는 `size` 수정자

너비와 높이가 가장 작은 제약 조건 경계보다 작거나 가장 큰 제약 조건 경계보다 큰 경우 수정자는 전달된 제약 조건을 준수하면서 전달된 제약 조건과 최대한 근접하게 일치시킵니다.

![두 개의 UI 트리와 컨테이너에 해당하는 표현입니다. 첫 번째 예에서는 크기 수정자가 들어오는 제약 조건을 수용합니다. 두 번째 예에서는 크기 수정자가 너무 큰 제약 조건에 최대한 가깝게 조정되어 컨테이너를 채우는 제약 조건이 됩니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/size-modifier-3.png?hl=ko)

**그림 9.** 전달된 제약 조건을 최대한 준수하는 `size` 수정자입니다.

여러 개의 `size` 수정자를 체이닝하면 작동하지 않습니다. 첫 번째 `size` 수정자는 최솟값과 최댓값 제약 조건을 모두 고정 값으로 설정합니다. 두 번째 크기 수정자가 더 작거나 더 큰 크기를 요청하더라도 전달된 정확한 경계를 준수해야 하므로 이러한 값을 재정의하지는 않습니다.

![UI 트리의 두 크기 수정자의 체이닝과 컨테이너의 표현입니다. 이는 두 번째 값이 아닌 전달된 첫 번째 값의 결과입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/size-modifier-4.png?hl=ko)

**그림 10.** 전달된 두 번째 값 (`50dp`)이 첫 번째 값 (`100dp`)을 재정의하지 않는 두 개의 `size` 수정자의 체이닝입니다.

### `requiredSize` 수정자

노드가 수신된 제약 조건을 재정의해야 하는 경우 [`size`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).size(androidx.compose.ui.unit.Dp)>) 대신 [`requiredSize`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).requiredSize(androidx.compose.ui.unit.Dp)>) 수정자를 사용합니다. `requiredSize` 수정자는 수신되는 제약 조건을 대체하고 지정한 크기를 정확한 경계로 전달합니다.

크기가 트리 위로 다시 전달되면 하위 노드가 사용 가능한 공간의 중앙에 배치됩니다.

![UI 트리에 체이닝된 size 및 requiredSize 수정자와 컨테이너의 상응하는 표현입니다. requiredSize 수정자 제약 조건이 size 수정자 제약 조건보다 우선 적용됩니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/requiredsize-modifier.png?hl=ko)

**그림 11.** `requiredSize` 수정자가 `size` 수정자의 수신 제약 조건을 재정의합니다.

### `width` 및 `height` 수정자

`size` 수정자는 제약 조건의 너비와 높이를 모두 조정합니다. `width` 수정자를 사용하면 너비를 고정으로 설정하고 높이는 결정하지 않을 수 있습니다. 마찬가지로 `height` 수정자를 사용하면 고정된 높이를 설정하고 너비는 결정하지 않을 수 있습니다.

![너비 수정자와 컨테이너 표현이 있는 UI 트리와 높이 수정자와 표현이 있는 UI 트리](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/width-height-modifier.png?hl=ko)

**그림 12.** 고정 너비와 높이를 각각 설정하는 `width` 수정자와 `height` 수정자

### `sizeIn` 수정자

`sizeIn` 수정자를 사용하면 너비와 높이에 대한 정확한 최소 및 최대 제약 조건을 설정할 수 있습니다. 제약 조건을 세부적으로 제어해야 하는 경우 `sizeIn` 수정자를 사용하세요.

![최소 및 최대 너비와 높이가 설정된 sizeIn 수정자가 있는 UI 트리와 컨테이너 내의 표현입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/sizein-modifier.png?hl=ko)

**그림 13.** `minWidth`, `maxWidth`, `minHeight`, `maxHeight`가 설정된 `sizeIn` 수정자

## 예

이 섹션에서는 체이닝된 수정자가 있는 여러 코드 스니펫의 출력을 보여주고 설명합니다.

```
Image(
    painterResource(R.drawable.hero),
    contentDescription = null,
    Modifier
        .fillMaxSize()
        .size(50.dp)
)
```

[ConstraintsModifiersSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/layouts/ConstraintsModifiersSnippets.kt#L45-L51)

이 스니펫은 다음과 같은 출력을 생성합니다.

![](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/example-1.png?hl=ko)

- [`fillMaxSize`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).fillMaxSize(kotlin.Float)>) 수정자는 최소 너비와 높이를 모두 최대 값(너비 `300dp`, 높이 `200dp`)으로 설정하도록 제약 조건을 변경합니다.
- `size` 수정자는 `50dp` 크기를 사용하려 하지만 수신되는 최소 제약 조건을 준수해야 합니다. 따라서 `size` 수정자는 `200`에 의해 `300`의 정확한 제약 조건 경계를 출력하여 `size` 수정자에 제공된 값을 효과적으로 무시합니다.
- `Image`는 이러한 경계를 따르고 `300`x`200` 크기를 보고하며, 이는 트리 전체에 전달됩니다.

```
Image(
    painterResource(R.drawable.hero),
    contentDescription = null,
    Modifier
        .fillMaxSize()
        .wrapContentSize()
        .size(50.dp)
)
```

[ConstraintsModifiersSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/layouts/ConstraintsModifiersSnippets.kt#L61-L68)

이 스니펫은 다음과 같은 출력을 생성합니다.

![](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/example-2.png?hl=ko)

- `fillMaxSize` 수정자는 최소 너비와 높이를 모두 최대값(너비의 경우 `300dp`, 높이의 경우 `200dp`)으로 설정하도록 제약 조건을 조정합니다.
- `wrapContentSize` 수정자는 최소 제약 조건을 재설정합니다. 따라서 `fillMaxSize`는 고정된 제약 조건을 초래했지만 `wrapContentSize`는 *제한된 제약 조건으로 다시 재설정*합니다. 이제 다음 노드는 전체 공간을 다시 차지하거나 전체 공간보다 작을 수 있습니다.
- `size` 수정자는 제약 조건을 `50`의 최소 및 최대 경계로 설정합니다.
- `Image`는 `50` x `50` 크기로 확인되고 `size` 수정자는 이를 전달합니다.
- [`wrapContentSize`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).wrapContentSize(androidx.compose.ui.Alignment,kotlin.Boolean)>) 수정자는 특별한 속성을 갖습니다. 자식을 가져와 전달된 *사용 가능한 최소 경계의 중앙에 배치*합니다. 따라서 상위 요소에 전달되는 크기는 전달된 최소 경계와 같습니다.

수정자 3개만 조합하면 컴포저블의 크기를 정의하고 상위 요소에 가운데 정렬할 수 있습니다.

```
Image(
    painterResource(R.drawable.hero),
    contentDescription = null,
    Modifier
        .clip(CircleShape)
        .padding(10.dp)
        .size(100.dp)
)
```

[ConstraintsModifiersSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/layouts/ConstraintsModifiersSnippets.kt#L78-L85)

이 스니펫은 다음과 같은 출력을 생성합니다.

![](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/example-3.png?hl=ko)

- `clip` 수정자는 제약 조건을 변경하지 않습니다.
  - `padding` 수정자는 최대 제약 조건을 낮춥니다.
  - `size` 수정자는 모든 제약조건을 `100dp`로 설정합니다.
  - `Image`는 이러한 제약 조건을 준수하고 `100`x`100dp` 크기를 보고합니다.
  - `padding` 수정자는 모든 크기에 `10dp`를 추가하므로 보고된 너비와 높이가 `20dp`만큼 증가합니다.
  - 이제 그리기 단계에서 `clip` 수정자는 `120dp`를 통해 `120`의 캔버스에 작동합니다. 따라서 *해당 크기의 원 마스크가 생성*됩니다.
  - 그런 다음 `padding` 수정자는 모든 크기에서 콘텐츠를 `10dp`만큼 안쪽으로 넣으므로 캔버스 크기가 `100dp`만큼 `100`로 줄어듭니다.
  - `Image`가 이 캔버스에 그려집니다. 이미지는 `120dp`의 원래 원을 기준으로 잘리므로 출력은 원형이 아닌 결과입니다.

# 맞춤 수정자 만들기 

Compose는 일반적인 동작을 위한 여러 [수정자](https://developer.android.com/develop/ui/compose/modifiers?hl=ko)를 기본적으로 제공하지만 직접 맞춤 수정자를 만들 수도 있습니다.

수정자는 여러 부분으로 구성됩니다.

- 수정자 팩토리
  - `Modifier`의 확장 함수로, 수정자에 관용적인 API를 제공하고 수정자를 쉽게 체이닝할 수 있도록 합니다. 수정자 팩토리는 Compose에서 UI를 수정하는 데 사용하는 수정자 요소를 생성합니다.
- 수정자 요소
  - 여기에서 수정자의 동작을 구현할 수 있습니다.

필요한 기능에 따라 맞춤 수정자를 구현하는 방법에는 여러 가지가 있습니다. 맞춤 수정자를 구현하는 가장 쉬운 방법은 이미 정의된 다른 수정자 팩토리를 결합하는 맞춤 수정자 팩토리를 구현하는 것입니다. 더 많은 맞춤 동작이 필요한 경우 하위 수준이지만 더 많은 유연성을 제공하는 `Modifier.Node` API를 사용하여 수정자 요소를 구현합니다.

## 기존 수정자를 함께 체이닝

기존 수정자를 사용하기만 하면 맞춤 수정자를 만들 수 있는 경우가 많습니다. 예를 들어 [`Modifier.clip()`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).clip(androidx.compose.ui.graphics.Shape)>)는 `graphicsLayer` 수정자를 사용하여 구현됩니다. 이 전략은 기존 수정자 요소를 사용하며 자체 맞춤 수정자 팩토리를 제공합니다.

자체 맞춤 수정자를 구현하기 전에 동일한 전략을 사용할 수 있는지 확인하세요.

```kotlin
fun Modifier.clip(shape: Shape) = graphicsLayer(shape = shape, clip = true)
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L69-L69)

또는 동일한 수정자 그룹을 자주 반복하는 경우 자체 수정자로 래핑할 수 있습니다.

```kotlin
fun Modifier.myBackground(color: Color) = padding(16.dp)
    .clip(RoundedCornerShape(8.dp))
    .background(color)
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L74-L76)

## 컴포저블 수정자 팩토리를 사용하여 맞춤 수정자 만들기

컴포저블 함수를 사용하여 맞춤 수정자를 만들어 기존 수정자에 값을 전달할 수도 있습니다. 이를 컴포저블 수정자 팩토리라고 합니다.

**참고:** 이전 버전의 Compose에서는 이 접근 방식을 권장하지 않았으며 린트 규칙을 통해 [`composed {}`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).composed(kotlin.Function1,kotlin.Function1)>)를 사용하는 것이 좋습니다. 이제 `composed {}`가 권장되지 않으므로 린트 규칙이 삭제되었습니다.

컴포저블 수정자 팩토리를 사용하여 수정자를 만들면 [`animate*AsState`](https://developer.android.com/develop/ui/compose/animation/value-based?hl=ko#animate-as-state) 및 기타 [Compose 상태 지원 애니메이션 API](https://developer.android.com/develop/ui/compose/animation/choose-api?hl=ko)와 같은 상위 수준 Compose API를 사용할 수도 있습니다. 예를 들어 다음 스니펫은 사용 설정/사용 중지 시 알파 변경사항을 애니메이션 처리하는 수정자를 보여줍니다.

```kotlin
@Composable
fun Modifier.fade(enable: Boolean): Modifier {
    val alpha by animateFloatAsState(if (enable) 0.5f else 1.0f)
    return this then Modifier.graphicsLayer { this.alpha = alpha }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L80-L84)

**경고:** 맞춤 수정자를 만들 때 수정자 체이지를 중단하지 마세요. 항상 `this`를 참조해야 합니다. 그러지 않으면 이전에 추가한 모든 수정자가 삭제됩니다. 위의 예와 같이 `this then Modifier`를 사용하거나 암시적으로 `return graphicsLayer { this.alpha = alpha }`를 사용할 수 있습니다.

맞춤 수정자가 `CompositionLocal`의 기본값을 제공하는 편의 메서드인 경우 이를 구현하는 가장 쉬운 방법은 컴포저블 수정자 팩토리를 사용하는 것입니다.

```kotlin
@Composable
fun Modifier.fadedBackground(): Modifier {
    val color = LocalContentColor.current
    return this then Modifier.background(color.copy(alpha = 0.5f))
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L88-L92)

이 접근 방식에는 아래에 설명된 몇 가지 주의사항이 있습니다.

#### `CompositionLocal` 값은 수정자 팩토리의 호출 사이트에서 확인됩니다.

컴포저블 수정자 팩토리를 사용하여 맞춤 수정자를 만들 때 컴포지션 로컬은 사용되는 것이 아니라 생성된 컴포지션 트리에서 값을 가져옵니다. 이로 인해 예기치 않은 결과가 발생할 수 있습니다. 예를 들어 위의 컴포지션 로컬 수정자 예시를 살펴보겠습니다. 이 예시는 구성 가능한 함수를 사용하여 약간 다르게 구현되었습니다.

```kotlin
@Composable
fun Modifier.myBackground(): Modifier {
    val color = LocalContentColor.current
    return this then Modifier.background(color.copy(alpha = 0.5f))
}

@Composable
fun MyScreen() {
    CompositionLocalProvider(LocalContentColor provides Color.Green) {
        // Background modifier created with green background
        val backgroundModifier = Modifier.myBackground()

        // LocalContentColor updated to red
        CompositionLocalProvider(LocalContentColor provides Color.Red) {

            // Box will have green background, not red as expected.
            Box(modifier = backgroundModifier)
        }
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L97-L116)

수정자가 예상대로 작동하지 않는 경우 맞춤 [`Modifier.Node`](https://developer.android.com/develop/ui/compose/custom-modifiers?hl=ko#implement-custom)을 대신 사용하세요. 컴포지션 로컬은 사용 사이트에서 올바르게 확인되고 안전하게 호이스팅될 수 있기 때문입니다.

#### 구성 가능한 함수 수정자는 건너뛰지 않습니다.

반환 값이 있는 구성 가능한 함수는 건너뛸 수 없으므로 구성 가능한 팩토리 수정자는 [건너뛰지 않습니다](https://developer.android.com/develop/ui/compose/mental-model?hl=ko#skips). 즉, 수정자 함수는 모든 리컴포지션에서 호출되며, 리컴포지션이 자주 발생하면 비용이 많이 들 수 있습니다.

#### 구성 가능한 함수 수정자는 구성 가능한 함수 내에서 호출해야 합니다.

모든 구성 가능한 함수와 마찬가지로 구성 가능한 팩토리 수정자는 구성 내에서 호출해야 합니다. 이렇게 하면 수정자를 컴포지션 외부로 호이스팅할 수 없으므로 수정자를 호이스팅할 수 있는 위치가 제한됩니다. 반면 구성 불가능한 수정자 팩토리는 구성 가능한 함수 외부로 호이스팅하여 더 쉽게 재사용하고 성능을 개선할 수 있습니다.

```kotlin
val extractedModifier = Modifier.background(Color.Red) // Hoisted to save allocations

@Composable
fun Modifier.composableModifier(): Modifier {
    val color = LocalContentColor.current.copy(alpha = 0.5f)
    return this then Modifier.background(color)
}

@Composable
fun MyComposable() {
    val composedModifier = Modifier.composableModifier() // Cannot be extracted any higher
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L121-L132)

## `Modifier.Node`를 사용하여 맞춤 수정자 동작 구현

[`Modifier.Node`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier.Node?hl=ko)는 Compose에서 수정자를 만드는 하위 수준 API입니다. Compose에서 자체 수정자를 구현하는 것과 동일한 API이며 맞춤 수정자를 만드는 가장 성능이 우수한 방법입니다.

**참고:** 맞춤 수정자를 만드는 또 다른 API인 [`composed {}`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).composed(kotlin.Function1,kotlin.Function1)>)가 있습니다. 이 API는 발생한 성능 문제로 인해 더 이상 권장되지 않습니다. `Modifier.Node`는 컴포지션된 수정자보다 훨씬 우수한 성능을 제공하도록 처음부터 설계되었습니다. 컴포지션된 수정자의 문제에 관한 자세한 내용은 Android Dev Summit 강연 [Compose 수정자 심층 분석](https://www.youtube.com/watch?v=BjGX2RftXsU&hl=ko)을 참고하세요.

### `Modifier.Node`를 사용하여 맞춤 수정자 구현

Modifier.Node를 사용하여 맞춤 수정자를 구현하는 작업은 세 부분으로 나뉩니다.

- 수정자의 로직과 상태를 보유하는 [`Modifier.Node`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/Modifier.kt;l=184?hl=ko) 구현입니다.
- 수정자 노드 인스턴스를 만들고 업데이트하는 [`ModifierNodeElement`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/ModifierNodeElement.kt;l=39?hl=ko)입니다.
- 위에 설명된 대로 선택적 수정자 팩토리입니다.

`ModifierNodeElement` 클래스는 스테이트리스(Stateless)이며 각 리컴포지션마다 새 인스턴스가 할당되는 반면 `Modifier.Node` 클래스는 스테이트풀(Stateful)일 수 있으며 여러 리컴포지션에서 유지되며 재사용할 수도 있습니다.

다음 섹션에서는 각 부분을 설명하고 원을 그리는 맞춤 수정자를 빌드하는 예를 보여줍니다.

#### `Modifier.Node`

`Modifier.Node` 구현 (이 예에서는 `CircleNode`)은 맞춤 수정자의 기능을 구현합니다.

```kotlin
// Modifier.Node
private class CircleNode(var color: Color) : DrawModifierNode, Modifier.Node() {
    override fun ContentDrawScope.draw() {
        drawCircle(color)
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L136-L141)

이 예에서는 수정자 함수에 전달된 색상으로 원을 그립니다.

노드는 `Modifier.Node`와 0개 이상의 노드 유형을 구현합니다. 수정자에 필요한 기능에 따라 다양한 노드 유형이 있습니다. 위의 예는 그릴 수 있어야 하므로 draw 메서드를 재정의할 수 있는 `DrawModifierNode`를 구현합니다.

사용 가능한 유형은 다음과 같습니다.

| **노드** | **사용 정보** |
| | |
| [`LayoutModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/LayoutModifierNode.kt?hl=ko) | 래핑된 콘텐츠의 측정 및 배치 방식을 변경하는 `Modifier.Node`입니다. |
| [`DrawModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/DrawModifierNode.kt?hl=ko) | 레이아웃의 공간에 그리는 `Modifier.Node`입니다. |
| [`CompositionLocalConsumerModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/CompositionLocalConsumerModifierNode.kt?hl=ko) | 이 인터페이스를 구현하면 `Modifier.Node`가 구성 로컬을 읽을 수 있습니다. |
| [`SemanticsModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/SemanticsModifierNode.kt?hl=ko) | 테스트, 접근성, 유사한 사용 사례에 사용할 시맨틱 키/값을 추가하는 `Modifier.Node`입니다. |
| [`PointerInputModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/PointerInputModifierNode.kt?hl=ko) | [PointerInputChanges](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/input/pointer/PointerEvent.kt?hl=ko)를 수신하는 `Modifier.Node`입니다. |
| [`ParentDataModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/ParentDataModifierNode.kt?hl=ko) | 상위 레이아웃에 데이터를 제공하는 `Modifier.Node` |
| [`LayoutAwareModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/LayoutAwareModifierNode.kt?hl=ko) | `onMeasured` 및 `onPlaced` 콜백을 수신하는 `Modifier.Node`입니다. |
| [`GlobalPositionAwareModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/GlobalPositionAwareModifierNode.kt?hl=ko) | 콘텐츠의 전역 위치가 변경되었을 수 있는 경우 레이아웃의 최종 `LayoutCoordinates`와 함께 `onGloballyPositioned` 콜백을 수신하는 `Modifier.Node`입니다. |
| [`ObserverModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/ObserverModifierNode.kt?hl=ko) | `ObserverNode`를 구현하는 `Modifier.Node`는 `observeReads` 블록 내에서 읽은 스냅샷 객체의 변경에 응답하여 호출될 자체 `onObservedReadsChanged` 구현을 제공할 수 있습니다. |
| [`DelegatingNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/DelegatingNode.kt?hl=ko) | 다른 `Modifier.Node` 인스턴스에 작업을 위임할 수 있는 `Modifier.Node`입니다.<br><br>이는 여러 노드 구현을 하나로 컴포지션하는 데 유용할 수 있습니다. |
| [`TraversableNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/TraversableNode.kt;l=28?hl=ko) | `Modifier.Node` 클래스가 동일한 유형의 클래스 또는 특정 키의 노드 트리를 위아래로 탐색할 수 있도록 허용합니다. |

노드는 해당하는 요소에서 update가 호출될 때 자동으로 무효화됩니다. 이 예시는 `DrawModifierNode`이므로 요소에서 update가 호출될 때마다 노드가 다시 그리기를 트리거하고 색상이 올바르게 업데이트됩니다. [아래](https://developer.android.com/develop/ui/compose/custom-modifiers?hl=ko#autoinvalidation)에 설명된 대로 자동 무효화를 선택 해제할 수 있습니다.

#### `ModifierNodeElement`

`ModifierNodeElement`는 맞춤 수정자를 만들거나 업데이트하기 위한 데이터를 보유하는 변경 불가능한 클래스입니다.

```kotlin
// ModifierNodeElement
private data class CircleElement(val color: Color) : ModifierNodeElement<CircleNode>() {
    override fun create() = CircleNode(color)

    override fun update(node: CircleNode) {
        node.color = color
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L145-L152)

`ModifierNodeElement` 구현은 다음 메서드를 재정의해야 합니다.

1. `create`: 수정자 노드를 인스턴스화하는 함수입니다. 이는 수정자가 처음 적용될 때 노드를 만들기 위해 호출됩니다. 일반적으로 노드를 생성하고 수정자 팩토리에 전달된 매개변수로 구성하는 것과 같습니다.
2. `update`: 이 수정자가 노드가 이미 존재하는 동일한 위치에 제공되었지만 속성이 변경될 때마다 호출됩니다. 이는 클래스의 `equals` 메서드에 의해 결정됩니다. 이전에 생성된 수정자 노드가 `update` 호출에 매개변수로 전송됩니다. 이 시점에서 업데이트된 매개변수에 맞게 노드의 속성을 업데이트해야 합니다. 노드를 이런 식으로 재사용할 수 있는 기능은 `Modifier.Node`가 가져오는 성능 향상의 핵심입니다. 따라서 `update` 메서드에서 새 노드를 만드는 대신 기존 노드를 업데이트해야 합니다. 원 예시에서는 노드의 색상이 업데이트됩니다.

또한 `ModifierNodeElement` 구현은 `equals` 및 `hashCode`도 구현해야 합니다. `update`는 이전 요소와의 등식 비교가 false를 반환하는 경우에만 호출됩니다.

**경고:** `ModifierNodeElement`는 `equals` 및 `hashCode`를 올바르게 구현해야 하며 인스턴스 등식에 의존해서는 안 됩니다. 이 속성이 없으면 수정자 노드가 불필요하게 업데이트되고 성능이 저하됩니다. 데이터 클래스를 사용하여 자동으로 이 작업을 실행합니다.

위 예에서는 데이터 클래스를 사용하여 이를 실행합니다. 이러한 메서드는 노드 업데이트 필요 여부를 확인하는 데 사용됩니다. 요소에 노드 업데이트 필요 여부에 기여하지 않는 속성이 있거나 바이너리 호환성 문제로 인해 데이터 클래스를 피하려는 경우 `equals` 및 `hashCode`(예: [패딩 수정자 요소](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/foundation/foundation-layout/src/commonMain/kotlin/androidx/compose/foundation/layout/Padding.kt;l=358?hl=ko))를 수동으로 구현할 수 있습니다.

#### 수정자 팩토리

이는 수정자의 공개 API 노출 영역입니다. 대부분의 구현은 수정자 요소를 만들고 수정자 체인에 추가하기만 합니다.

```
// Modifier factory
fun Modifier.circle(color: Color) = this then CircleElement(color)
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L156-L157)

#### 전체 예

이 세 가지 부분이 결합되어 `Modifier.Node` API를 사용하여 원을 그리는 맞춤 수정자를 만듭니다.

```kotlin
// Modifier factory
fun Modifier.circle(color: Color) = this then CircleElement(color)

// ModifierNodeElement
private data class CircleElement(val color: Color) : ModifierNodeElement<CircleNode>() {
    override fun create() = CircleNode(color)

    override fun update(node: CircleNode) {
        node.color = color
    }
}

// Modifier.Node
private class CircleNode(var color: Color) : DrawModifierNode, Modifier.Node() {
    override fun ContentDrawScope.draw() {
        drawCircle(color)
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L162-L179)

## `Modifier.Node`를 사용하는 일반적인 상황

`Modifier.Node`로 맞춤 수정자를 만들 때 발생할 수 있는 일반적인 상황은 다음과 같습니다.

### 매개변수 0개

수정자에 매개변수가 없는 경우 업데이트할 필요가 없으며 데이터 클래스일 필요도 없습니다. 다음은 컴포저블에 고정된 양의 패딩을 적용하는 수정자의 샘플 구현입니다.

```kotlin
fun Modifier.fixedPadding() = this then FixedPaddingElement

data object FixedPaddingElement : ModifierNodeElement<FixedPaddingNode>() {
    override fun create() = FixedPaddingNode()
    override fun update(node: FixedPaddingNode) {}
}

class FixedPaddingNode : LayoutModifierNode, Modifier.Node() {
    private val PADDING = 16.dp

    override fun MeasureScope.measure(
        measurable: Measurable,
        constraints: Constraints
    ): MeasureResult {
        val paddingPx = PADDING.roundToPx()
        val horizontal = paddingPx * 2
        val vertical = paddingPx * 2

        val placeable = measurable.measure(constraints.offset(-horizontal, -vertical))

        val width = constraints.constrainWidth(placeable.width + horizontal)
        val height = constraints.constrainHeight(placeable.height + vertical)
        return layout(width, height) {
            placeable.place(paddingPx, paddingPx)
        }
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L184-L210)

### 컴포지션 로컬 참조

`Modifier.Node` 수정자는 `CompositionLocal`와 같은 Compose 상태 객체의 변경사항을 자동으로 관찰하지 않습니다. `Modifier.Node` 수정자는 컴포저블 팩토리로 만든 수정자에 비해 [`currentValueOf`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/node/CompositionLocalConsumerModifierNode?hl=ko#(androidx.compose.ui.node.CompositionLocalConsumerModifierNode).currentValueOf(androidx.compose.runtime.CompositionLocal)>)를 사용하여 수정자가 할당된 위치가 아닌 UI 트리에서 수정자가 사용되는 위치에서 컴포지션 로컬의 값을 읽을 수 있다는 이점이 있습니다.

그러나 수정자 노드 인스턴스는 상태 변경을 자동으로 관찰하지 않습니다. 컴포지션 로컬 변경에 자동으로 반응하려면 범위 내에서 현재 값을 읽으면 됩니다.

- `DrawModifierNode`: [`ContentDrawScope`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/DrawModifierNode.kt;l=31?hl=ko)
- `LayoutModifierNode`: [`MeasureScope`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/LayoutModifierNode.kt;l=64?hl=ko) 및 [`IntrinsicMeasureScope`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/LayoutModifierNode.kt;l=87?hl=ko)
- `SemanticsModifierNode`: [`SemanticsPropertyReceiver`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/semantics/SemanticsProperties.kt;l=788?hl=ko)

이 예에서는 `LocalContentColor` 값을 관찰하여 색상에 따라 배경을 그립니다. `ContentDrawScope`는 스냅샷 변경사항을 관찰하므로 `LocalContentColor` 값이 변경되면 자동으로 다시 그립니다.

class BackgroundColorConsumerNode :
Modifier.Node(),
DrawModifierNode,
CompositionLocalConsumerModifierNode {
override fun ContentDrawScope.draw() {
val currentColor = currentValueOf(LocalContentColor)
drawRect(color = currentColor)
drawContent()
}
}

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L214-L223)

범위 외부의 상태 변경사항에 반응하고 수정자를 자동으로 업데이트하려면 [`ObserverModifierNode`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/ui/ui/src/commonMain/kotlin/androidx/compose/ui/node/ObserverModifierNode.kt?hl=ko)를 사용하세요.

예를 들어 [`Modifier.scrollable`](https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/foundation/foundation/src/commonMain/kotlin/androidx/compose/foundation/gestures/Scrollable.kt;l=269?hl=ko)는 이 기법을 사용하여 `LocalDensity`의 변경사항을 관찰합니다. 단순화된 예는 다음과 같습니다.

```
class ScrollableNode :
    Modifier.Node(),
    ObserverModifierNode,
    CompositionLocalConsumerModifierNode {

    // Place holder fling behavior, we'll initialize it when the density is available.
    val defaultFlingBehavior = DefaultFlingBehavior(splineBasedDecay(UnityDensity))

    override fun onAttach() {
        updateDefaultFlingBehavior()
        observeReads { currentValueOf(LocalDensity) } // monitor change in Density
    }

    override fun onObservedReadsChanged() {
        // if density changes, update the default fling behavior.
        updateDefaultFlingBehavior()
    }

    private fun updateDefaultFlingBehavior() {
        val density = currentValueOf(LocalDensity)
        defaultFlingBehavior.flingDecay = splineBasedDecay(density)
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L234-L256)

### 애니메이션 수정자

`Modifier.Node` 구현은 `coroutineScope`에 액세스할 수 있습니다. 이렇게 하면 [Compose Animatable API](https://developer.android.com/develop/ui/compose/animation/value-based?hl=ko#animatable)를 사용할 수 있습니다. 예를 들어 이 스니펫은 위의 `CircleNode`를 수정하여 반복적으로 페이드 인 및 페이드 아웃합니다.

```
class CircleNode(var color: Color) : Modifier.Node(), DrawModifierNode {
    private val alpha = Animatable(1f)

    override fun ContentDrawScope.draw() {
        drawCircle(color = color, alpha = alpha.value)
        drawContent()
    }

    override fun onAttach() {
        coroutineScope.launch {
            alpha.animateTo(
                0f,
                infiniteRepeatable(tween(1000), RepeatMode.Reverse)
            ) {
            }
        }
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L261-L278)

### 위임을 사용하여 수정자 간에 상태 공유

`Modifier.Node` 수정자는 다른 노드에 위임할 수 있습니다. 다양한 수정자 간에 공통 구현을 추출하는 것과 같은 다양한 사용 사례가 있지만 수정자 간에 공통 상태를 공유하는 데도 사용할 수 있습니다.

예를 들어 상호작용 데이터를 공유하는 클릭 가능한 수정자 노드의 기본 구현은 다음과 같습니다.

```
class ClickableNode : DelegatingNode() {
    val interactionData = InteractionData()
    val focusableNode = delegate(
        FocusableNode(interactionData)
    )
    val indicationNode = delegate(
        IndicationNode(interactionData)
    )
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L292-L300)

### 노드 자동 무효화 선택 해제

상응하는 `ModifierNodeElement`가 업데이트를 호출하면 `Modifier.Node` 노드가 자동으로 무효화됩니다. 더 복잡한 수정자의 경우 수정자가 단계를 무효화하는 시점을 더 세부적으로 제어하기 위해 이 동작을 선택 해제해야 할 수 있습니다.

이는 맞춤 수정자가 레이아웃과 그리기를 모두 수정하는 경우에 특히 유용합니다. 자동 무효화를 선택 해제하면 `color`와 같은 그리기 관련 속성만 변경될 때 그리기를 무효화하고 레이아웃은 무효화하지 않을 수 있습니다. 이렇게 하면 수정자의 성능이 개선될 수 있습니다.

이에 관한 가상의 예는 아래에 `color`, `size`, `onClick` 람다가 속성으로 있는 수정자를 사용하여 보여줍니다. 이 수정자는 필요한 항목만 무효화하고 필요하지 않은 항목은 무효화하지 않습니다.

```
class SampleInvalidatingNode(
    var color: Color,
    var size: IntSize,
    var onClick: () -> Unit
) : DelegatingNode(), LayoutModifierNode, DrawModifierNode {
    override val shouldAutoInvalidate: Boolean
        get() = false

    private val clickableNode = delegate(
        ClickablePointerInputNode(onClick)
    )

    fun update(color: Color, size: IntSize, onClick: () -> Unit) {
        if (this.color != color) {
            this.color = color
            // Only invalidate draw when color changes
            invalidateDraw()
        }

        if (this.size != size) {
            this.size = size
            // Only invalidate layout when size changes
            invalidateMeasurement()
        }

        // If only onClick changes, we don't need to invalidate anything
        clickableNode.update(onClick)
    }

    override fun ContentDrawScope.draw() {
        drawRect(color)
    }

    override fun MeasureScope.measure(
        measurable: Measurable,
        constraints: Constraints
    ): MeasureResult {
        val size = constraints.constrain(size)
        val placeable = measurable.measure(constraints)
        return layout(size.width, size.height) {
            placeable.place(0, 0)
        }
    }
}
```

[CustomModifierSnippets.kt](https://github.com/android/snippets/blob/c79a414f423d09d009c92d69fb71e882e6edd39b/compose/snippets/src/main/java/com/example/compose/snippets/modifiers/CustomModifierSnippets.kt#L309-L352)

# 참고 문서

- [Android Developers|Get started with Jetpack Compose](https://developer.android.com/develop/ui/compose/documentation)
