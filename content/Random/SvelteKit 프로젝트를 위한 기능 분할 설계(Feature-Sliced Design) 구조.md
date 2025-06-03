---
title: SvelteKit 프로젝트를 위한 기능 분할 설계(Feature-Sliced Design) 구조
description: SvelteKit 프로젝트를 위한 기능 분할 설계(Feature-Sliced Design) 구조
draft: false
noindex: false
date: 2025-04-07T16:57:00
tags:
  - SvelteKit
  - FSD
  - 기능 분할 설계
  - FE
---

# 들어가며

현대 웹 애플리케이션은 그 규모와 복잡성이 날로 증가하고 있으며, 이는 코드 관리, 유지보수, 그리고 새로운 기능 추가에 상당한 어려움을 야기합니다. 이러한 상황에서 체계적인 아키텍처 설계는 프로젝트의 성공적인 개발과 지속적인 성장을 위해 필수적입니다. 기능 분할 설계(Feature-Sliced Design, FSD)는 이러한 복잡성을 효과적으로 관리하기 위해 등장한 프론트엔드 아키텍처 방법론 중 하나입니다. FSD는 애플리케이션의 코드를 기능 단위로 분할하고, 각 기능 간의 의존성을 명확히 관리함으로써 코드의 유지보수성, 확장성, 그리고 개발 효율성을 향상시키는 것을 목표로 합니다.

이러한 맥락에서 SvelteKit은 Svelte 기반의 풀스택 웹 프레임워크로서, 빠른 개발 속도와 뛰어난 성능을 제공하며 많은 개발자들에게 각광받고 있습니다. SvelteKit은 파일 시스템 기반 라우팅, 서버 사이드 렌더링(SSR), 그리고 API 엔드포인트와 같은 강력한 기능들을 내장하고 있어, FSD와 같은 체계적인 아키텍처 패턴을 적용하기에 매우 적합한 기반을 제공합니다. 특히 SvelteKit의 routes 폴더는 애플리케이션의 라우팅 구조를 명확하게 정의하며, `lib` 폴더는 재사용 가능한 코드를 위한 공간을 제공하므로, FSD의 계층 구조를 자연스럽게 매핑할 수 있습니다.

본 글은 SvelteKit 프로젝트에 최적화된 FSD 구조를 제시하고, 그 적용 방안을 상세하게 분석하는 것을 목표로 합니다. 이를 위해 FSD의 기본 개념과 SvelteKit 프레임워크의 주요 특징을 살펴보고, SvelteKit 환경에서 FSD를 효과적으로 적용할 수 있는 구체적인 폴더 구조 및 개발 패턴을 제시할 것입니다. 또한, FSD를 SvelteKit 프로젝트에 적용했을 때 예상되는 이점과 잠재적인 문제점을 심층적으로 분석하고, 발생 가능한 문제에 대한 해결 방안을 모색할 것입니다. 궁극적으로 이 보고서는 SvelteKit 개발자들이 FSD를 성공적으로 도입하여 더욱 체계적이고 확장 가능한 애플리케이션을 구축하는 데 실질적인 도움을 제공하고자 합니다.

# Feature-Sliced Design (FSD)란?

기능 분할 설계(FSD)는 대규모 프론트엔드 애플리케이션의 구조를 체계적으로 관리하기 위한 아키텍처 방법론으로, 애플리케이션을 독립적인 기능 단위로 분할하고 각 기능 간의 의존성을 명확하게 관리하는 것을 핵심 원칙으로 합니다. FSD의 주요 목표는 코드의 응집도를 높이고 결합도를 낮춤으로써 프로젝트의 유지보수성과 확장성을 향상시키는 데 있습니다. FSD는 기능 중심의 코드 분할, 단방향 의존성, 재사용성 및 독립성, 그리고 엄격한 공개 API 관리라는 핵심 원칙을 기반으로 합니다. 이러한 원칙들은 변화하는 비즈니스 요구사항에 유연하게 대응하고, 프로젝트를 더 이해하기 쉽고 안정적으로 만드는 데 기여합니다.

FSD의 아키텍처는 크게 레이어(Layers), 슬라이스(Slices), 그리고 세그먼트(Segments)의 세 가지 주요 개념으로 구성됩니다. 레이어는 애플리케이션을 추상화 수준에 따라 수직적으로 분리한 최상위 구조이며, 슬라이스는 각 레이어 내에서 특정 비즈니스 도메인 또는 기능을 기준으로 코드를 그룹화한 단위입니다. 마지막으로 세그먼트는 각 슬라이스를 기술적인 목적에 따라 더욱 세분화한 폴더를 의미합니다.

## FSD 주요 계층 구조

### App

애플리케이션의 전역 설정 및 초기화를 담당하는 최상위 레이어입니다. 여기에는 애플리케이션의 진입점, 라우팅 설정, 전역 스타일, 테마 적용, 그리고 전역 상태 관리 초기화와 같이 애플리케이션 전체에 영향을 미치는 설정들이 포함됩니다. SvelteKit에서는 이 레이어가 주로 루트 레이아웃 컴포넌트(+layout.svelte)와 전역 훅(hooks.server.js, hooks.client.js)을 통해 구현되며, 애플리케이션 전체의 동작 방식을 정의하는 역할을 수행합니다.

### Shared

프로젝트 전반에 걸쳐 재사용 가능한 유틸리티 함수, UI 컴포넌트 라이브러리, 상수, 타입 정의, 그리고 API 클라이언트와 같은 공통 리소스를 포함하는 레이어입니다. 이 레이어는 특정 비즈니스 로직에 의존하지 않는 순수하고 추상화된 코드를 담고 있어야 합니다. SvelteKit의 $lib 디렉토리는 이러한 shared 레이어의 역할을 수행하기에 적합하며, 프로젝트 전반에서 공통적으로 사용되는 코드를 효율적으로 관리할 수 있도록 지원합니다.

### Entities
애플리케이션의 핵심 비즈니스 데이터 모델과 관련된 로직을 관리하는 레이어입니다. 여기에는 데이터 구조 정의, 유효성 검증 규칙, 그리고 기본적인 데이터 조작 로직 등이 포함됩니다. 예를 들어, 사용자(User) 엔티티나 상품(Product) 엔티티와 같이 애플리케이션의 핵심적인 개념을 나타내는 코드가 이 레이어에 속합니다. SvelteKit에서는 $lib 디렉토리 내에 entities 폴더를 생성하여 이러한 엔티티 관련 코드를 체계적으로 관리할 수 있습니다.

### Features
재사용 가능한 독립적인 비즈니스 기능을 구현하는 레이어입니다. 사용자 인증, 상품 검색, 댓글 작성 등 특정 사용자 시나리오를 수행하는 데 필요한 모든 코드를 포함합니다. features 레이어는 entities와 shared 레이어의 기능을 활용하여 비즈니스 로직을 구현하며, 다른 features 레이어를 직접적으로 의존해서는 안 됩니다. SvelteKit에서는 $lib 디렉토리 내에 features 폴더를 만들고, 각 기능별로 하위 폴더를 구성하여 관련 코드를 관리할 수 있습니다.

### Widgets
페이지 내에서 독립적으로 작동하며, 하나 이상의 features 또는 entities를 조합하여 만들어진 재사용 가능한 UI 블록을 포함하는 레이어입니다. 검색 바, 상품 목록, 사용자 프로필 위젯 등이 이에 해당합니다. SvelteKit에서는 $lib 디렉토리 내에 widgets 폴더를 생성하여 이러한 재사용 가능한 UI 컴포넌트들을 관리할 수 있습니다.

### Pages
특정 URL에 매핑되는 개별 페이지를 구성하는 레이어입니다. 각 페이지는 features, widgets, entities, 그리고 shared 레이어의 컴포넌트와 로직을 조합하여 사용자에게 완전한 화면을 제공합니다. SvelteKit의 src/routes 디렉토리는 FSD의 pages 레이어와 직접적으로 대응되며, 각 폴더 및 파일 구조는 애플리케이션의 URL 경로를 정의합니다.


### Processes
과거에는 페이지 간의 복잡한 시나리오나 워크플로를 관리하는 데 사용되었으나, 현재 FSD v2.0 이후로는 사용이 권장되지 않는 레이어입니다. 이러한 복잡한 로직은 주로 features 레이어나 별도의 서비스 레이어에서 관리하는 것이 일반적입니다.

각 레이어 내에서 코드를 구성하는 기본 단위는 슬라이스입니다. 슬라이스는 특정 비즈니스 도메인이나 기능을 기준으로 관련된 코드들을 하나의 폴더로 묶는 역할을 합니다. 예를 들어, features 레이어 내에는 auth 슬라이스, entities 레이어 내에는 user 슬라이스와 같이 구성할 수 있습니다. 각 슬라이스 내부는 세그먼트라는 폴더를 통해 기술적인 목적에 따라 더욱 세분화됩니다. 일반적인 세그먼트로는 UI 컴포넌트를 담는 ui, 비즈니스 로직 및 상태 관리를 위한 model, API 호출 관련 코드를 포함하는 api, 그리고 유틸리티 함수들을 모아놓은 lib 등이 있습니다. 이러한 슬라이스와 세그먼트 구조는 각 레이어 내에서 관심사를 분리하고 코드의 모듈성을 높여 유지보수성을 향상시키는 데 기여합니다.

# SvelteKit 프레임워크의 이해

SvelteKit은 Svelte를 기반으로 구축된 풀스택 웹 애플리케이션 프레임워크로, 뛰어난 성능과 개발 편의성을 제공합니다. SvelteKit 프로젝트의 기본적인 폴더 구조는 다음과 같습니다.

- **static**: 이미지, 비디오, 오디오, 폰트, favicon 등 애플리케이션에서 사용되는 정적인 자원들을 저장하는 폴더입니다.
- **src**: SvelteKit 프로젝트의 핵심 소스 코드가 위치하는 디렉토리입니다. 이 폴더 내에서 애플리케이션의 로직, UI, 그리고 라우팅이 관리됩니다.
    - **routes**: SvelteKit의 핵심 기능 중 하나인 파일 시스템 기반 라우팅을 담당하는 폴더입니다. 이 폴더 내의 각 폴더와 파일은 애플리케이션의 특정 URL 경로에 매핑됩니다. 예를 들어, src/routes/about 폴더는 /about 경로에 해당합니다. 이 폴더 내에는 페이지 컴포넌트(+page.svelte), 레이아웃 컴포넌트(+layout.svelte), 그리고 서버/클라이언트 측 데이터 로딩 로직(+page.server.js, +page.js) 등이 위치합니다. 그룹 레이아웃((group))을 활용하여 여러 라우트에 공통 레이아웃을 적용하고 라우트 구조를 체계화할 수도 있습니다.
    - **lib**: 프로젝트 전반에 걸쳐 재사용 가능한 유틸리티 함수, UI 컴포넌트, 서버 로직, 그리고 상태 관리 관련 코드 등을 포함하는 폴더입니다. 일반적으로 components, utils, server, store 등의 하위 폴더로 구성되어 코드의 목적과 역할을 명확히 분리합니다. SvelteKit 설정 파일에서 경로 별칭을 설정하여 $lib/components와 같이 더 짧고 직관적인 경로로 import할 수 있습니다.
    - **hooks**: 서버 및 클라이언트 측에서 요청과 응답을 가로채고 처리하는 로직을 담는 파일 (hooks.server.js, hooks.client.js)을 포함합니다. 이를 통해 인증, 로깅, 데이터 변환 등 전역적인 요청/응답 처리를 수행할 수 있습니다.
    

      이 외에도 src 디렉토리에는 애플리케이션의 기본 HTML 템플릿을 정의하는 app.html, 그리고 전역 타입 정의를 위한 app.d.ts와 같은 중요한 파일들이 위치합니다.
    
- **svelte.config.js**: SvelteKit 프로젝트의 다양한 설정을 구성하는 파일입니다. 어댑터 설정, 경로 별칭(alias) 정의 등을 포함합니다.
- **vite.config.ts**: Vite 빌드 도구의 설정을 관리하는 파일입니다. 개발 서버 설정, 번들링 최적화 등을 정의할 수 있습니다.
- **package.json**: 프로젝트의 의존성 패키지 정보와 실행 스크립트 등을 관리하는 파일입니다.


SvelteKit은 컴포넌트 기반 개발 방식을 채택하고 있으며, Svelte의 반응형 업데이트 시스템을 통해 효율적인 UI 렌더링을 제공합니다. 파일 기반 라우팅을 통해 개발자는 폴더 구조만으로 애플리케이션의 라우팅을 직관적으로 관리할 수 있으며, 서버 사이드 렌더링(SSR)과 API 라우트 기능을 통해 풀스택 웹 애플리케이션 개발을 용이하게 합니다. 이러한 SvelteKit의 핵심 기능과 개발 방식은 FSD와 같은 구조적인 아키텍처 패턴을 적용하는 데 중요한 고려 사항이 됩니다.

# SvelteKit 프로젝트에 FSD 적용 전략

SvelteKit 프로젝트에 기능 분할 설계(FSD)를 효과적으로 적용하기 위해서는 FSD의 각 계층을 SvelteKit의 폴더 구조에 적절하게 매핑하는 것이 중요합니다. 다음은 각 FSD 계층을 SvelteKit의 폴더 및 파일 구조와 연동하는 방안에 대한 심층적인 분석입니다.

### Pages 계층과 src/routes 폴더의 연동

FSD의 pages 계층은 SvelteKit의 src/routes 폴더와 직접적으로 매핑될 수 있습니다. src/routes 폴더 내에 FSD의 pages 레이어에 해당하는 폴더 구조를 구성하고, 각 페이지는 src/routes/페이지명/+page.svelte 파일로 구현합니다. 예를 들어, 사용자 관련 페이지는 src/routes/(app)/users/+page.svelte와 같이 구성할 수 있습니다. SvelteKit의 파일 기반 라우팅 규칙을 활용하여 FSD의 pages 레이어를 직관적이고 효율적으로 관리할 수 있습니다. 그룹 레이아웃((group))을 사용하여 공통 레이아웃을 적용하고 라우트 구조를 더욱 체계화하는 것도 좋은 전략입니다.

### Shared 계층과 src/lib/shared 폴더의 활용

FSD의 shared 레이어는 SvelteKit의 src/lib 폴더 아래에 shared라는 하위 폴더를 생성하여 구현할 수 있습니다. 재사용 가능한 UI 컴포넌트, 유틸리티 함수, 상수, 그리고 타입 정의와 같은 공통 코드는 이 src/lib/shared 폴더 내에 체계적으로 구성합니다. 이는 특정 비즈니스 도메인에 종속되지 않는 순수한 재사용 가능 코드를 위한 명확한 위치를 제공합니다.

### Entities, Features, Widgets 계층의 src/lib 내 하위 폴더 구성

FSD의 entities, features, 그리고 widgets 계층은 모두 SvelteKit의 src/lib 폴더 내에 각각의 하위 폴더를 생성하여 구성할 수 있습니다. entities 폴더에는 핵심 비즈니스 모델과 관련된 코드를, features 폴더에는 특정 기능을 구현하는 코드 (각 기능별 폴더 내에 ui, model, api 등의 세그먼트 폴더 포함), 그리고 widgets 폴더에는 재사용 가능한 UI 블록을 위치시킵니다. 이러한 구조는 도메인 특화 코드(entities), 비즈니스 로직(features), 그리고 재사용 가능한 UI 요소(widgets)를 명확하게 분리하여 관리할 수 있도록 돕습니다.

### App 계층의 구현

FSD의 app 계층은 SvelteKit 프로젝트의 최상위 src 폴더 또는 src/app 폴더 (선택 사항)에 위치하는 레이아웃 컴포넌트(+layout.svelte)와 훅(hooks.server.js, hooks.client.js)을 통해 구현할 수 있습니다. +layout.svelte는 애플리케이션의 전역 레이아웃을 관리하며, hooks.server.js와 hooks.client.js는 전역 설정 및 요청/응답 처리를 담당합니다.

### Processes 계층의 역할 대체

현대 FSD에서는 processes 레이어의 사용이 권장되지 않으므로, 과거 이 레이어가 담당했던 복잡한 비즈니스 로직은 주로 features 레이어 내의 슬라이스 또는 src/lib/services와 같은 별도의 서비스 레이어에서 관리하는 것이 좋습니다. 이는 코드의 복잡성을 줄이고 중복을 방지하는 데 도움이 됩니다.

### SvelteKit의 파일 기반 라우팅 특성을 고려한 FSD 슬라이스 구성

src/routes 폴더 내의 폴더 구조를 비즈니스 도메인 또는 기능별로 구성하여 FSD 슬라이스를 반영할 수 있습니다. 예를 들어, 사용자 관련 페이지들을 users 폴더 아래에, 인증 관련 페이지들을 auth 폴더 아래에 구성하는 방식입니다. 이는 라우팅 구조를 FSD의 기능 중심 구조와 일관성 있게 유지하여 전체적인 코드 관리 효율성을 높입니다.

## FSD 레이어와 SvelteKit 폴더 구조 간 매핑 관계

| FSD 레이어   | SvelteKit 폴더/파일                        | 역할                                                                 |
| --------- | -------------------------------------- | ------------------------------------------------------------------ |
| App       | src/app/ (선택 사항), src/                 | 전역 설정, 레이아웃 (+layout.svelte), 훅 (hooks.server.js, hooks.client.js) |
| Shared    | src/lib/shared/                        | 재사용 가능한 UI 컴포넌트, 유틸리티, 상수, 타입 정의                                   |
| Entities  | src/lib/entities/                      | 핵심 비즈니스 모델 및 관련 로직                                                 |
| Features  | src/lib/features/                      | 특정 기능 구현 (각 기능별 폴더에 세그먼트 포함)                                       |
| Widgets   | src/lib/widgets/                       | 재사용 가능한 UI 블록                                                      |
| Pages     | src/routes/                            | 라우팅되는 페이지 컴포넌트 (각 페이지별 폴더 구조 활용)                                   |
| Processes | src/lib/features/ 또는 src/lib/services/ | 복잡한 비즈니스 로직 (현재는 features 또는 별도 서비스 레이어에서 관리)                      |

이러한 매핑 전략을 통해 SvelteKit 프로젝트에서 FSD의 장점을 최대한 활용하면서 프레임워크의 특징과 자연스럽게 통합되는 구조를 구축할 수 있습니다.

# SvelteKit에서 FSD를 사용할 때의 이점

SvelteKit 프로젝트에 기능 분할 설계(FSD)를 적용하면 다음과 같은 여러 가지 중요한 이점을 얻을 수 있습니다.

### 코드의 조직화 및 유지보수 용이성 향상

FSD는 코드를 기능 단위로 명확하게 분리하여 관련된 파일들을 한곳에 모아 관리할 수 있도록 합니다. 이는 프로젝트 규모가 커지더라도 특정 기능을 쉽게 찾고 이해할 수 있도록 도와주어 코드베이스를 탐색하고 유지보수하는 데 필요한 시간과 노력을 줄여줍니다. 또한, 레이어 기반의 구조는 애플리케이션의 관심사를 명확하게 분리하고 전체적인 아키텍처를 파악하는 데 용이하며 9, 낮은 결합도는 특정 기능을 수정하거나 변경할 때 다른 부분에 미치는 영향을 최소화하여 유지보수성을 크게 향상시킵니다. 각 레이어와 슬라이스의 책임이 명확하게 분리되어 있어, 문제 발생 시 해당 영역의 코드만 집중적으로 검토하여 디버깅을 용이하게 합니다.

### 기능별 독립성 및 재사용성 증대

FSD는 각 기능을 독립적인 단위로 개발하고 테스트할 수 있도록 지원하여 개발 효율성을 높입니다. shared 레이어를 통해 공통으로 사용되는 코드들을 한곳에서 관리하고 재사용함으로써 코드의 중복을 줄이고 일관성을 유지할 수 있습니다. 또한, 독립적인 기능 단위로 개발된 코드는 필요에 따라 다른 프로젝트나 애플리케이션에서도 재사용될 가능성을 높여 전반적인 개발 생산성을 향상시킵니다.

### 개발 팀 협업 효율성 증대

코드를 기능 단위로 분리함으로써 여러 개발자가 독립적인 기능을 동시에 작업하는 것이 용이해집니다. 각 개발자는 자신이 담당하는 기능에 집중하여 개발하고, 다른 기능에 미치는 영향을 최소화할 수 있습니다. 또한, 명확하게 정의된 프로젝트 구조는 새로운 개발자가 프로젝트에 합류했을 때 빠르게 코드베이스를 이해하고 적응하는 데 도움을 주어 팀 전체의 협업 효율성을 향상시킵니다.

### 프로젝트 확장성 확보 및 장기적인 유지보수 관점에서의 이점

FSD는 작은 규모의 프로젝트에서 시작하여 소프트웨어 규모가 커짐에 따라 점진적으로 적용할 수 있는 유연성을 제공합니다. 새로운 기능을 추가할 때 해당 기능과 관련된 코드들을 새로운 슬라이스 내에 독립적으로 구성할 수 있어 코드베이스의 복잡성을 효과적으로 관리하며 확장이 용이합니다. 또한, 향상된 유지보수성은 장기적인 프로젝트 관리 비용을 절감하고 안정적인 성장을 가능하게 합니다.

요약하자면, SvelteKit에서 FSD를 사용하면 코드를 기능 중심으로 체계적으로 조직화하고, 레이어와 슬라이스를 통해 관심사를 분리하며, 엄격한 의존성 관리를 통해 유지보수성과 확장성을 높이고, 개발자 간의 협업을 증진시키는 데 큰 이점을 얻을 수 있습니다.

# SvelteKit에서 FSD를 사용할 때의 문제점 및 고려 사항

SvelteKit 프로젝트에 기능 분할 설계(FSD)를 적용하는 것은 많은 이점을 제공하지만, 동시에 몇 가지 문제점과 고려해야 할 사항들이 존재합니다.

### 초기 설정 및 학습 곡선

FSD는 레이어, 슬라이스, 세그먼트와 같은 새로운 개념을 도입하므로, 개발팀이 이 아키텍처를 이해하고 SvelteKit에 적용하는 방법을 학습하는 데 시간이 소요될 수 있습니다. 특히 FSD를 처음 접하는 개발자들에게는 초기 설정과 기본적인 규칙을 이해하는 데 어려움이 있을 수 있습니다.

### 프로젝트 규모에 따른 폴더 구조 복잡성 증가 가능성

작은 규모의 프로젝트에서는 FSD를 무리하게 적용하면 오히려 코드 구조가 더 복잡해지고 불필요한 오버헤드가 발생할 수 있습니다. 따라서 프로젝트의 규모와 복잡성에 맞춰 적절한 수준으로 FSD를 적용하는 것이 중요합니다.

### SvelteKit의 특정 기능과의 잠재적인 충돌 가능성

FSD의 엄격한 구조는 SvelteKit의 특정 기능, 특히 파일 기반 라우팅과 같은 기능과 잠재적으로 충돌할 수 있습니다. 예를 들어, Next.js와 FSD를 함께 사용할 때 라우팅 방식에서 충돌이 발생한 사례가 있으며 7, SvelteKit에서도 유사한 문제가 발생할 수 있으므로 주의가 필요합니다.

### FSD 아키텍처 규칙의 엄격한 준수 필요성

FSD의 효과를 제대로 보기 위해서는 레이어 간의 의존성 규칙과 같은 아키텍처 규칙을 엄격하게 준수해야 합니다. 이를 위해서는 개발팀 전체가 FSD의 규칙을 정확히 이해하고 개발 과정에서 이를 철저히 지켜야 합니다. 규칙을 위반할 경우 의존성 그래프가 복잡해져 유지보수가 어려워질 수 있습니다.

### 기존 SvelteKit 프로젝트에 FSD를 점진적으로 도입하는 경우의 어려움

기존의 구조화되지 않은 SvelteKit 프로젝트에 FSD를 점진적으로 도입하는 것은 어려울 수 있습니다. FSD의 기능 단위 분할 방식은 프로젝트 전체 구조에 영향을 미치므로, 부분적인 도입보다는 새로운 프로젝트에 적용하는 것이 더 효과적일 수 있습니다. 점진적으로 도입하려는 경우, 명확한 전략과 충분한 계획이 필요합니다.

### 데이터 접근 방식의 복잡성 증가
FSD는 레이어 간의 엄격한 import 규칙을 적용하여 데이터 접근 및 검색 로직을 하위 레이어 (shared 및 entities)로 강제합니다. 이는 최종적으로 프로젝트 구조를 개선하는 데 도움이 되지만, 초기에는 데이터 접근 방식을 설계하는 데 더 많은 고민이 필요할 수 있으며, 온라인에서 흔히 볼 수 있는 간단한 예제들과 달라 혼란을 야기할 수 있습니다.

### 단위 테스트 코드 작성의 잠재적 어려움

FSD에서 가장 하위 레이어인 shared조차 외부 의존성으로부터 자유롭지 못하기 때문에 단위 테스트 코드 작성이 복잡해질 수 있습니다. 이는 각 단위 테스트를 어떻게 작성하고 강제할 것인지에 대한 고민을 필요로 합니다.

이러한 문제점과 고려 사항들을 충분히 인지하고, 프로젝트의 특성과 개발팀의 역량에 맞춰 FSD를 신중하게 적용하는 것이 중요합니다.

## SvelteKit 에 적합한 FSD 구조 제안

앞서 분석한 내용을 바탕으로, SvelteKit 프로젝트에 적용하기에 가장 적합한 FSD 폴더 구조를 다음과 같이 제안합니다. 이 구조는 SvelteKit의 표준 폴더 구조와 FSD의 핵심 원칙을 조화롭게 통합하여 개발 효율성과 유지보수성을 모두 높이는 것을 목표로 합니다.

  
```sh
src/  
├── app/                         # (선택 사항) 전역 레이아웃 및 훅  
│   └── +layout.svelte  
│   └── hooks.server.js  
│   └── hooks.client.js  
├── lib/                         # 애플리케이션 핵심 로직 및 재사용 가능 코드  
│   ├── shared/                  # 여러 레이어에서 재사용 가능한 UI, 유틸리티 등  
│   │   └── ui/  
│   │   └── utils/  
│   │   └── assets/  
│   │   └── types/  
│   │   └── api/  
│   ├── entities/                # 핵심 비즈니스 모델 및 관련 로직 (도메인별 폴더로 세분화)  
│   │   └── user/  
│   │   └── product/  
│   │   └──...  
│   ├── features/                # 특정 기능 구현 (기능별 폴더, 내부에 ui, model, api 등 세그먼트 포함)  
│   │   └── auth/  
│   │       ├── ui/  
│   │       ├── model/  
│   │       └── api/  
│   │   └── product-search/  
│   │       ├── ui/  
│   │       ├── model/  
│   │       └── api/  
│   │   └──...  
│   └── widgets/                 # 재사용 가능한 UI 블록 (기능 조합)  
│       ├── product-card/  
│       └── user-profile/  
├── routes/                      # 라우팅 및 페이지 컴포넌트 (비즈니스 도메인 또는 기능별 폴더 구조 활용)  
│   ├── (app)/                    # 공통 레이아웃 적용 그룹  
│   │   ├── home/  
│   │   │   └── +page.svelte  
│   │   └── users/  
│   │       ├── +page.svelte  
│   │       └── [id]/  
│   │           └── +page.svelte  
│   ├── auth/  
│   │   ├── login/  
│   │   │   └── +page.svelte  
│   │   └── register/  
│   │       └── +page.svelte  
│   └── +layout.svelte           # 애플리케이션 기본 레이아웃 (app/layout.svelte가 없을 경우)  
└──...  
```


각 FSD 계층은 다음과 같이 SvelteKit의 폴더 및 파일 구조와 연동됩니다.

- [[#App|App]]: 선택적으로 src/app/ 폴더를 생성하여 전역 레이아웃 컴포넌트(+layout.svelte)와 훅(hooks.server.js, hooks.client.js)을 관리합니다. src/app/ 폴더가 없는 경우, 최상위 src/ 폴더에 이 파일들을 위치시킬 수 있습니다.
- [[#Shared|Shared]]: src/lib/shared/ 폴더는 재사용 가능한 UI 컴포넌트(ui/), 유틸리티 함수(utils/), 이미지 및 폰트와 같은 자산(assets/), 타입 정의(types/), 그리고 공통 API 클라이언트(api/) 등을 포함합니다.
- [[#Entities|Entities]]: src/lib/entities/ 폴더는 핵심 비즈니스 모델을 나타내는 폴더들을 포함합니다. 각 엔티티 (예: user, product) 별로 하위 폴더를 생성하고, 그 안에 데이터 모델 정의 및 관련 로직을 담습니다.
- [[#Features|Features]]: src/lib/features/ 폴더는 애플리케이션의 각 기능을 폴더별로 관리합니다. 각 기능 폴더 (예: auth, product-search) 내에는 UI 컴포넌트(ui/), 비즈니스 로직 및 상태 관리(model/), 그리고 API 관련 코드(api/)를 위한 세그먼트 폴더를 구성합니다.
- [[#Widgets|Widgets]]: src/lib/widgets/ 폴더는 하나 이상의 features 또는 entities를 조합하여 만들어진 재사용 가능한 UI 블록들을 포함합니다. 예를 들어, product-card/는 상품 정보를 표시하는 위젯, user-profile/은 사용자 프로필 정보를 보여주는 위젯이 될 수 있습니다.
- [[#Pages|Pages]]: src/routes/ 폴더는 애플리케이션의 라우팅 및 페이지 컴포넌트를 관리합니다. 비즈니스 도메인 또는 기능별로 폴더를 구성하여 FSD 슬라이스를 반영합니다. 그룹 레이아웃((app)/)을 활용하여 공통 레이아웃을 적용하고 관련 페이지들을 묶을 수 있습니다.
- [[#Processes|Processes]]: 복잡한 비즈니스 로직은 src/lib/features/ 내의 특정 기능 슬라이스 또는 src/lib/services/와 같은 별도의 폴더에서 관리합니다.

제안된 구조는 명확한 관심사 분리, 높은 재사용성, 용이한 유지보수, 그리고 체계적인 확장성을 특징으로 합니다. 각 레이어의 책임이 명확하게 정의되어 있어 코드의 이해도가 높아지고, 기능별로 코드가 분리되어 있어 협업 효율성을 증대시킵니다.

# 제안된 FSD 구조의 실용성 증명

제안된 FSD 구조가 SvelteKit에서 실제로 사용 가능한 구조임을 증명하기 위해, 간단한 예시 SvelteKit 프로젝트 구조를 제시하고, 기존에 FSD를 적용한 SvelteKit 프로젝트 사례를 인용합니다.

### SvelteKit 프로젝트 구조 예시

```sh
src/  
├── app/  
│   └── +layout.svelte  # 애플리케이션의 기본 레이아웃을 정의하는 컴포넌트입니다.
├── lib/  
│   ├── shared/  
│   │   └── ui/  
│   │       └── Button.svelte  # 프로젝트 전반에서 재사용 가능한 버튼 컴포넌트입니다.
│   ├── entities/  
│   │   └── user/  
│   │       └── user.ts  # 사용자 데이터 모델 및 관련 타입을 정의합니다.
│   └── features/  
│       └── auth/  
│           ├── ui/  
│           │   └── LoginForm.svelte  # 사용자 로그인 폼 컴포넌트입니다.
│           └── model/  
│               └── auth.ts  # 로그인 관련 비즈니스 로직 및 상태 관리를 담당합니다.
└── routes/  
    └── login/+page.svelte  # `/login` 경로에 해당하는 페이지 컴포넌트로, LoginForm을 사용하여 로그인 기능을 제공합니다.
```

### 기존에 FSD를 적용한 SvelteKit 프로젝트 사례

- [mishamyrt/feature-sliced-svelte](https://github.com/mishamyrt/feature-sliced-svelte): 이 GitHub 저장소는 Feature-Sliced Design 아키텍처에 따라 Svelte 프로젝트를 유지 관리하는 데 유용한 유틸리티를 제공합니다. 이는 SvelteKit에서도 FSD를 적용하는 데 참고할 수 있는 좋은 예시입니다.
- [falkomerr/sveltekit-starter](https://github.com/falkomerr/sveltekit-starter): 이 저장소는 SvelteKit과 FSD를 통합한 스타터 프로젝트입니다. 기본적인 FSD 폴더 구조를 갖추고 있어 SvelteKit 프로젝트에 FSD를 적용하는 방법을 보여줍니다.
- [mmmoli/sveltekit-fsd-structure](https://sveltethemes.dev/mmmoli/sveltekit-fsd-structure): Svelte Themes에서 제공하는 이 예제 프로젝트는 SvelteKit과 Feature-Sliced Design을 결합한 구조를 보여줍니다. 실제 프로젝트에서 FSD 구조가 어떻게 구성될 수 있는지 구체적인 아이디어를 얻을 수 있습니다.

이러한 예시들은 SvelteKit 프로젝트에 FSD를 적용하는 것이 실제로 가능하며, 코드 구조를 체계화하고 유지보수성을 높이는 데 효과적임을 보여줍니다.

# 맺으며

SvelteKit 프로젝트에 적합한 기능 분할 설계(FSD) 구조를 제시하고, 그 적용 방안을 상세하게 알아보았습니다. FSD는 대규모 프론트엔드 애플리케이션의 복잡성을 관리하고 유지보수성과 확장성을 향상시키는 데 매우 효과적인 아키텍처 패턴입니다. SvelteKit은 파일 시스템 기반 라우팅, 재사용 가능한 코드를 위한 $lib 디렉토리, 그리고 전역 설정 및 로직 처리를 위한 훅과 같은 강력한 기능들을 제공하여 FSD를 적용하기에 매우 적합한 환경을 제공합니다.

제안된 FSD 구조는 SvelteKit의 표준 폴더 구조와 FSD의 핵심 원칙을 조화롭게 통합하여, 코드의 조직화, 재사용성, 협업 효율성, 그리고 확장성을 향상시킬 수 있습니다. 물론 FSD를 SvelteKit 프로젝트에 적용하는 데에는 초기 학습 비용, 잠재적인 복잡성 증가, 그리고 프레임워크 특정 기능과의 조화 등 고려해야 할 사항들이 존재합니다. 따라서 프로젝트의 규모, 팀의 숙련도, 그리고 애플리케이션의 특성을 종합적으로 고려하여 FSD 도입 수준을 결정하고, 팀 내 FSD 규칙 및 컨벤션에 대한 충분한 합의를 이루는 것이 중요합니다. 또한, SvelteKit의 특정 기능과의 조화로운 사용 전략을 모색하고, 지속적인 학습과 커뮤니티 참여를 통해 FSD에 대한 이해도를 높이는 노력이 필요합니다.

향후 FSD와 SvelteKit 관련 연구는 더욱 활발해질 것으로 예상되며, 두 기술의 장점을 결합한 최적의 개발 방식에 대한 지속적인 탐구가 필요합니다. 본 보고서가 SvelteKit 개발자들이 FSD를 이해하고 실제 프로젝트에 적용하는 데 유용한 길잡이가 되기를 바랍니다.

# 참고 자료

1. velog.io, 4월 3, 2025, [링크](https://velog.io/@clydehan/FSDFeature-Sliced-Design-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C#:~:text=Feature%2DSliced%20Design\(FSD\),%EA%B3%BC%20%EA%B4%80%EB%A1%80%EC%9D%98%20%EB%AA%A8%EC%9D%8C%EC%9D%B4%EB%8B%A4.)
2. FSD(Feature-Sliced Design) 완벽 가이드 - velog, 4월 3, 2025, [링크](https://velog.io/@clydehan/FSDFeature-Sliced-Design-%EC%99%84%EB%B2%BD-%EA%B0%80%EC%9D%B4%EB%93%9C)
3. 둘러보기 | Feature-Sliced Design, 4월 3, 2025, [링크](https://feature-sliced.design/kr/docs/get-started/overview)
4. Feature-Sliced Design(FSD) 도입기 - source-code-lean - 티스토리, 4월 3, 2025, [링크](https://23life.tistory.com/entry/Feature-Sliced-DesignFSD-%EB%8F%84%EC%9E%85%EA%B8%B0)
5. Introduction • Docs • Svelte, 4월 3, 2025, [링크](https://svelte.dev/docs/kit/)
6. svelte kit 폴더 구조 및 설정 - velog, 4월 3, 2025, [링크](https://velog.io/@sting01/svelte-kit-%ED%8F%B4%EB%8D%94-%EA%B5%AC%EC%A1%B0)
7. (번역) 기능 분할 설계 - 최고의 프런트엔드 아키텍처 - emewjin.log, 4월 3, 2025, [링크](https://emewjin.github.io/feature-sliced-design/)
8. 니들이 FSD를 알아?? - velog, 4월 3, 2025, [링크](https://velog.io/@carloskim/%EB%8B%88%EB%93%A4%EC%9D%B4-FSD%EB%A5%BC-%EC%95%8C%EC%95%84)
9. FSD 아키텍처 알아보기 - velog, 4월 3, 2025, [링크](https://velog.io/@jay/fsd)
10. Sveltekit Fsd Structure | Svelte Themes, 4월 3, 2025, [링크](https://sveltethemes.dev/mmmoli/sveltekit-fsd-structure)
11. Setting Up a Clean Project Structure in typescript | by Michele ..., 4월 3, 2025, [링크](https://medium.com/@michele.memoli/setting-up-a-clean-project-structure-in-typescript-23bcb1220daf)
12. SvelteKit(스벨트킷) 튜토리얼 - 3 - 프로젝트 구조 - YouTube, 4월 3, 2025, [링크](https://www.youtube.com/watch?v=kdKx5KCLNuI)
13. NextJS와 함께 사용하기, 4월 3, 2025, [링크](https://feature-sliced.design/kr/docs/guides/tech/with-nextjs)
14. 가장 복잡한 프런트엔드 아키텍처: 기능 분할 디자인에 대해 알아야 할 사항 - HackerNoon, 4월 3, 2025, [링크](https://hackernoon.com/lang/ko/%EA%B8%B0%EB%8A%A5-%EC%8A%AC%EB%9D%BC%EC%9D%B4%EC%8A%A4-%EB%94%94%EC%9E%90%EC%9D%B8%EC%97%90-%EB%8C%80%ED%95%B4-%EC%95%8C%EC%95%84%EC%95%BC-%ED%95%A0-%EA%B0%80%EC%9E%A5-%EB%B3%B5%EC%9E%A1%ED%95%9C-%ED%94%84%EB%9F%B0%ED%8A%B8%EC%97%94%EB%93%9C-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98)
15. FSD; Feature-Sliced Design에 대해 - Medium, 4월 3, 2025, [링크](https://medium.com/@junep/fsd-feature-sliced-design%EC%97%90-%EB%8C%80%ED%95%B4-11a7b88d5c9e)
16. 폴더 구조로 변경 · Issue #334 · Developer-Sauna-Club ... - GitHub, 4월 3, 2025, [링크](https://github.com/Developer-Sauna-Club/TMI_HOMERS_FE/issues/334)
17. mishamyrt/feature-sliced-svelte: Control of FSD with Svelte - GitHub, 4월 3, 2025, [링크](https://github.com/mishamyrt/feature-sliced-svelte)
18. falkomerr/sveltekit-starter: Starter for SvelteKit with FSD ... - GitHub, 4월 3, 2025, [링크](https://github.com/falkomerr/sveltekit-starter)