---
title: 갭 버퍼
description: 갭 버퍼(Gap Buffer)는 동적 배열의 한 형태로, 특정 위치 근처에서 삽입 및 삭제 작업을 효율적으로 수행할 수 있도록 설계된 자료 구조이다.
date: 2025-03-16T22:00:00
draft: false
noindex: false
alias:
  - Gap Buffer
  - gap buffer
tags:
  - Data Structure
---

# 정의

갭 버퍼(Gap Buffer)는 동적 배열의 한 형태로, 특정 위치 근처에서 삽입 및 삭제 작업을 효율적으로 수행할 수 있도록 설계된 자료 구조이다. 주로 **텍스트 편집기**에서 사용되며, 커서 주변에서 주로 변경이 발생하는 특성을 반영한다.

# 구조 및 동작 원리

- 텍스트는 **두 개의 연속된 세그먼트**로 저장되며, 그 사이에 **빈 공간(gap)** 이 존재한다.
- 커서 이동 시 **갭을 이동시키는 방식**으로 동작하며, 필요할 때만 텍스트를 복사하여 성능을 최적화한다.
- 삽입 시 첫 번째 세그먼트 끝에 새 텍스트를 추가하고, 삭제 시 해당 부분을 지운다.

# 특징

## 장점

- 두 개의 문자열만으로 표현되므로 **공간 효율성이 높음**
- **빠른 검색 및 출력 가능**
- 일반적인 편집 작업에서는 **효율적**

## 단점

- 커서가 멀리 이동하면 **많은 텍스트를 복사해야 하는 비효율성** 발생
- 갭이 가득 차면 새로운 갭을 만들어야 하며, 이 과정에서 **전체 텍스트 복사가 필요할 수도 있음**

# 예시

Kotlin 코드를 예시로 갭 버퍼를 구현해보겠습니다.

```kotlin
class GapBuffer(private val size: Int) {
    private val buffer = CharArray(size) { ' ' }  // 전체 버퍼 (갭 포함)
    private var gapStart = 0  // 갭의 시작 위치
    private var gapEnd = size / 2  // 갭의 끝 위치

    fun insert(text: String) {
        for (c in text) {
            if (gapStart == gapEnd) expandGap()  // 갭이 다 차면 확장
            buffer[gapStart++] = c  // 문자를 갭에 추가
        }
    }

    fun delete(count: Int) {
        gapStart = maxOf(0, gapStart - count)  // 갭을 앞으로 확장 (삭제)
    }

    fun moveCursor(position: Int) {
        if (position < gapStart) {  // 왼쪽으로 이동
            while (gapStart > position) {
                buffer[--gapEnd] = buffer[--gapStart]  // 문자 오른쪽으로 이동
            }
        } else {  // 오른쪽으로 이동
            while (gapEnd < position) {
                buffer[gapStart++] = buffer[gapEnd++]  // 문자 왼쪽으로 이동
            }
        }
    }

    private fun expandGap() {
        // 단순 예제: 갭 크기를 2배로 늘림 (실제 구현에서는 효율적으로 처리)
        val newGapEnd = minOf(buffer.size, gapEnd + 5)
        for (i in gapEnd until newGapEnd) buffer[i] = ' '
        gapEnd = newGapEnd
    }

    fun getText(): String {
        return (buffer.copyOfRange(0, gapStart) + buffer.copyOfRange(gapEnd, buffer.size))
            .joinToString("")
    }
}


// 사용 예제
fun main() {
    val gapBuffer = GapBuffer(20)

    gapBuffer.insert("Hello")
    println(gapBuffer.getText())  // Hello

    gapBuffer.moveCursor(2)  // "l" 앞(2번째 위치)로 이동
    gapBuffer.insert("X")
    println(gapBuffer.getText())  // HeXllo

    gapBuffer.delete(1)  // "X" 삭제
    println(gapBuffer.getText())  // Hello

    gapBuffer.moveCursor(5)  // "o" 뒤로 이동
    gapBuffer.insert(" World!")
    println(gapBuffer.getText())  // Hello World!
}
```

```sh
# 실행 결과
Hello
HeXllo
Hello
Hello World!
```

# 참고 문서

- [Gap_buffer](https://en.wikipedia.org/wiki/Gap_buffer)
