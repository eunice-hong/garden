---
title: Confined Dispatcher
description: 생성 가능한 스레드 개수에 제한이 있는 디스패처
date: 2024-08-09 10:00:00 +0900
draft: false
noindex: false
aliases:
  - 제한된 디스패처
---

[[Unconfined Dispatcher]]와 반대되는 개념으로, 특정 스레드 또는 스레드 풀에 코루틴 실행을 제한하는 디스패처를 말합니다. 

이러한 디스패처들은 코루틴이 실행될 스레드를 명시적으로 지정하여, 코루틴의 실행 환경을 좀 더 제어할 수 있도록 합니다.

예를 들어, Kotlin 코루틴에서는 다음과 같은 디스패처들이 있습니다:

1. `Dispatchers.Default`: 기본적으로 공유된 백그라운드 스레드 풀에서 코루틴을 실행합니다. 이는 CPU 사용량이 많은 작업에 적합합니다.
2. `Dispatchers.IO`: 입출력 작업에 최적화된 스레드 풀에서 코루틴을 실행합니다. 파일 I/O, 네트워크 통신 등에 사용됩니다.
3. `Dispatchers.Main`: 메인 스레드에서 코루틴을 실행합니다. 주로 UI 업데이트에 사용되며, Android에서 UI 스레드를 의미합니다.

이러한 디스패처들은 코루틴을 특정한 실행 환경에 "구속(confine)"함으로써, 예측 가능한 스레딩 환경을 제공하고, 
특정한 유형의 작업에 최적화된 성능을 발휘할 수 있게 합니다. 
반면, `Dispatchers.Unconfined`는 코루틴이 시작된 스레드에 구애받지 않고, 
호출된 중단 함수에 의해 결정되는 스레드에서 자유롭게 실행될 수 있게 합니다. 


# 참고 문서

1. https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-coroutine-dispatcher/