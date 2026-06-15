const root = document.documentElement;
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navAnchors = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const popover = document.querySelector("#skill-popover");
const popoverClose = document.querySelector("[data-skill-close]");
let activeSkillButton = null;

// Keep the fixed evidence panel outside section stacking contexts.
document.body.append(popover);

const skillEvidence = {
  "AI Agent Evaluation": {
    where: "AfterQuery",
    problem: "Agent-task validity",
    description: "Authored and reviewed terminal-based agent tasks, checking whether instructions, environments, oracle solutions, and verifiers measured the intended capability without shortcuts or leakage.",
  },
  "LLM Evaluation": {
    where: "Outlier AI / SOUL AI",
    problem: "Output correctness",
    description: "Assessed model responses for correctness, reasoning quality, instruction adherence, clarity, and consistency, then provided structured feedback to improve future outputs.",
  },
  "Dataset Quality Assurance": {
    where: "Innodata Inc.",
    problem: "Label consistency",
    description: "Applied project guidelines, annotation review, and quality control to reduce inconsistent labels and strengthen the reliability of training datasets.",
  },
  "Rubric-Based Evaluation": {
    where: "Zerberus AI / SOUL AI",
    problem: "Reviewer consistency",
    description: "Created and applied explicit criteria that separate strong, acceptable, and failing responses while keeping scoring tied to correctness, safety, and task intent.",
  },
  "AI Benchmark Task Design": {
    where: "AfterQuery",
    problem: "Benchmark integrity",
    description: "Designed task specifications, containerized environments, reference solutions, and verifier tests so benchmark results reflect genuine agent capability.",
  },
  "Prompt QA": {
    where: "AfterQuery / SOUL AI",
    problem: "Ambiguous instructions",
    description: "Reviewed prompts for missing context, hidden assumptions, answer leakage, unclear output contracts, and difficulty mismatches before they reached evaluation workflows.",
  },
  "RLHF": {
    where: "SOUL AI / Outlier AI",
    problem: "Actionable feedback",
    description: "Compared responses against quality standards and delivered precise corrections, preference signals, and explanations that support model training and alignment.",
  },
  "Prompt Engineering": {
    where: "SOUL AI / Zerberus AI",
    problem: "Instruction adherence",
    description: "Designed and refined prompts to improve response accuracy, clarity, consistency, robustness, and compliance with defined constraints.",
  },
  "Adversarial Prompt Testing": {
    where: "Zerberus AI",
    problem: "Hidden failure modes",
    description: "Built adversarial cases for prompt injection, unsafe completion, hallucination, data leakage, conflicting priorities, and tool misuse.",
  },
  "LLM Safety Testing": {
    where: "Zerberus AI",
    problem: "Unsafe behavior",
    description: "Defined risk hypotheses, expected safe behavior, severity, and audit-ready evidence for structured safety and robustness assessment.",
  },
  "Reliability Analysis": {
    where: "AirDawg Lab / Outlier AI",
    problem: "Recurring model defects",
    description: "Compared outputs and implementations to identify repeated reasoning, correctness, and robustness failures that weaken dependable model behavior.",
  },
  "Failure Analysis": {
    where: "AirDawg Lab / Zerberus AI",
    problem: "Root-cause discovery",
    description: "Classified failure patterns, reproduced problematic behavior, and connected symptoms to prompt, model, verifier, or environment weaknesses.",
  },
  "Python": {
    where: "AirDawg Lab / Projects",
    problem: "Reproducible analysis",
    description: "Used Python for reference implementations, debugging, model experiments, data analysis, computer vision, and repeatable evaluation utilities.",
  },
  "Docker": {
    where: "AfterQuery",
    problem: "Environment reproducibility",
    description: "Built and reviewed isolated task environments so agent benchmarks run consistently across machines and dependencies remain controlled.",
  },
  "Pytest": {
    where: "AfterQuery",
    problem: "Verifier coverage",
    description: "Developed and audited tests that accept valid solutions, reject shallow shortcuts, cover edge cases, and reflect the natural-language requirement.",
  },
  "Git": {
    type: "Professional significance",
    where: "Engineering workflow",
    problem: "Traceable change control",
    description: "Git supports reviewable, reversible work through branches, commits, diffs, and collaboration history, which is essential for reliable technical evaluation.",
  },
  "Linux": {
    where: "AfterQuery workflows",
    problem: "Agent environment testing",
    description: "Worked with terminal-based environments, filesystem behavior, processes, permissions, and command-line task execution during agent evaluation.",
  },
  "Bash": {
    where: "AfterQuery workflows",
    problem: "Repeatable task setup",
    description: "Used shell commands and scripts to inspect environments, reproduce task behavior, validate setup, and automate technical checks.",
  },
  "Test Automation": {
    where: "AfterQuery",
    problem: "Scalable verification",
    description: "Converted task requirements and edge cases into executable checks so quality decisions remain consistent and repeatable.",
  },
  "Technical Writing": {
    where: "AirDawg Lab / AfterQuery",
    problem: "Clear technical transfer",
    description: "Produced task specifications, solution notes, evaluation rationale, and documentation that another contributor can inspect and reproduce.",
  },
  "ChatGPT": {
    type: "Professional significance",
    where: "Independent AI workflow",
    problem: "Rapid iteration",
    description: "Useful for structured ideation, prompt comparison, drafting, code explanation, and evaluation experiments when outputs are independently checked against requirements.",
  },
  "Claude": {
    where: "Smart Grid RL project",
    problem: "AI-assisted analysis",
    description: "Applied Claude API concepts in the Smart Grid RL environment and use Claude for long-context reasoning, technical review, and comparative prompt evaluation.",
  },
  "Cursor": {
    type: "Professional significance",
    where: "AI-assisted development",
    problem: "Codebase navigation",
    description: "Cursor combines repository context with coding models to accelerate implementation, refactoring, debugging, and code understanding while preserving human review.",
  },
  "Replit": {
    type: "Professional significance",
    where: "Rapid prototyping",
    problem: "Low-friction execution",
    description: "Replit is valuable for quickly building, running, sharing, and testing small applications or coding experiments in a browser-based environment.",
  },
  "Coding LLM Evaluation": {
    where: "Outlier AI",
    problem: "Generated-code quality",
    description: "Evaluated model-generated code for functional correctness, syntax, reasoning, edge cases, and alignment with the requested behavior.",
  },
  "AI-Assisted Development": {
    where: "AirDawg Lab / Projects",
    problem: "Faster validated delivery",
    description: "Use AI systems to accelerate exploration, implementation, debugging, and documentation, then verify results with tests, execution, and manual review.",
  },
  "Prompt Iteration": {
    where: "SOUL AI / Zerberus AI",
    problem: "Response quality",
    description: "Compared prompt variants and revised instructions to reduce ambiguity, improve constraint following, and expose behavior under difficult inputs.",
  },
  "Code Review & Debugging": {
    where: "Outlier AI / AirDawg Lab",
    problem: "Defect identification",
    description: "Inspected generated and reference code for logic errors, syntax defects, fragile assumptions, and implementation choices that reduce reliability.",
  },
};

const scrollProgress = document.createElement("div");
scrollProgress.className = "scroll-progress";
scrollProgress.setAttribute("aria-hidden", "true");
scrollProgress.innerHTML = "<i></i>";
document.body.prepend(scrollProgress);

document.querySelectorAll(".skill-list span").forEach((label) => {
  const button = document.createElement("button");
  button.className = "skill-button";
  button.type = "button";
  button.textContent = label.textContent.trim();
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-controls", "skill-popover");
  label.replaceWith(button);
});

const skillButtons = [...document.querySelectorAll(".skill-button")];

function closeSkillPopover({ restoreFocus = false } = {}) {
  if (!activeSkillButton) return;
  const previousButton = activeSkillButton;
  previousButton.setAttribute("aria-expanded", "false");
  popover.hidden = true;
  activeSkillButton = null;
  if (restoreFocus) previousButton.focus();
}

function positionSkillPopover() {
  if (!activeSkillButton || popover.hidden || window.innerWidth <= 620) return;
  const trigger = activeSkillButton.getBoundingClientRect();
  const panel = popover.getBoundingClientRect();
  const margin = 16;
  const gap = 12;
  const roomBelow = window.innerHeight - trigger.bottom;
  const top = roomBelow >= panel.height + gap
    ? trigger.bottom + gap
    : Math.max(margin, trigger.top - panel.height - gap);
  const centeredLeft = trigger.left + (trigger.width / 2) - (panel.width / 2);
  const left = Math.min(window.innerWidth - panel.width - margin, Math.max(margin, centeredLeft));
  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;
  popover.style.setProperty("--popover-origin", roomBelow >= panel.height + gap ? "50% 0%" : "50% 100%");
}

function openSkillPopover(button) {
  if (activeSkillButton === button) {
    closeSkillPopover({ restoreFocus: true });
    return;
  }
  if (activeSkillButton) activeSkillButton.setAttribute("aria-expanded", "false");

  const title = button.textContent.trim();
  const evidence = skillEvidence[title] || {
    type: "Professional significance",
    where: "AI quality workflow",
    problem: "Reliable delivery",
    description: `${title} supports clearer, safer, and more reproducible AI development and evaluation.`,
  };

  activeSkillButton = button;
  button.setAttribute("aria-expanded", "true");
  popover.querySelector("[data-skill-type]").textContent = evidence.type || "Applied experience";
  popover.querySelector("[data-skill-title]").textContent = title;
  popover.querySelector("[data-skill-where]").textContent = evidence.where;
  popover.querySelector("[data-skill-problem]").textContent = evidence.problem;
  popover.querySelector("[data-skill-description]").textContent = evidence.description;
  popover.querySelector("[data-skill-evidence]").textContent = evidence.type
    ? "Professional relevance, stated without a company-use claim"
    : "Evidence connected to portfolio experience and project work";
  popover.hidden = false;
  requestAnimationFrame(positionSkillPopover);
}

skillButtons.forEach((button) => {
  button.addEventListener("click", () => openSkillPopover(button));
});

popoverClose.addEventListener("click", () => closeSkillPopover({ restoreFocus: true }));

document.addEventListener("click", (event) => {
  if (activeSkillButton && !popover.contains(event.target) && !event.target.closest(".skill-button")) {
    closeSkillPopover();
  }
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeSkillPopover({ restoreFocus: true });
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }
});

const capabilityTargets = ["Prompt QA", "Reliability Analysis", "Pytest", "RLHF"];
document.querySelectorAll(".capability-card").forEach((card, index) => {
  const target = capabilityTargets[index];
  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `${card.querySelector("h3").textContent}. Explore related evidence.`);
  const activate = () => {
    const button = skillButtons.find((item) => item.textContent.trim() === target);
    if (!button) return;
    button.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => openSkillPopover(button), root.style.scrollBehavior === "auto" ? 0 : 500);
  };
  card.addEventListener("click", activate);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

themeToggle.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("manav-theme", nextTheme);
  themeToggle.setAttribute("aria-label", `Switch to ${nextTheme === "dark" ? "light" : "dark"} theme`);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", nextTheme === "dark" ? "#07111f" : "#f4f8fc");
  requestAnimationFrame(positionSkillPopover);
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
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
  scrollProgress.style.setProperty("--scroll-progress", `${progress}%`);

  const currentSection = sections.reduce((active, section) => {
    return window.scrollY >= section.offsetTop - 180 ? section.id : active;
  }, "home");

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("active", anchor.getAttribute("href") === `#${currentSection}`);
  });

  if (activeSkillButton) requestAnimationFrame(positionSkillPopover);
};

window.addEventListener("scroll", updateNavigation, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    menuToggle.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  }
  if (activeSkillButton) requestAnimationFrame(positionSkillPopover);
});

document.querySelector("[data-year]").textContent = new Date().getFullYear();
themeToggle.setAttribute("aria-label", `Switch to ${root.dataset.theme === "dark" ? "light" : "dark"} theme`);
updateNavigation();
