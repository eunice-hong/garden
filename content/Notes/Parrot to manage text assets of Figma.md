---
title: Parrot to manage text assets of Figma
languages:
  - ko
tags:
  - figma
date: 2025-04-09T17:00:00
---
최근 #SvelteKit 프로젝트를 새로 시작했다. 프로젝트 기본 셋업 중 빠질 수 없는 것이 i18n 이다.

# i18n?

internationalization (국제화)의 약자로 첫글자 i 와 끝 글자 n 사이 18글자를 줄여서 표현한다. 소프트웨어 i18n을 말한다면, 보통 특정 지역이나 언어에 관계없이 사용가능하게 하는 것을 말한다. 


사실 지금 막 시작하는 프로젝트에서 다양한 언어를 지원할 계획은 없다. 하지만, 앱 화면에 포함되는 모든 텍스트를 관리하는데에 i18n 셋업만큼 도움이 되는게 없다. 

# Parrot

[r👉 Figma/Parrot 바로가기](https://www.figma.com/community/plugin/1205803482754362456)

요즘은 기획자, 디자이너와 협업할 때 피그마를 흔히 사용한다. 디자인이 완성된 후에도, 어감이나 앱 정책 변경 등을 이유로 화면상에서 텍스트를 변경하는 일은 흔하다. 그렇다보니 Figma 와 실제 코드에 사용되는 텍스트가 항상 동기화되도록 관리하는 노력이 필요하다. 

기존 프로젝트는 워낙 방대해 시도해 볼 엄두가 안났다. 하지만, 하얀 도화지 상태라면? Why not!


# Let's get into it

현재 진행 중인 프로젝트에 [inlang/paraglide](https://inlang.com/m/gerre34r/library-inlang-paraglideJs/sveltekit) 를 사용하고 있었다. 다행히 [i18next](https://www.i18next.com/) 와 동일한 형식으로 에셋을 관리하고 있어, Parrot 과 함께 사용할 수 있었다. 


```json
// ko.json
{
	"helloWorld": "헬로 월드!",
	"myNameIs": "제 이름은 {name}입니다."
}

```

JSON Object 안에 string 을 나열해서 사용하면 되고, 변수를 넣고 싶다면, `{}` 안에 넣어서 표현할 수 있다. 


# Pitfalls

나는 미리 작업해둔 `ko.json` 파일을 Parrot 에 import 하여 사용하려고 했다. 하지만, 버그인지 파일이 좀처럼 불러와지지 않았다. 

서치를 해보니 Android, iOS 에서 사용하는 string.xml 이나 .strings 형식으로는 문제없이 동작한다고 한다.


_AI에게 맡겼다._

![[delegate to cursor.png]]

JSON 파일을 xml 로 변환하는 일은 정말 귀찮다. AI가 나에게 선물한 문자열 파일은 문제없이 import 되었다. 🎉



# Work in progress

이제 기존 피그마에 각 key 를 연결하여 사용하면 끝이다. key 가 연결된 텍스트는 디자인 파일에서 수정하면 그 상태 그대로 JSON 파일로 export해서 사용할 수 있다. 