# 터치 인터페이스 설계 가이드

## 터치 대상의 크기

### 최소 터치 타겟 크기 가이드라인

| Company/Organization                                       | Recommended Size |
|------------------------------------------------------------|------------------|
| HIG (Apple)                                                | 44 * 44 pt       |
| Material Design Guide (Google)                             | 48 * 48 dp       |
| Web Content Accessibility Guidelines (WCAG)                | 44 * 44 CSS px   |
| Nielsen Norman Group (UX Training, Consulting, & Research) | 1 * 1 cm         |

👆 터치 대상이 작으면 사용자는 대상을 문제없이 선택했을 때 조차 인터페이스 사용성이 떨어진다는 인상을 받게 된다.

## 터치 대상 사이의 거리 확보

성인의 손가락 지문면 평균 면적: 10~14mm  
성인의 손 끝 평균 면적: 8~10mm

⇒ 터치 대상 간 거리를 최소 8 dp 이상 확보해야 한다!

## 터치 대상의 배치

터치 대상은 인터페이스 상에서 쉽게 도달할 수 있는 영역에 배치해야 한다.

![Smartphone Touch Accuracy](Untitled 50.png)

### 스마트폰 터치 정확도

- 화면 중앙부: 시선 🔼, 터치 선호도 🔼, 정확도 🔼

_참고: PC에서는 왼쪽 상단에서 오른쪽 하단으로 시선이 흐른다._

![Fitts's Law](Untitled 1 19.png)

## 피츠의 법칙

피츠의 법칙은 사용자가 목표물에 도달하기까지 걸리는 시간을 예측하는 공식이다.

### 공식
\[ T = a + b \log_2\left(\frac{D}{W} + 1\right) \]

- **T**: 동작을 완수하는 데 필요한 평균 시간 (MT: Movement Time)
- **a, b**: 실험 상수
- **D**: 대상 물체의 중심으로부터 측정한 거리 (A: Amplitude)
- **W**: 목표물의 폭 및 허용 오차 (± W/2)

이 공식에 따르면, 목표물의 크기가 작아지거나 목표물과의 거리가 멀어질수록 속도와 정확도가 나빠지고, 목표물에 도달하는 데 더 많은 시간이 필요하다.