const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("manav-theme", nextTheme);
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`);
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("open", !isOpen);
});

navAnchors.forEach((anchor) => {
  anchor.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  });
});

document.addEventListener("click", (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  }
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px" });

document.querySelectorAll("[data-reveal]").forEach((element) => {
  element.style.setProperty("--delay", `${element.dataset.delay || 0}ms`);
  revealObserver.observe(element);
});

const updateNavigation = () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  const currentSection = sections.reduce((active, section) => {
    return window.scrollY >= section.offsetTop - 180 ? section.id : active;
  }, "home");

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentSection}`);
  });
};

window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
updateNavigation();
