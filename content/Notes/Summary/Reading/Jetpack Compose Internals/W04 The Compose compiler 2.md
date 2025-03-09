---
title: Compose 컴파일러
description: 
date: 2025-03-09T21:00:00
draft: false
noindex: false
tags:
  - JetpackCompose
---

Compose Compiler 플러그인의 작동 방식과 이전 시간에 배운 annotation을 사용하는 방법에 대해 알아보도록 하겠습니다.


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

## 참고 문서

- [Writing Your Second Kotlin Compiler Plugin, Part 2 — Inspecting Kotlin IR](https://blog.bnorm.dev/writing-your-second-compiler-plugin-part-2)