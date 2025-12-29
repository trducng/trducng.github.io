/**
 * Carousel Component
 *
 * Initializes carousels for image groups wrapped in <div class="carousel">
 * Provides navigation via arrows, dots, keyboard, and touch gestures
 */

(function() {
  'use strict';

  // Initialize carousels on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    var carousels = document.querySelectorAll('.carousel');

    carousels.forEach(function(carousel, index) {
      setupCarousel(carousel, index);
    });
  });

  /**
   * Detect and set aspect ratio from first image
   */
  function setCarouselAspectRatio(carouselDiv, firstImage) {
    // Wait for image to load if not already loaded
    if (firstImage.complete && firstImage.naturalWidth > 0) {
      applyAspectRatio(carouselDiv, firstImage);
    } else {
      firstImage.addEventListener('load', function() {
        applyAspectRatio(carouselDiv, firstImage);
      });
    }
  }

  /**
   * Apply the calculated aspect ratio to the carousel
   */
  function applyAspectRatio(carouselDiv, image) {
    var aspectRatio = image.naturalWidth / image.naturalHeight;
    carouselDiv.style.setProperty('--carousel-aspect-ratio', aspectRatio);
  }

  /**
   * Set up a single carousel instance
   */
  function setupCarousel(carouselDiv, carouselId) {
    // Get all images within the carousel div
    var images = Array.from(carouselDiv.querySelectorAll('img'));

    if (images.length === 0) {
      console.warn('Carousel has no images:', carouselDiv);
      return;
    }

    // Set aspect ratio from first image
    setCarouselAspectRatio(carouselDiv, images[0]);

    // Create carousel structure
    var wrapper = document.createElement('div');
    wrapper.className = 'carousel-wrapper';

    // Create previous button
    var prevBtn = createNavButton('prev', 'Previous image');

    // Create track and move images into it
    var track = document.createElement('div');
    track.className = 'carousel-track';

    images.forEach(function(img, index) {
      img.classList.add('carousel-slide');
      if (index === 0) {
        img.classList.add('active');
      }
      track.appendChild(img);
    });

    // Create next button
    var nextBtn = createNavButton('next', 'Next image');

    // Assemble wrapper
    wrapper.appendChild(prevBtn);
    wrapper.appendChild(track);
    wrapper.appendChild(nextBtn);

    // Create dots
    var dots = createDots(images.length);

    // Clear carousel div and add new structure
    carouselDiv.innerHTML = '';
    carouselDiv.appendChild(wrapper);
    carouselDiv.appendChild(dots);

    // Initialize carousel state
    var state = {
      currentIndex: 0,
      totalSlides: images.length,
      container: carouselDiv,
      track: track,
      prevBtn: prevBtn,
      nextBtn: nextBtn,
      dots: dots.querySelectorAll('.carousel-dot')
    };

    // Attach event listeners
    attachCarouselEvents(state);

    // Set initial button states
    updateNavigationButtons(state);
  }

  /**
   * Create a navigation button (prev/next)
   */
  function createNavButton(direction, ariaLabel) {
    var btn = document.createElement('button');
    btn.className = 'carousel-nav carousel-nav-' + direction;
    btn.setAttribute('aria-label', ariaLabel);
    btn.innerHTML = getArrowIcon(direction);
    return btn;
  }

  /**
   * Get SVG icon for arrow buttons
   */
  function getArrowIcon(direction) {
    var path = direction === 'prev'
      ? 'M15 18l-6-6 6-6'
      : 'M9 18l6-6-6-6';

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
      '<path d="' + path + '"/>' +
      '</svg>';
  }

  /**
   * Create dot indicators
   */
  function createDots(count) {
    var dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    dotsContainer.setAttribute('role', 'tablist');
    dotsContainer.setAttribute('aria-label', 'Image navigation');

    for (var i = 0; i < count; i++) {
      var dot = document.createElement('button');
      dot.className = 'carousel-dot';
      if (i === 0) {
        dot.classList.add('active');
      }
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', 'Image ' + (i + 1) + ' of ' + count);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);
    }

    return dotsContainer;
  }

  /**
   * Attach all event listeners to carousel
   */
  function attachCarouselEvents(state) {
    // Arrow button navigation
    state.prevBtn.addEventListener('click', function() {
      navigate(state, -1);
    });

    state.nextBtn.addEventListener('click', function() {
      navigate(state, 1);
    });

    // Dot navigation
    state.dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var index = parseInt(dot.getAttribute('data-index'), 10);
        goToSlide(state, index);
      });
    });

    // Keyboard navigation
    state.container.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigate(state, -1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigate(state, 1);
      }
    });

    // Touch/swipe support
    attachTouchEvents(state);
  }

  /**
   * Navigate to prev/next slide
   */
  function navigate(state, direction) {
    var newIndex = state.currentIndex + direction;

    if (newIndex >= 0 && newIndex < state.totalSlides) {
      goToSlide(state, newIndex);
    }
  }

  /**
   * Go to a specific slide index
   */
  function goToSlide(state, index) {
    var slides = state.track.querySelectorAll('.carousel-slide');

    // Update slides
    slides[state.currentIndex].classList.remove('active');
    slides[index].classList.add('active');

    // Update dots
    state.dots[state.currentIndex].classList.remove('active');
    state.dots[state.currentIndex].setAttribute('aria-selected', 'false');
    state.dots[index].classList.add('active');
    state.dots[index].setAttribute('aria-selected', 'true');

    // Update state
    state.currentIndex = index;

    // Update button states
    updateNavigationButtons(state);
  }

  /**
   * Update navigation button disabled states
   */
  function updateNavigationButtons(state) {
    state.prevBtn.disabled = state.currentIndex === 0;
    state.nextBtn.disabled = state.currentIndex === state.totalSlides - 1;
  }

  /**
   * Attach touch/swipe event listeners
   */
  function attachTouchEvents(state) {
    var touchStartX = 0;
    var touchEndX = 0;
    var minSwipeDistance = 50; // pixels

    state.track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    state.track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      var swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) < minSwipeDistance) {
        return;
      }

      if (swipeDistance > 0) {
        // Swiped left -> next slide
        navigate(state, 1);
      } else {
        // Swiped right -> previous slide
        navigate(state, -1);
      }
    }
  }

})();
