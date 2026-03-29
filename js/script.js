document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupHeroCarousel();
});

function setupMobileMenu() {
  const header = document.querySelector(".site-header");
  const toggleButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#site-nav");

  if (!header || !toggleButton || !nav) return;

  const navLinks = nav.querySelectorAll("a");

  toggleButton.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    toggleButton.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-active", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-active");
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideHeader = header.contains(event.target);

    if (!clickedInsideHeader && header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-active");
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      header.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-active");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      header.classList.remove("menu-open");
      toggleButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-active");
    }
  });
}

function setupHeroCarousel() {
  const slides = document.querySelectorAll(".hero-slide");

  if (!slides.length) return;

  let currentIndex = 0;
  const intervalTime = 4500;

  slides.forEach((slide, index) => {
    slide.classList.toggle("is-active", index === 0);
  });

  setInterval(() => {
    slides[currentIndex].classList.remove("is-active");
    currentIndex = (currentIndex + 1) % slides.length;
    slides[currentIndex].classList.add("is-active");
  }, intervalTime);
}