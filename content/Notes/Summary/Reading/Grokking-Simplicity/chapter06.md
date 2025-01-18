---
title: "CHAPTER 6 변경 가능한 데이터 구조를 가진 언어에서 불변성 유지하기"
description: |-
  - 함수형 프로그래밍에서 불변 데이터가 필요합니다. 계산에서는 변경 가능한 데이터에 쓰기를 할 수 없습니다.
  - copy-on-write는 데이터를 불변형으로 유지할 수 있는 원칙입니다. 복사본을 만들고 원본 대신 복사본을 변경하는 것을 말합니다.
  - copy-on-write는 값을 변경하기 전에 얕은 복사를 합니다. 그리고 리턴합니다. 이렇게 하면 통제할 수 있는 범위에서 불변성을 구현할 수 있습니다.
  - 보일러 플레이트 코드를 줄이기 위해 기본적인 배열과 객체 동작에 대한 copy-on-write 버전을 만들어 두는 것이 좋습니다.
date: 2024-12-15T20:33:00
tags: ["FP"]
draft: false
alias: ["copy-on-write", "카피-온-라이트"]
---

> [!NOTE] 유의사항
> 본 책은 JavaScript를 기준으로 작성되어있으나, 
> 아래 예제에는 제가 자주 사용하는 Kotlin과 Dart 예시도 포함되어 있습니다. 

# 요점 정리
- 함수형 프로그래밍에서 불변 데이터가 필요합니다. 계산에서는 변경 가능한 데이터에 쓰기를 할 수 없습니다.
- copy-on-write는 데이터를 불변형으로 유지할 수 있는 원칙입니다. 복사본을 만들고 원본 대신 복사본을 변경하는 것을 말합니다.
- copy-on-write는 값을 변경하기 전에 얕은 복사를 합니다. 그리고 리턴합니다. 이렇게 하면 통제할 수 있는 범위에서 불변성을 구현할 수 있습니다.
- 보일러 플레이트 코드를 줄이기 위해 기본적인 배열과 객체 동작에 대한 copy-on-write 버전을 만들어 두는 것이 좋습니다.


# 복사하기

Kotlin과 Dart에서 배열과 객체를 복사/변형하는 방법을 알아봅니다.

> [!Note] 알아두기
> - 얕은 복사: 데이터 구조의 최상위 단계만 복사합니다.
> - 깊은 복사: 데이터 구조의 모든 단계를 복사합니다.

## Kotlin 배열 동작

1. `List`: List는 불변 컬렉션으로, 읽기 전용 메서드만 제공하며 값을 수정하거나 삭제할 수 없습니다.
2. `MutableList`: 수정 가능한 컬렉션으로, 추가, 삭제, 변경 작업을 지원합니다.
3. `Array`: 고정된 크기의 배열로, 크기 변경은 불가능하며 특정 인덱스의 값을 변경하거나 복사만 가능합니다.
4. `ArrayList`: MutableList와 유사하며, 더 세부적인 동작이 Java의 ArrayList와 동일합니다.

| 동작                     | `List`                    | `MutableList`                            | `Array`                   | `ArrayList`                              |
|------------------------|---------------------------|------------------------------------------|---------------------------|------------------------------------------|
| **1. 인덱스로 값 찾기**       | `get(index)` 또는 `[index]` | `get(index)` 또는 `[index]`                | `get(index)` 또는 `[index]` | `get(index)` 또는 `[index]`                |
| **2. 값 할당하기**          | 불가능                       | `set(index, value)` 또는 `[index] = value` | `[index] = value`         | `set(index, value)` 또는 `[index] = value` |
| **3. 길이**              | `size`                    | `size`                                   | `size`                    | `size`                                   |
| **4. 끝에 추가하기**         | 불가능                       | `add(value)`                             | 불가능                       | `add(value)`                             |
| **5. 끝에 있는 값을 지우기**    | 불가능                       | `removeAt(size - 1)`                     | 불가능                       | `removeAt(size - 1)`                     |
| **6. 앞에 추가하기**         | 불가능                       | `add(0, value)`                          | 불가능                       | `add(0, value)`                          |
| **7. 앞에 있는 값을 지우기**    | 불가능                       | `removeAt(0)`                            | 불가능                       | `removeAt(0)`                            |
| **8. 배열 복사하기** (얕은 복사) | `toList()`                | `toList()`                               | `copyOf()`                | `toList()`                               |
| **9. 항목 삭제하기**         | 불가능                       | `remove(value)`                          | 불가능                       | `remove(value)`                          |

**얕은 복사 vs 깊은 복사**

<iframe src="https://pl.kotl.in/2i5_h3Wci" width="100%" height="460px"></iframe>

## Kotlin 객체 동작

| 동작               | `Map`                 | `MutableMap`                         |
|------------------|-----------------------|--------------------------------------|
| **1. 키로 값 찾기**   | `get(key)` 또는 `[key]` | `get(key)` 또는 `[key]`                |
| **2. 키로 값 설정하기** | 불가능                   | `put(key, value)` 또는 `[key] = value` |
| **3. 키/값 쌍 지우기** | 불가능                   | `remove(key)`                        |
| **4. 객체 복사하기**   | `toMap()`             | `toMap()`                            |
| **5. 키 목록 가져오기** | `keys`                | `keys`                               |


**얕은 복사 vs 깊은 복사**

<iframe src="https://pl.kotl.in/n-NUhwXGp" width="100%" height="460px"></iframe>


## Dart 배열 동작

1.	`List` (고정 길이):
      - Dart의 List는 고정 길이로 생성할 경우 크기 변경이 불가능하며, 읽기 및 쓰기 작업만 가능합니다.
      - 고정 길이로 생성: List.filled(length, initialValue)
2.	`List` (가변 길이):
      - List는 가변 길이로 생성하면 동적으로 추가, 삭제, 변경 작업이 가능합니다.
      - 가변 길이로 생성: [] 또는 List.empty(growable: true)

| 동작                     | `List` (고정 길이)        | `List` (가변 길이)          |
|------------------------|-----------------------|-------------------------|
| **1. 인덱스로 값 찾기**       | `list[index]`         | `list[index]`           |
| **2. 값 할당하기**          | `list[index] = value` | `list[index] = value`   |
| **3. 길이**              | `list.length`         | `list.length`           |
| **4. 끝에 추가하기**         | 불가능                   | `list.add(value)`       |
| **5. 끝에 있는 값을 지우기**    | 불가능                   | `list.removeLast()`     |
| **6. 앞에 추가하기**         | 불가능                   | `list.insert(0, value)` |
| **7. 앞에 있는 값을 지우기**    | 불가능                   | `list.removeAt(0)`      |
| **8. 배열 복사하기** (얕은 복사) | `list.toList()`       | `list.toList()`         |
| **9. 항목 삭제하기**         | 불가능                   | `list.remove(value)`    |

**얕은 복사 vs 깊은 복사**

```dart
void main() {
  // 원본 리스트 (중첩 구조)
  var original = [
    [1, 2],
    [3, 4]
  ];

  // 얕은 복사: toList() 또는 List.from()
  var shallowCopy = original.toList();

  // 깊은 복사: 각 내부 리스트를 개별적으로 복사
  var deepCopy = original.map((e) => List.from(e)).toList();

  // 얕은 복사에서 내부 요소 변경
  shallowCopy[0][0] = 99;
  print("원본 (얕은 복사 후 수정): $original"); // [[99, 2], [3, 4]]
  print("얕은 복사: $shallowCopy"); // [[99, 2], [3, 4]]

  // 깊은 복사에서 내부 요소 변경
  deepCopy[0][0] = 100;
  print("원본 (깊은 복사 후 수정): $original"); // [[99, 2], [3, 4]]
  print("깊은 복사: $deepCopy"); // [[100, 2], [3, 4]]
}
```

## Dart 객체 동작

| 동작               | `Map`                                |
|------------------|--------------------------------------|
| **1. 키로 값 찾기**   | `map[key]` 또는 `map.containsKey(key)` |
| **2. 키로 값 설정하기** | `map[key] = value`                   |
| **3. 키/값 쌍 지우기** | `map.remove(key)`                    |
| **4. 객체 복사하기**   | `Map.from(map)` 또는 `{...map}`        |
| **5. 키 목록 가져오기** | `map.keys`                           |


**얕은 복사 vs 깊은 복사**

```dart
void main() {
  // 원본 Map (중첩된 Map)
  var original = {
    'key1': {'subKey1': 1, 'subKey2': 2},
    'key2': {'subKey3': 3, 'subKey4': 4}
  };

  // 얕은 복사: Map.from() 사용
  var shallowCopy = Map.from(original);

  // 깊은 복사: 내부 Map을 개별적으로 복사
  var deepCopy = original.map((key, value) => MapEntry(key, Map.from(value)));

  // 얕은 복사에서 내부 Map의 값 변경
  shallowCopy['key1']!['subKey1'] = 99;
  print("원본 (얕은 복사 후 수정): $original"); // {key1: {subKey1: 99, subKey2: 2}, key2: {subKey3: 3, subKey4: 4}}
  print("얕은 복사: $shallowCopy");           // {key1: {subKey1: 99, subKey2: 2}, key2: {subKey3: 3, subKey4: 4}}

  // 깊은 복사에서 내부 Map의 값 변경
  deepCopy['key1']!['subKey1'] = 100;
  print("원본 (깊은 복사 후 수정): $original"); // {key1: {subKey1: 99, subKey2: 2}, key2: {subKey3: 3, subKey4: 4}}
  print("깊은 복사: $deepCopy");             // {key1: {subKey1: 100, subKey2: 2}, key2: {subKey3: 3, subKey4: 4}}
}
```

---

# 불변성 유지하기

## copy-on-write 원칙

^9cc06c

> [!NOTE] copy-on-write 단계
> 1. 복사본 만들기
> 2. 복사본 변경하기
> 3. 복사본 반환하기

## 1. 동작을 읽기, 쓰기, 혹은 둘 다로 분류하기

- 읽기: 데이터를 변경하지 않고 정보를 꺼내는 것
- 쓰기: 데이터를 변경하는 동작

## 2. 쓰기를 읽기로 바꾸기

**변경 전**

```javascript
function remove_item_by_name(cart, name) {
    var idx = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            idx = i;
        }
    }
    if (idx !== null) {
        cart.splice(idx, 1);
    }
}
```

**변경 후**

```javascript
function remove_item_by_name(cart, name) {
    var new_cart = cart.slice(); // 인자를 복사한다.
    var idx = null;
    for (var i = 0; i < new_cart.length; i++) {
        if (new_cart[i].name === name) {
            idx = i;
        }
    }
    if (idx !== null) {
        new_cart.splice(idx, 1); // 복사본을 변경한다.
    }
    return new_cart; // 복사본을 반환한다.
}
```

## 3. 중첩된 쓰기를 읽기로 바꾸기

**변경 전**

```javascript
function set_pricy_by_name(cart, name) {
    var idx = null;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].name === name) {
            cart[i].price = new_price;
        }
    }
}
```

**변경 후**

```javascript
function set_pricy_by_name(cart, name, price) {
    var new_cart = cart.slice(); // 인자를 복사한다.
    var idx = null;
    for (var i = 0; i < new_cart.length; i++) {
        if (new_cart[i].name === name) {
            new_cart[i].price = set_price(new_cart[i], price); // 복사본을 변경한다.
        }
    }
    return new_cart; // 복사본을 반환한다.
}

function set_price(item, new_price) {
    var new_item = Object.assign({}, item); // 인자를 복사한다.
    new_item.price = new_price; // 복사본을 변경한다.
    return new_item; // 복사본을 반환한다.
}
```


## 4. 쓰면서 읽는 함수 분리하기
1. 쓰면서 읽는 함수 분리하기

    **변경 전**

    ```javascript
    function drop_first(array) {
      array.shift(); // 원본을 변경한다.
    }
    ```

    **변경 후**

    ```javascript
    function drop_first(array) {
      var copy = array.slice(); // 인자를 복사한다.
      copy.shift(); // 복사본을 변경한다.
      return copy; // 복사본을 반환한다.
    }
    ```
2. 값을 두 개 반환하는 함수 만들기

    **변경 전**

    ```javascript
    function drop_first(array) {
      return array.shift();
    }
    ```

    **변경 후**

    ```javascript
    function drop_first(array) {
      var array_copy = array.slice();
      var first = array_copy.shift();
      return {
        first: first,
        rest: array_copy
      };
    }
    ```


