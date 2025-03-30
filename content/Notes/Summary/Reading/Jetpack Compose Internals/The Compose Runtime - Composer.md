---
title: The Compose Runtime - Composer
description: Composer의 역할과 데이터 처리 방식을 설명합니다.
date: 2025-03-30T21:01:00
draft: false
noindex: false
tags:
  - JetpackCompose
aliases:
  - Composer
---
> [!abstract] Composer
> [[The Compose Compiler|컴파일 단계]]에서 주입된 `$composer`는 Composable 함수를 Compose Runtime에 연결하는 역할을 합니다. 이는 트리의 구조를 구성하고 변경사항을 방출하는 중재자 역할을 합니다 [oai_citation:0‡Jetpack compose internals.pdf](file-service://file-EHh5YEhAXriKyW5chQQKnM).

# Composer의 데이터 처리

^feeding-the-composer

1. [[Jetpack Compose ReusableComposeNode|ReusableComposeNode]]
   필요한 경우 노드를 재사용하기 위한 정보를 제공합니다. 새로운 노드를 생성하거나 초기화하지 않고 기존 노드로의 이동만 기록하여 효율적인 구성(composition)이 가능합니다.
2. [[Jetpack Compose remember|remember]]
   슬롯 테이블에서 값을 찾고, 없으면 새로 생성하여 저장합니다. 이때 Composer가 삽입 중이면 즉시 테이블에 쓰고, 아니면 변경 사항(Change)으로 기록됩니다.

# 변경 사항 모델링

모든 방출 작업은 `Change`로 모델링되며, 이는 Applier와 SlotWriter에 접근할 수 있는 지연된 함수입니다:

```kotlin
internal typealias Change<N> = (
    applier: Applier<N>,
    slots: SlotWriter,
    rememberManager: RememberManager
) -> Unit
```

> 참고: 예전 문서에는 LifeCycleManager가 등장하지만, 최신 문서에서는 RememberManager가 사용됩니다 .

“방출”은 Change를 생성하는 행위로, 슬롯 테이블의 노드 추가/제거/이동 등을 Applier가 실행할 수 있도록 예약합니다. 이러한 변경들은 나중에 일괄 적용됩니다 .

# 작성 시기 최적화

Composer는 현재 삽입 중인지 인지하며, 삽입 중일 경우 변경 사항을 즉시 슬롯 테이블에 기록하고, 그렇지 않으면 변경 목록에 보류로 기록합니다. 이로써 불필요한 작업을 줄이고 효율적인 업데이트가 가능합니다 .

# 쓰기 및 읽기 그룹

Composition 완료 후 applyChanges()를 호출하여 모든 변경사항을 실제로 적용합니다. Composer는 SlotWriter를 통해 그룹을 기록하거나, SlotReader를 통해 읽기 작업을 수행합니다. 그룹은 다음과 같이 분류됩니다:

- **재시작 가능 그룹** (Restartable)
- **이동 가능 그룹** (Movable)
- **교체 가능 그룹** (Replaceable)
- **재사용 가능 그룹** (Reusable)
- **특수 목적 그룹**: 예. remember로 감싸는 기본 매개변수 wrapper 등

**Composer의 그룹 처리 방식 요약**:

1. **시작 시**:
   - 삽입 중이면 즉시 슬롯 테이블에 작성
   - 보류 중 작업이 있다면 변경 사항 기록
   - 그룹이 다른 위치에 있다면 슬롯 이동 기록
   - 신규 그룹이면 insertTable에 작성 후 예약
   - 그 외에는 읽기 모드로 진입
2. **종료 시**:
   - 읽기 종료 또는 SlotWriter에서 그룹 제거 작업 수행

# 값 기억하기

remember는 값을 슬롯 테이블에 저장하고, 이후 Composition에서 재사용합니다. 값이 RememberObserver인 경우, 해당 객체를 추적하기 위한 암시적 Change도 함께 기록됩니다 .

```kotlin
remember {
    // 기존 값과 비교
    // 변경 시: Change로 기록 (삽입 중이 아니면)
}
```

이러한 구조는 추후 remembered 값이 필요 없어질 때 forget() 처리에도 사용됩니다.

# 재구성 범위

RecomposeScope는 Composable 내의 특정 영역이 독립적으로 재구성될 수 있도록 모델링한 것입니다. 이는 재시작 가능한 그룹이 생성될 때마다 `Composer`가 RecomposeScope를 만들고, 이를 `currentRecomposeScope`로 설정함으로써 구성됩니다. 해당 scope는 수동으로 무효화할 수 있으며, 다음과 같이 사용할 수 있습니다:

```kotlin
currentRecomposeScope.invalidate()
```

이 scope는 상태의 읽기가 발생했을 때만 used 상태가 되며, 이때 비로소 endRestartGroup()?.updateScope {} 블록이 유효한 recomposition 블록으로 활성화됩니다 .

# Composer와 사이드 이펙트

사이드 이펙트는 Composable 함수의 생명주기 외부에서 발생하는 동작을 말하며, Composer는 이를 **슬롯 테이블이 아닌** 별도의 방식으로 추적합니다. 사이드 이펙트는 Composition이 완료된 이후 실행되며, DisposableEffect, SideEffect 같은 핸들러를 통해 안전하게 실행할 수 있습니다 .

```kotlin
SideEffect {
    externalState.value = something
}
```

이러한 이펙트는 Composition이 실패하면 단순히 폐기되며, 재시도되지 않습니다 .

# Composer와 CompositionLocal

CompositionLocal은 Provider와 함께 슬롯 테이블 내에서 하나의 그룹으로 저장되며, 현재 Composer는 해당 키를 통해 값을 소비할 수 있습니다. 다음은 이를 보여주는 예입니다:

```kotlin
inline val current: T
    @ReadOnlyComposable @Composable get() = currentComposer.consume(this)
```

currentComposer.consume() 호출은 현재 CompositionLocal에서 값을 읽기 위한 메커니즘입니다 .

# 소스 정보 저장

Composer는 composition 중에 수집된 데이터를 CompositionData 객체로 저장합니다. 이 데이터는 툴 API에서 활용되며, CompositionGroup들의 목록과 함께 구성됩니다:

```kotlin
interface CompositionData {
    val compositionGroups: Iterable<CompositionGroup>
    val isEmpty: Boolean
}
```

이는 Compose 도구가 slot table의 상태를 해석하는 데 필요한 메타데이터를 제공합니다 .

# CompositionContext를 이용한 Composition 연결

CompositionContext는 Subcomposition 간의 연결을 위해 사용되며, 상위 Composition과 하위 Composition을 트리 구조로 묶어줍니다. 이로 인해 CompositionLocal이나 무효화 범위가 마치 단일 Composition처럼 자연스럽게 전파됩니다. 해당 context는 slot table에 그룹으로 기록됩니다 .

```kotlin
@Composable
fun rememberCompositionContext(): CompositionContext {
    return currentComposer.buildContext()
}
```

이 함수는 Subcomposition을 생성할 때 자주 사용됩니다. 예시로는 SubcomposeLayout, Dialog, Popup, AndroidView 등이 있습니다.

# 현재 상태 스냅샷에 접근

각 Composition은 자체적인 스냅샷을 생성하여 격리된 상태 추적을 가능하게 하며, 이는 Snapshot.enter() 함수로 진입합니다. 이를 통해 특정 시점의 상태를 일관되게 유지할 수 있습니다:

```
val snapshot = Snapshot.takeMutableSnapshot(readObserver, writeObserver)
snapshot.enter {
    // 상태 읽기 및 쓰기
}
```

스냅샷은 Compose의 상태 격리 모델의 핵심 요소이며, mutable state의 안전한 변경 및 버전 관리를 지원합니다 .

# 노드 탐색

노드 트리는 Applier를 통해 최종적으로 변경 사항이 적용되지만, 그 전 단계에서 SlotReader가 slot table을 탐색하고 위치를 추적합니다. 탐색 정보는 downNodes 배열에 기록되며, 필요 시 Applier를 통해 일괄적으로 재생됩니다 .

# Reader와 Writer 간의 동기화 유지하기

슬롯 테이블에서 그룹이 삽입, 삭제, 이동됨에 따라 Reader와 Writer는 동일한 그룹이라도 서로 다른 위치를 참조할 수 있습니다. 이를 위해 Composer는 두 위치 간의 delta 값을 유지하여, Writer가 Reader의 위치에 맞게 조정될 수 있도록 합니다. 이는 적용 전까지의 일시적 거리(unrealized distance)로 표현됩니다 .

[code-composer]: https://android.googlesource.com/platform/frameworks/support/+/refs/heads/androidx-compose-release/compose/runtime/runtime/src/commonMain/kotlin/androidx/compose/runtime/Composer.kt
[code-composition-applyChanges]: https://android.googlesource.com/platform/frameworks/support/+/refs/heads/androidx-compose-release/compose/runtime/runtime/src/commonMain/kotlin/androidx/compose/runtime/Composition.kt#249
[code-composition-local]: https://cs.android.com/androidx/platform/frameworks/support/+/androidx-main:compose/runtime/runtime/src/commonMain/kotlin/androidx/compose/runtime/CompositionLocal.kt;l=19-76?q=file:androidx%2Fcompose%2Fruntime%2FCompositionLocal.kt%20class:androidx.compose.runtime.CompositionLocal
