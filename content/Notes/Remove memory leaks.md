---
title: 메모리 릭 해결기
description: 메모리 릭 해결기
date: 2024-11-28
tags:
  - Android
  - AndroidStudio
  - MemoryLeak
draft: true
---

안녕하세요, 저는 Android 개발자로 일하며 다양한 문제를 해결하는 일을 하고 있습니다. 오늘은 회사 업무 중 경험했던 **메모리 릭 문제와 이를 해결한 과정**을 공유하려고 합니다. 개발자라면 한 번쯤 겪게 되는 이 문제를, 어떻게 발견하고 해결했는지 친근한 톤으로 풀어볼게요!

---

## 1. 문제 상황 파악

어느 날, 특정 페이지에서 앱이 계속 느려지고, 심지어 간헐적으로 크래시가 발생하는 상황을 접하게 되었습니다.  
**증상**은 다음과 같았어요:

- 앱이 오래 실행될수록 메모리 사용량이 증가.
- 해당 기능을 여러 번 사용할수록 화면 전환 속도 저하.
- 때때로 앱 강제 종료(OutOfMemoryError).

우선 **Android Studio의 메모리 프로파일러**를 사용해 성능 모니터링을 시작했습니다. 결과적으로 문제가 집중된 페이지를 확인했고, "메모리 릭"이 주요 원인임을 알게 되었습니다.

---

## 2. 메모리 릭 분석 방법

문제를 분석하기 위해 다음과 같은 도구와 접근 방식을 사용했습니다:

- **Android Studio Memory Profiler**: 객체 그래프와 메모리 힙 덤프 확인.
- **LeakCanary**: 메모리 릭을 실시간으로 탐지.
- **패턴 식별**: 이벤트 리스너, 순환 참조, 익명 클래스 등을 의심하며 코드를 리뷰.

결과적으로, 특정 객체들이 **GC(Garbage Collector)**에서 해제되지 않고 계속 유지되는 것을 발견했어요.

---

## 3. 발견된 메모리 릭의 원인

분석 결과, 문제는 다음과 같은 코드 패턴에서 발생하고 있었습니다:

1. **이벤트 리스너 미제거**
   - 화면이 종료되었음에도 리스너가 계속 동작.
2. **순환 참조**
   - ViewModel과 Activity 간 참조가 끊기지 않음.
3. **클로저로 인한 메모리 누수**
   - 익명 함수에서 외부 클래스의 참조를 지속.
4. **DOM 요소 참조 관리 미흡** (WebView 관련)
   - WebView를 사용하는 페이지에서 리소스 해제가 누락.

---

## 4. 해결 과정

각 문제를 하나씩 해결해나갔습니다. 구체적인 방법과 적용한 코드를 공유합니다.

### 1) **이벤트 리스너 미제거**
- `onDestroy()`나 `onCleared()`에서 리스너를 명시적으로 제거.
```kotlin
override fun onDestroy() {
    super.onDestroy()
    someListener?.remove()
}

### 2) 순환 참조 해소

	- 약한 참조(WeakReference)로 변경하여 참조 순환 방지.
```kotlin   
val weakContext = WeakReference(context)
```

### 3) 클로저 참조 개선

	- 외부 참조를 명시적으로 끊거나, 적절한 범위 제한 사용.

```kotlin
someCallback = { param ->
    val currentContext = context ?: return@someCallback
    // 작업 수행
}
```

### 4) WebView 리소스 해제

	- destroy() 호출을 통해 리소스 명시적으로 해제.
```kotlin
override fun onDestroy() {
    super.onDestroy()
    webView?.apply {
        clearHistory()
        clearCache(true)
        destroy()
    }
}
```

5. 개선 결과

이 모든 과정을 거친 후, 다음과 같은 눈에 띄는 성과를 얻었습니다:
	- 메모리 사용량: 전/후 비교 결과, 앱의 메모리 사용량이 약 30% 감소.
	- 성능 개선: 화면 전환 속도 약 40% 향상.
	- 사용자 경험: 크래시 발생 빈도 감소로 사용자 만족도 증대.

Before vs After (Memory Usage)

항목	Before	After
메모리 사용량	200MB	140MB
화면 전환 시간	1.5초	0.9초

6. 학습한 점과 권장사항

이번 경험을 통해 메모리 릭 예방을 위해 꼭 기억해야 할 몇 가지를 정리했습니다:

1.	코딩 가이드라인:
    - 이벤트 리스너는 명시적으로 제거.
    - 객체 참조 시 WeakReference 활용.
2.	정기적인 모니터링:
    - Memory Profiler와 LeakCanary를 활용해 주기적으로 확인.
3.	추천 도구와 방법론:
    - Android Studio Profiler, LeakCanary.
- 힙 덤프 분석을 통한 근본 원인 탐구.

이 글이 저와 비슷한 문제를 겪고 계신 개발자분들에게 도움이 되길 바랍니다. 혹시 더 좋은 팁이나 방법이 있다면 댓글로 함께 공유해주세요!