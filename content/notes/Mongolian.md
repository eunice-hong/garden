---
title: Mongolian
aliases:
  - Mongolian
  - 몽골어
  - モンゴル語
draft: true
tags:
  - 🌱
  - chronology
---

2014-03-03

The first encountered the Mongolian alphabet.

2015-08-24

Life in Ulaanbaatar began. 
Learned the “living” Mongolian language.

2018-08-16

Since the day I graduated from Mongolian Language department, there has been no chance to speak in Mongolian.



```mermaid
timeline
    title Powertools for AWS Lambda (Python) CI/CD pipeline

    section Continuous Integration
    Project setup <br> (make dev)   : Code checkout
                                    : Virtual environment
                                    : Dependencies
                                    : Git pre-commit hooks
                                    : Local branch
                                    : Local changes
                                    : Local tests

    Pre-commit checks <br> (git commit)     : Merge conflict check
                                            : Trailing whitespaces
                                            : TOML checks
                                            : Code linting (standards)
                                            : Markdown linting
                                            : CloudFormation linting
                                            : GitHub Actions linting
                                            : Terraform linting
                                            : Secrets linting

    Pre-Pull Request <br> (make pr)     : Code linting
                                        : Docs linting
                                        : Static typing analysis
                                        : Tests (unit|functional|perf)
                                        : Security baseline
                                        : Complexity baseline
                                        : +pre-commit checks

    Pull Request <br> (CI checks)   : Semantic PR title check
                                    : Related issue check
                                    : Acknowledgment check
                                    : Code coverage diff
                                    : Contribution size check
                                    : Contribution category check
                                    : Dependency vulnerability check
                                    : GitHub Actions security check
                                    : +pre-pull request checks

    After merge <br> (CI checks)    : End-to-end tests
                                    : Longer SAST check
                                    : Security posture check (scorecard)
                                    : GitHub Actions security check
                                    : Rebuild Changelog
                                    : Deploy staging docs
                                    : Update draft release

    section Continuous Delivery

    Source code anti-tampering  : Checkout release commit code
                                : Bump release version
                                : Seal and upload artifact

    Quality Assurance           : Restore sealed code
                                : +Continuous Integration checks

    Build                       : Restore sealed code
                                : Integrity check
                                : Build release artifact
                                : Seal and upload artifact

    Provenance                  : Detect build environment
                                : Generate SLSA Builder
                                : Verify SLSA Builder provenance
                                : Create and sign provenance
                                : Seal and upload artifact
                                : Write to public ledger

    Release                     : Restore sealed build
                                : Integrity check
                                : PyPi ephemeral credentials
                                : Publish PyPi
                                : Baking time

    Git tagging                 : Restore sealed code
                                : Integrity check
                                : Bump git tag
                                : Create temporary branch
                                : Create PR

    Lambda Layers               : Fetch PyPi release
                                : Build x86 architecture
                                : Build ARM architecture
                                : Deploy Beta
                                : Canary testing
                                : Deploy Prod

    Lambda Layers SAR           : Deploy Beta
                                : Deploy Prod

    Documentation               : Update Lambda Layer ARNs
                                : Build User Guide
                                : Build API Guide
                                : Rebuild Changelog
                                : Release new version
                                : Update latest alias
                                : Create temporary branch
                                : Create PR

    Post-release                : Close pending-release issues
                                : Notify customers
```


```mermaid
gantt
    title Proposed Terminal Releases 1.14-1.18
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b
    section Terminal 1.14
        Lock down & bake        :done, 2022-05-06, 2w
        Release 1.14            :milestone, 2022-05-24
    section Terminal 1.15
        Features                :done, a1, 2022-05-06, 4w
        Bugfix                  :active, a2, after a1  , 1w
        Lock down & bake        :after a2  , 1w
        Release 1.15            :milestone, 2022-06-21, 0
        1.15 becomes Stable     :milestone, after b3, 0
    section Terminal 1.16
        Features                :b1, after a2, 4w
        Bugfix                  :b2, after b1  , 2w
        Lock down & bake        :b3, after b2  , 2w
        Release 1.16            :milestone, after b3, 0
        1.16 becomes Stable     :milestone, after c3, 0
    section Terminal 1.17
        Features                :c1, after b2, 4w
        Bugfix                  :c2, after c1  , 2w
        Lock down & bake        :c3, after c2  , 2w
        Release 1.17            :milestone, after c3, 0
        1.17 becomes Stable     :milestone, after d3, 0
    section Terminal 1.18
        Features                :d1, after c2, 4w
        Bugfix                  :d2, after d1  , 2w
        Lock down & bake        :d3, after d2  , 2w
        Release 1.18            :milestone, after d3, 0
```


```mermaid
timeline
    title 나의 인생 연대기
    section 어린 시절
        태어남 : 1990-01-01
        첫 학교 입학 : 1996-03-01
        가족 이사 : 2000-06-15
    section 청소년기
        중학교 입학 : 2002-03-01
        첫 해외 여행 : 2005-08-20
        고등학교 졸업 : 2008-02-28
    section 대학
        대학교 입학 : 2008-03-02
        전공 변경 : 2010-09-01
        첫 인턴십 : 2012-06-01
        대학 졸업 : 2013-02-28
    section 직장 생활
        첫 직장 : 2013-03-05
        직장 이동 : 2016-08-15
        승진 : 2019-07-01
    section 현재
        새로운 취미 시작 : 2020-01-01
        현재 직장 : 2021-05-01

```


```mermaid
gantt
    title 나의 인생 연대기
    dateFormat  YYYY-MM-DD
    section 어린 시절
    태어남            :done, 1990-01-01, 1990-01-02
    첫 학교 입학      :done, 1996-03-01, 1996-03-02
    가족 이사         :done, 2000-06-15, 2000-06-16
    section 청소년기
    중학교 입학      :done, 2002-03-01, 2002-03-02
    첫 해외 여행      :done, 2005-08-20, 2005-08-21
    고등학교 졸업     :done, 2008-02-28, 2008-02-29
    section 대학 시절
    대학교 입학      :done, 2008-03-02, 2008-03-03
    전공 변경        :done, 2010-09-01, 2010-09-02
    첫 인턴십        :done, 2012-06-01, 2012-06-02
    대학 졸업        :done, 2013-02-28, 2013-03-01
    section 직장 생활
    첫 직장         :done, 2013-03-05, 2013-03-06
    직장 이동        :done, 2016-08-15, 2016-08-16
    승진            :done, 2019-07-01, 2019-07-02
    section 현재
    새로운 취미 시작 :done, 2020-01-01, 2020-01-02
    현재 직장        :done, 2021-05-01, 2021-05-02
```