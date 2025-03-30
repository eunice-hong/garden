---
title: The Compose Compiler
description: 컴파일러 플러그인의 작동 방식과 이전 시간에 배운 annotation을 사용하는 방법에 대해 알아보도록 하겠습니다.
date: 2025-03-09T21:00:00
draft: false
noindex: false
tags:
  - JetpackCompose
---

# Composable 함수들

## Composable 함수의 의미

- Jetpack Compose의 가장 기본이 되는 요소
- Composable 트리 구조를 작성하는 데 사용됨
- `@Composable` 어노테이션을 사용하여 Composable 함수 선언 가능

```kotlin
@Composable
fun NamePlate(name: String) {
    // Composable 코드
}
```

note: Jetpack Compose에서 UI 요소를 선언할 때 Composable 함수를 사용합니다. 트리 구조 개념을 이해하는 것이 중요합니다. @Composable 어노테이션을 사용함으로써, 우리는 컴파일러에게 이 함수가 본질적으로 데이터를 하나의 노드(node)로 변환하여 Composable 트리(tree)에 기재하겠다는 의도를 전달합니다.

## Composable 함수의 속성

note: Compose Runtime은 Composable 함수가 사전에 정의된 특성을 준수하도록 가정한다.

### 호출 컨텍스트

- Composable 함수는 오직 다른 Composable 함수에서만 호출 가능
- `Compose Compiler`가 `Composer` 매개변수를 추가하여 처리

```kotlin
fun NamePlate(name: String, lastname: String, $composer: Composer<*>) {
    Column(modifier = Modifier.padding(16.dp), $composer) {
        Text(text = name, $composer)
        Text(text = lastname, style = MaterialTheme.typography.subtitle1, $composer)
    }
}
```

note: Composable 함수는 일반 함수와 다르게 컴파일러가 특별한 처리를 합니다. 내부적으로 `Composer` 객체를 사용하여 UI 상태를 관리합니다.

Composable 함수의 속성은 대부분 Compose Compiler에 의해 활성화됩니다. 각 Composable 함수에 추가된 요소 중 하나는 함수의 매개변수 목록의 끝에 새롭게 추가된 Composer입니다. 이 매개변수는 암묵적이며 개발자는 이에 대해 알아야 할 필요가 없습니다. Composer 매개변수의 인스턴스는 런타임에 주입되며, 모든 하위 Composable 호출로 전달되므로 트리의 모든 수준에서 접근할 수 있습니다.

**Suspend 함수와의 유사성**

- `@Composable` 함수는 `suspend` 함수와 비슷한 방식으로 동작
- Composable 함수는 **호출 컨텍스트**가 필요하며, 일반 함수에서는 호출할 수 없음

Composable 함수와 suspend 함수는 호출 컨텍스트를 필요로 한다는 점에서 유사합니다. 하지만 Composable 함수는 UI 상태를 다루기 위한 특수한 개념입니다.

### 멱등성(Idempotent)

- 동일한 입력값을 사용하면 항상 동일한 결과 반환
- Compose Runtime은 recomposition 시 변경된 부분만 다시 실행

note: 멱등성은 Composable 함수가 같은 입력에 대해 항상 같은 출력을 보장하는 개념입니다. 이 덕분에 불필요한 UI 업데이트를 방지할 수 있습니다.

### 통제되지 않은 사이드 이펙트 방지

- Composable 함수 내에서 네트워크 요청, 전역 변수 변경 등을 피해야 함

```kotlin
@Composable
fun EventsFeed(networkService: EventsNetworkService) {
    val events = networkService.loadAllEvents() // 위험한 코드!
    LazyColumn {
        items(events) { event ->
            Text(text = event.name)
        }
    }
}
```

note: Composable 함수는 UI 상태를 관리하는 역할을 합니다. 네트워크 요청 같은 사이드 이펙트는 별도의 `LaunchedEffect` 같은 효과 핸들러에서 실행해야 합니다.

### 재시작 가능 (Restartable)

- 상태(State)의 변화에 반응하여 Composable 함수가 다시 실행될 수 있음

note: Jetpack Compose의 강점 중 하나는 상태가 변경될 때 UI가 자동으로 업데이트된다는 점입니다. 이를 가능하게 하는 것이 Composable 함수의 재시작 가능성입니다.

### 빠른 실행 (Fast execution)

- UI를 구축하는 것이 아니라 **트리 구조를 생성하고 업데이트**하는 것이 목표

note: Composable 함수는 실제 UI를 직접 그리는 것이 아니라, UI의 구조를 설명하는 역할을 합니다. 런타임에서 이를 최적화하여 빠르게 UI를 갱신합니다.

--

### 위치 기억법 (Positional Memoization)

- `remember`를 사용하여 불필요한 재계산 방지

```kotlin
@Composable
fun FilteredImage(path: String) {
    val filters = remember { computeFilters(path) }
    ImageWithFiltersApplied(filters)
}
```

note: `remember`는 Composable 함수 내에서 값이 불필요하게 다시 계산되는 것을 방지하는 중요한 도구입니다. 상태를 유지할 때 활용하세요.

## 함수 컬러링 (Function Coloring)

- Composable 함수는 일반 함수와 별개의 특성을 가지므로 호출 방식이 다름
- `inline`을 활용하면 일반적인 컬렉션 연산 내에서 Composable 함수 사용 가능

```kotlin
@Composable
fun SpeakerList(speakers: List<Speaker>) {
    Column {
        speakers.forEach {
            Speaker(it)
        }
    }
}
```

note: 일반 함수에서 Composable 함수를 직접 호출할 수 없습니다. 하지만 `inline` 키워드를 활용하면 이를 우회할 수 있습니다.

## Composable 함수 타입

- `@Composable` 어노테이션이 적용된 함수는 **특정 타입**을 가짐
- `(T) -> A` 형태의 타입을 가지며, 반환값은 `Unit` 또는 다른 값이 될 수 있음

```kotlin
val textComposable: @Composable (String) -> Unit = {
    Text(text = it, style = MaterialTheme.typography.subtitle1)
}
```

note: Composable 함수는 일반 함수와 다르게 특수한 타입을 가지며, 이를 활용하면 보다 유연한 UI 구성이 가능합니다.

---

# Q&A

note:

- `@Composable` 함수는 UI를 선언적 방식으로 구성하는 핵심 요소
- Compose Runtime은 Composable 함수의 호출을 최적화하여 빠른 실행을 보장
- **멱등성, 재시작 가능성, 위치 기억법** 등의 개념이 중요하게 작용함
- **사이드 이펙트를 방지하고 빠른 실행을 유지하는 것이 핵심 목표**
  Jetpack Compose의 핵심 개념을 이해하면, 효율적인 UI를 작성할 수 있습니다. 특히 recomposition과 상태 관리 개념을 잘 활용하는 것이 중요합니다.

---

# Compose 컴파일러

---

## Compose의 핵심 요소

1. Compose Compiler
2. Compose Runtime
3. Compose UI

note: Compose Compiler와 Runtime은 핵심 요소이며, Compose UI는 그 위에 구축된 클라이언트 라이브러리 중 하나. Compose는 단순한 UI 라이브러리가 아니라 Compiler와 Runtime을 포함하는 더 큰 아키텍처를 가지고 있습니다. 이를 이해하면 최적화된 Compose 코드를 작성하는 데 도움이 됩니다.

---

## Compose Compiler란?

- Kotlin 컴파일러 플러그인으로 동작하며 **코드 변환 및 최적화** 수행
- kapt(어노테이션 프로세서) 대신 Kotlin 컴파일러 내부에서 실행되어 더 빠름
- Kotlin IR(Intermediate Representation)을 변환하여 Compose Runtime에 최적화된 코드 생성

note: Compose Compiler는 일반적인 Java/Kotlin의 어노테이션 프로세서(kapt)와 달리, 컴파일 단계에서 직접 작동하여 더 강력한 코드 최적화가 가능합니다.

---

## Compose Compiler의 역할

- `@Composable` 어노테이션이 붙은 함수를 변환하여 `Composer` 객체를 추가
- IR 변환을 통해 **Composition 및 Recomposition 최적화**
- Kotlin 컴파일러 프론트엔드 단계에서 정적 분석을 수행하여 빠른 피드백 제공

note: Compose Compiler는 일반적인 Kotlin 컴파일 과정과 밀접하게 연결되어 있으며, 이를 통해 Composable 함수의 실행 방식을 최적화합니다.

---

# Compose 어노테이션

## 주요 Compose 어노테이션

### `@Composable`

- Composable 함수로 변환되어 Compose Runtime에서 관리됨
- Composition 트리의 노드를 생성하고 UI를 갱신하는 역할

```kotlin
@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name")
}
```

note: `@Composable` 어노테이션은 Compose의 핵심 개념이며, Composable 함수는 일반 함수와 다르게 동작합니다.

--

### `@ComposableCompilerApi`

- Compose Compiler 내부에서만 사용하는 API임을 나타냄

note: 일반 개발자가 사용할 필요는 없으며, Compose Compiler가 내부적으로 최적화하는 데 활용됩니다.

--

### `@InternalComposeApi`

- Compose 내부 API 중 일부가 변경될 수 있음을 의미
- Kotlin의 `internal` 키워드보다 더 넓은 범위에서 사용됨

note: 내부 API에 의존하면 향후 Compose 업데이트 시 코드가 깨질 가능성이 있습니다.

--

### `@DisallowComposableCalls`

- 특정 람다 내에서 Composable 함수를 호출하지 못하도록 제한

```kotlin
@Composable
inline fun <T> remember(calculation: @DisallowComposableCalls () -> T): T {
    return currentComposer.cache(false, calculation)
}
```

note: `remember` 같은 함수에서 Composable 함수를 호출하면 불필요한 메모리 할당이 발생할 수 있기 때문에 이를 방지합니다.

--

### `@ReadOnlyComposable`

- Composition을 변경하지 않고 **오직 읽기 전용**으로 작동하는 함수
- `CompositionLocal`을 활용하는 경우 사용 가능

```kotlin
@ReadOnlyComposable
@Composable
fun getThemeColor(): Color {
    return MaterialTheme.colors.primary
}
```

note: `@ReadOnlyComposable`을 사용하면 불필요한 recomposition을 줄이고 성능을 향상시킬 수 있습니다.

--

### `@NonRestartableComposable`

- Composable 함수가 recomposition 시 재실행되지 않도록 설정
- 단순한 UI 요소(아이콘, 이미지 등)에 사용하면 성능 최적화 가능

note: `@NonRestartableComposable`을 사용하면 불필요한 recomposition을 방지하여 성능을 향상시킬 수 있습니다.

--

# 안정성 관련 어노테이션

## `@StableMarker`

- `@Stable` 및 `@Immutable`을 위한 메타 어노테이션
- **안정성을 보장하는 타입**임을 컴파일러에게 알림

note: `@StableMarker` 자체는 직접 사용할 일이 없으며, `@Stable`과 `@Immutable`에서 사용됩니다.

--

## `@Immutable`

- 클래스의 모든 외부 속성이 변경되지 않음을 보장
- recomposition 최적화에 활용됨

```kotlin
@Immutable
data class User(val name: String, val age: Int)
```

note: 불변 객체는 recomposition 시 값이 변경되지 않으므로 Compose에서 최적화하여 불필요한 재실행을 방지할 수 있습니다.

--

## `@Stable`

- 내부적으로 변경될 가능성이 있지만 Compose에서 안정적인 타입으로 간주
- **상태 변경이 발생하면 Compose Runtime에서 감지 가능**

```kotlin
@Stable
class Counter {
    var count by mutableStateOf(0)
}
```

note: `@Stable` 객체는 값이 변경되면 Compose Runtime에서 자동으로 감지하여 UI를 갱신할 수 있도록 합니다.

---

# Q&A

note:

- Compose Compiler는 Compose의 핵심 요소 중 하나로, Composable 함수의 최적화 및 변환을 담당
- 다양한 어노테이션을 활용하여 Composable 함수의 동작을 최적화 가능
- 안정성 관련 어노테이션을 활용하면 불필요한 recomposition을 줄일 수 있음
  Compose Compiler의 동작을 이해하고 적절한 어노테이션을 활용하면, 성능 최적화된 Compose 애플리케이션을 개발할 수 있습니다.

## 0. 컴파일러 확장 등록

Compose Compiler 플러그인은 가장 먼저 `ComponentRegistrar`를 사용하여 Kotlin 컴파일러 파이프라인에 자신을 등록합니다.
`ComponentRegistrar`를 통해 다양한 컴파일러 확장을 등록할 수 있습니다.

이어서 다룰 각종 컴파일러 확장 기능들은 컴파일러 플래그 설정에 따라 등록됩니다.

## 1. Kotlin 컴파일러 버전 확인

Compose Compiler는 Kotlin 버전을 구체적으로 지정할 필요가 있습니다.
만약 컴파일러 플래그에서 지정된 Kotlin 버전이 충족되지 않을 경우, 컴파일 오류로 이어지기 쉽습니다.

## 2. 정적 분석

정적 분석은 린팅을 수행하여 Composable 어노테이션이 올바르게 사용되었는지 검사합니다.
컴파일러 플러그인이 코드 컨텍스트를 추적하여 경고나 오류를 보고하고, IDEA 플러그인과 통합됩니다.
컴파일러 코드의 분석과 변환을 수행하는 초기 단계에서 검증이 이루어져 빠른 피드백을 제공합니다.

#### 1. 호출 검사 (Call checks)

- Compose Compiler는 Composable 함수 호출을 검증하는 정적 호출 검사를 제공
- `@DisallowComposableCalls`, `@ReadOnlyComposable` 등의 어노테이션을 검사하여 올바른 사용을 강제

**호출 검사기 (Call Checker)**

- PSI 트리(Program Structure Interface) 방문: 코드 내 모든 호출을 분석
- [방문자 패턴(Visitor Pattern)](https://refactoring.guru/design-patterns/visitor) 활용하여 각 노드의 호출 컨텍스트를 확인
- Composable 함수 호출의 유효성을 검증하고 IDE에서 오류 또는 경고 보고

**주요 검사 항목**

1. 호출자(Callers) 추적

- Composable 함수가 호출된 모든 컨텍스트를 추적
- 람다, 프로퍼티, try/catch 블록 등 다양한 호출 시나리오 검사

2. 인라인 람다 분석

- 인라인 람다 내에서 Composable 함수가 올바르게 호출되었는지 확인
- Composable 함수 내부에 감싸져 있는지 검사

3. 누락된 `@Composable` 어노테이션 감지

- Composable 함수가 필요한 경우 개발자에게 자동 제안
- 정적 분석을 통해 코드 품질 향상 지원

4. `@ReadOnlyComposable` 함수 검증

- `@ReadOnlyComposable` 함수 내에서는 읽기 전용 Composable만 호출 가능
- 방문자 패턴을 활용하여 전체 트리 구조 내에서 위반 여부 검사

5. 참조 제한 검사

- Jetpack Compose에서 지원되지 않는 Composable 참조 사용을 차단

#### 2. 타입 검사 (Type checks)

`@Composable` 어노테이션이 필요한지 판단하여, 필요한 경우 오류 발생
함수 뿐만 아니라 타입에도 적용된다.

#### 3. 선언 검사 (Declaration checks)

- Composable 함수의 선언 위치(프로퍼티, 접근자, 함수 선언 등)를 분석하여 일관성을 유지함.
- Composable 함수가 재정의(override)될 경우 어노테이션이 유지되는지 검사하고, `@Composable`과 `suspend`의 동시 사용을 금지함.
- `main()` 함수의 Composable 선언 및 Composable 속성의 backing 필드 사용을 제한하는 검사 수행.

  ```kotlin
  // 잘못된 Composable Backing Field 사용 예시
  val myText: String
      @Composable get() = "Hello" // ❌ 허용되지 않음!
  ```

  ```kotlin
  // 올바른 사용 예시
  @Composable
  fun MyText(): String {
      return "Hello"
  }
  ```

## 3. 진단 제지기 ⁉️

> [!abstract] 진단 제지기(Diagnostic Suppression)
> 특정 컴파일 오류를 무시하도록 허용하는 컴파일러 플러그인 기능이다. `ComposeDiagnosticSuppressor`는 Compose가 Kotlin의 일부 언어적 제한을 우회할 수 있도록 한다.

예를 들어, `AnnotationRetention.BINARY` 또는 `AnnotationRetention.RUNTIME` 보존 어노테이션이 인라인 람다에 적용되면, 컴파일 타임에 사라지므로 Kotlin은 이를 금지한다.
이 규칙을 위반하면 “해당 람다식은 인라인된 매개변수이므로, 이 어노테이션은 어디에도 저장할 수 없습니다.” 오류가 발생한다.

## 4. 런타임 버전 검사

- Compose Compiler는 코드 생성 전에 Compose Runtime의 최소 지원 버전을 검사하여, 너무 오래된 버전이 아닌지 확인한다.
- Compose Runtime이 누락되었거나 버전이 지원되지 않는 경우 감지하여 오류를 방지한다.

## 5. 코드 생성

> [!abstract] Kotlin IR(Intermediate Representation)
> 컴파일러가 소스파일을 해석하는 하나의 과정으로, 코드 수정 및 변환이 가능하다. Compose Compiler는 IR을 활용하여 Composer 매개변수를 자동으로 주입하고, Composable 호출을 변환한다.

> [!abstract] 낮추기 (Lowering)
> 번역 컴파일러가 더 높은 수준 또는 더 고급 프로그래밍 개념에서 더 낮은 수준의 원자적인(atomic) 개념의 조합으로 수행할 수 있는 작업을 의미합니다.

### a. 클래스 안정성 추론

Compose Runtime은 필요에 따라 recomposition을 생략하기 위해 입력값이 안정적인지 확인할 수 있어야 합니다.  
안정성의 주요 목적은 런타임의 불필요한 연산을 줄이는 것입니다.

**안정적인 타입의 조건**

- 두 인스턴스에 대한 `equals` 함수의 호출은 동일한 두 인스턴스에서 항상 같은 결과를 반환해야 함.
- 타입의 `public` 프로퍼티가 변경될 때마다, composition은 변경 사항을 감지할 수 있어야 함.
- 모든 `public` 프로퍼티는 원시 타입 또는 안정적인 타입이어야 함.

**불안정한 타입 처리**

Compose에서 안정적인 타입이 아닐 경우 안정성을 보장하기 위해 `@Stable` 또는 `@Immutable` 어노테이션을 추가할 수 있습니다.
예를 들어, `MutableState`는 변경 사항을 감지할 수 있도록 설계되었으며, Compose는 이를 안정적인 타입으로 간주합니다.

**Compose의 클래스 안정성 추론 방식**

- 기본적으로 모든 클래스를 방문하여 `@StabilityInferred` 주석을 합성하는 방식 사용.
- 클래스에 대해 안정성 정보를 인코딩한 `static final int $stable` 값을 추가하여 안정성을 결정.

**안정성 추론 조건**

- 클래스의 모든 필드가 `readonly`이고 안정적이면, 해당 타입을 안정적이라고 추론.
  - 예제 1: `class Foo(val value: Int)` → 안정적인 타입
  - 예제 2: `class Foo(var value: Int)` → 불안정한 타입 (값이 변경될 가능성이 있음)
- 클래스의 제네릭 타입이 포함될 경우 전달된 타입의 안정성에 따라 클래스의 안정성이 결정

**안정성 추론 대상**

안정성 추론은 모든 클래스에 적용되는 것이 아니라, 다음과 같은 조건을 만족하는 클래스에만 적용됩니다.
`@Stable` 또는 `@Immutable` 어노테이션이 명시적으로 추가되지 않은 일반적인 클래스, 데이터 클래스(`data class`)는 기본적으로 안정성이 추론됩니다.

- `enum`, `enum entry`
- `interface`
- `anonymous object`
- `expect` 엘리먼트
- `inner class`
- `companion object`
- `inline class`가 아닌 **모든 `public` 클래스**

### b. 라이브 리터럴 활성화

컴파일러에 전달할 수 있는 플래그 중에는 '라이브 리터럴(live literals)'이라는 플래그가 있습니다.
라이브 리터럴은 Compose 도구들이 미리 보기에서 변경사항을 리컴파일(recompilation) 없이 실시간으로 반영하도록 도와줍니다.
Compose Compiler는 `MutableState` 프로퍼티를 생성하여, 변경 사항이 즉시 감지되도록 합니다.
리컴파일 없이 실시간 UI 변경이 가능하지만, 성능 문제로 릴리스 빌드에서는 사용하지 않아야 합니다.

**Compose Compiler의 역할**

- 상수 표현식이 포함된 파일마다 `LiveLiterals$<클래스명>` 싱글톤 클래스를 생성
- 해당 클래스 내의 각 상수(Constant) 표현식에 고유한 ID를 생성
- 상수값을 `MutableState` 프로퍼티의 getter에서 획득하여 변환
- 런타임에서 생성된 키를 이용해 변환된 상수값을 획득

```kotlin
// 기본 Composable 함수
@Composable
fun Foo() {
    print("Hello World")
}
```

```kotlin
// 변환된 코드 (LiveLiterals 적용 후)
@Composable
fun Foo() {
    print(LiveLiterals$FooKt.getString$arg-0$call-print$fun-Foo())
}

object LiveLiterals$FooKt {
    var `String$arg-0$call-print$fun-Foo`: String = "Hello World"
    var `State$String$arg-0$call-print$fun-Foo`: MutableState<String>? = null
}

fun `getString$arg-0$call-print$fun-Foo`(): String {
    val field = this.`String$arg-0$call-print$fun-Foo`

    val state = if (field == null) {
        val tmp = liveLiteral(
            "String$arg-0$call-print$fun-Foo",
            this.`String$arg-0$call-print$fun-Foo`
        )
        this.`String$arg-0$call-print$fun-Foo` = tmp
        tmp
    } else field

    return field.value
}
```

### 컨트롤 플로우 그룹

^control-flow-group

Compose Compiler는 각 Composable 함수의 본문에 그룹(group)을 삽입합니다. 본문 내에서 찾을 수 있는 컨트롤 플로우 구조에 따라 아래와 같은 3가지 유형의 그룹이 생성됩니다.

| 그룹 유형              | 설명                                                           |
| ---------------------- | -------------------------------------------------------------- |
| **교체 가능한 그룹**   | - Composable 함수 호출 위치를 추적<br>- 상태 변경 시 교체 가능 |
| **이동 가능한 그룹**   | `key()`를 통해 정체성 보존하며 순서 변경 가능                  |
| **재시작 가능한 그룹** | recomposition 중 함수를 재시작할 수 있도록 함                  |

Composable 함수는 런타임 시에 그룹을 생성하며, 생성된 그룹들은 Composable 함수의 현 상태에 대한 모든 정보를 감싸고 보존합니다. 이를 통해 composition은 그룹에 교체가 필요할 때(교체 가능한 그룹), Composable의 정체성을 항상 유지하면서 데이터를 이동시킬 때 (이동 가능한 그룹), 또는 recomposition 중에 함수를 재시작할 때 (재시작 가능한 그룹) 쓰여진 데이터를 어떻게 처리해야 할지 알 수 있습니다.

결국, 런타임은 composition이 메모리에 저장한 정보를 바탕으로 컨트롤 플로우를 어떻게 다루어야 하는지 알아야 합니다. 또한, 그룹은 Composable 함수의 호출 위치에 대한 정보를 가지고 있습니다. 그룹이 생성될 때, 작성된 소스 코드의 텍스트 범위를 지정하여 감싸고, 호출 위치 정보를 바탕으로 생성된 키(key)를 가집니다. 이를 통해 그룹을 저장하고, 1장에서 살펴보았던 위치 기억법을 가능하게 합니다.

#### 교체 가능한 그룹

“Composable 람다식 기억법” 섹션에서 Composable 람다식의 본문에 $composer, $key, Composable 람다식의 실체와 같은 값을 매개변수로 받는 Composable 팩토리 함수 호출 을 삽입함으로써, Composable 람다식이 자동으로 감싸진다는 사실을 살펴보았습니다. 아래 예시는 방금 이야기한 팩토리 함수가 실제 어떻게 생겼는지를 보여줍니다.

```kotlin
fun composableLambda(
    composer: Composer,
    key: Int,
    tracked: Boolean,
    block: Any
): ComposableLambda {
    composer.startReplaceableGroup(key)
    val slot = composer.rememberedValue()
    val result = if (slot === Composer.Empty) {
        val value = ComposableLambdaImpl(key, tracked)
        composer.updateRememberedValue(value)
        value
    } else {
        slot as ComposableLambdaImpl
    }
    result.update(block)
    composer.endReplaceableGroup()
    return result
}
```

위의 팩토리 함수는 Composable 함수에서 사용되는 것 과 같이 Composable 람다식을 위해 호출됩니다. 코드를 주의 깊게 살펴보면, 먼저 키(key)로 교체 가능한 그룹을 시작하고, 중간에 모든 텍스트의 범위를 감싸고, 마지막으로 그룹을 닫는다는 사실을 알 수 있습니다. 시작과 끝 호출 사이에서, composition을 관련성 있는 정보로 업데이트합니다. 이것이 우리가 래핑하는 람다식입니다.

방금 살펴본 예시는 Composable 람다식에 대한 것이지만, 다른 Composable 함수의 호출 또한 동일하게 처리됩니다. 아래의 예는 @NonRestartableComposable 어노테이션으로 재시작이 불가능하다고 마킹된 Composable 함수의 코드가 어떻게 변환되는지를 보여줍니다.

```kotlin
// Before compiler (sources)
@NonRestartableComposable
@Composable
fun Foo(x: Int) {
    Wat()
}

// After compiler
@NonRestartableComposable
@Composable
fun Foo(x: Int, %composer: Composer?, %changed: Int) {
    %composer.startReplaceableGroup(<>)
    Wat(%composer, 0)
    %composer.endReplaceableGroup()
}
```

위의 Composable 함수 또한 composition에 저장하기 위한 교체 가능한 그룹을 생성합니다. 그룹은 일종의 트리와 같습니다. 각 그룹은 원하는만큼 그 어떠한 수의 그룹도 자식으로 가질 수 있습니다. 위의 예시에서 Wat() 함수 또한 Composable 함수라면, 컴파일러는 해당 함수에 대해서도 그룹을 삽입할 것 입니다.

우리는 “Composable 어노테이션” 섹션에서, Composable 호출은 위치에 기반하기 때문에 정체성이 보존될 수 있음을 아래의 예시를 통해 살펴보았습니다. 그리고, 런타임은 아래의 서로 다른 두 Text 호출이 다르다는 것을 이해할 수 있다는 사실도 다루었습니다.

```kotlin
if (condition) {
    Text(”Hello”)
} else {
    Text(”World”)
}
```

이와 같은 조건부 논리를 수행하는 Composable 함수 또한 교체 가능한 그룹을 발행하는데,
조건(condition)이 전환되면 교체될 수 있는 그룹을 슬롯 테이블에 저장합니다.

#### 이동 가능한 그룹

이동 가능한 그룹은 정체성을 잃지 않고 재정렬이 가능한 그룹입니다. 이 그룹은 아직까지는 key 함수의 내부에서 Composable 함수를 호출하는 경우에만 활용됩니다. 이전에 한 번 다루었던 예시를 통해 살펴보도록 하겠습니다.

```kotlin
@Composable
fun TalksScreen(talks: List<Talk>) {
    Column {
        for (talk in talks) {
            key(talk.id) { // Unique key
                Talk(talk)
            }
        }
    }
}
```

key 함수로 Talk 함수를 감싸면, Talk Composable 함수마다의 고유한 정체성이 보장되고 이동 가능한 그룹이 생성됩니다. 이 작업은 호출된 각 Composable 함수마다 정체성을 해치지 않으면서 호출 순서를 변경할 수 있도록 합니다.

아래의 예시를 통해 key 함수를 사용할 때 Composable이 어떻게 변환되는지 살펴볼 수 있습니다.

```kotlin
// Before compiler (sources)
@Composable
fun Test(value: Int) {
    key(value) {
        Wrapper {
            Leaf(”Value ${’$’}value”)
        }
    }
}

// After
@Composable
fun Test(value: Int, %composer: Composer?, %changed: Int) {
    // ...
    %composer.startMovableGroup(<>, value)
    Wrapper(composableLambda(%composer, <>, true) { %composer: Composer?,%changed: Int‑>
        Leaf(”Value %value”, %composer, 0)
    }, %composer, 0b0110)
    %composer.endMovableGroup()
    //
```

#### 재시작 가능한 그룹

재시작 가능한 그룹은 아마 가장 흥미로운 그룹 중 하나 입니다. 이 그룹들은 재시작 가능한 Composable 함수에만 삽입됩니다. 재시작 가능한 그룹 또한 해당 Composable 호출들을 감싸지만, 여기서 end 함수 호출을 약간 확장하여 nullable한 값을 반환합니다. 반환 값은 Composable 함수가 그 어떠한 상태(state)도 읽지 않을 때만 null이 되며,

결과적으로 recomposition이 필요하지 않습니다. 이런 경우는 런타임에게 해당 Composable을 재구성하는 방법에 대해 가르칠 필요가 없습니다. 만약 null이 아닌 값을 반환하는 경우, 컴파일러는composition을 업데이트하기 위해 람다식을 생성하는데, 그 람다식은 Composable을 “재시작” (다시 실행)하는 방법을 런타임에 가르칩니다.위 설명에 대한 코드는 아래와 같습니다.

```kotlin
// Before compiler (sources)
@Composable fun A(x: Int) {
    f(x)
}
// After compiler
@Composable
fun A(x: Int, $composer: Composer<*>, $changed: Int) {
    $composer.startRestartGroup()
    // ...
    f(x)
    $composer.endRestartGroup()?.updateScope { next ‑>
        A(x, next, $changed or 0b1)
    }
}
```

A()라는 Composable 함수에 대해 동일한 새 호출을 감싸고, recomposition을 트리거하기 위한 범위를 updateScope()를 통해 어떻게 갱신하는지 살펴보시길 바랍니다. 재시작 가능한 그룹은 상태(state)를 읽는 모든 Composable 함수에 대해 생성되는 유형의 그룹입니다.

이 섹션을 마무리하기 전에, 다양한 유형의 그룹을 생성하기 위해 컴파일러가 실행 가능한 블록에 적용하는 몇 가지 추가적인 논리에 대해 살펴보고자 합니다. 이러한 논리는 다른 유형의 그룹을 생성하기 위해 실행 가능한 블록(executable block)에 알맞게 적용됩니다. 아래는 공식 문서에서 가져온 내용입니다.

- 블록이 항상 정확하게 1회만 실행된다면 그룹이 필요하지 않습니다.
- 조건부 논리와 같이 블록의 집합체 중 한개가 단 한 번 실행되는 경우(가령, if 문 또는 when문 내의 블록), 각 블록 주위에 교체 가능한 그룹을 삽입합니다.
- 이동 가능한 그룹은 key Composable 함수 호출의 본문에서만 사용됩니다.

## 참고 문서

- [Writing Your Second Kotlin Compiler Plugin, Part 2 — Inspecting Kotlin IR](https://blog.bnorm.dev/writing-your-second-compiler-plugin-part-2)
