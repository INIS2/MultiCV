# MultiCV
One source JSON으로 여러 이력서 템플릿을 렌더링하고 편집하는 정적 프로젝트입니다.

## 기획 동기
CV/Resume를 쓸 때 마다 내가 한 일을 정리하는데 시간이 많이 소모되는게 항상 불만이었습니다.

더불어
- 각 회사마다 보여주고싶은 정보와 가리고 싶은 정보가 있는데 매번 다르게 설정하기가 어려움
- 다양한 Portfolio/CV/Resume를 찾아보았지만 마음에 쏙 드는게 많지 않음.
- 게다가 디자인을 바꿀 때마다 다시 작성하기가 너무 귀찬음

등등의 이유로 다음과 같은 기능을 가진 프로젝트를 기획했습니다.
- 통합 정보를 1번 구축하면 비슷한 포맷에서(물론 데이터 구조가 크게 다르면 안되겠지만) 여러 템플릿을 사용할 수 있게 함
- 세부 요소를 보여줄지 말지에 대한 컨트롤이 가능하고 그 상태를 데이터를 추출하거나 프린트 가능
- 여러 상태값을 미리 올려두되 암호화하여 public repo에서도 정보별 접근제어 가능
- url 파라미터를 통해 경로 및 PW를 같이 전달하여 별도 조작없이 링크만으로 개개별 정보 다이렉트 접근
- 기본적으로는 개인 사용을 위한 프로젝트라서 DATA 폴더에 암호걸린 파일들을 넣어놓겠지만, 예시양식을 활용하여 누구나(조금의 노가다를 곁들이면) 데이터 편집/추출/인쇄가 가능하도록 함
- Github Pages를 통해 조작이 가능하도록 정적 페이지로 구현(data 디렉토리를 DB처럼 활용)

## 구조
assets
- css(공통구조)
- js(공통구조)
template
data
index.html

## 워크플로우
1.index는 랜딩페이지이다.이 사이트의 설명이 있고, 어떤 템플릿을 활용할 수 있는지가 나온다.
2. /~~~ 하게되면 data폴더 안의 파일명을 찾는다. 기본적으로는 json인데 json안에 meta에 어떤 템플릿으로 연동할지가 나와있다. 그 템플릿 이름을 다시 /template에서 찾아 띄워준다.
3. /~~~ 해서 파일명을 찾았을때 zip일 수 있다. PW가 걸릴수도 안걸릴수도 있다. PW가 걸려있다면 풀 수 있도록 화면에서 물어봐야한다. 아니면 처음부터 링크에서 pw=XXXX라는 식으로 파라미터를 줄 수도 있다. 안에는 json과 같이 활용되는 img들이 있을 수 있다. 
4. /edit/~~~ 하면 편집이 되는 페이지로 넘어갈 수 있는데 당연히 암호걸린 파일은 암호를 물어봐야한다.

## 향후 추진사항
암호화 프로세스 확인
자료등록을 통한 처리
편집기능 고도화
desc 마크다운 호환?


--------------------------------------------------------------------------------------------
## AI 내용정리

## 기획 배경

이력서와 포트폴리오를 템플릿마다 다시 만드는 과정은 반복 작업이 많고 유지보수 비용이 큽니다.  
MultiCV는 하나의 데이터 소스를 기준으로 여러 형태의 이력서 결과물을 빠르게 확인하고, 필요할 때 즉시 수정할 수 있도록 만드는 것을 목표로 합니다.

핵심 방향은 다음과 같습니다.

- 이력서 원본 데이터는 한 곳에서 관리한다.
- 템플릿은 여러 개를 두고 같은 데이터를 서로 다른 형태로 렌더링한다.
- 정적 환경에서도 열람, 편집, 다운로드, 인쇄가 가능해야 한다.
- 템플릿은 가능한 한 서로 독립적으로 동작해야 한다.

## 현재 구조

```text
MultiCV/
├─ index.html
├─ 404.html
├─ assets/
│  ├─ css/
│  │  └─ style.css
│  ├─ img/
│  │  ├─ brand/
│  │  └─ icons/
│  └─ js/
│     ├─ app.js
│     ├─ data.js
│     ├─ helpers.js
│     ├─ router.js
│     ├─ template-loader.js
│     ├─ ui.js
│     └─ pages/
│        ├─ landing.js
│        ├─ view.js
│        └─ edit.js
├─ data/
│  ├─ (Template) classic-column.json
│  ├─ (Template) board-grid.json
│  ├─ (Template) sidebar-timeline.json
│  ├─ (Template) magazine-block.json
│  ├─ resume1.json
│  ├─ resume2.json
│  ├─ resume3.json
│  └─ resume4.json
└─ template/
   ├─ classic-column.js
   ├─ board-grid.js
   ├─ sidebar-timeline.js
   └─ magazine-block.js
```

## 데이터 규칙

모든 이력서 데이터는 JSON 파일입니다.

- 일반 데이터 파일: `resume1.json`, `resume2.json`, `resume3.json`, `resume4.json`
- 템플릿 샘플 파일: `(Template) classic-column.json` 같은 형식
- 랜딩 분류 기준:
  파일명에 `template` 문자열이 포함되면 `Template`
  포함되지 않으면 `Data`
- 실제 렌더 기준:
  각 JSON의 `meta.template`
- 카드 설명 기준:
  각 JSON의 `meta.template_desc`

현재 템플릿 id는 다음 네 가지입니다.

- `classic-column`
- `board-grid`
- `sidebar-timeline`
- `magazine-block`

## 워크플로우

1. `index.html`로 진입하면 랜딩 페이지가 열린다.
2. 랜딩은 `data.js`에서 정해진 후보 파일명을 직접 probe해서 존재하는 JSON만 수집한다.
3. `Template` 섹션은 샘플 JSON을 읽고 실제 템플릿을 축소 렌더한 preview를 보여준다.
4. `Data` 섹션은 실제 렌더 대신 목업 카드로 파일 목록을 보여준다.
5. 사용자가 파일을 열면 JSON의 `meta.template` 값을 기준으로 대응하는 템플릿 모듈을 동적으로 불러온다.
6. `edit` 모드에서는 JSON을 직접 수정하고, 같은 템플릿으로 미리보기를 갱신한다.

## URL 규칙

- 랜딩: `./index.html`
- 뷰: `./index.html?resume=<fileName>`
- 편집: `./index.html?resume=<fileName>&mode=edit`

예시:

- `./index.html?resume=resume1.json`
- `./index.html?resume=resume1.json&mode=edit`
- `./index.html?resume=(Template)%20classic-column.json`

## 현재 기능

- 공통 topbar와 로고
- 랜딩 페이지 템플릿/데이터 자동 분류
- 템플릿 카드 실제 축소 preview
- 데이터 카드 목업 preview
- 뷰 모드
- 편집 모드
- JSON 다운로드
- `resume-shell`만 인쇄
- 상단 설정 드롭다운
- 정보 모달
- 정적 배포 환경 대응

## 매니페스트 생성

랜딩 페이지는 `data/manifest.json`을 기준으로 목록을 읽습니다.
`data/` 또는 `template/` 아래 파일을 추가/삭제한 뒤에는 아래 명령으로 매니페스트를 다시 생성해야 합니다.

```bash
npm run generate:manifest
```

생성 스크립트는 [data/generate-manifest.mjs](/C:/DEV/MultiCV/data/generate-manifest.mjs)에 있습니다.

## 템플릿 설계 원칙

현재 템플릿은 가능한 한 self-contained 구조를 따릅니다.

- 템플릿은 각 파일 내부에 자신의 마크업, 스타일, 렌더 로직을 가진다.
- 앱 셸은 라우팅, 데이터 로드, topbar, 모달 같은 공통 기능만 담당한다.
- 템플릿은 `meta.template`와 파일명만 맞으면 동적으로 연결된다.
- 별도의 템플릿 레지스트리 하드코딩은 사용하지 않는다.

## 기술 메모

- 번들러 없이 ES module 기반으로 동작
- 정적 파일 구조
- 서버 DB 없음
- JSON이 source of truth 역할
- 템플릿은 동적 import 방식으로 로드
- 공통 스타일은 앱 셸 중심, 템플릿 스타일은 각 템플릿 내부 중심

## 현재 한계

- 데이터 탐색은 실제 폴더 스캔이 아니라 후보 파일명 probe 방식이라 확장성이 제한적입니다.
- 랜딩 분류가 파일명 규칙에 의존하고 있어, 장기적으로는 `meta.kind` 같은 명시적 메타가 더 안전합니다.
- ZIP/PW 해제 워크플로우는 아직 구현되지 않았습니다.
- 템플릿 수가 더 늘어나면 후보 파일명 규칙도 함께 관리해야 합니다.
- 브라우저별 인쇄 결과와 실제 배포 환경 테스트는 추가 검수가 필요합니다.

## 보완 제안

- 파일명 규칙 대신 `meta.kind`, `meta.sample`, `meta.name` 같은 메타 필드로 분류 전환
- `data/` 후보 목록 자동 생성 스크립트 추가
- ZIP 및 비밀번호 입력 흐름 구현
- 템플릿별 썸네일 캐시 또는 preview 최적화
- README와 데이터 스키마 문서 분리

현재 구현은 다음 원칙으로 정리할 수 있습니다.

- 앱 셸과 템플릿을 분리했다.
- 템플릿은 이름 기반으로 동적 로딩된다.
- 하나의 JSON 구조를 여러 템플릿에 연결할 수 있다.
- 랜딩, 뷰, 편집이 모두 정적 파일만으로 동작한다.
- 편집 화면은 로컬 JSON 수정과 미리보기에 집중한다.
