const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function onAnchorClick(event) {
    const href = this.getAttribute("href");
    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll(".fade-in").forEach((element) => observer.observe(element));

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const interest = (formData.get("interest") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = `Website enquiry: ${interest || "General query"}${company ? ` - ${company}` : ""}`;
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Company: ${company || "-"}`,
      `Interest: ${interest || "-"}`,
      "",
      "Query:",
      message || "-"
    ].join("\n");

    window.location.href = `mailto:contact@madtalesai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
