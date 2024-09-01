---
title: 06장 CoroutineContext
description: 코루틴의 실행 환경을 설정하고 관리하는 인터페이스인 CoroutineContext에 대해 알아봅니다.
date: 2024-09-01 17:05:00 +0900
draft: false
noindex: false
aliases:
  - CoroutineContext
---
 
## 1. 주요 개념 정리

### 1.1 CoroutineContext란?

> 코루틴의 실행 환경을 설정하고 관리하는 인터페이스

CoroutineContext 는 코루틴의 실행 환경을 설정하고 관리하는 인터페이스입니다.
아래에 이어지는 CoroutineContext 의 구성요소들, CoroutineName, CoroutineDispatcher, Job, CoroutineExceptionHandler 를 통해 코루틴의 실행 환경을 설정합니다.

## 2. CoroutineContext 구성요소

### 2.1 CoroutineContext 구성요소

1. [CoroutineName][coroutine_name_docs]: 코루틴의 이름을 나타낸다.
2. [[Notes/Summary/Reading/코틀린-코루틴의-정석/03장 CoroutineDispatcher|CoroutineDispatcher]]: 코루틴을 스레드에 할당하여 실행시킨다.
3. [Job][job_docs]: 코루틴의 추상체로 코루틴을 조작하는 데에 사용된다.
4. `CoroutineExceptionHandler`: 코루틴에서 예외가 발생했을 때 처리하는 핸들러이다.

코루틴은 네가지 구성요소를 가지고 있습니다.
순서대로 `CoroutineName`, `CoroutineDispatcher`, `Job`, `CoroutineExceptionHandler` 입니다.
각 구성요소는 조합해서 사용할 수 있습니다. 즉, 모든 구성요소가 포함될 필요는 없습니다.


또한, 한 `CoroutineContext`에는 구성요소는 각각 하나씩만 사용할 수 있습니다.
즉, 같은 구성요소 키에 여러개의 값을 할당할 수 없습니다.


## 3. CoroutineContext 구성하기: CREATE

### 3.1 `+` 연산자를 사용해 CoroutineContext 생성하기

```kotlin
fun main() = runBlocking<Unit> {  
    val coroutineName = CoroutineName("Eunjin Coroutine")  
    val dispatcher = Dispatchers.IO  
    val coroutineContext: CoroutineContext = coroutineName + dispatcher  
  
    println(coroutineContext)  
}
``` 

위 코드에서 보이는 것처럼, `+` 연산자를 사용하여 CoroutineContext 를 생성할 수 있습니다.
이 코드는 CoroutineName 과 CoroutineDispatcher 를 사용하여 CoroutineContext 를 생성합니다.

이 코드를 실행하면, 각 줄이 출력하는 결과는 다음과 같습니다.

```sh
[CoroutineName(Eunjin Coroutine), Dispatchers.IO]
```

## 4. CoroutineContext 구성하기: READ

### 4.1 구성요소 자체를 사용해 CoroutineContext 구성요소 읽기

```kotlin
@OptIn(ExperimentalStdlibApi::class)  
fun main() = runBlocking<Unit> {  
    val coroutineName = CoroutineName("Eunjin Coroutine")  
    val dispatcher = Dispatchers.IO  
    val coroutineContext: CoroutineContext = coroutineName + dispatcher  
  
    println(coroutineContext[CoroutineName])  
    println(coroutineContext[CoroutineDispatcher])  
    println(coroutineContext[Job])
    println(coroutineContext[CoroutineExceptionHandler])
}
``` 

위 코드에서 보셨던 방법 그대로 `CoroutineContext` 구성요소를 생성하고,
각 구성요소 별 싱글톤 객체를 사용하여 값을 읽을 수 있습니다.

결과값은 다음과 같습니다.
값을 설정하지 않은 `Job` 과 `CoroutineExceptionHandler`는 `null` 이 출력됩니다.

```sh
CoroutineName(Eunjin Coroutine)
Dispatchers.IO
null
null
```

### 4.2 싱글톤 키를 사용해 CoroutineContext 구성요소 읽기

앞선 코드에서 싱글톤 객체를 키로 사용해 값을 읽을 수 있었습니다.
실제로 키 자리에 위치한 싱글톤 객체를 클릭해보면, `Key` 라는 내부 객체가 나타남을 확인할 수 있습니다.

즉, 위 코드는 아래 코드와 동일한 방식으로 작동한 셈입니다.

```kotlin
@OptIn(ExperimentalStdlibApi::class)  
fun main() = runBlocking<Unit> {  
    val coroutineName = CoroutineName("Eunjin Coroutine")  
    val dispatcher = Dispatchers.IO  
    val coroutineContext: CoroutineContext = coroutineName + dispatcher  
  
    println(coroutineContext[CoroutineName.Key])  
    println(coroutineContext[CoroutineDispatcher.Key])  
    println(coroutineContext[Job.Key])
    println(coroutineContext[CoroutineExceptionHandler])
}
```

위 코드를 실행하면, 아래와 같은 결과가 출력됩니다.

```sh
CoroutineName(Eunjin Coroutine)
Dispatchers.IO
null
null
```

### 4.3 구성요소의 key를 사용해 CoroutineContext 구성요소 읽기

사실, 싱글톤 객체를 키로 사용해서 값을 가져오는 것은 실험적인 기능입니다.
안전하게 사용하려면, 다음과 같이 구성요소 객체의 `key` 를 사용하여 값을 가져오는 것이 좋습니다.

```kotlin
fun main() =  
    runBlocking<Unit> {  
        val coroutineName = CoroutineName("Eunjin Coroutine")  
        val dispatcher = Dispatchers.IO  
        val coroutineContext: CoroutineContext = coroutineName + dispatcher  
  
        println(coroutineContext[coroutineName.key])  
        println(coroutineContext[dispatcher.key])  
    }
```

위 코드를 실행하면, 아래와 같은 결과가 출력됩니다.

```sh
CoroutineName(Eunjin Coroutine)
Dispatchers.IO
```

## 5. CoroutineContext 구성하기: UPDATE

### 5.1 `+` 연산자를 사용해 CoroutineContext 구성요소 변경하기

```kotlin
fun main() =  
    runBlocking<Unit> {  
        val coroutineName = CoroutineName("Eunjin Coroutine")  
        val dispatcher = Dispatchers.Default
        val job1 = Job()  
        val coroutineContext: CoroutineContext = coroutineName + dispatcher + job1  
  
        println(coroutineContext[Job])  
  
        val job2 = Job()  
        val updatedCoroutineContext = coroutineContext + job2  
  
        println(coroutineContext[Job])  
        println(updatedCoroutineContext[Job])  
    }
```

`+` 연산자를 사용하여 `CoroutineContext` 구성요소가 변경된 값을 얻을 수 있습니다.

여기서 중요한 점은, *원본 `CoroutineContext`는 변경되지 않는다*는 것입니다.  

CoroutineName, CoroutineDispatcher, Job 의 구성요소를 사용하여 생성된 CoroutineContext 에,
`job2`를 추가하면, Job 객체가 덮어 씌워진 새로운 객체가 생성됩니다.
`job2`가 추가되기 전, `job1`이 추가된 `CoroutineContext` 는 변경되지 않습니다.

따라서, 위 코드를 실행하면, 다음과 같은 결과가 출력됩니다.

```sh
JobImpl{Active}@887af79
JobImpl{Active}@887af79
JobImpl{Active}@7fac631b
```

## 6. CoroutineContext 구성하기: DELETE

### 6.1 `minusKey` 를 사용해 구성요소 제거하기

```kotlin
fun main() =  
    runBlocking<Unit> {  
        val coroutineName = CoroutineName("Eunjin Coroutine")  
        val dispatcher = Dispatchers.Default  
        val job = Job()  
        val coroutineContext: CoroutineContext = coroutineName + dispatcher + job  
  
        val deletedCoroutineContext = coroutineContext.minusKey(CoroutineName)

        println(coroutineContext[coroutineName.key])
        println(deletedCoroutineContext[coroutineName.key])
        println(deletedCoroutineContext[dispatcher.key])  
        println(deletedCoroutineContext[job.key])  
    }
```

`CoroutineContext` 구성요소를 제거하는 것 또한, 원본 `CoroutineContext` 를 변경하지 않습니다. 
`minusKey` 함수는 원본 `CoroutineContext` 를 변경하지 않고, 인자로 받은 키를 사용하여 해당 값을 제거한 `CoroutineContext` 를 반환합니다.

위 코드에서 각 `println`이 출력하는 결과는 무엇일까요?

```shell
CoroutineName(Eunjin Coroutine)
null
Dispatchers.Default
JobImpl{Active}@3108bc
```

원본 `CoroutineContext` 에서 `CoroutineName` 을 제거한 `deletedCoroutineContext` 는,
`CoroutineName` 을 제거한 새로운 `CoroutineContext` 를 반환합니다.




[coroutine_name_docs]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-name/
[job_docs]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-job/
