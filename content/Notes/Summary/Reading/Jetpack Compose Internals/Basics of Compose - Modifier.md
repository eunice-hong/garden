---
title: "Basics of Compose: Modifier"
description: "Compose 수정자에 대한 기본 개념과 사용법을 설명합니다."
date: 2025-02-10T22:00:00
draft: false
noindex: true
tags:
  - JetpackCompose
---

# `Modifier`

## Compose 수정자

수정자를 사용하면 컴포저블을 장식하거나 강화할 수 있습니다. 수정자를 통해 다음과 같은 종류의 작업을 실행할 수 있습니다.

- 컴포저블의 크기, 레이아웃, 동작 및 모양 변경
- 접근성 라벨과 같은 정보 추가
- 사용자 입력 처리
- 요소를 클릭 가능, 스크롤 가능, 드래그 가능 또는 확대/축소 가능하게 만드는 높은 수준의 상호작용 추가

수정자는 표준 Kotlin 객체입니다. [`Modifier`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko) 클래스 함수 중 하나를 호출하여 수정자를 만듭니다.

```kotlin
@Composable
private fun Greeting(name: String) {
    Column(modifier = Modifier.padding(24.dp)) {
        Text(text = "Hello,")
        Text(text = name)
    }
}
```

## 수정자의 순서가 중요

수정자 함수의 순서는 **중요**합니다. 각 함수는 이전 함수에서 반환한 `Modifier`를 변경하므로 순서는 최종 결과에 영향을 줍니다.

```kotlin
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

위의 코드에서는 `padding` 수정자가 `clickable` 수정자 _뒤에_ 적용되었기 때문에 주변 패딩을 포함하여 전체 영역을 클릭할 수 있습니다.

## 내장 수정자

Jetpack Compose는 컴포저블을 장식하거나 강화하는 데 도움이 되는 내장 수정자 목록을 제공합니다.

### `padding` 및 `size`

기본적으로 Compose에서 제공되는 레이아웃은 하위 요소를 래핑합니다. 하지만 [`size`](https://developer.android.com/reference/kotlin/androidx/compose/foundation/layout/package-summary?hl=ko#size) 수정자를 사용하여 크기를 설정할 수 있습니다.

```kotlin
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

## Compose의 범위 안전성

Compose에는 특정 컴포저블의 하위 요소에 적용될 때만 사용할 수 있는 수정자가 있습니다. Compose는 맞춤 범위를 통해 이를 적용합니다.

### `Box`의 `matchParentSize`

하위 레이아웃이 `Box` 크기에 영향을 미치지 않고 상위 `Box`와 크기가 같이지도록 하려면 `matchParentSize` 수정자를 사용하세요.

```kotlin
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

## 수정자 추출 및 재사용

여러 수정자를 함께 체이닝하여 컴포저블을 장식하거나 강화할 수 있습니다. 동일한 수정자 체인을 변수로 추출하고 재사용하면 코드 가독성을 개선하고 성능을 최적화할 수 있습니다.

```kotlin
val reusableModifier = Modifier
    .fillMaxWidth()
    .background(Color.Red)
    .padding(12.dp)
```

### 추출된 수정자의 추가 체이닝

추출된 수정자 체인은 [`.then()`](https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#then) 함수를 호출하여 더 체이닝하거나 추가할 수 있습니다.

```kotlin
// Append to your reusableModifier
reusableModifier.clickable { /*...*/ }

// Append your reusableModifier
otherModifier.then(reusableModifier)
```

[수정자 순서가 중요](https://developer.android.com/develop/ui/compose/modifiers?hl=ko#order-modifier-matters)하다는 점을 유의해야 합니다.

# 제약 조건 및 수정자 순서

Compose에서는 여러 수정자를 함께 체이닝하여 컴포저블의 디자인과 분위기를 변경할 수 있습니다. 이러한 수정자 체인은 너비 및 높이 경계를 정의하는 컴포저블에 전달된 _제약 조건_ 에 영향을 줄 수 있습니다.

이 페이지에서는 체이닝된 수정자가 제약 조건에 미치는 영향과 그에 따라 컴포저블의 측정 및 배치에 미치는 영향을 설명합니다.

## UI 트리의 수정자

![컴포저블 및 수정자의 코드와 UI 트리로의 시각적 표현](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/modifier-wrapping.png?hl=ko)

"Compose에서 UI 트리는 컴포저블이 배치되는 구조입니다. 수정자는 이 트리에서 각 요소를 감싸며 동작을 변경할 수 있습니다."

수정자가 서로에게 어떤 영향을 미치는지 이해하려면 컴포지션 단계에서 생성되는 UI 트리에 어떻게 표시되는지 시각화하는 것이 좋습니다. 자세한 내용은 [구성](https://developer.android.com/develop/ui/compose/phases?hl=ko#composition) 섹션을 참고하세요.

UI 트리에서 수정자를 레이아웃 노드의 래퍼 노드로 시각화할 수 있습니다.

이 그림은 Compose UI 트리에서 수정자가 요소를 래핑하는 방식을 보여줍니다.

## 레이아웃 단계의 제약조건

1. **하위 요소 측정**: 노드가 하위 요소(있는 경우)를 측정합니다.
2. **자체 크기 결정**: 노드는 이러한 측정치를 기반으로 자체 크기를 결정합니다.
3. **하위 요소 배치**: 각 하위 노드는 노드의 자체 위치를 기준으로 배치됩니다.

"Compose의 레이아웃 단계는 요소의 크기와 위치를 결정하는 과정입니다. 이는 세 단계로 구성됩니다."
[레이아웃 단계](https://developer.android.com/develop/ui/compose/phases?hl=ko#layout)는 3단계 알고리즘에 따라 각 레이아웃 노드의 너비, 높이, x, y 좌표를 찾습니다.

"이 단계는 UI 요소들이 어떻게 배치되는지를 결정하는 중요한 과정입니다."

## 제약조건에 영향을 미치는 수정자

이전 섹션에서는 일부 수정자가 제약 조건 크기에 영향을 줄 수 있다는 것을 알아봤습니다. 다음 섹션에서는 제약 조건에 영향을 미치는 특정 수정자를 설명합니다.

### `size` 수정자

[`size`](<https://developer.android.com/reference/kotlin/androidx/compose/ui/Modifier?hl=ko#(androidx.compose.ui.Modifier).size(androidx.compose.ui.unit.Dp)>) 수정자는 콘텐츠의 기본 크기를 선언합니다.

![크기 수정자가 레이아웃 노드를 래핑하는 UI 트리의 일부와 컨테이너에서 크기 수정자에 의해 설정된 제약 조건의 표현입니다.](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/size-modifier.png?hl=ko)

"size 수정자는 컴포저블의 크기를 고정하는 역할을 합니다. 하지만 상위 요소의 제약 조건에 의해 영향을 받을 수 있습니다."

예를 들어 다음 UI 트리는 `200dp`에 의해 `300dp` 컨테이너에 렌더링되어야 합니다. 제약조건은 너비가 `100dp`~`300dp`이고 높이가 `100dp`~`200dp`이 되도록 제한됩니다. "size 수정자는 제약 조건을 따라 크기를 변경할 수도 있고, 필요하면 크기를 제한할 수도 있습니다."

## 예

```kotlin
Image(
    painterResource(R.drawable.hero),
    contentDescription = null,
    Modifier
        .fillMaxSize()
        .size(50.dp)
)
```

이 섹션에서는 체이닝된 수정자가 있는 여러 코드 스니펫의 출력을 보여주고 설명합니다. "fillMaxSize와 size 수정자가 어떻게 영향을 미치는지 설명해 주세요. fillMaxSize가 적용된 후 size가 적용되므로 예상한 크기가 나오지 않을 수 있습니다."

이 스니펫은 다음과 같은 출력을 생성합니다.

![](https://developer.android.com/static/develop/ui/compose/images/layouts/constraints-modifiers/example-1.png?hl=ko)

"이 예제에서는 fillMaxSize가 적용된 후 size가 적용되므로 결국 50dp가 아닌 부모의 크기에 맞춰집니다. 이를 통해 수정자 순서의 중요성을 알 수 있습니다."

# 맞춤 수정자 만들기 

Compose는 일반적인 동작을 위한 여러 [수정자](https://developer.android.com/develop/ui/compose/modifiers?hl=ko)를 기본적으로 제공하지만 직접 맞춤 수정자를 만들 수도 있습니다.

## 수정자의 구성 요소

수정자는 여러 부분으로 구성됩니다.

- **수정자 팩토리**
  - `Modifier`의 확장 함수로, 수정자에 관용적인 API를 제공하고 수정자를 쉽게 체이닝할 수 있도록 합니다.
- **수정자 요소**
  - 여기에서 수정자의 동작을 구현할 수 있습니다.

필요한 기능에 따라 맞춤 수정자를 구현하는 방법에는 여러 가지가 있습니다. 맞춤 수정자를 구현하는 가장 쉬운 방법은 이미 정의된 다른 수정자 팩토리를 결합하는 방식입니다. 더 많은 맞춤 동작이 필요한 경우 `Modifier.Node` API를 사용하여 수정자 요소를 구현합니다.

## 기존 수정자를 함께 체이닝

기존 수정자를 사용하여 맞춤 수정자를 만들 수 있습니다. 예를 들어 `Modifier.clip()`은 `graphicsLayer` 수정자를 사용하여 구현됩니다.

```kotlin
fun Modifier.clip(shape: Shape) = graphicsLayer(shape = shape, clip = true)
```

또한 동일한 수정자 그룹을 자주 반복[하는 경우 맞](https://developer.android.com/develop/ui/compose/phases?hl=ko#layout)춤 수정자로 래핑할 수 있습니다.

```kotlin
fun Modifier.myBackground(color: Color) = padding(16.dp)
    .clip(RoundedCornerShape(8.dp))
    .background(color)
```

"이미 제공된 수정자를 조합하여 맞춤 수정자를 만들 수 있습니다. 예를 들어, 특정한 배경색을 적용하는 경우 여러 수정자를 결합하여 하나의 함수로 추출하면 편리합니다."

## 컴포저블 수정자 팩토리를 사용하여 맞춤 수정자 만들기

컴포저블 함수를 사용하여 맞춤 수정자를 만들 수도 있습니다. 이를 **컴포저블 수정자 팩토리**라고 합니다.

```kotlin
@Composable
fun Modifier.fade(enable: Boolean): Modifier {
    val alpha by animateFloatAsState(if (enable) 0.5f else 1.0f)
    return this then Modifier.graphicsLayer { this.alpha = alpha }
}
```

"컴포저블 수정자 팩토리는 상태를 기반으로 수정자를 동적으로 변경할 수 있습니다. 예를 들어, 애니메이션을 적용하는 경우 유용합니다. 하지만 수정자 체이닝이 끊어지지 않도록 주의해야 합니다."

## `Modifier.Node`를 사용하여 맞춤 수정자 동작 구현

`Modifier.Node`는 Compose에서 맞춤 수정자를 만드는 하위 수준 API로, 성능을 최적화하는 데 유용합니다.

### `Modifier.Node`를 사용한 맞춤 수정자 예제

```kotlin
private class CircleNode(var color: Color) : DrawModifierNode, Modifier.Node() {
    override fun ContentDrawScope.draw() {
        drawCircle(color)
    }
}
```

"`Modifier.Node`를 사용하면 직접적인 그리기, 레이아웃 제어 등이 가능합니다. 기존의 `composed {}` API보다 성능이 뛰어납니다."

## 맞춤 수정자 적용 예제

아래는 원을 그리는 맞춤 수정자의 전체 예제입니다.

```kotlin
fun Modifier.circle(color: Color) = this then CircleElement(color)

data class CircleElement(val color: Color) : ModifierNodeElement<CircleNode>() {
    override fun create() = CircleNode(color)
    override fun update(node: CircleNode) {
        node.color = color
    }
}

private class CircleNode(var color: Color) : DrawModifierNode, Modifier.Node() {
    override fun ContentDrawScope.draw() {
        drawCircle(color)
    }
}
```

"이제 `Modifier.circle(Color.Red)`를 사용하여 원을 그리는 맞춤 수정자를 만들 수 있습니다. `ModifierNodeElement`를 활용하면 수정자 상태를 효율적으로 업데이트할 수 있습니다."

## `Modifier.Node`를 사용하는 일반적인 상황

### 1. 매개변수 없는 수정자 만들기

```kotlin
fun Modifier.fixedPadding() = this then FixedPaddingElement

data object FixedPaddingElement : ModifierNodeElement<FixedPaddingNode>() {
    override fun create() = FixedPaddingNode()
    override fun update(node: FixedPaddingNode) {}
}

class FixedPaddingNode : LayoutModifierNode, Modifier.Node() {
    override fun MeasureScope.measure(
        measurable: Measurable,
        constraints: Constraints
    ): MeasureResult {
        val paddingPx = 16.dp.roundToPx()
        val placeable = measurable.measure(constraints.offset(-paddingPx * 2, -paddingPx * 2))
        return layout(placeable.width + paddingPx * 2, placeable.height + paddingPx * 2) {
            placeable.place(paddingPx, paddingPx)
        }
    }
}
```

"이 수정자는 모든 요소에 일정한 패딩을 적용하는 역할을 합니다. `ModifierNodeElement`를 사용하여 상태를 유지하면서 수정할 수 있습니다."

### 2. 애니메이션 수정자 적용

```kotlin
class CircleNode(var color: Color) : Modifier.Node(), DrawModifierNode {
    private val alpha = Animatable(1f)

    override fun ContentDrawScope.draw() {
        drawCircle(color = color, alpha = alpha.value)
    }

    override fun onAttach() {
        coroutineScope.launch {
            alpha.animateTo(
                0f,
                infiniteRepeatable(tween(1000), RepeatMode.Reverse)
            ) {}
        }
    }
}
```

이 수정자는 원의 투명도를 반복적으로 애니메이션하는 예제입니다. `coroutineScope.launch`를 사용하여 애니메이션을 실행할 수 있습니다.

맞춤 수정자는 기본 제공되는 수정자로 해결할 수 없는 경우 유용합니다. `Modifier.Node`를 활용하면 성능 최적화가 가능하며, 상태 관리가 용이해집니다. 하지만 불필요한 맞춤 수정자는 오히려 유지보수를 어렵게 만들 수 있으므로 필요할 때만 적용하는 것이 좋습니다.

맞춤 수정자를 만들기 전에 먼저 기존 수정자로 해결할 수 있는지 확인하는 것이 중요합니다. `Modifier.Node`는 성능 최적화에 적합하지만 필요 없는 경우 사용하지 않는 것이 좋습니다.
