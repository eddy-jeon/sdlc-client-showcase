# SDLC Client Showcase

`SDLC Client`를 소개하기 위한 독립 GitHub Pages 랜딩 페이지입니다.

별도 build step 없이 `index.html`, `styles.css`, `script.js`만으로 동작합니다. GitHub Pages의
project site 경로에서도 작동하도록 모든 asset 경로를 상대 경로로 사용합니다.

## 온라인 실행

QueryPie 계정으로 로그인하면 운영 중인
[SDLC Client](https://sdlc-client.dev.querypie.io)에서 내 Jira 티켓과 연결된 작업을
브라우저로 확인하고 이어갈 수 있습니다.

## 로컬 미리보기

```bash
cd /Users/eddy/Documents/worktree/product/acp/sdlc-client-showcase
python3 -m http.server 4173
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다.

## GitHub Pages 배포

새 개인 repository를 만들고 이 디렉터리를 push합니다.

```bash
cd /Users/eddy/Documents/worktree/product/acp/sdlc-client-showcase
git init
git add .
git commit -m "feat: add SDLC Client showcase"
gh repo create sdlc-client-showcase --public --source=. --remote=origin --push
```

GitHub repository의 `Settings → Pages → Build and deployment`에서 `GitHub Actions`를 선택합니다.
이후 `main` push마다 `.github/workflows/deploy-pages.yml`이 사이트를 배포합니다.

배포 URL은 보통 다음 형태입니다.

```text
https://<github-username>.github.io/sdlc-client-showcase/
```

## 콘텐츠 근거

페이지의 제품 설명은 `querypie-mono`의 다음 원본을 기준으로 작성했습니다.

- `tools/sdlc-client/README.md`
- `tools/sdlc-client/DESIGN.md`
- `tools/sdlc-client/NOTES.md`
- `.agents/sdlc/README.md`
- `.agents/sdlc/core/references/state-machine.md`
- `.agents/skills/sdlc-orchestrator/references/sdlc-client-usage.md`

## 수정하기

- 본문과 Q&A: `index.html`
- 색상, layout, responsive style: `styles.css`
- 티켓 데모, 메뉴, 복사, FAQ interaction: `script.js`
- 실제 `SDLC Client` 코드 링크: `index.html`의 final CTA
