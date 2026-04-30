const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

const setNavOpen = (isOpen) => {
  if (!navLinks) {
    return;
  }
  navLinks.classList.toggle("open", isOpen);
  if (navToggle) {
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
};

if (navToggle && navLinks) {
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.addEventListener("click", () => {
    const willOpen = !navLinks.classList.contains("open");
    setNavOpen(willOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setNavOpen(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavOpen(false);
    }
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

const getWeb3FormsAccessKey = () => {
  const meta = document.querySelector('meta[name="web3forms-access-key"]');
  const raw = meta?.getAttribute("content")?.trim() ?? "";
  if (!raw || raw === "YOUR_ACCESS_KEY_HERE") {
    return "";
  }
  return raw;
};

if (contactForm) {
  const contactFormStatus = document.getElementById("contactFormStatus");
  const contactSubmit = document.getElementById("contactSubmit");

  const setContactStatus = (message, kind) => {
    if (!contactFormStatus) {
      return;
    }
    contactFormStatus.textContent = message;
    contactFormStatus.classList.remove("contact-form-status--success", "contact-form-status--error");
    if (kind === "success") {
      contactFormStatus.classList.add("contact-form-status--success");
    }
    if (kind === "error") {
      contactFormStatus.classList.add("contact-form-status--error");
    }
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setContactStatus("", null);

    const formData = new FormData(contactForm);
    const honeypot = (formData.get("honeypot") || "").toString().trim();
    if (honeypot) {
      return;
    }

    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const company = (formData.get("company") || "").toString().trim();
    const interest = (formData.get("interest") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = `Website enquiry: ${interest || "General"}${company ? ` — ${company}` : ""}`;
    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Company: ${company || "-"}`,
      `Topic: ${interest || "-"}`,
      "",
      "Message:",
      message || "-"
    ].join("\n");

    const accessKey = getWeb3FormsAccessKey();

    if (!accessKey) {
      setContactStatus("Opening your email app so you can send this to us…", null);
      window.location.href = `mailto:contact@madtalesai.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    if (contactSubmit) {
      contactSubmit.disabled = true;
    }
    setContactStatus("Sending…", null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          subject,
          to: "contact@madtalesai.com",
          name: name || "Website visitor",
          email,
          message: body,
          replyto: email,
          from_name: "Madtales AI Website"
        })
      });

      const result = await response.json();

      if (result.success) {
        setContactStatus("Thanks—your message was sent. We’ll get back to you soon.", "success");
        contactForm.reset();
      } else {
        setContactStatus(
          result.message || "Could not send. Please email contact@madtalesai.com directly.",
          "error"
        );
      }
    } catch {
      setContactStatus("Network problem. Try again or email contact@madtalesai.com.", "error");
    } finally {
      if (contactSubmit) {
        contactSubmit.disabled = false;
      }
    }
  });
}
