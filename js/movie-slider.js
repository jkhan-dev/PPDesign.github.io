document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const movieSwiper = new Swiper('.movieSwiper', {
        // Enable loop mode
        loop: true,
        
        // Enable centered slides
        centeredSlides: true,
        
        // Number of slides visible (will be overridden by breakpoints)
        slidesPerView: 'auto',
        
        // Space between slides
        spaceBetween: 50,
        
        // Smooth transition effect
        effect: 'coverflow',
        
        // Coverflow effect settings
        coverflowEffect: {
            rotate: 5,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: false,
        },
        
        // Speed of transition
        speed: 800,
        
        // Auto play settings
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        // Keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        
        // Pagination
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        
        // Navigation arrows
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        
        // Responsive breakpoints
        breakpoints: {
            // When window width is < 576px
            320: {
                slidesPerView: 1.2,
                spaceBetween: 20,
                coverflowEffect: {
                    depth: 100,
                    modifier: 1,
                    rotate: 0
                }
            },
            // When window width is >= 576px
            576: {
                slidesPerView: 1.5,
                spaceBetween: 30,
                coverflowEffect: {
                    depth: 120,
                    modifier: 1.2,
                    rotate: 2
                }
            },
            // When window width is >= 768px
            768: {
                slidesPerView: 2,
                spaceBetween: 40,
                coverflowEffect: {
                    depth: 150,
                    modifier: 1.3,
                    rotate: 3
                }
            },
            // When window width is >= 992px
            992: {
                slidesPerView: 2.5,
                spaceBetween: 50,
                coverflowEffect: {
                    depth: 180,
                    modifier: 1.4,
                    rotate: 4
                }
            },
            // When window width is >= 1200px
            1200: {
                slidesPerView: 3,
                spaceBetween: 60,
                coverflowEffect: {
                    depth: 200,
                    modifier: 1.5,
                    rotate: 5
                }
            }
        },
        
        // Events
        on: {
            init: function() {
                console.log('Swiper initialized');
                
                // Add active class to initial slide
                setTimeout(function() {
                    animateActiveSlide();
                }, 500);
            },
            slideChangeTransitionStart: function() {
                // Reset all slides
                resetSlides();
            },
            slideChangeTransitionEnd: function() {
                // Animate active slide
                animateActiveSlide();
            },
            resize: function() {
                // Update swiper on resize
                this.update();
            }
        }
    });
    
    // Function to reset slides
    function resetSlides() {
        document.querySelectorAll('.swiper-slide').forEach(function(slide) {
            const info = slide.querySelector('.movie-info');
            const details = slide.querySelectorAll('.movie-info p, .movie-meta, .watch-btn');
            
            if (info) {
                info.style.transform = '';
            }
            
            details.forEach(function(element) {
                element.style.opacity = '';
                element.style.transform = '';
            });
        });
    }
    
    // Function to animate active slide
    function animateActiveSlide() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const info = activeSlide.querySelector('.movie-info');
            const details = activeSlide.querySelectorAll('.movie-info p, .movie-meta, .watch-btn');
            
            if (info) {
                info.style.transform = 'translateY(0)';
            }
            
            details.forEach(function(element, index) {
                setTimeout(function() {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100 * (index + 1));
            });
        }
    }
    
    // Add click event to watch buttons
    document.querySelectorAll('.watch-btn').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const movieTitle = this.closest('.movie-info').querySelector('h3').textContent;
            alert(`Starting playback: ${movieTitle}`);
        });
    });
    
    // Add hover effect to movie cards
    document.querySelectorAll('.movie-card').forEach(function(card) {
        card.addEventListener('mouseenter', function() {
            if (this.closest('.swiper-slide-active')) {
                this.classList.add('hover-effect');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            movieSwiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            movieSwiper.slideNext();
        }
    });
    
    // Optimize performance during scroll
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        
        // Pause autoplay during scroll
        movieSwiper.autoplay.stop();
        
        // Set a timeout to restart autoplay after scrolling stops
        isScrolling = setTimeout(function() {
            movieSwiper.autoplay.start();
        }, 200);
    });
    
    // Handle window resize for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            movieSwiper.update();
        }, 250);
    });
    
    // Add touch swiping instructions for mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.querySelector('.slider-info').textContent = 'Swipe left or right to navigate';
    }
}); 