---
title: CHAPTER 5 더 좋은 액션 만들기
description: |-
  - 일반적으로 암묵적 입력과 출력은 인자와 리턴값으로 바꿔 없애는 것이 좋습니다.
  - 설계는 엉켜있는 것을 푸는 것입니다. 풀려있는 것은 언제든 다시 합칠 수 있습니다.
  - 엉켜있는 것을 풀어 각 함수가 하나의 일만 하도록 하면, 개념을 중심으로 쉽게 구성할 수 있습니다.
date: 2024-12-14T23:00:00
tags: ["FP"]
draft: false
---
# 요점 정리
- 일반적으로 암묵적 입력과 출력은 인자와 리턴값으로 바꿔 없애는 것이 좋습니다.
- 설계는 엉켜있는 것을 푸는 것입니다. 풀려있는 것은 언제든 다시 합칠 수 있습니다.
- 엉켜있는 것을 풀어 각 함수가 하나의 일만 하도록 하면, 개념을 중심으로 쉽게 구성할 수 있습니다.


# 1. 암묵적 입출력 줄이기
모든 암묵적 입력과 출력을 없애지 못해 액션을 계산으로 바꾸지 못해도 암묵적 입력과 출력을 줄이면 테스트하기 쉽고 재사용하기 좋습니다.

# 2. 중복이나 불필요한 코드 처리하기
아래 예시와  같이 불필요하게 분리된 함수를 하나로 통합나는 것 또한 액션을 개선하는 방법 중 하나다. 

```javascript
function add_item_to_cart(name, price) {
	shopping_cart = add_item(shoppint_cart, name, price);
	calc_cart_total(shopping_cart);
}

function calc_cart_total(cart) {
	var total = calc_total(cart);
	set_cart_total_dom(total);
	update_shipping_icons(cart);
	update_tax_dom(total);
	shopping_cart_total = total	
}
```

위 코드에서 `calc_cart_total(cart)`는 굳이 분리될 필요 없이, `add_item_to_cart` 로 통합되어도 무방하다.


# 3. 계산 관심사 분류하기

> [!TIP] 관심사 분리의 이점
> 1. 재사용하기 쉽다.
> 2. 유지 보수하기 쉽다.
> 3. 테스트하기 쉽다.

1. 각 함수를 처리할 때 알아야 할 도메인에 따라 분류한다.
2. 함수 하나가 여러개의 도메인으로 구성되어있다면, 각 도메인을 함수로 분리할 수 있는지 확인한다.