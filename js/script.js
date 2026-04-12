document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupHeroCarousel();
  setupContactForm();
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
      closeMobileMenu(header, toggleButton);
    });
  });

  document.addEventListener("click", (event) => {
    const clickedInsideHeader = header.contains(event.target);

    if (!clickedInsideHeader && header.classList.contains("menu-open")) {
      closeMobileMenu(header, toggleButton);
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
      closeMobileMenu(header, toggleButton);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-open")) {
      closeMobileMenu(header, toggleButton);
    }
  });
}

function closeMobileMenu(header, toggleButton) {
  header.classList.remove("menu-open");
  toggleButton.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-active");
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

function setupContactForm() {
  const form = document.querySelector("#contact-form");
  const status = document.querySelector("#form-status");

  if (!form || !status) return;

  const submitBtn = form.querySelector(".contact-submit");
  const requiredFields = form.querySelectorAll(
    "input[required], textarea[required]",
  );

  checkFormValidity();

  requiredFields.forEach((field) => {
    field.addEventListener("input", checkFormValidity);
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    status.textContent = "";
    status.classList.remove("is-error", "is-success");

    const firstName = form.querySelector('[name="firstName"]')?.value.trim();
    const lastName = form.querySelector('[name="lastName"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!firstName || !lastName || !email || !message) {
      showFormStatus(status, "Please fill out all required fields.", "error");
      return;
    }

    if (!isValidEmail(email)) {
      showFormStatus(status, "Please enter a valid email address.", "error");
      return;
    }

    if (message.length < 10) {
      showFormStatus(
        status,
        "Please write a slightly longer message.",
        "error",
      );
      return;
    }

    status.textContent = "Sending...";

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.remove("enabled");
    }

    try {
      const formData = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      let result = {};

      try {
        result = await response.json();
      } catch (error) {
        result = {};
      }

      if (!response.ok) {
        throw new Error(
          result.errors?.[0]?.message ||
            result.error ||
            "Something went wrong.",
        );
      }

      form.reset();
      checkFormValidity();
      showFormStatus(status, "Thanks! Your message has been sent.", "success");
    } catch (error) {
      showFormStatus(
        status,
        error.message || "Sorry, there was a problem sending your message.",
        "error",
      );
      checkFormValidity();
    }
  });

  function checkFormValidity() {
    if (!submitBtn) return;

    let allFilled = true;

    requiredFields.forEach((field) => {
      if (!field.value.trim()) {
        allFilled = false;
      }
    });

    if (allFilled) {
      submitBtn.disabled = false;
      submitBtn.classList.add("enabled");
    } else {
      submitBtn.disabled = true;
      submitBtn.classList.remove("enabled");
    }
  }
}

function showFormStatus(statusElement, message, type) {
  statusElement.textContent = message;
  statusElement.classList.remove("is-error", "is-success");

  if (type === "error") {
    statusElement.classList.add("is-error");
  }

  if (type === "success") {
    statusElement.classList.add("is-success");
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
