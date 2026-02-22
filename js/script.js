// script.js
document.addEventListener("DOMContentLoaded", () => {
  // ==========================================
  // 1. LÓGICA DE NAVEGAÇÃO E SCROLLSPY
  // ==========================================
  const allNavTargets = document.querySelectorAll(
    "main section[id], main article[id]"
  );
  const asideNavLinks = document.querySelectorAll("aside nav a");
  const visibleElements = new Map();

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: [0, 0.2, 0.8, 1.0],
  };

  const activateLinkForId = (idToActivate) => {
    asideNavLinks.forEach((link) => {
      link.classList.remove("active");
    });

    if (idToActivate) {
      const targetLink = document.querySelector(
        `aside nav a[href="#${idToActivate}"]`
      );
      if (targetLink) {
        targetLink.classList.add("active");

        if (targetLink.matches("aside nav ul ul a")) {
          const parentLi = targetLink.closest("ul").closest("li");
          if (parentLi) {
            const parentCategoryLink = parentLi.querySelector("a.nav-link");
            if (parentCategoryLink) {
              parentCategoryLink.classList.add("active");
            }
          }
        }
      }
    }
  };

  const updateActiveLink = () => {
    if (visibleElements.size === 0) {
      activateLinkForId(null);
      return;
    }

    let topMostVisibleId = null;
    let minTopValue = Infinity;
    let maxIntersectionRatio = 0;

    visibleElements.forEach((entry, id) => {
      const rect = entry.target.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (topMostVisibleId === null || rect.top < minTopValue) {
          minTopValue = rect.top;
          topMostVisibleId = id;
          maxIntersectionRatio = entry.intersectionRatio;
        } else if (rect.top === minTopValue) {
          if (entry.intersectionRatio > maxIntersectionRatio) {
            topMostVisibleId = id;
            maxIntersectionRatio = entry.intersectionRatio;
          }
        }
      }
    });
    activateLinkForId(topMostVisibleId);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        visibleElements.set(entry.target.id, entry);
      } else {
        visibleElements.delete(entry.target.id);
      }
    });
    updateActiveLink();
  }, observerOptions);

  allNavTargets.forEach((target) => {
    if (target.id) {
      observer.observe(target);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ==========================================
  // 2. LÓGICA DO MOTOR DE BUSCA (COM TRAVA)
  // ==========================================
  const searchInput = document.getElementById('searchInput');
  const articles = document.querySelectorAll('main article');
  const sections = document.querySelectorAll('main section');
  const noResultsMsg = document.getElementById('noResultsMsg');

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const term = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      let hasGlobalResults = false;

      const homeSection = document.getElementById('home');
      if (term !== '') {
        if (homeSection) homeSection.style.display = 'none';
      } else {
        if (homeSection) homeSection.style.display = 'block';
      }

      articles.forEach(article => {
        const text = article.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (text.includes(term)) {
          article.style.display = 'block';
          hasGlobalResults = true;
        } else {
          article.style.display = 'none';
        }
      });

      // Timeout para evitar o bug do título fantasma
      setTimeout(() => {
        sections.forEach(section => {
          if (section.id === 'home' || section.id === 'faq') return; 

          const sectionArticles = section.querySelectorAll('article');
          
          if (sectionArticles.length > 0) {
            const hasVisibleArticle = Array.from(sectionArticles).some(article => article.style.display !== 'none');

            if (term !== '' && !hasVisibleArticle) {
              section.style.display = 'none'; 
            } else {
              section.style.display = 'block'; 
            }
          } else {
            const text = section.innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (text.includes(term) || term === '') {
              section.style.display = 'block';
              if (term !== '') hasGlobalResults = true;
            } else {
              section.style.display = 'none';
            }
          }
        });

        if (!hasGlobalResults && term !== '') {
          noResultsMsg.classList.remove('hidden');
        } else {
          noResultsMsg.classList.add('hidden');
        }
      }, 0);
    });
  }

  // ==========================================
  // 3. MENU MOBILE TOGGLE
  // ==========================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const topNav = document.getElementById('topNav');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      sidebarMenu.classList.toggle('hidden');
      topNav.classList.toggle('hidden');
    });
  }

  asideNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) { 
        sidebarMenu.classList.add('hidden');
      }
    });
  });

  // ==========================================
  // 4. LÓGICA DO DARK MODE
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;

  if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-theme');

      if (body.classList.contains('dark-theme')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  }

});