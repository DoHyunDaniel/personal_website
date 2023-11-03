# personal_ website
This is my personal website, made by html5/css/javascript/express.js/node.js
노드js기반으로 만든 개인 웹사이트 프로젝트입니다.

목차

## 프로젝트 소개

<p align="justify">
지금까지 공부한 내용들을 복기하기 위해, 개인 공부 내용과 일기 등을 업로드하는 목적으로 제작한 개인 웹사이트입니다.
</p>

<br>

## 기술 스택

1. HTML5
2. CSS
3. Javascript
4. Node.js
5. Express.js
6. mySQL

<br>

## 구현 기능

### 메인페이지
- 스크롤 기능을 통해 리마인드할 사항들을 상단 navbar에 배치하고, 구글 아이콘을 활용해 login과 logout기능을 배치했습니다.
- 좌측 sidebar는 드래그를 통해 늘리거나 줄일 수 있고, 드롭다운으로 개인 게시판 화면, 사용자 계정 관리 등의 동작을 수행할 수 있습니다.
- 로그인은 mysql을 기반으로, 모달 창과 애니메이션을 적용하여 간단하게 로그인할 수 있도록 했습니다.(관리자 계정이 아닌 경우 방명록에 글 추가만 할 수 있습니다.)

### Boards 페이지
node.js기반으로 CRUD 기능을 구현했습니다. 관리자 계정으로 로그인시 전체 게시물들을 업로드, 수정, 삭제할 수 있고, 다른 계정으로 로그인할 경우 해당 기능은 이용할 수 없습니다.

### profiles 페이지
로그인한 사용자는 자신의 이름, 비밀번호, 이메일을 수정할 수 있습니다.

<br>

## 배운 점 & 아쉬운 점

<p align="justify">
node.js의 모듈 기반 제작 환경에 대해 좀 더 이해하게 되었습니다. html, css, javascipt을 좀 더 효과적으로 사용하게 되었습니다. 목표한 기능 구현을 위해 챗gpt와 stactoverflow, 구글링 등을 끊임없이 활용하였습니다.  css 스타일시트를 이용하기 위해 express.js를 처음으로 이용해봤는데, 새로운 언어를 활용함으로서 기존 언어보다 더 편리하게, 더 나은 기능을 이용하기 위한 프로그래머들의 시선을 이해하게 되었습니다. 
</p>

<br>

## 라이센스

MIT &copy; [NoHack](mailto:lbjp114@gmail.com)
