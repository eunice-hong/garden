---
title: Unconfined Dispatcher
description: 생성 가능한 스레드 개수에 제한이 없는 디스패처
date: 2024-08-09 10:00:00 +0900
aliases:
  - 무제한 디스패처
draft: false
noindex: false
---

특정 스레드에 국한되지 않는 코루틴 디스패처입니다.

코루틴 작업 초기 부분을 현재 [호출 프레임][stack_frame]에서 실행하고, 해당 중단 함수가 사용하는 스레드에서 코루틴이 계속될 수 있도록 합니다. 
이는 특정 스레드 정책을 요구하지 않습니다. 이 디스패처에서 시작된 중첩 코루틴들은 스택 오버플로를 방지하기 위해 [[#이벤트 루프]]를 형성합니다.

# 이벤트 루프

이벤트 루프의 원리는 순전히 내부적인 개념으로, 모든 큐에 들어간 코루틴이 현재 스레드에서 실행된다는 것 외에는 실행 순서를 보장하지 않습니다.

현재 콜 프레임에서 코루틴의 초기 연속을 실행하고 특정 스레드 정책을 요구하지 않고 해당 일시 중지 기능에서 사용되는 스레드에서 코루틴을 재개할 수 있습니다.

이벤트 루프는 순전히 내부적인 개념으로, 실행 순서에 대한 보장이 없으며 모든 대기 중인 코루틴이 현재 스레드에서 실행됩니다.
```kotlin
withContext(Dispatchers.Unconfined) {
    println(1)
    launch(Dispatchers.Unconfined) { // Nested unconfined
        println(2)
    }
    println(3)
}

println("Done")
```
위 코드는 "1 2 3"을 출력할 수 도, "1 3 2"를 출력할 수도 있습니다. 즉, 출력 순서가 보장되지 않습니다.
하지만, "Done"은 withContext와 launch의 코드가 완료되면 한 번만 출력됩니다.

코루틴이 중단 후 특정 스레드나 스레드 풀에 구속되기를 원하면서도 첫 중단까지 현재 호출 프레임에서 실행하길 원한다면, 
코루틴 빌더(예: `launch`와 `async`)에서 `CoroutineStart.UNDISPATCHED` 값을 설정하는 선택적 [CoroutineStart][coroutine_start] 매개변수를 사용할 수 있습니다.


# 참고 문서

1. https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-unconfined.html

[stack_frame]: https://en.wikipedia.org/wiki/Call_stack#Structure
[coroutine_start]: https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-start/