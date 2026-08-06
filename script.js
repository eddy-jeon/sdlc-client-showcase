const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const menuLabel = menuButton?.querySelector(".sr-only");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const navigationLinks = [
  ...document.querySelectorAll('.desktop-nav a[href^="#"]'),
];
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 28);
}

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  if (menuLabel) menuLabel.textContent = "메뉴 열기";
  mobileMenu?.classList.remove("open");
  header?.classList.remove("menu-visible");
  document.body.classList.remove("menu-open");
}

function toggleMenu() {
  const willOpen = menuButton?.getAttribute("aria-expanded") !== "true";
  menuButton?.setAttribute("aria-expanded", String(willOpen));
  if (menuLabel) menuLabel.textContent = willOpen ? "메뉴 닫기" : "메뉴 열기";
  mobileMenu?.classList.toggle("open", willOpen);
  header?.classList.toggle("menu-visible", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
menuButton?.addEventListener("click", toggleMenu);
mobileMenu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((item) => {
  const delay = Number(item.getAttribute("data-delay") ?? 0);
  item.style.transitionDelay = `${delay}ms`;
});

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.12 },
  );
  revealItems.forEach((item) => revealObserver.observe(item));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort(
          (left, right) => right.intersectionRatio - left.intersectionRatio,
        )[0];
      if (!visible) return;
      navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.6] },
  );
  sections.forEach((section) => sectionObserver.observe(section));
}

const quickstartCommand = `cd tools/sdlc-client
pnpm install
./bin/sdlc-client local setup
./bin/sdlc-client local doctor
./bin/sdlc-client local dev`;
const copyButton = document.querySelector("[data-copy-command]");

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(quickstartCommand);
    copyButton.textContent = "Copied";
    copyButton.classList.add("copied");
    window.setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("copied");
    }, 1800);
  } catch {
    copyButton.textContent = "복사 실패";
    window.setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1800);
  }
});

const demoData = {
  qpd5526: {
    key: "QPD-5526",
    status: "Plan 진행 중",
    stage: 0,
    kicker: "QPD-5526 · PLAN 단계",
    title: "접속 화면의 상태 피드백 개선",
    caption: "작업 폴더 준비됨",
    summaryTitle: "이번 단계에서 결정할 것",
    summaryBody:
      "오류가 발생한 뒤 사용자가 상황을 이해하고 다시 시도할 수 있도록, 현재 피드백 흐름과 목표 상태를 정리했습니다.",
    leftAction: "← 더 쉽게 설명",
    rightAction: "마무리 점검 →",
    cards: [
      {
        type: "concept",
        label: "개념 1",
        title: "문제의 핵심",
        body: "오류는 보이지만 사용자가 다음에 무엇을 해야 하는지 알기 어렵습니다.",
      },
      {
        type: "flow",
        label: "흐름 2",
        title: "목표 경험",
        items: [
          "상태를 이해한다",
          "회복 방법을 찾는다",
          "같은 자리에서 다시 시도한다",
        ],
      },
      {
        type: "decision",
        label: "선택 3",
        title: "확인할 방향",
        items: ["화면 안에서 바로 복구", "상세 진단으로 연결"],
      },
    ],
  },
  qpd5595: {
    key: "QPD-5595",
    status: "Design 검토 필요",
    stage: 1,
    kicker: "QPD-5595 · DESIGN 단계",
    title: "LLM Wiki 지식 연결 보강",
    caption: "설계 결정 검토 중",
    summaryTitle: "지식이 흐르는 구조",
    summaryBody:
      "반복 질문에 답한 분석을 일회성 대화로 끝내지 않고, 원본 근거와 함께 다시 찾을 수 있는 지식으로 연결하는 구조를 설계했습니다.",
    leftAction: "← 대안 비교하기",
    rightAction: "설계 마무리 →",
    cards: [
      {
        type: "concept",
        label: "개념 1",
        title: "Source of truth",
        body: "Wiki만 믿지 않고 코드와 원본 문서를 함께 확인해 중요한 claim의 근거를 남깁니다.",
      },
      {
        type: "flow",
        label: "흐름 2",
        title: "Query to knowledge",
        items: ["질문과 원본 확인", "사실·해석 분리", "승인 후 knowledge 반영"],
      },
      {
        type: "decision",
        label: "선택 3",
        title: "저장할 분석",
        items: ["반복 가치가 있는 설명", "다음 작업에 필요한 결정"],
      },
    ],
  },
  qpd5524: {
    key: "QPD-5524",
    status: "Verify 확인 중",
    stage: 3,
    kicker: "QPD-5524 · VERIFY 단계",
    title: "클러스터 준비 상태 명확화",
    caption: "사람의 기능 확인 대기",
    summaryTitle: "검증 결과와 남은 확인",
    summaryBody:
      "계획, 설계, 구현의 연결은 확인했습니다. 실제 장애 환경에서 사용자가 준비 상태를 올바르게 이해하는지 한 가지 기능 확인이 남았습니다.",
    leftAction: "← 검증 근거 보기",
    rightAction: "확인 결과 남기기 →",
    cards: [
      {
        type: "concept",
        label: "결과 1",
        title: "정합성 통과",
        body: "요구사항과 설계 계약이 변경된 코드와 일치하고 자동 검증 결과도 보존되어 있습니다.",
      },
      {
        type: "flow",
        label: "검증 2",
        title: "확인한 경로",
        items: ["상태 조회", "준비 전 행동 제한", "준비 후 정상 진행"],
      },
      {
        type: "decision",
        label: "확인 3",
        title: "사람이 볼 것",
        items: ["표시 문구의 이해도", "실제 환경의 회복 흐름"],
      },
    ],
  },
};

const demo = document.querySelector("[data-product-demo]");

function createWhiteboardCard(card) {
  const article = document.createElement("article");
  article.className = card.type;

  const label = document.createElement("small");
  label.textContent = card.label;
  const title = document.createElement("h5");
  title.textContent = card.title;
  article.append(label, title);

  if (card.body) {
    const body = document.createElement("p");
    body.textContent = card.body;
    article.append(body);
  } else {
    const list = document.createElement(card.type === "flow" ? "ol" : "ul");
    card.items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.append(listItem);
    });
    article.append(list);
  }
  return article;
}

function selectDemoTicket(ticketId) {
  if (!demo || !demoData[ticketId]) return;
  const data = demoData[ticketId];
  const selectors = {
    "[data-demo-status]": data.key,
    "[data-demo-status-label]": data.status,
    "[data-demo-kicker]": data.kicker,
    "[data-demo-title]": data.title,
    "[data-demo-caption]": data.caption,
    "[data-demo-summary-title]": data.summaryTitle,
    "[data-demo-summary-body]": data.summaryBody,
    "[data-demo-left]": data.leftAction,
    "[data-demo-right]": data.rightAction,
  };

  Object.entries(selectors).forEach(([selector, value]) => {
    const target = demo.querySelector(selector);
    if (target) {
      target.textContent = value;
      if (target.matches("button"))
        target.setAttribute("aria-label", `제품 모형: ${value}`);
    }
  });

  demo.querySelectorAll("[data-ticket]").forEach((button) => {
    const isActive = button.getAttribute("data-ticket") === ticketId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  demo.querySelectorAll("[data-demo-stages] span").forEach((stage, index) => {
    stage.classList.toggle("done", index < data.stage);
    stage.classList.toggle("current", index === data.stage);
  });

  const whiteboard = demo.querySelector("[data-demo-whiteboard]");
  if (whiteboard) {
    whiteboard.replaceChildren(...data.cards.map(createWhiteboardCard));
  }
}

demo?.querySelectorAll("[data-ticket]").forEach((button) => {
  button.addEventListener("click", () =>
    selectDemoTicket(button.getAttribute("data-ticket")),
  );
});

demo
  ?.querySelectorAll("[data-demo-left], [data-demo-right]")
  .forEach((button) => {
    button.setAttribute(
      "aria-label",
      `제품 모형: ${button.textContent.trim()}`,
    );
    button.addEventListener("click", () => {
      const previousLabel = button.textContent;
      button.textContent = "제품 모형에서 확인됨 ✓";
      window.setTimeout(() => {
        button.textContent = previousLabel;
      }, 1200);
    });
  });

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
