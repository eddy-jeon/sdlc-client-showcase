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

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;
    document.querySelectorAll(".faq-list details[open]").forEach((other) => {
      if (other !== detail) other.open = false;
    });
  });
});
