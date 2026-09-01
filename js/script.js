(function () {
  "use strict";

  const { normalizeText, levenshtein, typoTolerance, scoreItem } = window.GuideSearch;

  const escapeHtml = (value = "") => value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);

  document.addEventListener("DOMContentLoaded", () => {
    const config = window.GUIDE_CONFIG || {};
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const byId = (id) => document.getElementById(id);

    const setText = (id, value) => {
      const element = byId(id);
      if (element) element.textContent = value || "—";
    };

    const isSafeExternalUrl = (value) => {
      if (!value) return false;
      try {
        return ["https:", "http:"].includes(new URL(value).protocol);
      } catch (_error) {
        return false;
      }
    };

    const applyConfiguration = () => {
      setText("footerVersion", config.version ? `· versão ${config.version}` : "");

      const feedbackSection = byId("feedback");
      const feedbackLink = byId("feedbackLink");
      if (feedbackSection && feedbackLink && isSafeExternalUrl(config.feedbackUrl)) {
        feedbackLink.href = config.feedbackUrl;
        feedbackSection.hidden = false;
      }

      const contactSection = byId("contato");
      const contactCards = byId("contactCards");
      const contacts = Array.isArray(config.contacts) ? config.contacts.filter((contact) => contact && contact.title && (contact.phone || contact.email)) : [];
      if (contactSection && contactCards && contacts.length) {
        contacts.forEach((contact) => {
          const card = document.createElement("article");
          card.className = "contact-card";
          const heading = document.createElement("h3");
          heading.textContent = contact.title;
          card.append(heading);

          if (contact.phone) {
            const phone = document.createElement("p");
            phone.textContent = `Telefone: ${contact.phone}`;
            card.append(phone);
          }
          if (contact.email) {
            const paragraph = document.createElement("p");
            const link = document.createElement("a");
            link.href = `mailto:${contact.email}`;
            link.textContent = contact.email;
            paragraph.append("E-mail: ", link);
            card.append(paragraph);
          }
          if (contact.hours) {
            const hours = document.createElement("p");
            hours.textContent = `Horário: ${contact.hours}`;
            card.append(hours);
          }
          contactCards.append(card);
        });
        contactSection.hidden = false;
      }
    };

    const initTheme = () => {
      const toggle = byId("themeToggle");
      if (!toggle) return;

      const updateControl = () => {
        const isDark = document.documentElement.dataset.theme === "dark";
        const label = isDark ? "Ativar modo claro" : "Ativar modo escuro";
        toggle.setAttribute("aria-label", label);
        toggle.setAttribute("title", label);
        toggle.setAttribute("aria-pressed", String(isDark));
        const labelElement = byId("themeLabel");
        if (labelElement) labelElement.textContent = label;
        const icon = byId("themeIcon");
        if (icon) {
          icon.innerHTML = isDark
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364-.707-.707M6.343 6.343l-.707-.707m12.728 0-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"></path>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 0 1 8.646 3.646 9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646Z"></path>';
        }
      };

      updateControl();
      toggle.addEventListener("click", () => {
        const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = nextTheme;
        try {
          localStorage.setItem("guia-theme", nextTheme);
        } catch (_error) {
          // O tema continua funcionando durante a sessão quando o armazenamento está indisponível.
        }
        updateControl();
      });
    };

    const initMobileMenu = () => {
      const openButton = byId("mobileMenuBtn");
      const closeButton = byId("mobileMenuClose");
      const drawer = byId("sidebarMenu");
      const overlay = byId("menuOverlay");
      if (!openButton || !closeButton || !drawer || !overlay) return;

      const isMobile = () => window.matchMedia("(max-width: 767px)").matches;
      const focusable = () => Array.from(drawer.querySelectorAll('a[href], button:not([disabled])'));

      const closeMenu = ({ restoreFocus = true } = {}) => {
        if (!isMobile()) return;
        drawer.classList.add("hidden");
        overlay.classList.add("hidden");
        drawer.setAttribute("aria-hidden", "true");
        openButton.setAttribute("aria-expanded", "false");
        openButton.setAttribute("aria-label", "Abrir menu de navegação");
        document.body.classList.remove("menu-open");
        if (restoreFocus) openButton.focus();
      };

      const openMenu = () => {
        drawer.classList.remove("hidden");
        overlay.classList.remove("hidden");
        drawer.setAttribute("aria-hidden", "false");
        openButton.setAttribute("aria-expanded", "true");
        openButton.setAttribute("aria-label", "Fechar menu de navegação");
        document.body.classList.add("menu-open");
        closeButton.focus();
      };

      openButton.addEventListener("click", () => openButton.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu());
      closeButton.addEventListener("click", () => closeMenu());
      overlay.addEventListener("click", () => closeMenu());
      drawer.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", () => {
        if (isMobile()) closeMenu({ restoreFocus: false });
      }));

      document.addEventListener("keydown", (event) => {
        if (!isMobile() || openButton.getAttribute("aria-expanded") !== "true") return;
        if (event.key === "Escape") {
          event.preventDefault();
          closeMenu();
          return;
        }
        if (event.key !== "Tab") return;
        const controls = focusable();
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      const syncViewport = () => {
        if (isMobile()) {
          closeMenu({ restoreFocus: false });
        } else {
          drawer.setAttribute("aria-hidden", "false");
          overlay.classList.add("hidden");
          document.body.classList.remove("menu-open");
        }
      };
      window.addEventListener("resize", syncViewport);
      syncViewport();
    };

    const initAnchorNavigation = () => {
      document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
          const target = document.querySelector(anchor.getAttribute("href"));
          if (!target) return;
          event.preventDefault();
          target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
          history.replaceState(null, "", anchor.getAttribute("href"));
        });
      });
    };

    const initScrollSpy = () => {
      if (!("IntersectionObserver" in window)) return;
      const links = Array.from(document.querySelectorAll('#sidebarMenu a[href^="#"]'));
      const targets = Array.from(document.querySelectorAll("main section[id], main article[id]"));
      const visible = new Map();

      const update = () => {
        const active = Array.from(visible.values()).sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        links.forEach((link) => {
          const matches = active && link.getAttribute("href") === `#${active.target.id}`;
          link.classList.toggle("active", Boolean(matches));
          if (matches) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.isIntersecting ? visible.set(entry.target.id, entry) : visible.delete(entry.target.id));
        update();
      }, { rootMargin: "-10% 0px -72%", threshold: [0, 0.2] });
      targets.forEach((target) => observer.observe(target));
    };

    const initSearch = () => {
      const input = byId("searchInput");
      const clearButton = byId("clearSearch");
      const status = byId("searchStatus");
      const results = byId("searchResults");
      const guideContent = byId("guideContent");
      if (!input || !clearButton || !status || !results || !guideContent) return;

      const sources = [
        ...document.querySelectorAll("#guideContent article[id]"),
        ...document.querySelectorAll("#faq details"),
        ...document.querySelectorAll("#documentos-importantes .document-list li")
      ];

      const index = sources.map((element, position) => {
        const heading = element.querySelector("h3, summary, span") || element;
        const section = element.closest("section");
        const title = heading.textContent.replace("▼", "").trim();
        const text = element.textContent.replace(/\s+/g, " ").trim();
        const normalizedText = normalizeText(text);
        const id = element.id || section?.id || `resultado-${position}`;
        return {
          id,
          element,
          title,
          category: section?.querySelector(":scope > h2")?.textContent.trim() || "Conteúdo do Guia",
          text,
          normalizedTitle: normalizeText(title),
          normalizedText,
          tokens: Array.from(new Set(normalizedText.match(/[a-z0-9]+/g) || []))
        };
      });

      const highlighted = (text, query) => {
        const terms = normalizeText(query).split(" ").filter(Boolean);
        return text.split(/(\p{L}[\p{L}\p{N}-]*)/gu).map((part) => {
          const normalizedPart = normalizeText(part);
          const match = terms.some((term) => normalizedPart && (normalizedPart.includes(term) || (typoTolerance(term) && levenshtein(normalizedPart, term) <= typoTolerance(term))));
          return match ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part);
        }).join("");
      };

      const clearSearch = ({ focus = false } = {}) => {
        input.value = "";
        clearButton.hidden = true;
        results.hidden = true;
        results.replaceChildren();
        guideContent.hidden = false;
        status.textContent = "";
        if (focus) input.focus();
      };

      const openResult = (item) => {
        clearSearch();
        if (item.element.matches("details")) item.element.open = true;
        const focusTarget = item.element.querySelector("h3, summary") || item.element;
        if (!focusTarget.hasAttribute("tabindex") && !focusTarget.matches("summary")) focusTarget.setAttribute("tabindex", "-1");
        item.element.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        focusTarget.focus({ preventScroll: true });
        history.replaceState(null, "", `#${item.id}`);
      };

      const render = () => {
        const query = normalizeText(input.value);
        if (!query) {
          clearSearch();
          return;
        }

        clearButton.hidden = false;
        guideContent.hidden = true;
        results.hidden = false;
        results.replaceChildren();

        const matches = index
          .map((item) => ({ item, score: scoreItem(item, query) }))
          .filter((result) => result.score > 0)
          .sort((left, right) => right.score - left.score || left.item.title.localeCompare(right.item.title, "pt-BR"));

        status.textContent = `${matches.length} ${matches.length === 1 ? "resultado encontrado" : "resultados encontrados"} para “${input.value.trim()}”.`;

        if (!matches.length) {
          const empty = document.createElement("div");
          empty.className = "no-results";
          empty.innerHTML = `<strong>Nenhuma informação encontrada.</strong><p>Tente um termo mais curto ou uma categoria, como “caixa”, “entrega”, “loja” ou “FAQ”.</p>`;
          results.append(empty);
          return;
        }

        matches.forEach(({ item }) => {
          const link = document.createElement("a");
          link.href = `#${item.id}`;
          link.className = "search-result";
          link.setAttribute("aria-label", `${item.title}. ${item.category}`);
          const excerpt = item.text.length > 180 ? `${item.text.slice(0, 177)}…` : item.text;
          link.innerHTML = `<strong>${highlighted(item.title, query)}</strong><small>${escapeHtml(item.category)}</small><p>${highlighted(excerpt, query)}</p>`;
          link.addEventListener("click", (event) => {
            event.preventDefault();
            openResult(item);
          });
          results.append(link);
        });
      };

      input.addEventListener("input", render);
      input.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && input.value) clearSearch({ focus: true });
      });
      clearButton.addEventListener("click", () => clearSearch({ focus: true }));
    };

    applyConfiguration();
    initTheme();
    initMobileMenu();
    initAnchorNavigation();
    initScrollSpy();
    initSearch();
  });
})();
