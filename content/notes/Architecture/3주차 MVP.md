---
title: "MVP 소개"
draft: true
noindex: true
---

🙈 fun beforeSession() {

}

🙊 fun onSession() {

🏆 MVP

V: Activity, Fragment, View

P: 로직 처리

EXAMPLE: 로그인 화면

}

🐒 fun afterSession() {

}

# 🙈 fun beforeSession() {

}

# 🙊 fun onSession() {

# 🏆 MVP

> [!info] android/architecture-samples  
> This version of the app is called todo-mvp, and provides a foundation for other samples in this project. The sample aims to: Provide a basic Model-View-Presenter (MVP) architecture without using any architectural frameworks. Act as a reference point for comparing and contrasting the other samples in this project.  
> [https://github.com/android/architecture-samples/tree/todo-mvp](https://github.com/android/architecture-samples/tree/todo-mvp)

🔺MVC (M: Model, V: XML, C: activity)

### V: Activity, Fragment, View

UI - user input / output 처리

### P: 로직 처리

- 어떻게 보여줄지 결정함
- if 분기가 여기에 포함됨

### EXAMPLE: 로그인 화면

- View: id, pw, log in button
- 클릭 이벤트 처리: 아이디, 비번 스트링 가져오기
- OUTPUT
    - 존재하지 않는 / 틀린 아이디 비번 → server
    - 로그인 성공 페이지 띄우기 → server
    - 아이디 비번 empty → client

  ⇒ server: **P가 담당하여 처리하는 부분**

  login button ⇒ presenter에 아이디 비번 보내서 처리하게 한다

  _click listener는 VIEW에 있지만, click listener안에있는 로직은 presenter에서 처리한다_

  presenter에 들어가는 함수들은 대체로 return 값이 없음

  에러 코드로 처리

  참고) adapter는 VIEW에 포함된다  
  presenter에서 context가 필요한 경우

    - 최대한 안 들고 있게 해야 한다. ⇒ for testable application
    - 대신 context를 갖고 있는 객체를 넘겨준다.
    - presenter 생성 시 resource를 만들어 주게 한다.

  ex P(R(R(a)L(a)))

    - presenter에서 view를 갖고 있으면 안 된다.
    - android와 멀게 만든다.

      View, Model은 가깝게 한다.

- package
    - ui
        - LogInContract:
            - interface LoginContract
                - interface View
                    - fun loginSuccess
                    - fun showErrorInvalidIdOrPW()
                      ...
                - interface Presenter
                    - fun login
        - LogInPresenter
            - class LoginPresenter(private val view: LoginContract.View, private val repository): ~.Presenter
                - override ...
        - LogInActivity
            - implement Contract.View, AppCompatActivity
                - dagger를 이용해서 @inject할 수 있다.

# }

# 🐒 fun afterSession() {

search

→ TODO shortcut for today date, author ...

# }