/**
 * PEQUENO GÉNIO — 30 DIAS DE DESCOBERTA
 * Interatividade, UX, Carrossel & FAQ
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;
    
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha outros itens
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Alterna o atual
      if (isActive) {
        item.classList.remove('active');
        questionBtn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 2. Smooth Scrolling para links internos (#planos, #espreita-livro, etc.)
  const smoothLinks = document.querySelectorAll('a[href^="#"]');
  smoothLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    });
  });

  // 3. Mobile Sticky CTA Bar
  const stickyBar = document.querySelector('.mobile-sticky-bar');
  const heroSection = document.querySelector('.hero');
  const pricingSection = document.querySelector('#planos');

  if (stickyBar && heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) {
            stickyBar.classList.add('visible');
            document.body.classList.add('has-sticky-bar');
          } else {
            stickyBar.classList.remove('visible');
            document.body.classList.remove('has-sticky-bar');
          }
        });
      },
      { threshold: 0.1 }
    );
    heroObserver.observe(heroSection);

    if (pricingSection) {
      const pricingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              stickyBar.classList.remove('visible');
            } else {
              const heroRect = heroSection.getBoundingClientRect();
              if (heroRect.bottom < 0) {
                stickyBar.classList.add('visible');
              }
            }
          });
        },
        { threshold: 0.1 }
      );
      pricingObserver.observe(pricingSection);
    }
  }

  // 4. Carrossel Interativo das Páginas Reais
  const carouselTrack = document.querySelector('.carousel-track');
  const carouselSlides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dots = document.querySelectorAll('.carousel-dot');
  const counterCurrent = document.querySelector('.carousel-counter-current');

  if (carouselTrack && carouselSlides.length > 0) {
    let currentIndex = 0;
    const totalSlides = carouselSlides.length;

    const goToSlide = (index) => {
      if (index < 0) {
        currentIndex = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }

      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      if (counterCurrent) {
        counterCurrent.textContent = currentIndex + 1;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(i);
      });
    });

    // Navegação pelo teclado
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToSlide(currentIndex - 1);
      } else if (e.key === 'ArrowRight') {
        goToSlide(currentIndex + 1);
      }
    });

    // Touch Swipe para Telemóveis
    let startX = 0;
    let endX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  }
});
