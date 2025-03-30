---
title: Visitor
description: Visitor 패턴은 객체 구조를 정의하고, 그 구조에 새로운 연산을 추가할 수 있는 행동 디자인 패턴이다.
date: 2025-03-16T22:00:00
draft: false
noindex: false
alias:
  - 방문자 패턴
  - Visitor Pattern
  - visitor pattern
tags:
  - Design Pattern
---

## 의도(Intent)

Visitor는 알고리즘을 해당 알고리즘이 작동하는 객체에서 분리할 수 있도록 하는 행동 디자인 패턴입니다.

## Visitor 디자인 패턴

### 문제(Problem)

어떤 팀이 지리 정보를 거대한 그래프 형태로 다루는 애플리케이션을 개발하고 있습니다. 그래프의 각 노드는 도시와 같은 복잡한 개체뿐만 아니라 산업, 관광지 등 다양한 요소를 나타낼 수 있습니다. 이러한 노드들은 실제 객체 간의 도로를 기준으로 연결됩니다.

#### 그래프를 XML로 내보내기

팀은 그래프를 XML 형식으로 내보내야 하는 기능을 추가해야 했습니다. 처음에는 각 노드 클래스에 `export` 메서드를 추가하고 재귀를 사용해 그래프의 모든 노드에서 해당 메서드를 실행하는 방식으로 해결하려 했습니다. 그러나 시스템 아키텍트는 기존 노드 클래스를 수정하는 것을 반대했습니다.

이유는 다음과 같습니다:

1. 이미 운영 중인 코드이며, 변경으로 인해 버그가 발생할 위험이 있음.
2. 노드 클래스는 지리 데이터를 처리하는 것이 주 역할이며, XML 내보내기 기능이 적절하지 않음.
3. 이후 다른 형식(예: JSON)으로 내보내는 기능이 필요할 가능성이 높음. 이 경우, 다시 기존 코드를 변경해야 하는 문제가 발생할 것임.

### 해결책(Solution)

Visitor 패턴은 새로운 동작을 기존 클래스에 통합하는 대신 별도의 `Visitor` 클래스로 분리하는 방식을 제안합니다. 노드 객체는 `Visitor`의 메서드에 인수로 전달되며, Visitor는 객체 내부의 데이터를 활용해 동작을 수행합니다.

#### Visitor 패턴 적용 방식

객체의 클래스에 따라 다른 동작을 수행해야 할 경우, Visitor 클래스에서 여러 개의 메서드를 정의할 수 있습니다.

```java
class ExportVisitor implements Visitor {
    method doForCity(City c) { ... }
    method doForIndustry(Industry i) { ... }
    method doForSightSeeing(SightSeeing s) { ... }
}
```

하지만, 그래프의 모든 노드를 순회하면서 적절한 Visitor 메서드를 호출하는 것은 어렵습니다.

```java
foreach (Node node in graph) {
    if (node instanceof City)
        exportVisitor.doForCity((City) node);
    if (node instanceof Industry)
        exportVisitor.doForIndustry((Industry) node);
}
```

이러한 문제를 해결하기 위해 **더블 디스패치(Double Dispatch)** 기법을 활용할 수 있습니다. 노드 객체가 스스로 방문자를 받아들이고 적절한 메서드를 호출하도록 하는 것입니다.

```java
// 클라이언트 코드
foreach (Node node in graph) {
    node.accept(exportVisitor);
}

// City 클래스
class City {
    method accept(Visitor v) {
        v.doForCity(this);
    }
}

// Industry 클래스
class Industry {
    method accept(Visitor v) {
        v.doForIndustry(this);
    }
}
```

이제 Visitor 인터페이스를 구현하는 새로운 Visitor 클래스가 추가되더라도 기존 코드를 변경하지 않고 확장할 수 있습니다.

## 현실 세계의 비유

### 보험 설계사

보험 설계사는 다양한 조직에 맞는 보험 상품을 제공합니다.

- 주거 건물: 의료 보험
- 은행: 도난 보험
- 카페: 화재 및 홍수 보험

Visitor 패턴은 위와 같은 방식으로 다양한 객체에 맞는 동작을 실행할 수 있도록 해줍니다.

## 구조(Structure)

1. **Visitor 인터페이스**: 방문할 대상 요소(객체)에 대한 메서드들을 선언합니다.
2. **Concrete Visitor(구체적인 방문자)**: 각 요소 클래스에 맞는 동작을 구현합니다.
3. **Element 인터페이스**: 방문자를 받아들이는 `accept` 메서드를 선언합니다.
4. **Concrete Element(구체적인 요소)**: `accept` 메서드를 구현하여 적절한 Visitor 메서드를 호출합니다.
5. **Client**: 요소 객체의 집합을 관리하고 Visitor를 적용합니다.

## 예제 코드

```java
// 요소 인터페이스
interface Shape {
    void move(int x, int y);
    void draw();
    void accept(Visitor v);
}

// 구체적인 요소 클래스
class Dot implements Shape {
    @Override
    public void accept(Visitor v) {
        v.visitDot(this);
    }
}

class Circle implements Shape {
    @Override
    public void accept(Visitor v) {
        v.visitCircle(this);
    }
}

// Visitor 인터페이스
interface Visitor {
    void visitDot(Dot d);
    void visitCircle(Circle c);
}

// 구체적인 Visitor
class XMLExportVisitor implements Visitor {
    @Override
    public void visitDot(Dot d) {
        // Dot을 XML 형식으로 변환
    }

    @Override
    public void visitCircle(Circle c) {
        // Circle을 XML 형식으로 변환
    }
}

// 클라이언트 코드
class Application {
    List<Shape> shapes;

    void export() {
        Visitor exportVisitor = new XMLExportVisitor();
        for (Shape shape : shapes) {
            shape.accept(exportVisitor);
        }
    }
}
```

## 적용 사례(Applicability)

- **복잡한 객체 구조에서 특정 작업을 수행할 때** (예: 객체 트리 순회)
- **핵심 로직에서 보조 기능을 분리할 때** (예: 데이터 내보내기, 검증 등)
- **일부 클래스에서만 특정 동작이 필요한 경우** (관련 없는 클래스에는 빈 메서드를 둠)

## 구현 방법(How to Implement)

1. Visitor 인터페이스에 방문 메서드를 선언합니다.
2. 기존 요소(Element) 클래스에 `accept` 메서드를 추가합니다.
3. 구체적인 요소 클래스에서 `accept` 메서드를 구현하여 Visitor를 호출하도록 합니다.
4. 새로운 동작이 필요할 때마다 Visitor 클래스를 추가하여 확장합니다.

## 장점과 단점(Pros and Cons)

✅ **장점**

- **OCP(Open/Closed Principle) 준수**: 기존 클래스를 변경하지 않고 새 기능을 추가할 수 있음.
- **SRP(Single Responsibility Principle) 준수**: 핵심 비즈니스 로직과 부가 기능을 분리할 수 있음.
- **객체 구조 탐색 기능**: 복잡한 객체 구조를 방문하며 데이터를 수집할 수 있음.

❌ **단점**

- **새로운 요소 클래스 추가 시 Visitor 수정 필요**
- **Visitor가 요소의 비공개 멤버에 접근할 수 없음**

## 관련 패턴(Relations with Other Patterns)

- **Command**: Visitor는 다양한 객체에 대한 명령을 실행하는 강력한 Command 패턴으로 볼 수 있음.
- **Composite**: Visitor는 Composite 구조에서 전체 객체 트리를 탐색하며 동작할 수 있음.
- **Iterator**: Visitor는 복잡한 데이터 구조를 순회하며 특정 연산을 수행하는 데 사용될 수 있음.

# 참고 문서

- [Refactoring Guru - Visitor](https://refactoring.guru/design-patterns/visitor)
