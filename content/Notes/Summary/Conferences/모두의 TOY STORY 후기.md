---
title: 모두의 TOY STORY 후기
description: "사이드 프로젝트 관련 세션 후기"
date: 2019-07-14
draft: false
---

# Intro

4월부터 본업과 별개로 친구들과 2주에 한번씩 모여 진행하고 있는 프로젝트가 있다. 간단한 게시판을 제작하는 것이 목표지만 진도가 잘 나가지 않는다. 각자 본업이 따로 있기에 사이드 프로젝트에 집중하기 어려운 것이 가장 큰 이유다.

백엔드 개발자로 근무하면서 업무 외적으로 다른 일을 한다는 것이 부담될 때가 있지만, 사이드 프로젝트를 통해 인사이트를 얻을 때면 하길 잘했다고 생각하게 된다. 그러나 한편으로는 사이드 프로젝트를 업무와 관련이 있는 기술 스택으로 진행했으면 더 도움이 되지 않았을까 하는 아쉬움도 든다.

결론적으로 사이드 프로젝트와의 관계를 어떻게 가져가야 할지가 최근 나의 큰 고민이다. 그러던 중 관련 세션이 열린다고 하여 참여해 보았다.

이벤트 정보 링크: [👉클릭👈](https://festa.io/events/364)

# SUMMARY

*참고: tags - 세션별 키워드, summary - 내용 한 줄 요약, note - 세션 중 적은 내용*

_개인적으로 낯선 도메인의 발표(딥러닝, 게임 등)는 내용을 적지 못했습니다._

## 최고의 이벤트 플랫폼을 향하여, and beyond

**tags:** `festa`, `목표 설정`

**summary:** 분명한 지향점을 가지고 프로젝트를 진행하는 것이 지속성의 비결이다

- **note:**
    - **Festa 운영 중**
    1. **페스타의 탄생**
        - 2017년 스터디 모집 후 프로젝트 팀으로 전환
        - 행사용 통합 툴을 만들자고 생각
        - 어드민용 툴 개발 시도
        - 지라 of conference를 만들자: 모든 행사 관련 정보를 일원화할 수 있는 사이트 개발
        - 사용하고 싶은 기술을 마음껏 사용
        - 마감 기간 없이 진행
        - Devfest 진행 기간과 겹쳐 이를 수용할 수 있는 사이트 필요
        - ONOFFMIX 이용
        - 피봇하여 티케팅 사이트로 변경, 1달 마감 기간
        - 로그인 후 티켓을 구매할 수 있는 사이트 개발
        - EDD(event driven development): 이벤트가 하나 등록되면 그 이벤트에 맞춰 개발
        - 파이콘은 일주일도 안 걸렸다는 소문
        - 소득 증빙을 위해 대행업체 이용
        - 평일에는 각자, 주말에 모여서 위워크에서 작업
        - 열정과 보람을 느끼며 의미 있는 것을 만듦
        - 디자인도 스케치를 사용하여 하루 만에 완료
        - 일본 여행 중에도 코딩 (사케코딩)
        - 연차가 낮고 경력이 없었던 나에게 큰 일이었음
        - 체계가 없는 상태에서 버그 발생으로 일주일 동안 집에 들어가지 못함
        - m4large 사용으로 안정화
        - 실제 결제 성공 시 기쁨을 느낌
        - 그러나 슬슬 버그들이 많이 보임 (중간 과정에서 에러나면 처음부터 다시)
        - **회고:** 너무 힘들었음, 회사에 더 집중하자는 생각
        - **기술적 인사이트:**
            - 다른 사람들이 많이 쓰는 것은 이유가 있다
            - 아무거나 하지 말고, 약속이 많이 되어있는 라이브러리 사용

    - **스스로의 부족함 깨달음**
    - 책임감 증가
        - **협업의 어려움:**
            - 최고의 인재들을 모아도 설득이 어렵고 돈을 주는 것도 아니라서 힘듦
            - 데드라인은 발전의 원동력

    2. **새로운 본격적인 시작**
        - 사용자가 있다는 소식에 다시 열정이 샘솟음
        - 새로 멤버를 모집하고 기술 스택도 변경
        - MVP: 일정 기간 동안 얼마큼 개발할 수 있는지 측정
        - 협업 툴: 슬랙, 지라, 깃헙, 지수트
        - 사업자 문제, 보증보험, 정산을 위한 기초 자본금, 비즈니스 모델 문제 발생
        - **프로젝트 매니징의 어려움:** 슬럼프, 번아웃, 프로젝트 중단 위기 극복 필요
        - **사이드 프로젝트의 한계:** 인력과 시간 부족, 가볍게 시작하면 가볍게 끝남
        - **운영 이슈:** 매일 발생, 프로젝트 축소 및 집중 투입 (현재 festa는 사이드가 아닌 상태)
    3. **회고**
        - 최고의 사용자 경험을 제공하고자 함
        - 수익은 거의 카드사에서 가져가 남는 것이 없음
        - 오프라인 이벤트 코디네이터 역할

## 기술에 공유를 더하다: Daily-DevBlog

**tags:** `Mailing Service`, `Pivot`

**summary:** 내가 하고 싶고 필요한 프로젝트를 해야 지치지 않는다.

- **note:**
    - **기술 블로그 구독 서비스**
        - **사이드 프로젝트란?** 회사 업무와 별도로 진행, 주제와 목표, 일정에 제한 없음
        - **왜 할까?** 내가 필요해서
        - **사이드 프로젝트를 왜 만들었는가?** SNS 챙겨보기 힘들고, 자꾸 딴짓하게 됨
        - 파이썬 사용 (자바에서 파이썬으로 전환)
        - 서버: 헤로쿠 → python anywhere → 라즈베리파이 → AWS
        - 일주일간 밤을 새며 제작

    - **문제**
        - 메일링 속도 느림: 백명에게 보내는데 1시간 소요, 천명에게 보낼 때 메모리 1G, CPU 1개 사용
        - 메일 본문에 CSS, JS 사용 불가 → emogrifier 사용
        - 구글 SMTP 하루 500개 발송 제한 → 도메인 적용하여 발송
        - 엘라스틱서치 모니터링 → 비용 발생
        - 필터링, 카테고라이징 → 주간 서비스로 전환
        - 과거 글 아카이브 페이지 제작

    - **1년간 성과**
        - 구독자 수 약 1600명
        - 프리티어 종료
        - 돈은 안되고 있음

    - **느낀 점**
        - 강제 학습
        - 회사와 별도로 진행, 서비스에 대한 책임감 증가
        - 경험으로부터 나온 인사이트를 팀에 적용

## 전직 리눅스 오타쿠의 사이드 프로젝트 삽질기

**tag:** `KLDP`, `열정`

**summary:** 1만 시간의 법칙에 따라 한 가지에 많은 시간을 쏟으면, 남들이 가질 수 없는 인사이트를 얻을 수 있다.

- **note:**
    - **리눅스에 관심을 갖게 된 계기:** 여자친구와 헤어지고 정신을 쏟을 곳 필요
    - **서사기**
        - (1996년) 학교에서 아파치 서버 계정 발급
        - 야후 코리아 모방, table 만들기 학습
        - 다음 모방, table에 색 넣기 학습
        - 게시판 추가
        - (2001) 테이블 조종 가능
        - (2014~) KLDP 활동
        - (2016) 20주년 모임
        - 일을 제대로 하지 않음
    - **회고**
        - Linux vs Delphi: 델파이를 팠으면 이 자리에 못 섬 (럭키)
        - Developer Relations: 사이드 프로젝트 진행 (럭키)
    - **나는 정말 열심히 했다**
        - 삼성 진급 2번 실패
        - 하루 네 시간 이상 프로젝트에 힘을 쏟음 (한달 연수기간, 논산 훈련 제외)
        - 기숙사 전화선, 터미널, ADSL, 피씨방, 처갓집 등 장소와 관계없이 일함
    - **기술**
        - 문제를 해결하다 보면 삽질을 하게 되고, 깊이 파고들며 문제를 스스로 해결하지 못하는 상황 발생

## 눈누의 노란 사춘기

**tag:** `운영이슈`, `기술부채`

**summary:**
1. 프로젝트 자금 계획은 미리 세워야 한다.
2. 기술 부채를 막을 수는 없으므로, 부채 상환 계획을 잘 세워야 한다.

- **note:**
    - **눈누가 당면한 문제들**
        1. **오류 대응 미숙**
            - 시작부터 열광적인 반응으로 다양한 채널에 노출, 갑작스러운 이용자 증가
            - 오류 대응 어려움, 외부 도움 요청 반복 (반나절간 서버 다운)
            - 크루 모집
        2. **운영비 발생**
            - 멋사에서 출발해 AWS 1000 credit으로 2년 버틸 계획이었으나 1년 만에 소진
            - 비정기적 후원금, 비정기적 크라우드 펀딩 방식에서 후원사 유치 (`컬처랩`, `멋사`)
           - 과다한 용량 설정 줄이고, EC2를 두 개 띄워 Jenkins 사용
           - **결론:**
               1. 팀이 서비스를 감당 못할 경우 신중하고 빠르게 팀원 충원
               2. 자금 문제는 미리 준비

    - **부채**
        - **원인:** 개발자의 숙련도 부족, 사이드 프로젝트의 한계, 급박한 상황
        - **결과:** 개발자의 의욕 저하, 서비스 성장 정체, 해결되지 않는 문제 발생
    - **눈누 2.0 개발**
        - 각자 잘하는/하고 싶은 개발 진행
        - 일정 관리, 테스트 필요
    - **느낀 점:** 적절한 상환 계획이 중요

## 지속 가능한 사이드 프로젝트를 위한 시행착오

**tag:** `documentation`, `communication`

**summary:** 프로젝트 시작 가이드 마련, 팀원들과 생각 공유, 프로젝트 품질 기준선 높이기를 통해 지속 가능한 사이드 프로젝트를 만들 수 있다.

- **note:**
    1. **소개:** 로제타스톤
    2. **새로운 팀원 맞이하기**
        - 프로젝트 규모가 커지면 혼자서 감당하기 어려움
        - 구조 이해에 어려움을 겪는 팀원 지원 필요
        - **해결책:** 튜토리얼 문서, 예제 코드, API 문서 제공
    3. **각자의 마음속은 동상이몽**
        - 목표는 같지만 방법이 다름
        - **해결책:** 1달에 1번 진행 상황 공유, 논의 공간 마련
    4. **프로젝트 관리 기준선**
        - 빌드, 커밋, 코드 스타일, 품질, 문서 관리 기준 정립
        - 모든 OS에서 빌드 가능, 코드 리뷰 후 머지 가능 등 기준 설정
    5. **정리:**
        - 지속성 중요
        - 새로운 팀원 지원
        - 가이드 필요
        - 팀원 간 논의 시간 필요
        - 프로젝트 관리 기준선 설정 중요

## SaaS: Service as a Side project

**tag:** `디자인`, `자동화`

**summary:** 자신이 할 수 있는 기술을 이용하고, 역량 밖의 일(디자인, 배포)은 전문가에게 맡기자

- **note:**
    - **하지 말아야 할 것들:** 하드웨어, 앱 (배포 문제)
    - **짤봇 개발 방법:**
        - API 오픈, 슬랙 명령어 사용
        - 배포 어려움, 빌드 자동화 (젠킨스)
    - **Lessons:**
        - CICD 필수
        - 디자인 협업 필요
        - 좋아하고 필요한 것 선택
        - 크롤링 가능한 주제 선택
        - 친한 사람들과 함께하지만 큰 기대는 하지 말자
        - 역량을 보완해줄 사람 필요
        - 느슨하게 오래가는 팀이 좋음
        - 모티베이션을 주는 방향 모색
        - 부트업 시간이 짧은 기술 선택
        - 피쳐 개발이 쉬운 기술 선택 (RDBMS 피하기)
        - 단순한 구조 유지
        - 데이터 > 개발 시간 > 성능
        - 새로운 기술은 파운더가 선택하지 않음
        - 워라밸 유지: 하루 4-7시간 작업, 휴식 중요
        - 자동화 핵심

# Outro

사이드 프로젝트에 대한 다양한 경험을 듣고 인사이트를 얻을 수 있는 시간이었다. 오늘 이벤트에서 가장 많이 등장한 단어는 '열정'이다. 사이드 프로젝트는 내가 중심이 되어 하고 싶은 대로 하기 때문에 열정을 다른 어떤 개발 업무보다 더 많이 쏟을 수 있다. 다른 이들의 경험을 들으며 나도 내가 열정을 쏟고 싶은 여러 프로젝트들을 떠올렸다.

사이드 프로젝트의 한계는 명확하다. 우선 열정이란 창립자에게 강력하게 작용한다는 점이다. 팀으로 프로젝트가 운영되는 경우, 진행 중 다양한 어려움으로 인해 진도가 나가지 않는 경우 등 사이드 프로젝트들은 사이드로 끝나는 경우가 태반이다. 발표자들은 본업과 동시에 많은 시간과 자원을 쏟아 사이드 프로젝트들을 진행하면서도 진행이 더딜 때가 있다며 회고했다. 나는 일주일에 약 10시간 정도만 사이드 프로젝트에 투자하고 있다. 그들과 비교해 매우 적은 시간이라는 생각이 들었다.
