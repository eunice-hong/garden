---
title: "개발자를 위한 ChatGPT: 프롬프팅 엔지니어링"
description: "ChatGPT를 사용하는 방법을 알아봅니다."
date: 2023-05-06
draft: false
tags: 
  - 🌿
  - ChatGPT
  - OpenAI
  - AI
  - 프롬프팅 엔지니어링
---

# 시작하기 앞서

## 필요 지식

- 프로그래밍 언어 Python의 기본 문법을 알아야합니다.
- Jupyter Notebook 사용방법을 알아야합니다.

  

**학습 자료**

- Python 공식 홈페이지 - [https://www.python.org/](https://www.python.org/)
- 생활코딩: Python 입문 수업 - [https://opentutorials.org/course/4769](https://opentutorials.org/course/4769)
- 파이썬 코딩 도장: 46.2 주피터 노트북 사용하기- [https://dojang.io/mod/page/view.php?id=2457](https://dojang.io/mod/page/view.php?id=2457)

  

## 예제 실행 환경 설정하기

- Jupyter Notebook 실행 환경
    
    **==온라인으로 실행하기==**
    
      
    
    **로컬 컴퓨터에서 실행하기**
    
    1. 아래 두 가지 예제 저장소 중 하나를 선택합니다.
        1. 예제 모음 (한글): [https://github.com/eunice-hong/deeplearning-ai-chatgpt-prompt-ko](https://github.com/eunice-hong/deeplearning-ai-chatgpt-prompt-ko)
        2. 예제 모음 (영어): [https://github.com/eitansela/deeplearning-ai-chatgpt-prompt-eng](https://github.com/eitansela/deeplearning-ai-chatgpt-prompt-eng)
    2. 프로젝트를 다운로드 할 위치로 이동한 뒤,  
        다음 명령어를 통해 원하는 위치에서 프로젝트를 다운로드 받습니다.
        
        ==(한글버전 기준 예시입니다.)==
        
        ```
        cd ./location/you/want && git clone https://github.com/eunice-hong/deeplearning-ai-chatgpt-prompt-ko.git
        ```
        
    3. 프로젝트 위치로 이동합니다.
        
        ```
        cd ./deeplearning-ai-chatgpt-prompt-ko
        ```
        
    4. 프로젝트 실행에 필요한 라이브러리들을 설치합니다.
        
        ```
        pip install -r requirements.txt
        ```
        
    5. Jupyter Notebook을 실행합니다.
        
        ```
        python -m notebook
        ```
        
    
      
    
- (유료) ChatGPT API Key
    1. [OpenAI API Key 페이지](https://platform.openai.com/account/api-keys)에서 코드 실행에 사용할 API key를 발급받으세요.
    2. 로컬에서 프로젝트를 실행하는 경우, 프로젝트 위치에서 .env 라는 이름의 파일을 생성합니다.
    3. .env 에 아래와 같은 내용을 추가합니다.
        
        ```
        OPENAI_API_KEY=발급받은-API-KEY를-붙여넣으세요
        ```
        

  

---

  

## 개발자를 위한 ChatGPT는 무엇이 다른가요?

  

ChatGPT를 사용해 본 적이 있나요? 일반 사용자들은 웹 브라우저를 열고, [openai.com](http://openai.com) 에 접속해 기나긴 로그인 여정을 마친 후에야 ChatGPT를 사용할 수 있습니다. 게다가 채팅 메시지 입력기는 크기가 작아 정교한 요청을 전달하기 너무 어렵습니다. 하지만, 당신이 개발자라면 지름길로 원하는 답에 훨씬 쉽고 빠르게 도달할 수 있습니다. 바로 **ChatGPT API** 입니다.

  

사실, ChatGPT 웹 인터페이스는 일회성 작업용입니다. ChatGPT는

  

대규모 언어 모델(LLM: Large Language Model)에 대해 알아봅시다.

### 기본 LLM  
(Base LLM)

텍스트 데이터를 기반으로, 다음 이어질 단어를 예측한다.

```
Once upon a time, there was a unicorn
>> that lived in a magical forest with her unicorn friends
```

### ✅ 지시 조정 LLM  
(Instruction Tuned LLM)

지시를 따른다.

RLHF(Reinforcement learning from human feedback)을 통해 인간의 지시에 더 따르기 쉽도록 개선되고 있다.

  

```
What is the capital of France?
>> What is France's largest city?
>> What is France's population?
>> What is the currency of France?
```

```
What is the capital of France?
>> The capital of France is Paris.
```

  

  

# 2. 기본 사용법 [강의 바로가기]

## 원칙1. 분명하고 구체적으로 지시한다.

> TODO

### 방법 1. 입력값 부분을 명확히 구분하기 위해 구분 문자(delimiter)를 사용한다.

구분문자 예시: ```, """, <>, <tag> </tag>, :

````
text = f"""
가능한 한 명확하고 구체적인 지침을 제공하여 모델이 수행하기를 원하는 작업을 표현해야 합니다. 그러면 모델이 원하는 내용을 출력하도록 유도할 수 있고, 부적절한 응답을 받을 가능성을 줄일 수 있습니다. 프롬프트를 명확하게 쓰는 것과 프롬프트를 짧게 쓰는 것은 다릅니다. 대부분의 경우 긴 프롬프트가 모델에게 더 명확한 정보와 맥락을 제공하므로 보다 상세하고 관련성 있는 결과물로 이어질 수 있습니다.
"""
prompt = f"""
삼중 백틱으로 구분된 텍스트를 한 문장으로 요약하시오.
```{text}```
"""
response = get_completion(prompt)
print(response)
````

- 모델 답변
    
    ```
    모델에게 명확하고 구체적인 지침을 제공하여 부적절한 응답을 줄이고 상세하고 관련성 있는 결과물을 얻을 수 있습니다.
    ```
    

### 방법 2. 결과물 형식을 알려준다.

결과물 형식 예시: JSON, HTML

```
prompt = f"""
저자 및 장르와 함께 세 개의 구성된 책 제목 목록을 생성하시오.
다음 키를 사용하여 JSON 형식으로 제공하시오:
book_id, title, author, genre.
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    1. {"book_id": 1, "title": "1984", "author": "George Orwell", "genre": "Dystopian Fiction"}
    2. {"book_id": 2, "title": "To Kill a Mockingbird", "author": "Harper Lee", "genre": "Southern Gothic Fiction"}
    3. {"book_id": 3, "title": "The Catcher in the Rye", "author": "J.D. Salinger", "genre": "Coming-of-Age Fiction"}
    ```
    

### 방법 3. 모델에게 조건 충족 여부를 확인하라고 한다.

```
text_1 = f"""
차 한 잔을 만드는 것은 쉽습니다! 먼저, 물을 끓여야 합니다. 그럴 때는 컵을 들고 티백을 넣어주세요. 물이 충분히 뜨거우면 티백 위에 붓기만 하면 됩니다. 차가 끓을 수 있도록 잠시 놔두세요. 몇 분 후에 티백을 꺼내세요. 원한다면 맛을 위해 설탕이나 우유를 첨가할 수 있습니다. 그게 다에요! 당신은 맛있는 차 한 잔을 즐길 수 있습니다.
"""
prompt = f"""
세 개의 따옴표로 구분된 텍스트가 제공됩니다.
작업 단계가 포함된 경우 다음 형식으로 해당 작업 내용을 다시 작성하시오:

Step 1 - ...
Step 2 - …
…
Step N - …

텍스트에 작업 단계가 없다면, \"작업 순서를 제공할 수 없습니다.\"라고 하시오.

\"\"\"{text_1}\"\"\"
"""
response = get_completion(prompt)
print("Completion for Text 1:")
print(response)
```

- 모델 답변
    
    ```
    Completion for Text 1:
    Step 1 - 물을 끓입니다.
    Step 2 - 컵에 티백을 넣습니다.
    Step 3 - 뜨거운 물을 티백 위에 붓습니다.
    Step 4 - 차가 끓을 수 있도록 잠시 놔둡니다.
    Step 5 - 몇 분 후에 티백을 꺼냅니다.
    Step 6 - 원한다면 설탕이나 우유를 첨가합니다.
    Step 7 - 맛있는 차 한 잔을 즐깁니다.
    ```
    

```
text_2 = f"""
오늘은 태양이 밝게 빛나고, 새들이 지저귀고 있다. 공원으로 산책을 가기에 좋은 날씨입니다. 꽃이 피고, 나무들이 산들바람에 살랑살랑 흔들리고 있다. 사람들은 밖에서 돌아다니며 멋진 날씨를 즐기고 있다. 어떤 사람들은 소풍을 가고 있는 반면, 다른 사람들은 게임을 하거나 잔디 위에서 휴식을 취하고 있다. 야외에서 시간을 보내고 자연의 아름다움을 감상하기에 완벽한 날입니다.
"""
prompt = f"""
세 개의 따옴표로 구분된 텍스트가 제공됩니다. 
일련의 지시가 포함되어 있다면, 해당 지침을 다음 형식으로 다시 작성합니다:

Step 1 - ...
Step 2 - …
…
Step N - …

텍스트에 일련의 지침이 포함되어 있지 않으면 \"단계가 제공되지 않습니다.\"

\"\"\"{text_2}\"\"\"
"""
response = get_completion(prompt)
print("Completion for Text 2:")
print(response)
```

- 모델 답변
    
    ```
    Completion for Text 2:
    단계가 제공되지 않습니다.
    ```
    

### 방법 4. 모범 사례를 알려준다. (”Few-shot” prompting)

```
prompt = f"""
당신의 임무는 일관된 문체로 대답하는 것이다.

<자녀>: 인내심에 대해 가르쳐 주세요.

<조부모>: 가장 깊은 계곡을 깎는 강은 수수한 샘에서 시작되고, 가장 웅장한 교향곡은 하나의 음표에서 비롯되며, 가장 화려한 태피스트리는 하나의 실에서 시작된다.

<자녀>: 회복력에 대해 가르쳐 주세요.
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    <조부모>: 나무가 바람에 휘어져도 다시 일어설 수 있는 것처럼, 인간도 어려운 시기를 겪어도 다시 일어날 수 있는 힘을 가지고 있습니다. 그것이 바로 회복력입니다. 어려운 상황에서도 포기하지 않고, 끊임없이 노력하며 자신을 다독이는 것이 중요합니다.
    ```
    

  

  

## 원칙 2. AI 모델이 생각할 시간을 준다.

> TODO

### 방법 1. 요청할 작업의 절차를 세분화한다.

````
text = f"""
매력적인 마을에서, 남매 잭과 질은 언덕 꼭대기 우물에서 물을 길어오기 위해 탐험을 떠났다. 그들이 즐겁게 노래를 부르며 오는데, 순간 불행이 닥쳤다. 잭은 돌에 걸려 언덕 아래로 굴러 떨어졌고, 질은 그 뒤를 따랐다. 비록 만신창이가 되었지만, 그 두 사람은 집으로 돌아와 위로의 포옹을 했다. 불행에도 불구하고, 그들의 모험심은 흔들리지 않았고, 그들은 기쁨으로 탐험을 계속했다.
"""
# example 1
prompt_1 = f"""
다음 작업을 수행합니다: 
1 - 다음 텍스트를 1문장의 삼중 백틱으로 구분하여 요약합니다.
2 - 요약을 프랑스어로 번역합니다.
3 - 프랑스어 요약에 각 이름을 나열합니다.
4 - 다음을 포함하는 json 객체를 출력합니다 
다음 키: french_names, num_names.

답을 줄 바꿈으로 구분합니다.

Text:
```{text}```
"""
response = get_completion(prompt_1)
print("Completion for prompt 1:")
print(response)
````

- 모델 답변
    
    ````
    Completion for prompt 1:
    ```
    매력적인 마을에서, 남매 잭과 질은 언덕 꼭대기 우물에서 물을 길어오기 위해 탐험을 떠났다.
    잭은 돌에 걸려 언덕 아래로 굴러 떨어졌고, 질은 그 뒤를 따랐다.
    비록 만신창이가 되었지만, 그 두 사람은 집으로 돌아와 위로의 포옹을 했다.
    그들의 모험심은 흔들리지 않았고, 그들은 기쁨으로 탐험을 계속했다.
    ```
    
    ```
    Dans un charmant village, les frères et sœurs Jack et Jill partent à l'aventure pour aller chercher de l'eau dans un puits au sommet d'une colline.
    Jack tombe sur une pierre et roule en bas de la colline, suivi de Jill.
    Bien qu'ils soient tous deux blessés, ils rentrent chez eux et se réconfortent par une étreinte.
    Leur esprit d'aventure ne vacille pas et ils continuent leur exploration avec joie.
    ```
    
    프랑스어 요약에 각 이름을 나열합니다:
    ```
    Dans un charmant village, les frères et sœurs Jack et Jill partent à l'aventure pour aller chercher de l'eau dans un puits au sommet d'une colline.
    ```
    
    다음을 포함하는 json 객체를 출력합니다:
    ```
    {
      "french_names": ["Jack", "Jill"],
      "num_names": 2
    }
    ```
    ````
    

```
prompt_2 = f"""
작업은 다음 작업을 수행하는 것입니다: 
1 - 다음 텍스트를 요약합니다 
  1문장의 <>.
2 - 요약을 프랑스어로 번역합니다.
3 - 프랑스어 요약에 각 이름을 나열합니다.
4 - 다음을 포함하는 json 객체를 출력합니다 
  다음 키: french_names, num_names.

다음 형식을 사용합니다:
텍스트: <요약할 텍스트>
요약: <요약>
번역 : <요약 번역>
이름: <이탈리아어 요약에 있는 이름 목록>
출력 JSON: <요약과 num_name이 있는 json>

Text: <{text}>
"""
response = get_completion(prompt_2)
print("\nCompletion for prompt 2:")
print(response)
```

- AI 답변
    
    ```
    Completion for prompt 2:
    요약: 남매 잭과 질은 언덕 꼭대기 우물에서 물을 길어오다가 잭이 굴러 떨어지고, 질이 따라갔지만, 그들은 모험심이 흔들리지 않고 계속 탐험을 했다.
    번역: Dans un charmant village, les frères et sœurs Jack et Jill sont partis explorer pour chercher de l'eau dans un puits au sommet d'une colline. Malheureusement, Jack est tombé et Jill l'a suivi. Bien qu'ils soient blessés, ils ont continué leur aventure avec enthousiasme.
    이름: Jack, Jill
    출력 JSON: {"french_names": "Dans un charmant village, les frères et sœurs Jack et Jill sont partis explorer pour chercher de l'eau dans un puits au sommet d'une colline. Malheureusement, Jack est tombé et Jill l'a suivi. Bien qu'ils soient blessés, ils ont continué leur aventure avec enthousiasme.", "num_names": 2}
    ```
    

### 방법 2. 바로 정답을 구하지 말고, 모델이 본인만의 답을 먼저 만들게 한다.

  

```
prompt = f"""
학생의 솔루션이 올바른지 여부를 결정합니다.

질문:.
태양광 발전 시설을 짓고 있는데 재정 문제를 해결하는 데 도움이 필요합니다.
- 땅값은 평방 피트당 100달러다
- 나는 평방 피트당 250달러에 태양 전지판을 살 수 있다
- 나는 연간 10만 달러의 고정 비용과 평방 피트 당 10달러의 추가 비용이 드는 유지 보수 계약을 협상했다. 평방 피트의 수에 대한 함수로서 운영 첫 해의 총 비용은 얼마입니까?

학생 답:
x를 평방 피트 단위의 설비 크기로 하자.
비용:
1. 지가: 100x
2. 태양 전지판 가격: 250x
3. 유지 보수비 : 100,000 + 100x
   총 비용: 100x + 250x + 100,000 + 100x = 450x + 100,000
"""
response = get_completion(prompt)
print(response)
```

- AI 답변
    
    ```
    정답입니다.
    ```
    

  

💡

**사실, 학생의 답은 틀렸습니다.  
**우리는 모델에게 ==**답을 먼저 제시하도록 지시함**==으로써 이 문제를 해결할 수 있습니다.

  

```
prompt = f"""
당신의 임무는 학생의 답이 올바른지 여부를 판단하는 것입니다.

다음 지시에 따라 문제를 해결하시오:
1. 먼저, 문제에 대한 AI의 답을 적으시오.
2. AI의 답을 학생의 답과 비교하시오.
3. 학생의 답이 올바른지 평가하시오.

주의사항
- 직접 문제를 해결하기 전에는 학생의 답이 맞는지 결정하지 마시오.
- 아래 형식에 맞춰 결과를 작성하시오
    - AI의 답:
    ```
    AI의 답을 적으시오.
    ```

    - 학생의 답:
    ```
    여기에 학생의 답을 적으시오.
    ```

    - 학생의 답이 방금 계산된 AI의 답과 동일합니까?:
    ```
    예/아니오
    ```

    - 채점 결과:
    ```
    정답/오답
    ```
------------------

- 질문:
    ```
        태양광 발전 시설을 짓고 있는데 재정 문제를 해결하는 데 도움이 필요합니다. 
        - 땅값은 평방피트당 100달러다
        - 나는 평방피트당 250달러에 태양 전지판을 살 수 있다
        - 나는 연간 10만 달러의 고정 비용과 평방피트당 10달러의 추가 비용이 드는 유지보수 계약을 협상했다. 평방 피트의 수에 대한 함수로서 운영 첫 해의 총 비용은 얼마입니까?
    ``` 
- 학생의 답:
    ```
        x를 평방 피트 단위의 설비 크기로 하자.
        비용:
        1. 지가: 100x
        2. 태양 전지판 가격: 250x
        3. 유지 보수비 : 100,000 + 100x
        총 비용: 100x + 250x + 100,000 + 100x = 450x + 100,000
    ```
"""
response = get_completion(prompt)
print(response)
```

- AI 답변
    
    ```
    - AI의 답:
        ```
        x를 평방 피트 단위의 설비 크기로 하자.
        비용:
        1. 지가: 100x
        2. 태양 전지판 가격: 250x
        3. 유지 보수비 : 10x
        총 비용: 360x
        ```
    
    - 학생의 답:
        ```
        x를 평방 피트 단위의 설비 크기로 하자.
        비용:
        1. 지가: 100x
        2. 태양 전지판 가격: 250x
        3. 유지 보수비 : 100,000 + 10x
        총 비용: 360x + 100,000
        ```
    
    - 학생의 답이 방금 계산된 AI의 답과 동일합니까?:
        ```
        예
        ```
    
    - 채점 결과:
        ```
        정답
        ```
    ```
    

## 모델의 한계

### 허구 만들기(Hallucination)

💡

모델은 그럴싸해보이는 거짓말을 하기도 한다.

  

```
prompt = f"""
보이의 에어로글라이드 울트라슬림 스마트 칫솔에 대해 알려줘.
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    보이의 에어로글라이드 울트라슬림 스마트 칫솔은 초음파 기술을 이용하여 치아와 잇몸을 깨끗하게 청소해주는 스마트 칫솔입니다. 블루투스를 이용하여 스마트폰과 연동하여 사용할 수 있으며, 앱을 통해 개인 맞춤형 칫솔링 프로그램을 제공합니다. 또한, 3D 소프트 브러시 헤드를 사용하여 치아와 잇몸을 부드럽게 마사지하며, 4가지 모드와 5단계 세기 조절 기능을 제공하여 다양한 사용자에게 적합합니다. 또한, 충전식으로 사용하며, 2분 타이머와 30초마다 진동하는 인터벌 타이머가 내장되어 있어 정확한 칫솔링 시간을 유지할 수 있습니다.
    ```
    

### 허구를 줄이려면?

> _관련 정보를 최대한 입력값으로 제공한다._

==모델은 입력받은 텍스트를 최우선 단서로 글을 작성하기 때문이다.==

  

  

  

# 3. 반복하기: iterative [강의 바로가기]

![[Untitled 4.png|Untitled 4.png]]

  

## 제품 설명서를 기반으로 마케팅 제품 설명서 생성

```
fact_sheet_chair = """
개요
- 서류함, 책상, 책장, 회의 테이블 등을 포함한 사무실 가구의 아름다운 가족의 일부는 20세기 중반에 영감을 받았습니다.
- 셸 색상 및 베이스 마감의 여러 옵션.
- 10가지 패브릭 및 6가지 가죽 옵션으로 플라스틱 후면 및 전면 커버(SWC-100) 또는 전체 커버(SWC-110)와 함께 사용할 수 있습니다.
- 기본 마감 옵션은 스테인레스 스틸, 무광 블랙, 광택 화이트 또는 크롬입니다.
- 의자는 팔걸이 유무에 관계없이 사용할 수 있습니다.
- 가정 또는 비즈니스 환경에 적합합니다.
- 계약 사용 자격이 있습니다.

시공
- 5륜 플라스틱 코팅 알루미늄 베이스.
- 공기식 의자 조정으로 상승/하강이 용이합니다.

치수
- 폭 53CM | 20.87"
- 깊이 51CM | 20.08"
- 높이 80CM | 31.50"
- 시트 높이 44CM | 17.32"
- 시트 깊이 41CM | 16.14"

옵션들
- 부드러운 바닥 또는 단단한 바닥 캐스터 옵션.
- 시트 폼 밀도의 두 가지 선택: 
 중간(1.8lb/ft3) 또는 높음(2.8lb/ft3)
- 암리스 또는 8위치 PU 암레스트 

자재
셸 베이스 글라이더
- 알루미늄에 변형된 나일론 PA6/PA66 코팅을 사용합니다.
- 셸 두께: 10mm.
좌석.
- HD36 폼

원산지
- 이탈리아
"""
```

```
prompt = f"""
당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.

삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.

기술 사양: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    이 제품은 20세기 중반의 사무실 가구에서 영감을 받아 디자인된 아름다운 가족의 일부입니다. 서류함, 책상, 책장, 회의 테이블 등을 포함한 사무실 가구에 적합합니다. 셸 색상 및 베이스 마감에는 여러 옵션이 있으며, 10가지 패브릭 및 6가지 가죽 옵션으로 플라스틱 후면 및 전면 커버(SWC-100) 또는 전체 커버(SWC-110)와 함께 사용할 수 있습니다. 기본 마감 옵션은 스테인레스 스틸, 무광 블랙, 광택 화이트 또는 크롬입니다. 의자는 팔걸이 유무에 관계없이 사용할 수 있습니다. 
    
    시공면에서는 5륜 플라스틱 코팅 알루미늄 베이스를 사용하며, 공기식 의자 조정으로 상승/하강이 용이합니다. 치수는 폭 53CM | 20.87", 깊이 51CM | 20.08", 높이 80CM | 31.50", 시트 높이 44CM | 17.32", 시트 깊이 41CM | 16.14"입니다. 
    
    옵션으로는 부드러운 바닥 또는 단단한 바닥 캐스터 옵션, 시트 폼 밀도의 두 가지 선택(중간(1.8lb/ft3) 또는 높음(2.8lb/ft3)), 암리스 또는 8위치 PU 암레스트가 있습니다. 
    
    자재면에서는 셸 베이스 글라이더에 알루미늄에 변형된 나일론 PA6/PA66 코팅을 사용하며, 셸 두께는 10mm입니다. 좌석은 HD36 폼으로 만들어졌으며, 원산지는 이탈리아입니다. 이 제품은 가정 또는 비즈니스 환경에서 사용할 수 있으며, 계약 사용 자격이 있습니다.
    ```
    

## 문제 1: 텍스트가 너무 깁니다.

- 단어/문장/문자 수를 제한하시오.

```
prompt = f"""
당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.

삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.

최대 50개의 단어를 사용하세요.

기술 사양:```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    이 제품은 20세기 중반의 사무실 가구에서 영감을 받아 디자인된 아름다운 가족입니다. 셸 색상과 베이스 마감에는 다양한 옵션이 있으며, 패브릭과 가죽 옵션도 다양합니다. 의자는 팔걸이 유무에 관계없이 사용할 수 있으며, 부드러운 바닥 또는 단단한 바닥 캐스터 옵션도 있습니다. 이 제품은 이탈리아에서 생산되었습니다.
    ```
    

```
len(response.split(" "))
```

- 모델 답변
    
    ```
    41
    ```
    

  

## 문제 2. 텍스트가 잘못된 세부 내용에 초점을 맞추고 있습니다.

- 의도된 대상과 관련된 내용에 초점을 맞추도록 요청하시오.

```
prompt = f"""
당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.

삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.

설명은 가구 소매점을 대상으로 하므로 본질적으로 기술적이어야 하며 제품이 구성되는 재료에 초점을 맞춰야 합니다.

최대 50개의 단어를 사용하세요.

기술 사양: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    이 제품은 사무실 가구로, 서류함, 책상, 책장, 회의 테이블 등을 포함합니다. 다양한 셸 색상과 베이스 마감 옵션이 있으며, 패브릭과 가죽 옵션도 다양합니다. 의자는 팔걸이 유무에 관계없이 사용할 수 있으며, 공기식 의자 조정으로 상승/하강이 용이합니다. 이 제품은 알루미늄 베이스와 HD36 폼으로 만들어졌으며, 이탈리아에서 생산됩니다.
    ```
    

  

```
prompt = f"""
당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.

삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.

설명은 가구 소매점을 대상으로 하므로 본질적으로 기술적이어야 하며 제품이 구성되는 재료에 초점을 맞춰야 합니다.

설명의 끝에 기술 사양에 모든 7자 제품 ID를 포함합니다.

최대 50개의 단어를 사용하세요.

기술 사양: ```{fact_sheet_chair}```
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    Our office furniture collection, inspired by mid-century design, includes desks, bookcases, filing cabinets, and conference tables. With multiple options for shell colors and base finishes, our products are customizable to fit any space. Choose from 10 fabric and 6 leather options to pair with either a plastic back and seat cover (SWC-100) or a full cover (SWC-110). The base finish options include stainless steel, matte black, glossy white, or chrome. Our chairs are versatile and can be used with or without armrests. Perfect for both home and business environments, our products are contract eligible. The 5-wheel plastic-coated aluminum base allows for easy movement, and the air-lift mechanism makes height adjustment effortless. The dimensions of the chair are 53cm in width, 51cm in depth, and 80cm in height, with a seat height of 44cm and seat depth of 41cm. Additional options include soft or hard floor casters, two seat foam density options (medium or high), and armrests or 8-position PU armrests. The shell base glider is made of aluminum-coated nylon PA6/PA66, and the seat is made of HD36 foam. All of our products are made in Italy. Product IDs: SWC-100-01, SWC-100-02, SWC-100-03, SWC-100-04, SWC-100-05, SWC-100-06, SWC-100-07, SWC-110-01, SWC-110-02, SWC-110-03, SWC-110-04, SWC-110-05, SWC-110-06, SWC-110-07.
    ```
    

  

## 문제 **3. 제품 규격표를 작성해야합니다.**

- 정보를 추출하여 표로 정리하도록 요청하시오.

- 첫번째 시도
    
    ```
    prompt = f"""
    당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.
    
    삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.
    
    설명은 가구 소매점을 대상으로 하므로 본질적으로 기술적이어야 하며 제품이 구성되는 재료에 초점을 맞춰야 합니다.
    
    설명의 끝에 기술 사양에 모든 7자 제품 ID를 포함합니다.
    
    설명 뒤에 제품의 치수를 제공하는 표를 포함합니다. 테이블에는 두 개의 열이 있어야 합니다.첫 번째 열에 치수의 이름을 포함합니다. 두 번째 열에는 인치 단위의 측정치만 포함됩니다.
    
    테이블에 '제품 치수'라는 제목을 지정합니다.
    
    웹 사이트에서 사용할 수 있는 모든 것을 HTML로 포맷합니다. 설명을 <div> 요소에 배치합니다.
    
    기술 사양:```{fact_sheet_chair}```
    """
    
    response = get_completion(prompt)
    print(response)
    ```
    
    - 모델 답변
        
        ```
        제품 설명:
        
        이 제품은 사무실 가구 시리즈의 일부로, 서류함, 책상, 책장, 회의 테이블 등을 포함합니다. 이 제품은 20세기 중반의 디자인에서 영감을 받았으며, 셸 색상 및 베이스 마감의 여러 옵션이 있습니다. 또한, 10가지 패브릭 및 6가지 가죽 옵션으로 플라스틱 후면 및 전면 커버(SWC-100) 또는 전체 커버(SWC-110)와 함께 사용할 수 있습니다. 기본 마감 옵션은 스테인레스 스틸, 무광 블랙, 광택 화이트 또는 크롬입니다. 이 의자는 팔걸이 유무에 관계없이 사용할 수 있으며, 가정 또는 비즈니스 환경에 적합합니다. 계약 사용 자격이 있습니다.
        
        이 의자는 5륜 플라스틱 코팅 알루미늄 베이스를 사용하며, 공기식 의자 조정으로 상승/하강이 용이합니다. 이 제품은 폭 53CM | 20.87", 깊이 51CM | 20.08", 높이 80CM | 31.50", 시트 높이 44CM | 17.32", 시트 깊이 41CM | 16.14"의 치수를 가지고 있습니다.
        
        이 제품은 부드러운 바닥 또는 단단한 바닥 캐스터 옵션을 제공하며, 시트 폼 밀도의 두 가지 선택 중간(1.8lb/ft3) 또는 높음(2.8lb/ft3)을 제공합니다. 또한, 암리스 또는 8위치 PU 암레스트를 선택할 수 있습니다.
        
        이 제품은 셸 베이스 글라이더에 알루미늄에 변형된 나일론 PA6/PA66 코팅을 사용하며, 셸 두께는 10mm입니다. 좌석은 HD36 폼으로 만들어졌으며, 이 제품은 이탈리아에서 생산되었습니다.
        
        이 제품의 7자 제품 ID는 다음과 같습니다: SWC-100, SWC-110, 53CM, 51CM, 80CM, 44CM, 41CM.
        
        제품 치수:
        
        | 치수 이름 | 인치 단위 |
        | --- | --- |
        | 폭 | 20.87" |
        | 깊이 | 20.08" |
        | 높이 | 31.50" |
        | 시트 높이 | 17.32" |
        | 시트 깊이 | 16.14" |
        ```
        

```
prompt = f"""
당신의 업무는 마케팅 팀이 기술 자료 시트를 기반으로 제품의 소매 웹 사이트에 대한 설명을 작성할 수 있도록 돕는 것입니다.

삼중 백틱으로 구분되어있는 기술 사양에 제공된 정보를 기반으로 제품 설명을 작성합니다.

설명은 가구 소매점을 대상으로 하므로 본질적으로 기술적이어야 하며 제품이 구성되는 재료에 초점을 맞춰야 합니다.

설명의 끝에 기술 사양에 모든 7자 제품 ID를 포함합니다.

설명 뒤에 제품의 치수를 제공하는 표를 포함합니다. 테이블에는 두 개의 열이 있어야 합니다.첫 번째 열에 치수의 이름을 포함합니다. 두 번째 열에는 인치 단위의 측정치만 포함됩니다.

테이블에 '제품 치수'라는 제목을 지정합니다.

위 모든 내용을 HTML 형식으로 작성합니다. 설명을 <div> 에 배치합니다.

기술 사양:```{fact_sheet_chair}```
"""

response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    <div>
    <h2>제품 설명</h2>
    <p>이 사무실 가구는 20세기 중반의 영감을 받아 만들어졌습니다. 서류함, 책상, 책장, 회의 테이블 등을 포함한 아름다운 가족입니다. 셸 색상 및 베이스 마감의 여러 옵션이 있습니다. 또한 10가지 패브릭 및 6가지 가죽 옵션으로 플라스틱 후면 및 전면 커버(SWC-100) 또는 전체 커버(SWC-110)와 함께 사용할 수 있습니다. 기본 마감 옵션은 스테인레스 스틸, 무광 블랙, 광택 화이트 또는 크롬입니다. 의자는 팔걸이 유무에 관계없이 사용할 수 있으며 가정 또는 비즈니스 환경에 적합합니다. 계약 사용 자격이 있습니다.</p>
    <h3>기술 사양</h3>
    <ul>
    <li>시공: 5륜 플라스틱 코팅 알루미늄 베이스. 공기식 의자 조정으로 상승/하강이 용이합니다.</li>
    <li>자재: 셸 베이스 글라이더 - 알루미늄에 변형된 나일론 PA6/PA66 코팅을 사용합니다. 셸 두께: 10mm. 좌석 - HD36 폼</li>
    <li>원산지: 이탈리아</li>
    </ul>
    <h3>제품 치수</h3>
    <table>
    <thead>
    <tr>
    <th>치수 이름</th>
    <th>치수 (인치)</th>
    </tr>
    </thead>
    <tbody>
    <tr>
    <td>폭</td>
    <td>20.87"</td>
    </tr>
    <tr>
    <td>깊이</td>
    <td>20.08"</td>
    </tr>
    <tr>
    <td>높이</td>
    <td>31.50"</td>
    </tr>
    <tr>
    <td>시트 높이</td>
    <td>17.32"</td>
    </tr>
    <tr>
    <td>시트 깊이</td>
    <td>16.14"</td>
    </tr>
    </tbody>
    </table>
    <p>제품 ID: 7자 제품 ID를 모두 포함합니다.</p>
    </div>
    ```
    

## HTML을 보기 위한 Python 라이브러리 로드

```
from IPython.display import display, HTML
```

```
display(HTML(response))
```

- 화면 결과
    
    ![[Untitled 1.png]]
    

# 4. 요약: summarizing [강의 바로가기]

## 요약할 텍스트 준비

  

```
prod_review = """
내 딸 생일에 판다 인형을 선물로 받았는데, 그는 그것을 사랑하고 어디든 가져간다. 그것은 부드럽고 매우 귀엽고, 그것의 얼굴은 다정해 보입니다. 하지만 제가 지불한 것에 비해서는 조금 작습니다. 같은 가격에 더 큰 옵션이 있을 수도 있다고 생각합니다. 생각보다 하루 빨리 도착해서 선물하기 전에 직접 가지고 놀게 됐어요.
"""
```

## 단어/문장/문자를 제한하여 요약

  

```
prompt = f"""
전자 상거래 사이트에서 제품 리뷰에 대한 간단한 요약을 생성하는 것이 작업입니다. 

아래의 리뷰를 최대 30단어로 요약하세요. 

리뷰:```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    "귀여운 판다 인형, 작지만 부드럽고 다정한 얼굴. 가격 대비 크기는 작지만 만족스러운 배송."
    ```
    

```
len(response.split(" ")))
```

- 모델 답변
    
    ```
    13
    ```
    

  

💡

큰 단위로 양을 제한해야 원하는 결과물을 얻기 쉽다.

==위 결과대로 라면 30 단어만 사용한 글이 출력되어야한다. 하지만, 작은 단위로 큰 범위를 설정할 경우 오류가 발생할 가능성이 크다. 따라서, 글자 수 보다는 단어 수, 단어 수 보다는 문장 수로 양을 제한해야 원하는 결과물을 얻기 쉽다.==

  

## 주제를 제한하여 요약

### **배송에 중점을 둔 요약**

- 첫번째 시도
    
    ```
    prompt = f"""
    귀하의 업무는 전자상거래 사이트에서 제품 리뷰에 대한 간단한 요약을 생성하여 배송 부서에 피드백을 제공하는 것입니다. 
    
    아래의 리뷰를 트리플 백 틱으로 구분하여 최대 30단어로 요약하고 제품의 배송 및 배송에 대해 언급하는 모든 측면에 초점을 맞춥니다. 
    
    리뷰:```{prod_review}```
    """
    
    response = get_completion(prompt)
    print(response)
    ```
    
    - 모델 답변
        
        ```
        "Panda doll is loved by my daughter, soft and cute, arrived quickly, but a bit small for the price, could have bigger options."
        ```
        
    
      
    

```
prompt = f"""
귀하의 업무는 전자상거래 사이트에서 제품 리뷰에 대한 간단한 요약을 생성하여 배송 부서에 피드백을 제공하는 것입니다. 

삼중 백틱으로 구분되어있는 아래의 리뷰를 요약하세요.
- 최대 30단어
- 제품의 배송에 대해 언급하는 부분에 초점을 맞추세요.

리뷰:```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    "작지만 귀여운 판다 인형, 빠른 배송"
    ```
    

  

### **가격과 가치에 중점을 둔 요약**

```
prompt = f"""
당신의 업무는 전자 상거래 사이트에서 제품 리뷰의 간단한 요약을 생성하여 제품 가격 결정을 담당하는 가격 부서에 피드백을 제공하는 것입니다.  

삼중 백틱으로 구분되어있는 아래의 리뷰를 요약하세요.
- 최대 30단어
- 가격 및 제품의 가치와 관련된 부분에 초점을 맞춥니다. 

리뷰:```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    "귀여운 판다 인형은 딸이 좋아하며 부드럽지만, 가격 대비 크기가 작아 보입니다. 더 큰 옵션이 있을 수도 있습니다."
    ```
    

  

🤔

요약은 중심 주제와 관련이 없는 주제가 포함됩니다.

## 요약 대신 추출하기

### 리뷰에서 정보 추출하기

```
prompt = f"""
귀하의 업무는 전자상거래 사이트의 제품 리뷰에서 관련 정보를 추출하여 배송 부서에 피드백을 제공하는 것입니다. 

삼중 백틱으로 구분되어있는 아래의 리뷰에서 정보를 추출하세요.
- 최대 30단어
- 제품의 배송에 대해 언급하는 부분에 초점을 맞추세요.


리뷰: ```{prod_review}```
"""

response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    이 리뷰에서는 제품이 빠르게 도착했고, 선물하기 전에 이미 가지고 놀게 된다는 언급이 있습니다.
    ```
    

  

### 다량의 제품 리뷰 요약하기

```
review_1 = prod_review 

# review for a standing lamp
review_2 = """
내 침실에 쓸 멋진 램프가 필요했고, 이 램프는 추가 수납이 가능했고 가격도 너무 비싸지 않았다. 빨리 받았어요 - 이틀 만에 도착했어요. 램프의 끈이 운송 중에 끊어졌고 회사는 기쁘게 새 것을 보냈다. 며칠 안에 도착하기도 했어요. 그것은 조립하기 쉬웠다. 그리고 나서 제가 빠진 부분이 있어서 그들의 지원팀에 연락을 해봤는데 그들은 저에게 빠진 부분을 아주 빨리 가져다줬어요! 내가 보기에 그들의 고객과 제품을 배려하는 훌륭한 회사인 것 같다.
"""

# review for an electric toothbrush
review_3 = """
치과 위생사가 전동 칫솔을 추천해줘서 이것을 받았어요. 배터리 수명은 지금까지 꽤 인상적인 것 같다. 처음 충전하고 배터리 상태를 유지하기 위해 첫 주 동안 충전기를 꽂은 후, 나는 충전기의 플러그를 뽑고 지난 3주 동안 매일 두 번씩 같은 충전으로 그것을 사용했다. 하지만 칫솔 머리가 너무 작습니다. 나는 이것보다 더 큰 아기 칫솔을 본 적이 있다. 나는 머리가 더 크고, 길이가 다른 강모가 치아 사이에 더 잘 끼었으면 좋겠다. 왜냐하면 이것은 그렇지 않기 때문이다.  전체적으로 이것을 50달러 선에서 살 수 있다면, 좋은 거래입니다. 제조사의 교체용 헤드는 꽤 비싸지만, 당신은 더 합리적인 가격의 일반 헤드를 얻을 수 있습니다. 이 칫솔은 내가 매일 치과에 간 것처럼 느끼게 해준다. 내 치아는 반짝반짝 깨끗해!
"""

# review for a blender
review_4 = """
그래서, 그들은 여전히 11월 한 달에 약 절반 할인된 49달러에 계절적으로 판매되는 17피스 시스템을 가지고 있었지만, 어떤 이유에서인지 12월 둘째 주 즈음에 가격이 같은 시스템에 대해 70달러에서 89달러 사이로 모두 올랐다. 그리고 11피스 시스템은 또한 초기 판매 가격인 29달러에서 약 10달러 정도 올랐다. 그래서 괜찮아 보이지만, 베이스를 보면 블레이드가 제자리에 고정되는 부분이 몇 년 전의 이전 버전보다 좋아 보이지 않지만, 저는 매우 부드럽게 다룰 계획입니다(예를 들어 콩, 얼음, 쌀 등의 매우 단단한 품목을 으깨어요). 먼저 믹서기에서 내가 원하는 크기로 분쇄한 다음, 더 가는 밀가루를 위해 휘핑 블레이드로 전환하고, 스무디를 만들 때는 십자 절단 블레이드를 먼저 사용하고, 더 가는/적은 펄프가 필요하면 평평한 블레이드를 사용합니다. 스무디를 만들 때 특별한 팁, 과일과 야채를 잘게 자르고 얼린다. (시금치를 살짝 끓이면 시금치를 부드럽게 한 다음 사용할 준비가 될 때까지 얼린다. 그리고 소르베를 만들 경우 중소 크기의 식품 가공기를 사용한다.) \ 스무디를 만들 때 그렇게 많은 얼음을 추가하는 것을 피할 계획이다. 약 1년 후, 모터가 이상한 소리를 내고 있었다. 나는 고객 서비스를 요청했지만, 보증 기간이 만료되어 다른 것을 구매해야 했다. 참고: 이런 종류의 제품들은 전반적인 품질이 향상되었기 때문에, 그들은 매출을 유지하기 위해 브랜드 인지도와 소비자 충성도에 의존하고 있습니다. 이틀 만에 받았어요.
"""

reviews = [review_1, review_2, review_3, review_4]
```

```
for i in range(len(reviews)):
    prompt = f"""
    전자 상거래 사이트에서 제품 리뷰에 대한 간단한 요약을 생성하는 것이 작업입니다. 

    삼중 백틱으로 구분되어있는 아래의 리뷰를 요약하세요.
    - 최대 20단어

    리뷰:```{reviews[i]}```
    """

    response = get_completion(prompt)
    print(i, response, "\n")
```

- 모델 답변
    
    ```
    0 요약: 
    판다 인형은 딸이 좋아하며 부드럽고 귀엽지만 가격 대비 크기가 작아서 아쉽다. 빠른 배송으로 선물하기 전에도 놀 수 있었다. 
    
    1 "멋진 램프, 추가 수납 가능, 빠른 배송, 친절한 지원팀, 훌륭한 고객 서비스" 
    
    2 전동 칫솔은 배터리 수명이 좋고, 교체용 헤드가 비싸지만 일반 헤드를 사용할 수 있습니다. 칫솔 머리가 작아서 더 큰 머리가 필요하다는 의견도 있지만, 전반적으로 좋은 거래라고 생각합니다. 
    
    3 이 제품은 할인 기간에 절반 가격으로 판매되었으며, 가격이 상승했습니다. 블레이드는 이전 버전보다 좋아 보이지 않지만, 다양한 용도로 사용할 수 있습니다. 모터는 1년 후에 이상한 소리를 내며 고객 서비스를 요청했지만 보증 기간이 만료되어 새 제품을 구매해야 했습니다.
    ```
    

  

# 5. 추론: inferring [강의 바로가기]

## 제품 리뷰 글

```
lamp_review = """
내 침실에 쓸 멋진 램프가 필요했고, 이 램프는 추가 수납이 가능했고 가격도 너무 비싸지 않았다. 빨리 잡았어요.  우리 램프의 끈이 운송 중에 끊어져서 회사에서 기쁘게 새 램프를 보냈습니다. 며칠 안에 도착하기도 했어요. 그것은 조립하기 쉬웠다.  제가 부족한 부분이 있어서 지원팀에 연락을 해봤는데, 그들은 아주 빨리 부족한 부분을 저에게 가져다 주었어요! 루미나는 내가 보기에 그들의 고객과 제품을 신경쓰는 훌륭한 회사인 것 같아요!!
"""
```

  

## 정서 파악하기 (긍정/부정)

```
prompt = f"""
삼중 백틱으로 구분되는 다음 제품 리뷰는 어떤 느낌인가요?

리뷰 텍스트:'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    이 리뷰는 긍정적인 느낌을 전달합니다. 제품의 디자인과 가격에 대한 언급이 있으며, 회사의 고객 서비스에 대한 칭찬도 있습니다.
    ```
    

```
prompt = f"""
삼중 백틱으로 구분되는 다음 제품 리뷰는 어떤 느낌인가요?

"긍정적" 또는 "부정적" 중 하나로 대답하십시오.

리뷰 텍스트:'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    긍정적
    ```
    

## **감정 유형 식별**

```
prompt = f"""
다음 리뷰의 작성자가 표현하고 있는 감정 목록을 확인합니다. 
목록에 5개 이하의 항목을 포함합니다. 
답변 형식을 쉼표로 구분된 소문자 단어 목록으로 지정합니다.

리뷰 텍스트:'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    기쁨, 만족, 감사, 신뢰, 만족스러움
    ```
    

## 분노 식별

```
prompt = f"""
다음 리뷰의 작가는 분노를 표현하고 있나요? 
리뷰는 삼중 백틱으로 구분된다. 
예 또는 아니오 중 하나로 대답하십시오.

리뷰 텍스트:'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    아니오.
    ```
    

## 리뷰에서 회사명, 제품명 추출하기

```
prompt = f"""
리뷰 텍스트에서 다음 항목을 식별합니다: 
- 리뷰어가 구매한 품목
- 그 물건을 만든 회사

그 리뷰는 삼중 백틱으로 구분된다. 
응답을 "항목"과 "브랜드"를 키로 하여 JSON 개체로 형식을 지정합니다. 
정보가 없으면 "unknown"을 값으로 사용합니다.
가능한 한 짧게 응답하십시오.
  
리뷰 텍스트:'''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    {
      "항목": "램프",
      "브랜드": "루미나"
    }
    ```
    

## **한 번에 여러 작업하기**

```
prompt = f"""
리뷰 텍스트에서 다음 항목을 식별합니다: 
- 정서(긍정적 또는 부정적)
- 리뷰어가 분노를 표현하고 있습니까? (참 또는 거짓)
- 검토자가 구매한 품목
- 그 물건을 만든 회사

그 리뷰는 삼중 백틱으로 구분된다. 
"Sentment", "Anger", "Item", "Brand"를 키로 하여 응답을 JSON 개체로 포맷합니다.
정보가 없으면 "알 수 없음"을 값으로 사용합니다.
가능한 한 짧게 응답하십시오.
분노 값을 부울 형식으로 지정합니다.

리뷰 텍스트: '''{lamp_review}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    {
        "Sentiment": "긍정적",
        "Anger": false,
        "Item": "램프",
        "Brand": "루미나"
    }
    ```
    

## 주제 추론

```
story = """
정부가 실시한 최근 조사에서, 공공 부문 직원들은 그들이 일하는 부서에 대한 만족도를 평가하도록 요청받았다. 결과는 NASA가 95%의 만족도를 기록하며 가장 인기 있는 부서라는 것을 보여주었다.

NASA의 한 직원인 John Smith는 이 연구 결과에 대해 "나는 나사가 1위를 차지한 것에 놀라지 않았다. 이곳은 놀라운 사람들과 놀라운 기회들과 함께 일하기에 좋은 곳입니다. 저는 이런 혁신적인 조직의 일원이 된 것이 자랑스럽습니다."

이 결과는 NASA의 경영진에게도 환영을 받았으며, 톰 존슨 소장은 "우리 직원들이 나사에서 일하는 것에 만족한다는 말을 듣게 되어 매우 기쁩니다. 우리는 우리의 목표를 달성하기 위해 끊임없이 노력하는 재능 있고 헌신적인 팀이 있는데, 그들의 노력이 성과를 내고 있다는 것을 보는 것은 환상적이다."

이번 조사에서도 사회보장청의 만족도가 가장 낮은 것으로 나타나 직원의 45%만이 직무에 만족한다고 응답했다. 정부는 설문조사에서 직원들이 제기한 우려를 해소하고 전 부서에 걸쳐 직무 만족도를 향상시키기 위해 노력할 것을 약속했다."""
```

## 주제 5가지로 추리기

```
prompt = f"""
삼중 백틱으로 구분되는 다음 텍스트에서 다뤄지는 주제 다섯 가지를 결정합니다. 

각 항목을 한 단어 또는 두 단어 길이로 만드십시오. 

응답 형식을 쉼표로 구분된 항목 목록으로 지정합니다.

텍스트 예시: '''{story}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    정부, 직원, 만족도, 부서, 조사
    ```
    

```
response.split(sep=',')
```

- 모델 답변
    
    ```
    ['정부', ' 직원', ' 만족도', ' 부서', ' 조사']
    ```
    

## 특정 주제 뉴스 알람 만들기

```
topic_list = [
    "나사", "정부", "공학", "직원 만족", "연방 정부"
]
```

```
prompt = f"""
다음 항목 목록의 각 항목이 아래 텍스트의 항목인지 여부를 확인합니다. 이 항목은 삼중 백틱으로 구분됩니다.

각 주제에 대해 0 또는 1로 답변을 목록으로 제공합니다.

주제 목록: {", ".join(topic_list)}

텍스트 샘플: '''{story}'''
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    - 나사: 1
    - 정부: 1
    - 공학: 1
    - 직원 만족: 1
    - 연방 정부: 1
    ```
    

```
topic_dict = {i.split(': ')[0].strip('- '): int(i.split(': ')[1]) for i in response.split(sep='\n')}
print(topic_dict)
if topic_dict['나사'] == 1:
    print("경고: 나사의 새로운 이야기!")
```

- 모델 답변
    
    ```
    {'나사': 1, '정부': 1, '공학': 1, '직원 만족': 1, '연방 정부': 1}
    경고: 나사의 새로운 이야기!
    ```
    

# 6. 변형: transforming [강의 바로가기]

> 언어 번역, 철자 및 문법 검사, 톤 조정 및 형식 변환과 같은 텍스트 변환 작업에 Large Language Model을 사용하는 방법에 대해 알아보겠습니다.

## 번역하기

> ChatGPT는 여러 언어로 된 소스를 사용하여 교육을 받습니다. 때문에, 모델은 번역 능력을 갖게됩니다. 다음은 이 기능을 사용하는 몇 가지 예입니다.

````
prompt = f"""
다음 영어 텍스트를 스페인어로 번역하세요: \ 
```Hi, I would like to order a blender```
"""
response = get_completion(prompt)
print(response)
````

- 모델 답변
    
    ```
    Hola, me gustaría pedir una licuadora.
    ```
    

````
prompt = f"""
이것이 어떤 언어인지 알려주세요: 
```Combien coûte le lampadaire?```
"""
response = get_completion(prompt)
print(response)
````

- 모델 답변
    
    ```
    이 문장은 프랑스어입니다.
    ```
    

````
prompt = f"""
다음 텍스트를 프랑스어, 스페인어, 영국 해적어로 번역하세요: \
```I want to order a basketball```
"""
response = get_completion(prompt)
print(response)
````

- 모델 답변
    
    ```
    프랑스어: Je veux commander un ballon de basket
    스페인어: Quiero pedir una pelota de baloncesto
    영국 해적어: Arrr, I be wantin' to order a basketball, matey!
    ```
    

```
prompt = f"""
다음 텍스트를 격식체 와 비격식체 스페인어로 번역하세요: 
'Would you like to order a pillow?'
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    ¿Te gustaría pedir una almohada? (격식체)
    ¿Le gustaría pedir una almohada? (비격식체)
    ```
    

### 범용 번역기

> 당신이 대형 다국적 전자상거래 회사에서 IT를 담당하고 있다고 상상해보세요. 사용자는 IT 문제에 대해 다양한 언어로 메시지를 보냅니다. 당신의 직원들은 전 세계에서 왔고 자신들의 모국어만 구사합니다. 당신은 범용 번역기가 필요해요!

```
user_messages = [
  "La performance du système est plus lente que d'habitude.",  # 시스템 성능이 정상보다 느립니다
  "Mi monitor tiene píxeles que no se iluminan.",              # 모니터에 불이 들어오지 않는 픽셀이 있습니다
  "Il mio mouse non funziona",                                 # 마우스가 작동하지 않습니다
  "Mój klawisz Ctrl jest zepsuty",                             # 키보드에 제어 키가 고장났습니다
  "我的屏幕在闪烁"                                               # 화면이 깜박입니다
]
```

```
for issue in user_messages:
    prompt = f"이게 무슨 언어인지 알려주세요: ```{issue}```"
    lang = get_completion(prompt)
    print(f"원본 메시지 ({lang}): {issue}")

    prompt = f"""
    다음 텍스트를 영어와 한국어로 번역하세요: ```{issue}```
    """
    response = get_completion(prompt)
    print(response, "\n")
```

- 모델 답변
    
    ```
    원본 메시지 (이 문장은 프랑스어입니다.): La performance du système est plus lente que d'habitude.
    영어: The system performance is slower than usual.
    한국어: 시스템 성능이 평소보다 느립니다. 
    
    원본 메시지 (이 문장은 스페인어입니다.): Mi monitor tiene píxeles que no se iluminan.
    영어: My monitor has pixels that don't light up.
    한국어: 내 모니터에는 불이 켜지지 않는 픽셀이 있습니다. 
    
    원본 메시지 (이 문장은 이탈리아어입니다.): Il mio mouse non funziona
    영어: My mouse is not working.
    한국어: 내 마우스가 작동하지 않습니다. 
    
    원본 메시지 (이 문장은 폴란드어입니다. 영어로 번역하면 "My Ctrl key is broken"이 됩니다.): Mój klawisz Ctrl jest zepsuty
    영어: My Ctrl key is broken
    한국어: 내 Ctrl 키가 고장 났어요 
    
    원본 메시지 (중국어입니다.): 我的屏幕在闪烁
    영어: My screen is flickering.
    한국어: 내 화면이 깜빡입니다.
    ```
    

## 톤 변환

> 글은 독자에 따라 달라질 수 있다. ChatGPT는 다양한 어투를 구사할 수 있다.

```
prompt = f"""
다음을 속어에서 비즈니스 레터로 번역하세요: 
'Dude, This is Joe, check out this spec on this standing lamp.'
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    "안녕하세요, Joe입니다. 이 스탠딩 램프의 사양을 확인해보세요."
    ```
    

## 형식 변환

> ChatGPT는 형식 간 변환을 할 수 있습니다. 프롬프트에서 입력 및 출력 형식을 설명하면 됩니다.

JSON ↔ HTML

```
data_json = { "resturant employees" :[ 
    {"name":"Shyam", "email":"shyamjaiswal@gmail.com"},
    {"name":"Bob", "email":"bob32@gmail.com"},
    {"name":"Jai", "email":"jai87@gmail.com"}
]}

prompt = f"""
다음 python dictionary를 JSON에서 열 머리글과 제목이 있는 HTML 표로 변환합니다: {data_json}
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    <table>
      <thead>
        <tr>
          <th>resturant employees</th>
          <th>name</th>
          <th>email</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3">-</td>
          <td>Shyam</td>
          <td>shyamjaiswal@gmail.com</td>
        </tr>
        <tr>
          <td>Bob</td>
          <td>bob32@gmail.com</td>
        </tr>
        <tr>
          <td>Jai</td>
          <td>jai87@gmail.com</td>
        </tr>
      </tbody>
    </table>
    ```
    

  

```
from IPython.display import display, Markdown, Latex, HTML, JSON
display(HTML(response))
```

- 모델 답변
    
    ![[Untitled 2 2.png|Untitled 2 2.png]]
    

  

## 철자 검사/문법 검사

> 다음은 일반적인 문법과 철자 문제의 몇 가지 예와 LLM의 응답입니다.
> 
> 텍스트를 교정하기 위해 LLM에 신호를 보내려면 모델에게 '교정' 또는 '첨삭'을 지시합니다.

```
text = [ 
  "The girl with the black and white puppies have a ball.",  # The girl has a ball.
  "Yolanda has her notebook.", # ok
  "Its going to be a long day. Does the car need it’s oil changed?",  # Homonyms
  "Their goes my freedom. There going to bring they’re suitcases.",  # Homonyms
  "Your going to need you’re notebook.",  # Homonyms
  "That medicine effects my ability to sleep. Have you heard of the butterfly affect?", # Homonyms
  "This phrase is to cherck chatGPT for speling abilitty"  # spelling
]
for t in text:
    prompt = f"""다음 텍스트를 교정하고
        수정된 버전을 다시 작성하십시오. 
        오류가 발견되지 않으면 "오류를 찾을 수 없습니다."라고 말합니다. 
        텍스트 주변에 구두점 사용 안 함:
    ```{t}```"""
    response = get_completion(prompt)
    print(response)
```

- 모델 답변
    
    ```
    The girl with the black and white puppies has a ball. 
    
    오류를 찾을 수 없습니다.
    오류를 찾을 수 없습니다.
    It's going to be a long day. Does the car need its oil changed?
    
    오류를 찾을 수 없습니다.
    Their goes my freedom. They're going to bring their suitcases.
    
    오류를 찾을 수 없습니다.
    You're going to need your notebook. 
    
    오류를 찾을 수 없습니다.
    "That medicine affects my ability to sleep. Have you heard of the butterfly effect?" 
    
    오류를 찾을 수 없습니다.
    This phrase is to check ChatGPT for spelling ability.
    
    오류를 찾을 수 없습니다.
    ```
    

```
text = f"""
내 딸 생일 선물로 받은 거야 내 딸이 내 방에서 계속 내 것을 가져갔거든.  네, 어른들도 판다를 좋아해요.  그녀는 그것을 어디에나 가지고 다니는데, 그것은 매우 부드럽고 귀엽다.  한쪽 귀는 다른 한쪽 귀보다 약간 낮고, 저는 그것이 비대칭적으로 설계되었다고 생각하지 않습니다. 하지만 제가 지불한 것에 비해서는 조금 작습니다. 같은 가격에 더 큰 옵션이 있을 수도 있다고 생각합니다.  생각보다 하루 빨리 도착해서 딸에게 주기 전에 직접 가지고 놀게 되었어요.
"""
prompt = f"proofread and correct this review: ```{text}```"
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    This is the corrected review:
    
    이건 내 딸이 생일 선물로 받은 거야. 내 딸이 내 방에서 계속 가져가고 있어. 네, 어른들도 판다를 좋아해요. 그녀는 그것을 어디든지 가지고 다니는데, 그것은 매우 부드럽고 귀엽습니다. 한쪽 귀는 다른 한쪽 귀보다 약간 낮은데, 저는 그것이 비대칭적으로 디자인된 것 같지 않습니다. 하지만 제가 지불한 가격에 비해 조금 작은 것 같습니다. 같은 가격에 더 큰 옵션이 있을 수도 있다고 생각합니다. 생각보다 빨리 도착해서 딸에게 주기 전에 직접 가지고 놀게 되었어요.
    ```
    

```
from redlines import Redlines

diff = Redlines(text,response)
display(Markdown(diff.output_markdown))
```

- 모델 답변
    
    ![[Untitled 3 2.png|Untitled 3 2.png]]
    

```
prompt = f"""
이 리뷰를 교정하고 수정합니다. 좀 더 설득력 있게. 
APA 스타일 가이드를 따르고 고급 판독기를 대상으로 합니다. 
마크다운 형식의 출력입니다.
텍스트: ```{text}```
"""
response = get_completion(prompt)
display(Markdown(response))
```

- 모델 답변
    
    ```
    내 딸이 생일 선물로 받은 판다 인형을 구매하였습니다. 그러나 내 딸은 이제 내 방에서 계속 이 인형을 가져가고 있습니다. 이 인형은 어른들도 좋아할 만큼 매우 귀엽고 부드러운 소재로 만들어졌습니다. 한쪽 귀가 다른 한쪽 귀보다 약간 낮은 것은 비대칭적으로 디자인되었다고 생각하지 않습니다. 그러나 제가 지불한 가격에 비해 조금 작은 것 같습니다. 동일한 가격대에서 더 큰 옵션이 있을 수도 있다는 생각이 듭니다. 그러나 상품은 생각보다 빠르게 도착하여 딸에게 선물하기 전에 직접 놀 수 있었습니다. 이 인형은 매우 귀여우며 부드러워서 추천합니다.
    ```
    

  

# 7. 확장: expanding [강의 바로가기]

> 이 과정에서는 각 고객의 리뷰에 맞는 고객 서비스 이메일을 생성합니다.

## 맞춤형 고객 이메일 자동 응답

```
# "추측하기" 강의에서 배운 정서와
# 원래 고객 메시지를 고려하여 이메일을 사용자 정의합니다
sentiment = "부정적"

# review for a blender
review = f"""
그래서, 그들은 여전히 11월 한 달에 약 절반 할인된 49달러에 계절적으로 판매되는 17피스 시스템을 가지고 있었지만, 어떤 이유에서인지 12월 둘째 주 즈음에 가격이 같은 시스템에 대해 70달러에서 89달러 사이로 모두 올랐다. 그리고 11피스 시스템은 또한 초기 판매 가격인 29달러에서 약 10달러 정도 올랐다. 그래서 괜찮아 보이지만, 베이스를 보면 블레이드가 제자리에 고정되는 부분이 몇 년 전의 이전 버전보다 좋아 보이지 않지만, 저는 매우 부드럽게 다룰 계획입니다(예를 들어 콩, 얼음, 쌀 등의 매우 단단한 품목을 으깨어요). 먼저 믹서기에 넣고 내가 원하는 크기로 분쇄한 다음, 더 가는 밀가루를 위해 휘핑 블레이드로 전환하고, 스무디를 만들 때는 십자 절단 블레이드를 먼저 사용하고, 더 가는/적은 펄프가 필요하면 평평한 블레이드를 사용합니다.). 스무디를 만들 때 특별한 팁, 과일과 야채를 잘게 썰어서 얼리세요. (시금치를 살짝 끓이면 시금치를 부드럽게 한 후 사용할 준비가 될 때까지 얼리고, 소르베를 만들 경우 중소 크기의 식품 프로세서를 사용하세요.) 스무디를 만들 때 그렇게 많은 얼음을 추가하는 것을 피할 수 있습니다. 약 1년 후, 모터가 이상한 소리를 내고 있었다. 나는 고객 서비스를 요청했지만, 보증 기간이 만료되어 다른 것을 구매해야 했다. 참고: 이런 종류의 제품들은 전반적인 품질이 향상되었기 때문에, 그들은 매출을 유지하기 위해 브랜드 인지도와 소비자 충성도에 의존하고 있습니다. 이틀 만에 받았어요.
"""
```

```
prompt = f"""
당신은 고객 서비스 AI 비서입니다.
귀하의 업무는 중요한 고객에게 이메일 회신을 보내는 것입니다.
''로 구분된 고객 이메일이 주어지면 고객의 검토에 감사하는 답변을 생성합니다.
만약 그 감정이 긍정적이거나 중립적이라면, 그들의 검토에 감사하라.
감정이 부정적인 경우 사과하고 고객 서비스에 연락할 수 있다고 제안합니다. 
검토의 특정 세부 정보를 사용해야 합니다.
간결하고 전문적인 어조로 쓰세요.
이메일에 'AI 고객 에이전트'라고 서명합니다.
고객 후기: ```{review}```
리뷰 정서: {sentiment}
"""
response = get_completion(prompt)
print(response)
```

- 모델 답변
    
    ```
    제목: 고객 후기에 대한 회신
    
    안녕하세요,
    
    저희 제품을 구매해 주셔서 감사합니다. 그러나, 고객님의 후기를 읽어보니 매우 안타까운 일이 있었다는 것을 알게 되었습니다. 저희 제품이 고객님께서 기대하시던 것보다 더 나쁜 성능을 보여드렸다는 것에 대해 진심으로 사과드립니다.
    
    고객님의 후기를 토대로, 저희 제품의 가격 변동과 모터 소리에 대한 문제를 파악할 수 있었습니다. 이러한 문제가 발생한 것에 대해 저희는 책임을 지고, 고객님께서 불편을 겪지 않도록 최선을 다하겠습니다.
    
    만약 다른 문제가 발생하거나 제품에 대한 질문이 있으시면, 언제든지 고객 서비스에 연락해 주시기 바랍니다. 저희는 항상 고객님의 만족을 최우선으로 생각하고 있습니다.
    
    감사합니다.
    
    AI 고객 에이전트 드림
    
    (번역: 번역기)
    ```
    

## 고객의 이메일에 있는 세부 정보를 사용하도록 모델에게 알림

```
prompt = f"""
당신은 고객 서비스 AI 비서입니다.
귀하의 업무는 중요한 고객에게 이메일 회신을 보내는 것입니다.
''로 구분된 고객 이메일이 주어지면 고객의 검토에 감사하는 답변을 생성합니다.
만약 그 감정이 긍정적이거나 중립적이라면, 그들의 검토에 감사하라.
감정이 부정적인 경우 사과하고 고객 서비스에 연락할 수 있다고 제안합니다.
검토의 특정 세부 정보를 사용해야 합니다.
간결하고 전문적인 어조로 쓰세요.
이메일에 'AI 고객 에이전트'라고 서명합니다.
고객 후기: ```{review}```
리뷰 정서: {sentiment}
"""
response = get_completion(prompt, temperature=0.7)
print(response)
```

- 모델 답변
    
    ```
    안녕하세요,
    
    저희 제품에 대한 솔직한 리뷰 감사합니다. 고객님의 의견은 우리 제품을 개선하는 데 큰 도움이 됩니다.
    
    하지만, 고객님께서 제품 사용 중 문제가 발생하셨다는 것을 듣게 되어 매우 안타깝습니다. 저희 제품에 대한 고객 만족도와 신뢰도는 매우 중요하게 생각하며, 제품에 대한 문제가 발생한 경우 적극적으로 대처하고 있습니다.
    
    불편을 드려 대단히 죄송합니다. 고객님께서는 저희 고객 서비스에 연락하셔서 도움을 받으실 수 있습니다.
    
    감사합니다.
    
    AI 고객 에이전트
    ```
    

# 8. 채팅 형식: The Chat Format [강의 바로가기]

> 이 노트북에서는 채팅 형식을 활용하여 특정 작업이나 행동에 맞게 개인화되거나 전문화된 챗봇과 확장된 대화를 할 수 있는 방법을 탐구할 것이다.

  

```
def get_completion(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0, # this is the degree of randomness of the model's output
    )
    return response.choices[0].message["content"]

def get_completion_from_messages(messages, model="gpt-3.5-turbo", temperature=0):
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature, # this is the degree of randomness of the model's output
    )
#     print(str(response.choices[0].message))
    return response.choices[0].message["content"]
```

```
messages =  [  
{'role':'system', 'content':'당신은 셰익스피어처럼 말하는 assistant입니다.'},    
{'role':'user', 'content':'나에게 농담을 해줘'},   
{'role':'assistant', 'content':'닭은 왜 길을 건넜을까?'},   
{'role':'user', 'content':'나도 몰라요'}  ]
```

```
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

- 모델 답변
    
    ```
    닭은 반대편까지 가기 위해서였지요. (왜냐하면 그 쪽에 다른 계획이 있었거든요!)
    ```
    

```
messages =  [  
{'role':'system', 'content':'당신은 친절한 챗봇입니다.'},    
{'role':'user', 'content':'안녕, 내 이름은 이사야'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

- 모델 답변
    
    ```
    안녕하세요 이사야님, 반갑습니다! 저는 당신의 질문에 최선을 다해 답변해드릴 수 있는 챗봇입니다. 무엇을 도와드릴까요?
    ```
    

```
messages =  [  
{'role':'system', 'content':'당신은 친절한 챗봇입니다'},    
{'role':'user', 'content':'네, 제 이름이 뭐죠?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

- 모델 답변
    
    ```
    제 이름은 AI 챗봇입니다. 제가 도움이 필요한 부분이 있으면 언제든지 말씀하세요.
    ```
    

```
messages =  [  
{'role':'system', 'content':'당신은 친절한 챗봇입니다'},
{'role':'user', 'content':'안녕, 내 이름은 이사야'},
{'role':'assistant', 'content': "안녕 이사! 만나서 반가워. \
제가 오늘 도와드릴 일이 있나요?"},
{'role':'user', 'content':'네, 제 이름이 뭐죠?'}  ]
response = get_completion_from_messages(messages, temperature=1)
print(response)
```

- 모델 답변
    
    ```
    당신의 이름은 이사입니다. 제가 기억하고 있었답니다! 있어보이는 다른 질문이 있나요?
    ```
    

## **주문 봇**

> 우리는 OrderBot을 구축하기 위해 user 프롬프트 및 보조 응답 수집을 자동화할 수 있다. OrderBot은 피자 레스토랑에서 주문을 받을 것이다.

```
def collect_messages(_):
    prompt = inp.value_input
    inp.value = ''
    context.append({'role':'user', 'content':f"{prompt}"})
    response = get_completion_from_messages(context) 
    context.append({'role':'assistant', 'content':f"{response}"})
    panels.append(
        pn.Row('user:', pn.pane.Markdown(prompt, width=600)))
    panels.append(
        pn.Row('assistant:', pn.pane.Markdown(response, width=600, style={'background-color': '\#F6F6F6'})))
 
    return pn.Column(*panels)
```

```
import panel as pn  # GUI
pn.extension()

panels = [] # collect display 

context = [ {'role':'system', 'content':"""
당신은 피자집의 주문을 받는 자동화된 서비스인 OrderBot입니다.
당신은 먼저 고객에게 인사한 다음 주문을 받은 후 픽업인지 배송인지 물어봅니다.
전체 주문을 수집할 때까지 기다렸다가 요약하고 고객이 추가할 다른 내용이 있는지 최종 확인합니다.
배송이라면, 당신은 주소를 요청합니다.
마침내 당신은 지불금을 회수한다.
메뉴에서 항목을 고유하게 식별할 수 있도록 모든 옵션, 추가 및 크기를 명확히 해야 합니다.
당신은 짧고 매우 대화하기 좋은 스타일로 대답합니다.

메뉴는 다음 항목이 포함됩니다.
페퍼로니 피자 12.95, 10.00, 7.00
치즈피자 10.95, 9.25, 6.50
가지 피자 11.95, 9.75, 6.75
감자튀김 4.50, 3.50
그리스 샐러드 7.25
토핑:
치즈 추가 2.00,
양송이버섯 1.50개
소시지 3.00
캐나다산 베이컨 3.50
AI 소스 1.50
후추 1.00
음료:
코크스 3.00, 2.00, 1.00
스프라이트 3.00, 2.00, 1.00
생수 5.00
"""} ]  # accumulate messages


inp = pn.widgets.TextInput(value="안녕하세요.", placeholder='여기에 텍스트 입력하세요...')
button_conversation = pn.widgets.Button(name="채팅!")

interactive_conversation = pn.bind(collect_messages, button_conversation)

dashboard = pn.Column(
    inp,
    pn.Row(button_conversation),
    pn.panel(interactive_conversation, loading_indicator=True, height=300),
)

dashboard
```

- 모델 답변
    
    ![[Untitled 4 2.png|Untitled 4 2.png]]
    
    ![[Untitled 5.png]]
    

```
messages =  context.copy()
messages.append(
{'role':'system', 'content':'이전 음식 주문의 json 요약을 만듭니다. 각 품목의 가격을 항목화합니다.\
 필드는 1) 피자, 2) 토핑 목록 포함 3) 음료 목록 포함 4) 사이드 목록 포함 5) 총 가격이어야 합니다'},    
)
 # 필드는 1) 피자, 가격 2) 토핑 목록 3) 음료 목록 포함 가격 포함 4) 사이드 목록 포함 가격 포함 가격 포함 가격 포함 5) 총 가격',

response = get_completion_from_messages(messages, temperature=0)
print(response)
```

- 모델 답변
    
    ```
    {
        "피자": {
            "페퍼로니 피자 (소형)": 7.00
        },
        "토핑": {
            "캐나다산 베이컨": 3.50
        },
        "음료": {
            "스프라이트 (소형)": 1.00
        },
        "사이드": {},
        "총 가격": 14.50
    }
    ```
    

# 정리하기

- [ ] 프롬프팅을 위한 핵심 원칙에 대해 고찰하십시오: 명확하고 구체적인 지시사항 및 모델에게 생각할 시간을 제공하기
- [ ] 반복적인 프롬프트 개발 과정을 기억하십시오
- [ ] 대형 언어 모델의 기능을 탐구하십시오: 요약, 추론, 변환 및 확장
- [ ] 맞춤형 챗봇 구축 실험하기
- [ ] 대형 언어 모델을 사용한 작은 프로젝트 만들기
- [ ] 이전 프로젝트에서의 학습을 사용하여 후속 프로젝트를 개선하기
- [ ] 아이디어가 있다면 더 큰 프로젝트에 도전하기
- [ ] 대형 언어 모델을 책임 있게 사용하고 긍정적인 영향을 확보하기
- [ ] 코스에 대한 인지를 높이고 다른 사람들이 참여하도록 권장하기

  

  

# 참고

> [!info] ChatGPT Prompt Engineering for Developers - DeepLearning.AI  
> What you’ll learn in this course In ChatGPT Prompt Engineering for Developers, you will learn how to use a large language model (LLM) to quickly build new and powerful applications.  Using the OpenAI API, you’ll...  
> [https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/)  

- https://github.com/eitansela/deeplearning-ai-chatgpt-prompt-eng

- https://github.com/eunice-hong/deeplearning-ai-chatgpt-prompt-ko

