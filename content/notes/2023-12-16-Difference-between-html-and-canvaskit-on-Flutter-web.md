---
layout: post
title: Flutter Web에서 HTML과 CanvasKit의 차이
description: Flutter Web에서 HTML과 CanvasKit의 차이
date: 2023-12-09 00:00:00 +0900
image: /assets/images/eunice-hong-opengraph.jpg
headerImage: true
tags:
  - flutter
  - web
  - html
  - canvaskit
  - skia
category: draft
author: eunice-hong
draft: true
languages:
  - ko
---
# Flutter web 초기 로딩 너무 느리잖아... 🤮

Flutter 는 모바일과 웹에서 단일 코드베이스를 사용할 수 있다는 큰 장점이 있습니다. 저처럼 극도의 효율을 추구하는 사람들에게는 동일한 개발을 들여 여러 플랫폼에 동시에 출시할 수 있다는 건 엄청난 메리트입니다. 


하지만, 막상 Flutter 로 앱을 만들다보면 플랫폼 별 대응이 필요합니다. 특히 웹 앱은 첫 화면을 띄우기까지 너무나 긴 시간이 필요합니다. 앱이 크면 클수록 공허한 빈 화면을 봐야하는 시간은 더 길어집니다. 이 공허한 공간을 어떻게 하면 없앨 수 있을까요?


## 1. 나는 정말 Flutter Web를 사용해도 되는걸까? 🥹

Flutter 공식 문서에 따르면, Flutter Web은 `앱 중심 프로젝트`에 사용하기 위해 만들어졌습니다. 여기서 "앱" 이란, **모바일 앱**을 말합니다. 즉, 모바일 앱을 중심으로 하되, 앱을 플랫폼 관계없이 사용자들에게 선보이기 위해 사용하는 것이 Flutter Web 입니다. 


이미 존재하는 앱 기능 중 일부를 보여주려고 한다거나,  SPA(Single Page Application) 혹은 PWA(Progressive Web App) 만든다면 전혀 문제가 없습니다. 자료 중심의 웹이라면? 안타깝지만 Flutter Web 은 아주 맞는 옷이라고 보기 어렵습니다. 아직 SEO 지원도, 다양한 브라우저 지원도 현재로써는 미흡하거든요...

따라서, Flutter Web은 대형 커뮤니티 플랫폼 보다는 앱의 랜딩 페이지를 만드는 데에 적합한 도구입니다. 큰 프로젝트를 만든다면, 앱 초기 로딩시간이 길어질 수 밖에 없죠. 아직 프로젝트를 시작하기 전이라면 다른 도구를 알아보는 것이 초기 로딩 시간을 줄이는 가장 좋은 방법입니다. 😙




## 2. CanvasKit Renderer 대신 HTML Renderer 를 사용해보자. 🧑‍🎨

> [!TLDR]
> 화려한 화면을 보여줘야하는 상황이 아니라면 HTML Renderer 를 사용하자.


오, 1번 제언에도 불구하고 Flutter Web 을 사용하기로 했다구요? 🤔 그렇다면, 일단 제 동료가 되신 걸 축하드립니다 👊👏 


<div style="width:100%"><div style="height:0;padding-bottom:56.25%;position:relative;width:100%"><iframe allowfullscreen="" frameBorder="0" height="100%" src="https://giphy.com/embed/G96zgIcQn1L2xpmdxi/video" style="left:0;position:absolute;top:0" width="100%"></iframe></div></div>


Flutter Web 초기 로딩을 줄이고 싶다면, 일단 Flutter Web Renderer 에 대해 알아야합니다. Flutter 화면 요소를 웹 브라우저를 띄우기 위해 두가지 Renderer 중 하나를 선택할 수 있습니다.

### Flutter Web Renderer 유형
#### 1. HTML Renderer
HTML, CSS 등 웹 페이지 요소를 그대로 사용하여 Flutter 앱 요소를 브라우저에 띄우는 방식입니다. 

#### 2. CanvasKit Renderer
CanvasKit 엔진을 사용하여 Flutter 앱 요소를 브라우저에 띄우는 방식입니다. CanvasKit 을 사용하면 빠르고 깔끔한 Flutter 화면을 웹에 띄울 수 있습니다. 

하지만, CanvasKit Renderer는 1.5MB 정도로 경우에 따라서는 부담스러운 크기입니다. 첫 화면을 브라우저에 띄우기 전에 Renderer 다운로드가 완료되어야합니다. Flutter 로 게임 만들었거나 멋진 화면 요소를 보여줘야한다면, CanvasKit Render를 반드시 사용해야합니다. 그렇지 않은 경우에는 **HTML Renderer를 사용해 초기 로딩을 시간을 줄일 수 있습니다.** 


### 빌드 시 Renderer 유형을 선택하는 방법

Flutter Web 빌드를 만들 때, 설정을 통해 Renderer 유형을 선택할 수 있습니다. `flutter build web` 에 `--web-renderer` 인자를 설정합니다.


```sh
flutter build web --web-renderer html
```
- HTML Renderer 사용한 빌드 만들기


```sh
flutter build web --web-renderer canvaskit
```
CanvasKit Renderer 사용한 빌드 만들기


```sh
flutter build web
%% Same as below %%
%% flutter build web --web-renderer auto %%
```
- `--web-renderer` 를 설정하지 않을 경우, 기본 값으로 `auto` 가 사용됩니다. `auto` 를 사용할 경우, 모바일 웹 브라우저에서는 HTML Renderer, 데스크탑 웹 브라우저에서는 CanvasKit 을 사용하여 화면을 띄웁니다. 

### 런타임에 Renderer 유형을 선택하는 방법

```html {.numberLines}
<body>
  <script>
    let useHtml = true;

    window.addEventListener('load', function(ev) {
    _flutter.loader.loadEntrypoint({
      serviceWorker: {
        serviceWorkerVersion: serviceWorkerVersion,
      },
      onEntrypointLoaded: function(engineInitializer) {
        let config = {
          renderer: useHtml ? "html" : "canvaskit",
        };
        engineInitializer.initializeEngine(config).then(function(appRunner) {
          appRunner.runApp();
        });
      }
    });
  });
  </script>
</body>
```

Flutter 엔진 초기화 시, Renderer를 설정값으로 전달할 수 있습니다. 런타임이라고는 해도, 앱이 시작된 이후에는 Renderer를 변경하는 것은 불가능합니다. 


## 3. 초기화 작업 중 로딩 상태를 표시하자.

> [!TLDR]
> 첫 화면 띄워지기 전까지 로딩 상태를 표시한다. 

2번 제언대로 HTML 을 사용해 웹앱을 만들었습니다. 그래도 앱을 로딩하는데에 많은 시간이 필요할 수 있습니다. 앱에서 사용하는 asset 이 많거나, 사용하는 기기의 네트워크 속도 등을 이유로 사용자들은 빈 화면을 멀뚱히 바라만 봐야 합니다. 기본 배경이 어둡게 설정되어있다면, 화면에 비친 내 자신과 아이컨택을 하게 되기도 합니다. 🥱👀

<iframe src="https://giphy.com/embed/W0c3xcZ3F1d0EYYb0f" width="480" height="400" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/Friends-season-2-friends-tv-the-one-where-eddie-moves-in-W0c3xcZ3F1d0EYYb0f">Feeling emptyness on Loading Flutter app</a></p>

이 따분하고 공허한 시간을 어쩌면 좋을까요? Flutter 공식문서에서는 화면이 로드 되기 전, 준비상태를 알려줄 것을 권합니다. 일례로 [superdash.flutter.dev](https://superdash.flutter.dev/) 를 보면, 게임을 로딩하는 데에 N second 가 필요합니다. 해당 로딩화면에 있는 화면요소들 덕분에 지루함은 해결되었습니다. 

### Flutter web 초기화 단계 알아보기

Flutter 앱을 웹에서 띄우기 위해서는 세 단계가 필요합니다. 아래 코드는 `flutter create` 를 할 경우, 기본으로 생성되는 `index.html` 의 일부입니다.

```html
<html>
  <head>
    <!-- ... -->
    <script src="flutter.js" defer></script>
  </head>
  <body>
    <script>
      window.addEventListener('load', function (ev) {
        // 1. flutter.js 내 함수로 Entrypoint Script 다운로드 받기
        _flutter.loader.loadEntrypoint({
          serviceWorker: {
            serviceWorkerVersion: serviceWorkerVersion,
          },
          onEntrypointLoaded: async function(engineInitializer) {
            // 2. Flutter 엔진 초기화
            let appRunner = await engineInitializer.initializeEngine();
            // 3. 앱 실행하기
            await appRunner.runApp();
          }
        });
      });
    </script>
  </body>
</html>
```

#### 1. entrypoint script 불러오기
`main.dart.js` 파일을 불러오는 단계입니다. onEntrypointLoaded 를 통해 entrypoint script 다운로드가 끝나는 시점을 파악할 수 있습니다. 


#### 2. Flutter 엔진 초기화하기

onEntrypointLoaded 콜백의 유일한 파라미터로 engine initializer 를 받을 수 있습니다. engine initializer로 런타임 설정값을 지정할 수 있습니다. 

engineInitializer.initializeEngine() 을 실행하면, App runner 가 반환됩니다. 
engineInitializer.initializeEngine() 를 사용하는 대신, 아래와 같이 `autoStart()` 를 실행할 경우, app runner 를 따로 불러오지 않고, 앱 시작 준비가 완료되는 즉시 앱을 시작하게 할 수 있습니다. 

#### 3. 앱 실행하기

App Runner 를 통해 할 수 있는 일은  runApp() 입니다. 

앱 실행에 필요한 요소들을 다운로드 받습니다.
ex. font, assets, Canvaskit, etc.

#### 로딩화면 예시

1. [CSS 를 사용한 간단한 애니메이션](https://github.com/flutter/gallery/blob/master_archived/web/index.html)

%% 내 사이트 로딩화면 녹화본 업로드 %%




## References

- https://docs.flutter.dev/platform-integration/web/renderers