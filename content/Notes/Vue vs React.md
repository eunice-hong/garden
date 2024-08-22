---
title: "Vue vs React"
description: "Vue.js와 React의 공통점과 차이점을 알아보자."
date: 2019-07-10
tags:
  - 🌿
  - Vue
  - React
---


## 💁‍♀️Why Vue & React?

  

지난 2주 프로젝트에서 나는 React를 활용하여 프론트엔드 작업을 진행하였다. 그러면서 Vue.js와 Angular와 같은 다른 SPA 라이브러리는 어떻게 동작하는지 궁금해졌다. 그 중에서도 최근 성장세에 있는 Vue.js에 대해 관심을 갖게 되었다. 중국을 기반으로 점차 많은 개인과 기업들이 채택하고 있는 Vue.js를 공부해봐야겠다고 생각했다. 때마침 Vue.js를 사용하는 4주 프로젝트에 참여할 기회가 생겼다.

막상 Vue.js를 공부해보니 React와 비슷한 점이 많다고 느껴졌다. 컴포넌트를 기반으로 사용하는 것부터 props를 내려 하위 컴포넌트에서 사용할 수 있게하는 점 등 기본적인 부분에서 많이 유사하다는 생각이 들었다. 그래서 본 포스트에서 Vue.js와 React가 어떤 공통점을 갖고, 어떤 차이점을 가지는지 알아보려고 한다.

  

## 🤲 Vue vs React의 공통점


> _- Virtual DOM을 활용한다.  
> - 반응적이고 조합 가능한 컴포넌트를 제공한다.  
> - 라이브러리가 자기 자신의 핵심 기능에만 집중하고 있다._

  
반응적이고 조합가능한 컴포넌트를 제공한다고 되어있는데, 여기서 반응적이라는 말은 데이터 변경에 따라 반응적으로 화면이 갱신된다는 의미를 가지고 있다. React에서는 state 객체, Vue에서는 data 객체 안에 담겨서 데이터가 바뀔 때마다 화면에도 적용하여 나타낸다.


그리고 React와 Vue 모두 핵심 라이브러리를 중점적으로 다루고 나머지는 외부 라이브러리에 역할을 분담한다. 라우팅은 React에서 ==**React-route**==, Vue에서는 ==**Vue Router**==, 전역 상태관리는 React에서 **==Redux==**, Vue에서는 **==Vuex==**가 담당하고 있다.

  

  

## 🧶 Vue vs React의 내적 차이점 - 데이터 바인딩

### 1. Component 변수 저장

  

### ✔ Vue

```
<script>
export default {
  data() {
    return {
      input: "",
      todoItems: []
    };
  },
```

### ⚛ React

```
this.state = {
	input: "",
	todoItems: []
	... 
}


```

  

### 2. Component 내부 데이터 바인딩

  

### 💻 Source Code

  

- ⚛ **React** `TodoList.jsx`
    
    ```
    import React, { Component } from "react";
    import TodoItem from "./TodoItem";
    
    export default class TodoList extends Component {
      constructor(props) {
        super(props);
        this.state = {
          input: "",
          todoItems: []
        };
      }
      addTodo = () => {
        const newTodo = {
          id: this.state.todoItems.length,
          title: this.state.input
        };
        this.setState({
          input: "",
          todoItems: [...this.state.todoItems, newTodo]
        });
      };
      deleteItem = id => {
        this.setState({
          todoItems: this.state.todoItems.filter(todo => todo.id !== id)
        });
      };
      render() {
        const { input, todoItems } = this.state;
        return (
          <div>
            <h1>✔ Todo List</h1>
            <div>
              <input
                type="text"
                onKeyUp={e => {
                  this.setState({ input: e.target.value });
                }}
                defaultValue={input}
              />
              <button onClick={this.addTodo}>추가하기</button>
            </div>
            <ul>
              {todoItems.map(todo => (
                <TodoItem todo={todo} deleteItem={this.deleteItem} />
              ))}
            </ul>
          </div>
        );
      }
    }
    ```
    
      
    
- ⚛ **React** `TodoItem.jsx`
    
    ```
    import React, { Component } from "react";
    
    export default class TodoItem extends Component {
      render() {
        const { todo, deleteItem } = this.props;
        return (
          <li>
            {todo.title}
            <button
              onClick={() => {
                deleteItem(todo.id);
              }}
            >
              제거하기
            </button>
          </li>
        );
      }
    }
    ```
    
      
    
- ✔ **Vue** `TodoList.vue`
    
    ```
    <template>
      <div class="hello">
        <div>
          <h1>✔ Todo list</h1>
          <input v-model="input" type="text">
          <button @click="addTodoItem">추가하기</button>
        </div>
        <ul>
          <TodoItem
            v-for="(todo, index) in todoItems"
            :key="index"
            :todo="todo"
            :index="index"
            @deleteTodo="(index)=> deleteTodoItem(index)"
          />
        </ul>
      </div>
    </template>
    
    <script>
    import TodoItem from "./TodoItem";
    export default {
      components: {
        TodoItem
      },
      data() {
        return {
          input: "",
          todoItems: []
        };
      },
      methods: {
        addTodoItem() {
          this.todoItems.push(this.input);
        },
        deleteTodoItem(index) {
          this.todoItems.splice(index, 1);
        }
      }
    };
    </script>
    ```
    
      
    
- ✔ **Vue** `TodoItem.vue`
    
    ```
    <template>
      <li>
        {{todo}}
        <button @click="deleteTodo">제거하기</button>
      </li>
    </template>
    
    <script>
    export default {
      props: {
        todo: {
          type: String,
          default: ""
        },
        index: {
          type: Number,
          default: -1
        }
      },
      data() {
        return {
          input: "",
          todoItems: []
        };
      },
      methods: {
        deleteTodo() {
          this.$emit("deleteTodo", this.index);
        }
      }
    };
    </script>
    ```
    
      
    

  

  

⚛ **React**

React의 경우 데이터 바인딩이 단방향이다. 이 때, 데이터 바인딩이란 Application UI와 비즈니스 논리를 연결하는 프로세스다. React는 state 객체 안에 담겨있는 값들이 UI에 그대로 반영될 뿐, UI가 state 값을 변경할 수는 없다. UI 작동을 통해 값을 변경하고자 하는 경우, 함수를 발생시켜야하고 그 함수에 `setState`라는 함수를 사용하여 새로운 값으로 대체하는 방법이 있다. 즉, 직접적으로 state를 변경시키는 것은 불가능하다.

**✔ Vue**

Vue의 경우 컴포넌트의 변수를 data라는 객체에서 관리한다. React와는 달리 mutable하기 때문에 위와 같이 data 변수를 직접 조작하는 것이 가능하다. 그리고 input field의 v-model에 data를 넣어주고 input 값을 입력하게 되면 v-model에 있는 값이 data 객체 내에도 그대로 반영된다. 즉, React가 `setState`를 통해 State를 변경하여 그것을 컴포넌트에 반영하는 방식과는 달리, component에서 정의된 값을 data 객체에 반영하게 되는 것이다. 다시 말해 React의 경우 `state → component`의 일방적 데이터 바인딩이 일어나지만, Vue의 경우 그 반대인 `component → data`로의 역방향 데이터 바인딩도 가능하여 **양방향 바인딩**이라고 할 수 있다.

  

  

  

  

### 3. Component 간 데이터 바인딩

⚛ **React**

위 Todo list에서 todoItem은 TodoList에 있는 state: TodoItems props로 내려받아 렌더링 하고 있다. 그런데, todoItem의 delete 버튼을 눌러 TodoItems의 목록 중 하나를 제거하기 위해서는 어떻게 해야할까? 다시 말해 자식 컴포넌트에서 부모컴포넌트의 state를 조작하기 위해서는 어떻게 해야할까?

가장 보편적인 방법으로는 Todolist의 state를 조작할수 있는 함수를 props로 내려주어서 그것을 자식컴포넌트가 실행하는 방식이 있다. 이 경우에도 결국에는 부모컴포넌트에 있는 state가 변경되어 그 변경사항이 props로 타고 내려와 렌더링 되는 것이기 때문에 일방적인 데이터 바인딩이라고 할 수 있다.

**✔ Vue**

Vue의 경우 `TodoItem`에서 delete 버튼을 눌러 `TodoItems`를 조작해야하는 경우, `$emit`이라는 함수를 사용하여 부모 컴포넌트에게 실행해야하는 함수를 알려주는 방식으로 해결할 수 있다. `$emit`의 첫번째 인자로 `$emit`할 함수의 key값을 입력하고, 그 뒤에는 argument를 입력한다. 그리고 부모 컴포넌트에서는 자식컴포넌트에 `$emit` key값을 입력해두고 `$emit`이 일어나는 경우 key값에 할당된 함수를 실행한다. 즉, `$emit`을 통해 데이터를 부모 컴포넌트로 보내어 직접 조작하도록 만든 것이다. 다시 말해 Vue에서는 props를 통해 데이터를 자식 컴포넌트에 전송할 수도 있지만, `$emit`을 통해 부모 컴포넌트로 전송할 수도 있다.

  

## 🧶 Vue vs React의 외적 차이점

  

### 1. 생태계

  

![[Untitled 2 6.png|Untitled 2 6.png]]

  

Vue의 경우 상태관리와 라우팅을 위한 핵심 라이브러리들이 항상 공식적으로 최신 상태를 유지됩니다. 이에 반해 React의 경우 보다 분산된 생태계를 가지고 있어, 다양성적인 측면에 있어서 더 풍부하다고 할 수 있습니다

  

  

### 2. 프로젝트 제너레이터

  

  

### ✔ Vue

### ⚛ React

```
$ vue-cli 
```

```
$ create-react-app 
```

  

  

마지막으로 Vue는 `Webpack`, `Browserify`또는 빌드 시스템 사용안함을 포함하여 원하는 빌드 시스템을 사용하여 새 프로젝트를 쉽게 시작할 수있게 해주는 CLI 프로젝트 생성기를 제공한다. 영역을 “create-react-app”로 설정했지만 현재 몇 가지 제한 사항이 있다.

  

- Vue의 프로젝트 템플릿은 `Yeoman`과 같은 사용자 정의를 허용하지만 프로젝트 생성 중에는 어떠한 구성도 허용하지 않는다.
- 단일 페이지 애플리케이션을 작성한다고 가정하는 단일 템플릿만 제공하며, Vue는 다양한 목적을 위해 다양한 템플릿를 제공하고 시스템을 빌드한다.
- 사용자 정의 템플릿에서 프로젝트를 생성할 수 없으며 사전 정의된 규칙을 사용하는 엔터프라이즈 환경에 특히 유용 할 수 있다.

  

이러한 제한 사항 중 상당수는 `create-react-app` 팀이 의도적으로 설계한 것이다. 예를 들어, 프로젝트의 요구가 매우 간단하고 빌드 프로세스를 사용자 정의하기 위해 “추출”할 필요가없는 한, 이를 종속으로 업데이트 할 수 있다.

  

  

### 3. 모바일 앱 개발

  

  

![[Notion/Archive/assets/Untitled 3 5.png|Untitled 3 5.png]]

![[Notion/Archive/assets/Untitled 4 4.png|Untitled 4 4.png]]

  

React Native를 사용하면 React 컴포넌트 모델을 사용하여 iOS및 Android용 기본 렌더링 애플리케이션을 작성할 수 있다. 한 가지 언어로 여러 플랫폼에 적용할 수 있다는 점에서 매우 큰 장점이라고 할 수 있다. Vue측에서는 Weex라는 프레임워크를 이용하여 웹 프론트엔드 기술을 그대로 모바일 앱 구축에 활용할 수 있다. 그런데 Weex의 경우 아직 개발 중이고 React Native만큼 성숙하지도, 많은 테스트를 거치지도 않아 다소 불안정하다고 할 수 있다.

  

  

## 📝 Vue & React 적용

  

### ✔ Vue

- 빠르게 결과물을 만들고 싶은 경우
- 가볍고 빠른 앱을 제작하고 싶은 경우

### ⚛ React

- 웹 개발 기술을 가지고 모바일 앱을 제작하려는 경우
- 큰 개발 생태계를 원하는 경우

  

우선 빠르게 결과물을 만들고 싶은 경우 Vue를 사용하는 것이 적절하다. React의 경우 JSX와 ES6에 많이 의존하고 있는 반면 Vue의 경우 ES5만으로도 앱을완성할 수 있어 러닝 커브가 높지 않기 때문이다. 그리고 templete 구조를 활용하기 때문에 기존의 웹 개발 패러다임과 유사하여 JSX를 이용하여 돔을 생성하는 방식보다 이해하기 쉽다.

  

그리고 가볍고 빠른 앱을 제작하고 싶다면 이 역시 Vue를 사용하는 것이 좋다. Vue의 핵심 엔지니어들이 실험한 결과 Vue가 React에 비해 적게는 1.5배에서 많게는 3.0배까지 더 빠른 것으로 나타났다. 초기 로딩시 지연이 생기는 SPA 특성을 고려해 볼 때, 조금이라도 빠른 Vue를 써야하는 경우가 있을 수 있겠다.

  

하지만 웹 개발 기술을 가지고 모바일 앱을 제작하려는 경우에는 React가 적합하다고 할 수 있다. 앞서 언급했다시피 Vue의 경우 Weex가 아직 성장하는 단계에 있고, ReactNative는 상당히 성숙한 프레임워크다. 실험적으로 Weex를 사용해볼 수 도 있겠지만, 형성되어있는 커뮤니티의 규모나 안정성등을 고려해볼때 ReactNative를 사용하는 것이 더 적합하다고 할 수 있다.

  

그리고 큰 개발 생태계를 원하는 경우 React를 선택하는 것이 좋다. Vue가 현재 성장세에 있기는 하지만, Facebook이라는 큰 기업에서 운영하는 React의 경우 현재 한달에 약 22.5만 npm 다운로드수를 가지고 있을 만큼 널리 사용되고 있다.

  

  

### 🍒 References

- [https://kr.vuejs.org/v2/guide/comparison.html](https://kr.vuejs.org/v2/guide/comparison.html)