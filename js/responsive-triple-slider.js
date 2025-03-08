$(document).ready(function() {
    // Initialize videos
    $('.swiper-slide video').each(function() {
        // Hide videos until loaded to prevent flickering
        $(this).hide();
        
        // Pause all videos initially
        this.pause();
        
        // Show video when loaded
        $(this).on('loadeddata', function() {
            $(this).show();
        });
        
        // Add error handling
        $(this).on('error', function() {
            console.error('Video failed to load:', $(this).find('source').attr('src'));
            // Replace with a placeholder or fallback image if needed
            $(this).replaceWith('<div class="video-placeholder"><span>Video unavailable</span></div>');
        });
        
        // Set video attributes for better performance
        $(this).attr({
            'preload': 'metadata',
            'playsinline': true,
            'muted': true
        });
    });

    // Initialize Swiper
    const tripleSwiper = new Swiper('.tripleSwiper', {
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
            delay: 6000,
            disableOnInteraction: true,
            pauseOnMouseEnter: true,
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
            // When window width is < 480px (extra small devices)
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
                coverflowEffect: {
                    depth: 50,
                    modifier: 1,
                    rotate: 0
                }
            },
            // When window width is >= 480px (small devices)
            480: {
                slidesPerView: 1.2,
                spaceBetween: 15,
                coverflowEffect: {
                    depth: 70,
                    modifier: 1.1,
                    rotate: 2
                }
            },
            // When window width is >= 576px (small devices)
            576: {
                slidesPerView: 1.3,
                spaceBetween: 20,
                coverflowEffect: {
                    depth: 80,
                    modifier: 1.2,
                    rotate: 3
                }
            },
            // When window width is >= 768px (medium devices)
            768: {
                slidesPerView: 1.5,
                spaceBetween: 25,
                coverflowEffect: {
                    depth: 100,
                    modifier: 1.3,
                    rotate: 3
                }
            },
            // When window width is >= 992px (large devices)
            992: {
                slidesPerView: 2,
                spaceBetween: 30,
                coverflowEffect: {
                    depth: 150,
                    modifier: 1.3,
                    rotate: 4
                }
            },
            // When window width is >= 1200px (extra large devices)
            1200: {
                slidesPerView: 2.5,
                spaceBetween: 40,
                coverflowEffect: {
                    depth: 180,
                    modifier: 1.4,
                    rotate: 5
                }
            },
            // When window width is >= 1400px (extra extra large devices)
            1400: {
                slidesPerView: 3,
                spaceBetween: 50,
            }
        },
        
        // Events
        on: {
            init: function() {
                console.log('Swiper initialized');
                
                // Pause all videos initially
                pauseAllVideos();
                
                // Play only the active slide video after a short delay
                setTimeout(function() {
                    playActiveSlideVideo();
                }, 500);
                
                // Add active class to initial slide
                $('.swiper-slide-active').find('.slide-overlay h3, .slide-overlay p').css({
                    'transform': 'translateY(0)',
                    'opacity': '1'
                });
            },
            slideChangeTransitionStart: function() {
                // Reset all slides
                $('.swiper-slide').find('.slide-overlay h3, .slide-overlay p').css({
                    'transform': '',
                    'opacity': ''
                });
                
                // Pause all videos
                pauseAllVideos();
            },
            slideChangeTransitionEnd: function() {
                // Animate active slide
                $('.swiper-slide-active').find('.slide-overlay h3, .slide-overlay p').css({
                    'transform': 'translateY(0)',
                    'opacity': '1'
                });
                
                // Play only the active slide video
                playActiveSlideVideo();
                
                // Optimize video quality
                optimizeVideoQuality();
            },
            resize: function() {
                // Update swiper on resize
                this.update();
                
                // Re-optimize video quality
                optimizeVideoQuality();
            }
        }
    });
    
    // Function to pause all videos
    function pauseAllVideos() {
        $('.swiper-slide video').each(function() {
            this.pause();
        });
    }
    
    // Function to play only the active slide video
    function playActiveSlideVideo() {
        $('.swiper-slide-active video').each(function() {
            // Reset video to beginning
            this.currentTime = 0;
            
            // Play the video
            const playPromise = this.play();
            
            // Handle play promise (to avoid DOMException)
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Auto-play was prevented:', error);
                    // Add a play button overlay if autoplay is prevented
                    $(this).parent().addClass('autoplay-prevented');
                });
            }
        });
    }
    
    // Add hover effect to slides
    $('.swiper-slide').hover(
        function() {
            $(this).addClass('slide-hover');
        },
        function() {
            $(this).removeClass('slide-hover');
        }
    );
    
    // Add click event to slides
    $('.swiper-slide').on('click', function() {
        if (!$(this).hasClass('swiper-slide-active')) {
            // Navigate to this slide if it's not active
            const slideIndex = $(this).index();
            tripleSwiper.slideTo(slideIndex);
        } else {
            // Toggle play/pause for active slide video
            const video = $(this).find('video')[0];
            if (video) {
                if (video.paused) {
                    video.play();
                    $(this).find('.slide-content').removeClass('video-paused');
                } else {
                    video.pause();
                    $(this).find('.slide-content').addClass('video-paused');
                }
            }
        }
    });
    
    // Pause autoplay on hover
    $('.tripleSwiper').hover(
        function() {
            tripleSwiper.autoplay.stop();
        },
        function() {
            tripleSwiper.autoplay.start();
        }
    );
    
    // Handle video controls
    $('.slide-content').on('click', function(e) {
        e.stopPropagation();
        
        // Only handle video controls for active slide
        if ($(this).closest('.swiper-slide').hasClass('swiper-slide-active')) {
            const video = $(this).find('video')[0];
            
            if (video) {
                if (video.paused) {
                    video.play();
                    $(this).removeClass('video-paused');
                } else {
                    video.pause();
                    $(this).addClass('video-paused');
                }
            }
        }
    });
    
    // Optimize performance by reducing quality when not in view
    function optimizeVideoQuality() {
        // Apply blur filter to non-active slides
        $('.swiper-slide:not(.swiper-slide-active):not(.swiper-slide-prev):not(.swiper-slide-next) video').each(function() {
            // $(this).css('filter', 'blur(5px) brightness(0.7)');
            
            // Pause videos that are not in view
            this.pause();
        });
        
        // Remove filters from visible slides
        $('.swiper-slide-active video, .swiper-slide-prev video, .swiper-slide-next video').each(function() {
            $(this).css('filter', '');
        });
        
        // Only play the active slide video
        $('.swiper-slide-active video').each(function() {
            if (this.paused && !$(this).closest('.slide-content').hasClass('video-paused')) {
                this.play();
            }
        });
    }
    
    // Handle fullscreen mode for videos
    $('.slide-content').on('dblclick', function() {
        if ($(this).closest('.swiper-slide').hasClass('swiper-slide-active')) {
            const video = $(this).find('video')[0];
            
            if (video) {
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) { /* Safari */
                    video.webkitRequestFullscreen();
                } else if (video.msRequestFullscreen) { /* IE11 */
                    video.msRequestFullscreen();
                }
            }
        }
    });
    
    // Handle visibility change (pause videos when tab is not visible)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseAllVideos();
        } else {
            playActiveSlideVideo();
        }
    });
    
    // Handle window resize for responsive adjustments
    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            tripleSwiper.update();
            optimizeVideoQuality();
        }, 250);
    });
    
    // Initial optimization
    optimizeVideoQuality();
}); 