document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper
    const videoSwiper = new Swiper('.videoSwiper', {
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
            delay: 500000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        
        // Keyboard control
        keyboard: {
            enabled: true,
            onlyInViewport: false,
        },
        
        // Pagination
        pagination:false,
        
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
                console.log('Video Swiper initialized');
                
                // Initialize videos
                initializeVideos();
                
                // Add active class to initial slide
                setTimeout(function() {
                    animateActiveSlide();
                }, 500);
            },
            slideChangeTransitionStart: function() {
                // Reset all slides
                resetSlides();
                
                // Pause all videos except active
                handleVideosOnSlideChange();
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
    
    // Function to initialize videos
    function initializeVideos() {
        const videoWrappers = document.querySelectorAll('.video-wrapper');
        
        videoWrappers.forEach(function(wrapper) {
            // Add loader to each video wrapper
            const loader = document.createElement('div');
            loader.className = 'video-loader';
            loader.innerHTML = '<div class="loader-spinner"></div>';
            wrapper.appendChild(loader);
            
            const video = wrapper.querySelector('video');
            
            if (video) {
                // Set video attributes
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.preload = 'metadata';
                
                // Add data attribute to track state
                video.dataset.playing = 'false';
                video.dataset.loaded = 'false';
                
                // Add event listeners
                video.addEventListener('loadedmetadata', function() {
                    // Mark as metadata loaded
                    video.dataset.metadataLoaded = 'true';
                });
                
                video.addEventListener('canplay', function() {
                    // Show video once it can play
                    this.style.opacity = '1';
                    
                    // Hide loader
                    const loader = this.closest('.video-wrapper').querySelector('.video-loader');
                    if (loader) {
                        loader.style.opacity = '0';
                        setTimeout(() => {
                            loader.style.display = 'none';
                        }, 300);
                    }
                    
                    // Mark as loaded
                    video.dataset.loaded = 'true';
                });
                
                // Error handling
                video.addEventListener('error', function() {
                    const wrapper = this.closest('.video-wrapper');
                    if (wrapper) {
                        // Remove loader
                        const loader = wrapper.querySelector('.video-loader');
                        if (loader) {
                            wrapper.removeChild(loader);
                        }
                        
                        // Show error message
                        wrapper.innerHTML = `
                            <div class="video-placeholder">
                                <span>Video unavailable</span>
                            </div>
                        `;
                    }
                });
            }
        });
        
        // Start playing the active slide video
        playActiveSlideVideo();
    }
    
    // Function to play active slide video
    function playActiveSlideVideo() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (activeSlide) {
            const video = activeSlide.querySelector('video');
            if (video) {
                // If video has a data-src attribute, set the src to start loading
                if (video.hasAttribute('data-src') && !video.hasAttribute('src')) {
                    video.src = video.dataset.src;
                }
                
                video.play().catch(function(error) {
                    console.log('Auto-play was prevented:', error);
                    
                    // Show play button overlay if autoplay is prevented
                    const videoCard = video.closest('.video-card');
                    if (videoCard) {
                        videoCard.classList.add('autoplay-prevented');
                    }
                });
                
                video.dataset.playing = 'true';
            }
        }
    }
    
    // Function to pause all videos except active
    function handleVideosOnSlideChange() {
        const videos = document.querySelectorAll('.video-wrapper video');
        const activeSlide = document.querySelector('.swiper-slide-active');
        const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;
        
        videos.forEach(function(video) {
            if (video !== activeVideo) {
                video.pause();
                video.dataset.playing = 'false';
            } else if (activeVideo) {
                // If video has a data-src attribute and no src, set the src
                if (activeVideo.hasAttribute('data-src') && !activeVideo.hasAttribute('src')) {
                    // Show loader
                    const loader = activeVideo.closest('.video-wrapper').querySelector('.video-loader');
                    if (loader) {
                        loader.style.display = 'flex';
                        loader.style.opacity = '1';
                    }
                    
                    activeVideo.src = activeVideo.dataset.src;
                }
                
                activeVideo.play().catch(function(error) {
                    console.log('Auto-play was prevented on slide change:', error);
                });
                activeVideo.dataset.playing = 'true';
            }
        });
    }
    
    // Function to reset slides
    function resetSlides() {
        document.querySelectorAll('.swiper-slide').forEach(function(slide) {
            const info = slide.querySelector('.video-info');
            const details = slide.querySelectorAll('.video-info p, .video-meta, .watch-btn');
            
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
            const info = activeSlide.querySelector('.video-info');
            const details = activeSlide.querySelectorAll('.video-info p, .video-meta, .watch-btn');
            
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
            const videoTitle = this.closest('.video-info').querySelector('h3').textContent;
            alert(`Starting playback: ${videoTitle}`);
        });
    });
    
    // Add click event to video cards for play/pause
    document.querySelectorAll('.video-card').forEach(function(card) {
        card.addEventListener('click', function() {
            if (this.closest('.swiper-slide-active')) {
                const video = this.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play();
                        video.dataset.playing = 'true';
                        this.classList.remove('video-paused');
                    } else {
                        video.pause();
                        video.dataset.playing = 'false';
                        this.classList.add('video-paused');
                    }
                }
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            if (this.closest('.swiper-slide-active')) {
                this.classList.add('hover-effect');
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover-effect');
        });
    });
    
    // Add mute/unmute toggle
    document.querySelectorAll('.mute-toggle').forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const activeSlide = document.querySelector('.swiper-slide-active');
            if (activeSlide) {
                const video = activeSlide.querySelector('video');
                if (video) {
                    video.muted = !video.muted;
                    
                    // Update mute indicator
                    const muteIndicator = activeSlide.querySelector('.mute-indicator');
                    if (muteIndicator) {
                        muteIndicator.textContent = video.muted ? 'Sound Off' : 'Sound On';
                        muteIndicator.style.opacity = '1';
                        
                        // Hide indicator after 2 seconds
                        setTimeout(function() {
                            muteIndicator.style.opacity = '0';
                        }, 2000);
                    }
                    
                    // Update button icon
                    this.innerHTML = video.muted ? 
                        '<i class="fas fa-volume-mute"></i>' : 
                        '<i class="fas fa-volume-up"></i>';
                }
            }
        });
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            videoSwiper.slidePrev();
        } else if (e.key === 'ArrowRight') {
            videoSwiper.slideNext();
        } else if (e.key === ' ' || e.key === 'Spacebar') {
            // Toggle play/pause on spacebar
            const activeSlide = document.querySelector('.swiper-slide-active');
            if (activeSlide) {
                const video = activeSlide.querySelector('video');
                if (video) {
                    if (video.paused) {
                        video.play();
                        video.dataset.playing = 'true';
                        activeSlide.querySelector('.video-card').classList.remove('video-paused');
                    } else {
                        video.pause();
                        video.dataset.playing = 'false';
                        activeSlide.querySelector('.video-card').classList.add('video-paused');
                    }
                }
            }
            e.preventDefault(); // Prevent page scroll on spacebar
        }
    });
    
    // Optimize performance during scroll
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        
        // Pause autoplay during scroll
        videoSwiper.autoplay.stop();
        
        // Pause videos during scroll for better performance
        const videos = document.querySelectorAll('.video-wrapper video');
        videos.forEach(function(video) {
            if (video.dataset.playing === 'true') {
                video.pause();
            }
        });
        
        // Set a timeout to restart autoplay and videos after scrolling stops
        isScrolling = setTimeout(function() {
            videoSwiper.autoplay.start();
            playActiveSlideVideo();
        }, 200);
    });
    
    // Handle window resize for responsive adjustments
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            videoSwiper.update();
        }, 250);
    });
    
    // Add touch swiping instructions for mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        const sliderInfo = document.querySelector('.slider-info');
        if (sliderInfo) {
            sliderInfo.textContent = 'Swipe left or right to navigate';
        }
    }
    
    // Handle visibility change to pause videos when tab is not active
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause all videos when tab is not visible
            const videos = document.querySelectorAll('.video-wrapper video');
            videos.forEach(function(video) {
                if (video.dataset.playing === 'true') {
                    video.pause();
                }
            });
        } else {
            // Resume active video when tab becomes visible again
            playActiveSlideVideo();
        }
    });
    
    // Lazy load videos for better performance
    const lazyLoadVideos = function() {
        const videoElements = document.querySelectorAll('.video-wrapper video[data-src]:not([src])');
        const windowHeight = window.innerHeight;
        
        videoElements.forEach(function(video) {
            const rect = video.getBoundingClientRect();
            const isInViewport = (
                rect.top >= -windowHeight &&
                rect.bottom <= windowHeight * 2
            );
            
            if (isInViewport) {
                // Show loader
                const loader = video.closest('.video-wrapper').querySelector('.video-loader');
                if (loader) {
                    loader.style.display = 'flex';
                    loader.style.opacity = '1';
                }
                
                // Set video source to start loading
                video.src = video.dataset.src;
            }
        });
    };
    
    // Initial lazy load
    lazyLoadVideos();
    
    // Lazy load on scroll
    window.addEventListener('scroll', lazyLoadVideos);
    
    // Lazy load on swiper events
    videoSwiper.on('slideChange', lazyLoadVideos);
}); 