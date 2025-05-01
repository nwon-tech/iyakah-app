document.addEventListener("DOMContentLoaded", () => {
  // Create particles
  createParticles();

  // Start animation sequence
  setTimeout(startAnimations, 500);

  // Add scroll functionality
  const scrollIndicator = document.getElementById("scroll-indicator");
  scrollIndicator.addEventListener("click", () => {
    // Smooth scroll to next section
    const heroHeight = document.getElementById("hero").offsetHeight;
    window.scrollTo({
      top: heroHeight,
      behavior: "smooth",
    });
  });

  // Fix for any potential viewport issues
  adjustHeroHeight();
  window.addEventListener("resize", adjustHeroHeight);

  // Animate statistics
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateStats() {
    statNumbers.forEach((stat) => {
      const target = parseInt(stat.getAttribute("data-target"));
      const suffix = stat.textContent.includes("$") ? "$" : "";
      const duration = 2000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        let value;

        if (stat.textContent.includes(".")) {
          value = (progress * target).toFixed(1);
        } else {
          value = Math.floor(progress * target);
        }

        stat.textContent = suffix + value;

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    });
  }

  // Intersection Observer for stats animation
  const statsSection = document.querySelector(".stats-section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateStats();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(statsSection);
});

// Function to ensure hero section fits properly
function adjustHeroHeight() {
  const hero = document.getElementById("hero");
  const viewportHeight = window.innerHeight;

  // Make sure content fits without overflow
  if (hero.scrollHeight > viewportHeight) {
    hero.style.height = "auto";
    hero.style.minHeight = "100vh";
  } else {
    hero.style.height = "100vh";
  }
}

function createParticles() {
  const particlesContainer = document.getElementById("particles");
  const particleCount = Math.floor(window.innerWidth / 15); // Reduced particle count for white theme

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");

    // Random positioning
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const opacity = Math.random() * 0.08 + 0.02; // More subtle particles

    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.opacity = opacity;

    // Add particle to container
    particlesContainer.appendChild(particle);

    // Animate particle
    animateParticle(particle);
  }
}

function animateParticle(particle) {
  const duration = Math.random() * 30 + 15;
  const direction = Math.random() > 0.5 ? 1 : -1;

  particle.style.transition = `transform ${duration}s linear, opacity ${duration}s ease`;

  setTimeout(() => {
    particle.style.transform = `translateY(${direction * 100}vh)`;
    particle.style.opacity = "0";

    // Reset particle after animation
    setTimeout(() => {
      const posX = Math.random() * 100;
      const posY = direction > 0 ? -10 : 110;

      particle.style.transition = "none";
      particle.style.transform = "none";
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.opacity = Math.random() * 0.08 + 0.02;

      // Start animation again
      setTimeout(() => {
        animateParticle(particle);
      }, 100);
    }, duration * 1000);
  }, 100);
}

function startAnimations() {
  // IYAKAH typing animation
  const companyName = document.getElementById("company-name");
  const questionMark = document.getElementById("question-mark");
  const subtitle = document.getElementById("hero-subtitle");
  const feature1 = document.getElementById("feature-1");
  const feature2 = document.getElementById("feature-2");
  const feature3 = document.getElementById("feature-3");
  const ctaButton = document.getElementById("cta-button");
  const scrollIndicator = document.getElementById("scroll-indicator");

  // Question mark animation
  setTimeout(() => {
    questionMark.style.opacity = "1";

    // Subtitle animation
    setTimeout(() => {
      subtitle.classList.add("animate-in");

      // Feature animations (sequential)
      setTimeout(() => {
        feature1.classList.add("animate-in");

        setTimeout(() => {
          feature2.classList.add("animate-in");

          setTimeout(() => {
            feature3.classList.add("animate-in");

            // CTA button animation
            setTimeout(() => {
              ctaButton.classList.add("animate-in");

              // Show scroll indicator last
              setTimeout(() => {
                scrollIndicator.style.opacity = "1";
              }, 500);
            }, 300);
          }, 300);
        }, 300);
      }, 500);
    }, 600);
  }, 1000);
}

function prevSlide() {
  const carousel = document.querySelector("#carouselExample");
  const bsCarousel = new bootstrap.Carousel(carousel);
  bsCarousel.prev();
}

function nextSlide() {
  const carousel = document.querySelector("#carouselExample");
  const bsCarousel = new bootstrap.Carousel(carousel);
  bsCarousel.next();
}
