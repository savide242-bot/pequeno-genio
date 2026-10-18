/**
 * PEQUENO GÉNIO — 30 DIAS DE DESCOBERTA
 * Interatividade, UX & Acordeão de FAQ
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fecha outros itens para manter a página limpa
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

  // 2. Smooth Scrolling para todos os links internos (#planos, etc.)
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // Se o Hero NÃO estiver mais visível, mostramos a barra sticky (apenas no mobile)
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

    observer.observe(heroSection);

    // Também esconde a barra quando o visitante já está nos planos para não sobrepor
    if (pricingSection) {
      const pricingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              stickyBar.classList.remove('visible');
            } else if (!heroSection.getBoundingClientRect().top >= 0) {
              stickyBar.classList.add('visible');
            }
          });
        },
        { threshold: 0.2 }
      );
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

    const updateCarousel = (index) => {
      // Normaliza index
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      // Desloca o trilho
      carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

      // Atualiza dots
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('active');
          dot.removeAttribute('aria-current');
        }
      });

      // Atualiza contador
      if (counterCurrent) {
        counterCurrent.textContent = currentIndex + 1;
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        updateCarousel(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        updateCarousel(currentIndex + 1);
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateCarousel(i);
      });
    });

    // Navegação pelo teclado quando o carrossel estiver em foco/visível
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        const carouselSec = document.querySelector('.carousel-section');
        if (carouselSec) {
          const rect = carouselSec.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            updateCarousel(currentIndex - 1);
          }
        }
      } else if (e.key === 'ArrowRight') {
        const carouselSec = document.querySelector('.carousel-section');
        if (carouselSec) {
          const rect = carouselSec.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            updateCarousel(currentIndex + 1);
          }
        }
      }
    });

    // Suporte a Touch Swipe para Telemóveis
    let touchStartX = 0;
    let touchEndX = 0;

    carouselTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          // Swipe para a esquerda -> Próximo slide
          updateCarousel(currentIndex + 1);
        } else {
          // Swipe para a direita -> Slide anterior
          updateCarousel(currentIndex - 1);
        }
      }
    };
  }
});
