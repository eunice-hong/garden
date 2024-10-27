---
title: Future<Flutter> 후기
description: 한국에서 열린 가장 큰 규모 Flutter 컨퍼런스 중 하나인 Future<Flutter>에 참가했습니다. 이 페이지에는 컨퍼런스에서 들은 세션의 요약을 기록하고 있습니다.
date: 2024-09-28T12:30:00
draft: false
tags:
  - Flutter
---
![[future_flutter_header.jpg]]

# 1. 컨퍼런스 참여 계기

*플러터 개발자는 어떤 사람들일까?*

나는 회사에서 홀로 Flutter로 작은 웹 프로덕트를 만들고 있다. Flutter 의 매력은 하나의 코드로 여러 플랫폼을 지원하는데에 있는데, 나는 그 정수를 느끼지 못하고 있다. 기업 기술 블로그나 구직 사이트를 둘러보면 Flutter로 제품을 만드는 곳은 꽤 있다. 

다른 사람들이 Native 대신 Flutter를 실제 제품에 사용하는 이유는 뭘까? 그들도 나와 비슷한 곳에서 어려움을 겪고 있을까? 많은 것이 궁금하던 차에, 대규모 Flutter 컨퍼런스가 열린다는 소식을 들었다.


> [!SUMMARY]- `Future<Flutter>` 세션 리스트 
> ![session_table](https://cf.festa.io/img/2024-8-23/917575a9-9552-4081-bb1f-7a53af08b116.jpg)


Flutter 활용 사례부터 내부 구조 톺아보는 세션까지 모든 주제가 흥미로웠다. 쉬는 시간이 거의 없다는 것에 놀라긴 했지만, 좋은 연사분들로 꽉꽉 채운것이라 생각해, 당장 등록 클릭 클릭! 🖱️✨


# 2. 인상 깊었던 세션

모든 세션이 훌륭했지만, 그 중에서도 우리 팀에 공유할만한 내용이 담긴 세션을 정리해본다. 

## Flutter 웹을 활용한 제품 개발 환경 개선 사례

![](https://www.foodrink.co.jp/news/upimages/202004/demaekan.gif)

> Flutter Web이 모바일 앱 데모 버전으로서 유용하다.

2000년부터 운영된 데마이칸이 2020년에 라인에 인수되었다. 이에 오래된 데마에칸 프로젝트 코드 레거시 청산이 불가피했다. 당시 상황에서 필요한 모든 조건을 갖춘 프레임워크가 Flutter였기 때문에, 데마에칸 팀은 Flutter로 Recode 하는 방식으로 레거시를 청산하기로 했다.

Flutter가 웹을 지원한다는 건 큰 장점이었다. 웹으로 프로토타입을 만들어 확인하면, 개발 이후 피드백을 받는데에 걸리는 시간이 대폭 줄어들기 때문이다. 세계 각지에 흩어져 있는 데마이칸 팀원들에게 테스트 기기를 일일이 전달하기 보다는, 웹으로 플랫폼 관계없이 PoC를 진행하는 것이 훨씬 효율적이다. 더불어서, Flutter를 사용해 프로토타입을 웹으로 만들어두면, 모바일로 전환하는 것은 크게 어렵지 않다.

물론, Flutter 패키지 중 웹 플랫폼을 지원하지 않는 것들이 있어, CORS 문제 등 기능 개발과 별개로 웹 도메인에서 문제가 발생하기도 한다. 하지만, Flutter를 사용한 개발은 상기 어려움을 상쇄할 정도로 제품 개발 프로세스를 효율적으로 만들었다고 한다. 


## 스토어 심사 없이 앱 배포하기

![](data:image/jpeg;base64,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)


> ShoreBird를 사용하면, Flutter 모바일 앱을 스토어 심사없이 배포할 수 있다.


[Shorebird](https://shorebird.dev/)는 구글 Flutter 개발자들이 회사를 떠나 만든 프로젝트로, Flutter 프로젝트 코드 푸시 기능을 제공한다.


**코드 푸시(Code Push)** 란 MS에서 제공하는 서비스로, 모바일 앱 프로젝트 수정사항을 스토어 검수 과정 없이 바로 사용자들에게 새 버전을 배포하는 서비스다. 주로 react-native 프로젝트에서 많이 사용한다고 한다. 


ShoreBird를 사용해 코드를 배포하는 과정은 다음과 같다. (참고: [ShoreBird Docs/Get Started](https://docs.shorebird.dev/))

1. ShoreBird CLI 설치
	```sh
	curl --proto '=https' --tlsv1.2 https://raw.githubusercontent.com/shorebirdtech/install/main/install.sh -sSf | bash
	```
2. Flutter 프로젝트 생성
	```sh
	flutter create my_shorebird_app
	cd my_shorebird_app
	flutter run
	```
3. ShoreBird 설치 
	```sh
	shorebird init
	```

4. 배포하기
	```sh
	shorebird release android
	```

5. 수정사항 반영하기
	```sh
	shorebird patch android
	```


세션에서 ShoreBird의 설립자 Eric Seidel이 직접 라이브로 설치부터 패치까지 진행했는데, 생각보다 단순한 과정으로 배포가 가능해서 놀랐다. 다음에 사이드 프로젝트를 진행하게 된다면, 반드시 사용해보고 싶다!

## Flutter에서 Go Lang 사용하기

> ffi 패키지를 사용하여, Dart에서 C 라이브러리를 불러와 사용할 수 있다.

"FFI로 연결하는 고(Go)와 플러터 - 리쳉" 세션에서는 Go 언어를 Flutter 프로젝트에서 사용하는 방법에 대해 소개했다. 
Flutter 프로젝트에서 Go 언어 코드를 사용하기 위해서 
[`ffi(foreign function interface)`](https://pub.dev/packages/ffi) 패키지를 이용하는데, 
Go 언어 뿐 아니라 C API를 지원하는 언어는 무엇이든 사용할 수 있다고 한다. Go 언어는 아니지만, 구글 코드 랩의 
[Flutter에서 ffi를 사용하여 JavaScript REPL 구현하기][using_ffi_in_a_flutter_plugin]로 
`ffi`패키지 사용 방법을 간단히 확인할 수 있다. `ffi`를 사용해 Flutter에서도 low-level 코드를 활용한 
프로젝트를 만들 수 있다는 사실이 새로웠다. pub.dev 패키지 영역에서 벗어나 새로운 시도들을 해볼 수 있겠다는 생각이 들었다.   


# 3. 마치며

위에 언급한 세가지 세션 이외에도 Flutter에서 Web RTC를 사용해본 후기, Flutter 렌더링 방식에 대한 이야기 등 흥미로운 주제들이 많았다. 네트워킹이나 핸즈온 세션이 없었지만, 전체 세션이 알차서 집에 돌아오는 길에 내내 뿌듯했다. 오늘 알게된 내용들을 바탕으로 회사 제품이나 사이드 프로젝트에 적극적으로 활용해보고 싶다는 생각을 하며, 집에 돌아왔다. 





**참고 링크**

- [MS: code push](https://learn.microsoft.com/ko-kr/appcenter/distribution/codepush/)
- [Shorebird](https://shorebird.dev/)
- [pub.dev/ffi](https://pub.dev/packages/ffi)
- [Codelab: Using FFI in a Flutter plugin][using_ffi_in_a_flutter_plugin]

[using_ffi_in_a_flutter_plugin]: https://codelabs.developers.google.com/codelabs/flutter-ffigen

<!--
## FFI로 연결하는 고(Go)와 플러터 - 리쳉

> [!TLDR] TLDR; FFI를 사용하여 Go 언어를 Flutter에서 사용할 수 있다. 
> 

### 주요 포인트
1. C 인터페이스를 제공하는 언어라면 다트에서 ffi 를 통해 사용 가능하다.
2. ffigen 을 이용하면 헤더파일을 읽어 자동으로 바인딩 코드를 생성해준다.
3. Go 언어의 크로스 컴파일러를 이용해 쉽게 크로스 플랫폼 라이브러리 생성 가능하다.

DRAFT
1. 계기 
	1. go는 GUI를 보여주는데에 부족함
		1. 크로스 플랫폼
		2. 컴파일, 실행 빠름
		3. 가볍고 확장성 좋음
	2. flutter에 연결하여 사용해보자!
		1. 크로스 플랫폼
		2. 개발도구가 잘되어있음
		3. 빠르고 예쁨
2. ffi?
	1. 정의
		1. foreign function interface
		2. c 언어로 짜여진 함수를 다트나 플러터에서 사용하는 방법. dart:ffi파키지를 사용함
		3. c 언어 인터페이스를 사용하면 쓸 수 있음
	2. 사용방법
		1. `flutter create ... --template=plugin ffi native add`
3. go compile
	1. cgo 문법으로 export 해서 사용해야한다.
	2. iOS 의 경우 별도의 컴파일 과정이 있다.
	3. 플랫폼 별 빌드를 생성해야한다.
		1. 각 빌드가 플랫폼 폴더 내 적절한 폴더로 들어간다.
4. go -> flutter?
	1. FFIgen을 사용해서 바인딩을 만든다
		1. `flutter pub run ffigen --config ffigen.yaml`
	2. 생성된 dart 파일과 ffi 라이브러리를 사용한다.
5. 정리
	1. c 인터페이스를 제공하는 언어라면 다트에서 ffi 를 통해 사용가능함
	2. ffigen 을 이용하면 헤더파일을 읽어 자동으로 바인딩 코드를 생성해줌
	3. 고언어의 크로스 컴파일러를 이용해 쉽게 크로스 플랫폼 라이브러리 생성가능
6. 다음 스텝
	1. 깃헙 예제(Android, iOS, MacOS) 외 플랫폼
	2. 웹에서 동작하도록 빌드
	3. 메모리 공유나 비동기 처리등의 고급 사용 예제 


### 개인적인 생각
- Go lang를 Flutter에 병합하는 방법에 대해 알게 되어 흥미로웠다.
- 고성능 연산을 요구하는 애플리케이션을 개발할 때 상당히 유용할 것으로 보인다.
- 다른 언어와 바인딩하여 사용하는 방법도 있는지 궁금하다.

### 추가 리소스와 참고 링크
 - [참고 문서](https://dev.to/leehack/how-to-use-golang-in-flutter-application-golang-ffi-1950)
 - [예제 프로젝트](https://github.com/leehack/flutter_golang_ffi_example)



## 3. Web RTC - 이정주

### 중요 포인트와 인사이트
1. WebRTC 개발 계기
	1. 회사에서 영상통화 기능을 개발
	2. 통화 품질 문제로 프로덕션 릴리즈까지 개발하지 못함
2. WebRTC 란?
	3. 웹 애플리케이션과 사이트가 중간 전달자 없이 통신하도록 하는 기술
	4. 웹에서 실시간 미디어 스트리밍을 위한 유일한 표준
3. 소감
	1. 그냥 구현하는 것과 production 레벨로 구현하는 것은 다르다.
	2. 실제 구현하는 것은 동작 원리를 이해하는게 중요하다
	3. 관련없이 보였던 지식들이 연결되기도 한다. (ex. WebRTC & Push 알림)


### 추가 리소스와 참고 링크
- http://tech.kakaoenterprise.com/121

## 4. 쇼어버드 작동 방식 - Eric Seidel
### 중요 포인트와 인사이트
- Shorebird 시작 계기
	- 플랫폼 요구 < 사용자 요구  -> Shorebird 시작
	- 구글에서는 실현 불가능함
- Shorebird: Flutter Code Push
	- Not an interest for the GOOGLE
- Who he is, and why he is here?
- what is Code push?
	- 큰 앱에서 주로 사용한다.
	- 다운타임을 없앤다.
	- 모바일 팀이 웹 팀처럼 일하게 만들어준다.
	- 롤백 기능

### 추가 리소스와 참고 링크
• 실용적인 코드 예제나 도구
• 발표에서 소개된 코드 예제나 도구 사용법을 메모해두세요. 나중에 블로그에 실제 코드나 설정 방법 등을 포함하면 독자들이 실무에 바로 적용할 수 있어 유용합니다.
• 가능하면 메모 단계에서 코드 스니펫을 복사하거나 직접 기록해두면 좋습니다.
• 발표자가 추천한 자료나 링크를 메모하세요. 블로그 글에서 해당 리소스들을 포함해주면 독자들이 더 깊이 있는 학습을 할 수 있도록 도와줍니다.
• 관련 문서, GitHub 리포지토리, 블로그 글 등을 메모하고 정리하면 글의 정보량을 확장할 수 있습니다.




## 풍성한 디자인 요청사항에 대응하기 - 박유진

### 주요 내용
- 라인 ABC 팀 - 데마에칸 - 총 7개의 앱을 빌드하여 사용하고 있음
- 한정된 리소스 안에서 구조 변경 + 디자인 변경
	ex. poligon, loading skeleton 등을 직접 그려 컴포넌트화 한다.
- 원활한 디자인 구현을 위한 팁
	- 매주 개발자간 세션을 진행하여, 새로 만든 공용 컴포넌트에 대해 공유한다.
	- 디자인 요구사항 재확인 받기

## 플러터 렌더링 해부학 - 에이든

- [발표 자료](https://docs.google.com/presentation/d/1QznDbqk9JWC6mWmorRPcyzHu3C2yow7kpmjK40TbHuQ/mobilepresent?slide=id.g30324f6f666_0_3)

### 주요 내용
- Widget
- runApp
- RenderingObject

### 개인적인 생각
- GPU 프로그래밍에 관심을 가져야 한다.

## 7. Flutter Web을 활용해 제품 개발 환경 개선하기 - 김종식

> [!TLDR]
> Flutter web이 모바일 앱 데모 버전으로서 유용하다.

### 중요 포인트와 인사이트
1. 소개
	1. 데마에칸: 일본 배달 플랫폼
2. 웹 빌드 및 배포 시도 소개
	1. Flutter Web을 활용해 제품 개발 환경 개선하기
		1. 앱 제품 개선 과정 효율화
		2. 물리적 제약사항 극복
		3. 프로덕션 수준으로 서비스 출시 X
	2. DriverApp
		1. Recode를 통한 기술 유산 제거하기
		2. web 을 지원하지 않는 패키지가 많음
			1. 지도 패키지
			2. 웹 뷰 패키지
			3. 로컬 스토리지
		3. CORS 오류
			1. `--disable-web-security` 사용
			2. [`flutter_cors`](https://pub.dev/packages/flutter_cors) 사용
		4. 권한 요청 흐름
			1. 알림 권한 요청 - 앱 시작과 동시에 요청하기
	3. ConsumerApp
		1. 도입 계기
			1. 재택근무로 인한 물리적 제약사항
			2. 기획자 및 관계자들을 위한 앱의 동작 테스트 수단이 필요
			3. Web 시도 경험을 바탕으로 PoC 진행
			4. 컨슈머 앱을 웹에서 확인 가능한 환경을 제공하여 앱 동작 확인
		2. web 을 지원하지 않는 패키지가 많음
			1. import `dart:ffi` 중 오류 발생
			2. [`custom_lint`](https://pub.dev/packages/custom_lint)  사용
			3. [`newrelic_mobile`](https://pub.dev/packages/newrelic_mobile) 사용
			4. 필수가 아닌 경우, 동작 생략
		3. CORS issue
			1. BFF
			2. Image Server
	4. RetailApp
		1. 도입 계기
			1. Y!Shopping: 매장에서 주문을 수주하고 주문을 배달로 연계
		2. 
3. 요약
	1. `defaultTargetPlatform` 을 사용하자
	2. 웹 제약사항
		1. 웹에서 오류가 발생하는지 확인한다
		2. 관련 기능이 반드시 필요한다.
		3. 반대로 , 굳이 필요하지 않은지 판단한다.
		4. 웹에서 제약사항을 잘 공유한다.
	3. CORS 오류 대응하기
		1. Server side configuration
		2. User Proxy Server

- 쿠키때문에 문제 있으면 사용자한테 지우라고한다.
- 앱 서비스를 웹으로 테스트 한다는게 이해가 안감
	- 앱 테스터, 테스트 플라이트를 사용할 수 없음
	- 
- 

### 개인적인 생각

• 발표 내용에 대한 자신의 생각이나 의견을 메모해 두세요. 발표 내용이 유익했던 점, 더 궁금했던 점, 또는 개선할 수 있는 점에 대해 개인적인 의견을 추가하면 블로그 글이 더욱 독창적이고 흥미로워집니다.


### 추가 리소스와 참고 링크
- [Conditional imports across Flutter and Web](https://medium.com/flutter-community/conditional-imports-across-flutter-and-web-4b88885a886e)
- [CORS, Preflight, 인증 처리 관련 삽질](https://www.popit.kr/cors-preflight-%EC%9D%B8%EC%A6%9D-%EC%B2%98%EB%A6%AC-%EA%B4%80%EB%A0%A8-%EC%82%BD%EC%A7%88/)
- 

## 8. 어느날 갑자기 앱이 터졌다 - 신원규

> [!TLDR]
> 

### 중요 포인트와 인사이트

에러 로그 없이 오류 분석 시작하기
- 실행과 동시에 앱이 꺼진다.
- 전파 음영 지역?

1. 개발 환경에서 발생한 오류가 있는지
2. 실기기 콘솔을 확인한다.
	1. iOS - Impeller 엔진 관련 로그가 있어서, 강제로 껐음
3. 사용자 사용 기록을 확인한다.

1. Apple 도 NullPointerException 을 발생시킬 수 있다.
2. 모든 계층의 실행 단위를 확인해야한다.
3. 오류의 원인을 특정하기 위해서는 CS 지식이 필요하다.

### 개인적인 생각

• 발표 내용에 대한 자신의 생각이나 의견을 메모해 두세요. 발표 내용이 유익했던 점, 더 궁금했던 점, 또는 개선할 수 있는 점에 대해 개인적인 의견을 추가하면 블로그 글이 더욱 독창적이고 흥미로워집니다.


### 추가 리소스와 참고 링크

• 실용적인 코드 예제나 도구
• 발표에서 소개된 코드 예제나 도구 사용법을 메모해두세요. 나중에 블로그에 실제 코드나 설정 방법 등을 포함하면 독자들이 실무에 바로 적용할 수 있어 유용합니다.
• 가능하면 메모 단계에서 코드 스니펫을 복사하거나 직접 기록해두면 좋습니다.
• 발표자가 추천한 자료나 링크를 메모하세요. 블로그 글에서 해당 리소스들을 포함해주면 독자들이 더 깊이 있는 학습을 할 수 있도록 도와줍니다.
• 관련 문서, GitHub 리포지토리, 블로그 글 등을 메모하고 정리하면 글의 정보량을 확장할 수 있습니다.



## 9. Flutter Bloc을 제품 개발에 아무지게 적용하기 - 최정연

> [!TLDR]
> 

### 중요 포인트와 인사이트
1. Bloc을 선택한 이유
	1. 리뉴얼하면서 코드 구조를 바꿀 기회가 생김
	2. 비즈니스 로직 분리 용이
	3. 높은 인지도
	4. bloc_test 용이
	5. *큰 규모 앱에 매우 적합함*
2. 일회성 동작처리
	1. 스낵바, 토스트 메시지, 다이얼로그 등 띄우기 -> bloc_listener 사용한다.
		2. 상태 분리하기
			1. 같은 '성공' 동작을 너무 많은 상태로 분리해서 선언해야함
			2. 논리적으로 오류
		3. 데이터 분리하기
			1. 불필요한 데이터가 붙어있음
		4. 중첩 클래스로 분리
			1. `sealed class` 에 일회성 이벤트별로 class를 별도로 만들어준다.
4. 코드 작성 피로도 줄이기
	1. 작성할 최소한의 코드
	2. IntelliJ IDEA -> Live Templates
	3. code snippet은 반드시 Git으로 공유한다.
5. widget build 최적화
	1. BlocSelector 를 사용한다. -> 값이 하나인 경우에만 사용 가능하다.
	2. buildWhen 을 사용한다. 
		1. 유지보수가 어려운 중첩된 조건문
		2. state가 전체 노출되며 버그 발생 가능성이 높음
	3. [provider](https://pub.dev/packages/provider) 사용하기
6. test 하기
	1. 


• 발표 중 중요한 포인트나 발표자가 강조한 내용에 주목하세요. 기술적인 디테일, 새로운 개념, 도구 사용법 등 독자들에게 도움이 될 만한 내용을 메모합니다.
• 발표자가 예시나 경험을 공유하는 부분은 블로그의 스토리텔링 요소로 좋습니다. 이런 부분을 상세히 적어두면 글의 깊이가 더해집니다.


### 개인적인 생각

• 발표 내용에 대한 자신의 생각이나 의견을 메모해 두세요. 발표 내용이 유익했던 점, 더 궁금했던 점, 또는 개선할 수 있는 점에 대해 개인적인 의견을 추가하면 블로그 글이 더욱 독창적이고 흥미로워집니다.


### 추가 리소스와 참고 링크

• 실용적인 코드 예제나 도구
• 발표에서 소개된 코드 예제나 도구 사용법을 메모해두세요. 나중에 블로그에 실제 코드나 설정 방법 등을 포함하면 독자들이 실무에 바로 적용할 수 있어 유용합니다.
• 가능하면 메모 단계에서 코드 스니펫을 복사하거나 직접 기록해두면 좋습니다.
• 발표자가 추천한 자료나 링크를 메모하세요. 블로그 글에서 해당 리소스들을 포함해주면 독자들이 더 깊이 있는 학습을 할 수 있도록 도와줍니다.
• 관련 문서, GitHub 리포지토리, 블로그 글 등을 메모하고 정리하면 글의 정보량을 확장할 수 있습니다.



Empathetic Flutter - Craig Labenz & 이자영

webOS 소개 및 Flutter 적용 계획 - 이동영

> [!TLDR]
> 

### 중요 포인트와 인사이트

• 발표 중 중요한 포인트나 발표자가 강조한 내용에 주목하세요. 기술적인 디테일, 새로운 개념, 도구 사용법 등 독자들에게 도움이 될 만한 내용을 메모합니다.
• 발표자가 예시나 경험을 공유하는 부분은 블로그의 스토리텔링 요소로 좋습니다. 이런 부분을 상세히 적어두면 글의 깊이가 더해집니다.


### 개인적인 생각

• 발표 내용에 대한 자신의 생각이나 의견을 메모해 두세요. 발표 내용이 유익했던 점, 더 궁금했던 점, 또는 개선할 수 있는 점에 대해 개인적인 의견을 추가하면 블로그 글이 더욱 독창적이고 흥미로워집니다.


### 추가 리소스와 참고 링크

• 실용적인 코드 예제나 도구
• 발표에서 소개된 코드 예제나 도구 사용법을 메모해두세요. 나중에 블로그에 실제 코드나 설정 방법 등을 포함하면 독자들이 실무에 바로 적용할 수 있어 유용합니다.
• 가능하면 메모 단계에서 코드 스니펫을 복사하거나 직접 기록해두면 좋습니다.
• 발표자가 추천한 자료나 링크를 메모하세요. 블로그 글에서 해당 리소스들을 포함해주면 독자들이 더 깊이 있는 학습을 할 수 있도록 도와줍니다.
• 관련 문서, GitHub 리포지토리, 블로그 글 등을 메모하고 정리하면 글의 정


## 그 외

Web RTC, 쇼어버드 작동 방식, 풍성한 디자인 요청사항에 대응하기,  등 다양한 주제에 대한 



# 마치며

- 예상한 것들을 얻을 수 있었는지?
 -->
