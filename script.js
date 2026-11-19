const carousel = document.querySelector(".carousel");
const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dotsContainer = document.querySelector(".carousel-dots");

const AUTOPLAY_DELAY = 4000; // 4 seconds
const SWIPE_THRESHOLD = 50; // minimum px distance for a swipe

let currentIndex = 0;
let autoplayTimer = null;
let touchStartX = 0;
let touchEndX = 0;

// Create indicator dots
slides.forEach((_, idx) => {
  const dot = document.createElement("button");
  dot.classList.add("carousel-dot");
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to slide ${idx + 1}`);
  if (idx === 0) dot.classList.add("active");
  dot.addEventListener("click", () => {
    goToSlide(idx);
    resetAutoplay();
  });
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goToSlide(index) {
  currentIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentIndex);
  });
}

// Auto-play controls
function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => {
    goToSlide(currentIndex + 1);
  }, AUTOPLAY_DELAY);
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
}

function resetAutoplay() {
  stopAutoplay();
  startAutoplay();
}

// Button & keyboard navigation
prevBtn.addEventListener("click", () => {
  goToSlide(currentIndex - 1);
  resetAutoplay();
});

nextBtn.addEventListener("click", () => {
  goToSlide(currentIndex + 1);
  resetAutoplay();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    goToSlide(currentIndex - 1);
    resetAutoplay();
  }
  if (e.key === "ArrowRight") {
    goToSlide(currentIndex + 1);
    resetAutoplay();
  }
});

// Pause on hover or keyboard focus
carousel.addEventListener("mouseenter", stopAutoplay);
carousel.addEventListener("mouseleave", startAutoplay);
carousel.addEventListener("focusin", stopAutoplay);
carousel.addEventListener("focusout", startAutoplay);

// Pause when browser tab is inactive
document.addEventListener("visibilitychange", () => {
  document.hidden ? stopAutoplay() : startAutoplay();
});

// Touch swipe support
carousel.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  },
  { passive: true }
);

carousel.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  },
  { passive: true }
);

function handleSwipe() {
  const distance = touchStartX - touchEndX;
  if (Math.abs(distance) < SWIPE_THRESHOLD) return;

  if (distance > 0) {
    goToSlide(currentIndex + 1); // Swiped left -> next
  } else {
    goToSlide(currentIndex - 1); // Swiped right -> prev
  }
}

// Initialize
startAutoplay();
