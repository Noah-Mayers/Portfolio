const carouselWrapper = document.querySelector('.work-carousel-wrapper');
const carousel = document.querySelector('.work-carousel');
const cardWrappers = document.querySelectorAll('.work-card-wrapper');
const cards = document.querySelectorAll('.work-card');

let activeIndex = 0;
const scaleActive = 1;
const scaleInactive = 0.8;
const opacityActive = 1;
const opacityInactive = 0.5;
const transitionDuration = 300;

// --- Apply scale/opacity/zIndex to cards ---
function applyCardStyles() {
  cards.forEach((card, i) => {
    card.style.transition = `transform ${transitionDuration}ms ease-out, opacity ${transitionDuration}ms ease-out`;
    card.style.transform = i === activeIndex ? `scale(${scaleActive})` : `scale(${scaleInactive})`;
    card.style.opacity = i === activeIndex ? opacityActive : opacityInactive;
    card.style.zIndex = i === activeIndex ? 10 : 5;
  });
}

// --- Center active card ---
function centerActiveCard() {
  const wrapperRect = carouselWrapper.getBoundingClientRect();
  const activeRect = cardWrappers[activeIndex].getBoundingClientRect();
  const offset = wrapperRect.left + wrapperRect.width / 2 - (activeRect.left + activeRect.width / 2);
  carousel.style.transition = `transform ${transitionDuration}ms ease-out`;
  const current = carousel.style.transform.match(/translateX\(([-\d.]+)px\)/);
  const prevTranslate = current ? parseFloat(current[1]) : 0;
  carousel.style.transform = `translateX(${prevTranslate + offset}px)`;
}

// --- Click: center + enlarge + opaque ---
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    if (i === activeIndex) return;
    activeIndex = i;
    applyCardStyles();
    centerActiveCard();
  });
});

// --- Scroll handler: detect closest card to center ---
function onScroll() {
  const wrapperRect = carouselWrapper.getBoundingClientRect();
  const centerX = wrapperRect.left + wrapperRect.width / 2;
  let closest = 0;
  let minDistance = Infinity;

  cardWrappers.forEach((cw, i) => {
    const rect = cw.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const dist = Math.abs(centerX - cardCenter);
    if (dist < minDistance) {
      minDistance = dist;
      closest = i;
    }
  });

  if (closest !== activeIndex) {
    activeIndex = closest;
    applyCardStyles();
  }
}

// --- Attach scroll listener ---
carouselWrapper.addEventListener('scroll', onScroll, { passive: true });

// --- Init ---
applyCardStyles();
centerActiveCard();

// --- Resize: recenter active card ---
window.addEventListener('resize', () => {
  applyCardStyles();
  centerActiveCard();
});
