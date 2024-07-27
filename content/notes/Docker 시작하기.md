---
title: Docker 시작하기
date: 2019-07-03
description: "TL;DR: 도커를 통해 애플리케이션 실행 환경을 복제하여, 테스트, 배포 등을 쉽게할 수 있다."
tags:
  - 🌿
  - docker
---

> TL;DR: 도커를 통해 애플리케이션 실행 환경을 복제하여, 테스트, 배포 등을 쉽게할 수 있다.

## 🙋‍♀️ Intro

Backend 개발자로 일하기 시작하면서 Docker의 중요성을 느끼고 있다. 주변에서 Docker를 사용하면 개발과 배포가 편리해진다는 이야기를 많이 들었다. 현재는 일부 기능만 사용 중이지만, 배포환경과 동일한 환경을 로컬에서 손쉽게 구성할 수 있어 매우 유용하다.

지금은 몇 가지 명령어만 사용하지만, Docker가 실제로 어떻게 동작하고, 왜 사용해야 하는지에 대해 더 깊이 알고 싶다. 학부 시절 Virtual Machine에 대해 잠깐 들은 적이 있는데, 이것과 어떻게 다른지에 대해 알고 싶다.

## 🤔 [가상화](https://ko.wikipedia.org/wiki/%EA%B0%80%EC%83%81%ED%99%94) VS [컨테이너화](https://ko.wikipedia.org/wiki/%EC%BB%A8%ED%85%8C%EC%9D%B4%EB%84%88%EB%A6%AC%EC%A0%9C%EC%9D%B4%EC%85%98) (Virtualization vs Containerization)

가상화와 컨테이너화는 소프트웨어가 구동될 환경을 생성한다는 공통점이 있다. 가상화는 가상화 소프트웨어(예: Virtualbox)를 이용하여 호스트 컴퓨터 안에서 또 다른 환경의 컴퓨터를 가상으로 생성하는 것이다. 컨테이너화는 Docker와 같은 플랫폼을 이용하여 프로그램을 실행할 수 있는 환경을 만든다.

### 가상머신

- 추상화된 하드웨어에서 [하이퍼바이저](https://ko.wikipedia.org/wiki/%ED%95%98%EC%9D%B4%ED%8D%BC%EB%B0%94%EC%9D%B4%EC%A0%80)를 통해 여러 서버가 동작
    - 하이퍼바이저: 호스트 컴퓨터에서 다수의 운영체제를 동시에 실행하기 위한 논리적 플랫폼
- 다양한 Linux 배포판을 실행할 수 있다.
- 가상머신을 켤 때 많은 시간과 자원이 소요된다.

### 컨테이너화

- Application 단계가 추상화되어 같은 OS에서 여러 컨테이너가 동작할 수 있다.
- 부팅 시 자원이 적게 요구되고 속도가 빠르다.
    - 하드웨어를 구현하지 않고, 파일 시스템과 애플리케이션을 실행하기 때문이다.
    - 작업 공간에 관계없이 컨테이너를 쉽게 지우고 새로 생성할 수 있다.

## 👬 Docker의 기본 개념

애플리케이션 코드와 [Provisioning](https://ko.wikipedia.org/wiki/%ED%94%84%EB%A1%9C%EB%B9%84%EC%A0%80%EB%8B%9D) Script 두 가지를 가지고 있다고 가정해보자. Provisioning Script는 호스트 시스템에서 실행할 수 있는 간단한 셸 스크립트로, 윈도우즈 워크스테이션에서 클라우드 내 전용 서버까지 어디서나 사용할 수 있다.

프로비저닝은 사용자의 요구에 맞게 시스템 자원을 할당, 배치, 배포해 필요 시 시스템을 즉시 사용할 수 있는 상태로 준비하는 것이다. 도커를 사용하면 프로젝트 코드 기반을 수정하지 않고도, 프로비저닝 측면에서 더 나은 워크플로우와 속도를 제공할 수 있다.

**Dockerfile**이 Provisioning Script의 역할을 대신하며, 애플리케이션 코드와 Dockerfile이 결합해 도커 **이미지(Image)**를 생성한다. 이미지는 프로그램 실행에 필요한 종속성과 설정을 담고 있는 파일이다. 도커 이미지로 실행되는 애플리케이션을 도커 **컨테이너(Container)**라 하며, **도커(Docker)**는 이러한 컨테이너를 생성하고 실행하는 플랫폼을 가리킨다.

도커 컨테이너를 통해 새로운 환경에서 애플리케이션을 실행할 수 있다. 즉, 자신의 컴퓨터에서 Linux나 다른 운영체제, 애플리케이션을 선언하고 실행할 수 있다. 또한 컴퓨터 환경 설정과 관계없이 컨테이너를 만들고(build) 실행(run)할 수 있다.

## 🏃‍♀️ Outro

VM과 Container의 차이, Dockerfile, Docker Image, Docker Container에 대해 알아보았다. VM은 켜고 끄는 데 많은 시간과 자원이 소요되지만, Docker는 쉽게 boot/terminate할 수 있다. 차후에는 도커와 도커를 이용한 쉬운 배포에 대해 알아보겠다.

## 🍒 Reference

- Muli, Joseph. *Beginning DevOps with Docker: Automate the Deployment of Your Environment with the Power of the Docker Toolchain*. Birmingham: Packt Publishing, 2018.