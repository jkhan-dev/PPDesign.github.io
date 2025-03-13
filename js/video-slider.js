document.addEventListener('DOMContentLoaded', function() {
    // Check if device is mobile
    let isMobile = window.innerWidth <= 767;
    
    // Set the --vh variable for better mobile height handling
    function setVhVariable() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Also adjust the hero section height directly for immediate effect
        const heroSection = document.querySelector('.hero-video-section');
        if (heroSection) {
            const headerHeight = isMobile ? 60 : 80; // Adjust based on header height
            heroSection.style.height = `calc(${vh * 100}px - ${headerHeight}px)`;
            
            // Ensure proper spacing between header and video section
            heroSection.style.marginTop = `${headerHeight}px`;
        }
    }
    
    // Initial call to set the --vh variable
    setVhVariable();
    
    // Update the --vh variable on resize and orientation change
    window.addEventListener('resize', function() {
        setVhVariable();
        // Check if device width changed between mobile and desktop
        const newIsMobile = window.innerWidth <= 767;
        if (newIsMobile !== isMobile) {
            // Update the isMobile variable
            isMobile = newIsMobile;
            // Apply the correct header height
            const headerHeight = isMobile ? 60 : 80;
            const heroSection = document.querySelector('.hero-video-section');
            if (heroSection) {
                heroSection.style.marginTop = `${headerHeight}px`;
            }
        }
    });
    window.addEventListener('orientationchange', setVhVariable);
    
    // Function to adjust portrait video sizing on desktop
    function adjustPortraitVideoSizing() {
        if (window.innerWidth >= 768) {
            const videoCards = document.querySelectorAll('.video-card');
            const containerHeight = document.querySelector('.video-slider-section').offsetHeight;
            
            videoCards.forEach(card => {
                // Set max height based on container
                const maxHeight = containerHeight * 0.8;
                card.style.maxHeight = `${maxHeight}px`;
                
                // Calculate width based on 9:16 aspect ratio
                const width = maxHeight * (9/16);
                card.style.maxWidth = `${width}px`;
            });
        }
    }
    
    // Initialize Swiper with different settings based on device
    const videoSwiper = new Swiper('.videoSwiper', {
        // Enable loop mode
        loop: true,
        
        // Enable centered slides
        centeredSlides: true,
        
        // Number of slides visible (will be overridden by breakpoints)
        slidesPerView: isMobile ? 1 : 'auto',
        
        // Space between slides
        spaceBetween: isMobile ? 0 : 50,
        
        // Smooth transition effect
        effect: isMobile ? 'fade' : 'coverflow',
        
        // Fade effect settings for mobile
        fadeEffect: {
            crossFade: true
        },
        
        // Coverflow effect settings for desktop
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
            delay: 8000,
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
                slidesPerView: 1,
                spaceBetween: 0,
                effect: 'fade',
            },
            // When window width is >= 576px
            576: {
                slidesPerView: 1,
                spaceBetween: 0,
                effect: 'fade',
            },
            // When window width is >= 768px
            768: {
                slidesPerView: 1.5,
                spaceBetween: 40,
                effect: 'coverflow',
                coverflowEffect: {
                    depth: 150,
                    modifier: 1.3,
                    rotate: 3
                }
            },
            // When window width is >= 992px
            992: {
                slidesPerView: 2,
                spaceBetween: 50,
                effect: 'coverflow',
                coverflowEffect: {
                    depth: 180,
                    modifier: 1.4,
                    rotate: 4
                }
            },
            // When window width is >= 1200px
            1200: {
                slidesPerView: 2.5,
                spaceBetween: 60,
                effect: 'coverflow',
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
                
                // Set full height for mobile
                if (isMobile) {
                    setFullHeightForMobile();
                } else {
                    // Adjust portrait video sizing on desktop
                    adjustPortraitVideoSizing();
                }
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
                
                // Check if device width changed between mobile and desktop
                const newIsMobile = window.innerWidth <= 767;
                if (newIsMobile !== isMobile) {
                    // Reload page to apply correct settings
                    window.location.reload();
                }
            }
        }
    });
    
    // Function to set full height for mobile
    function setFullHeightForMobile() {
        if (isMobile) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
            
            const videoCards = document.querySelectorAll('.video-card');
            videoCards.forEach(card => {
                card.style.height = `calc(100vh - 0px)`;
                card.style.height = `calc(var(--vh, 1vh) * 100)`;
            });
            
            const videoWrappers = document.querySelectorAll('.video-wrapper');
            videoWrappers.forEach(wrapper => {
                wrapper.style.height = '100%';
                wrapper.style.width = '100%';
            });
        }
    }
    
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
                    
                    // Check video dimensions and adjust object-fit
                    checkVideoOrientation(this);
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
    
    // Function to check video orientation and adjust object-fit
    function checkVideoOrientation(video) {
        // When metadata is loaded, check the video dimensions
        if (video.videoWidth && video.videoHeight) {
            const aspectRatio = video.videoWidth / video.videoHeight;
            
            // If video is landscape (width > height)
            if (aspectRatio > 1) {
                video.style.objectFit = 'contain';
                video.style.backgroundColor = '#000';
            } else {
                // Portrait or square video
                video.style.objectFit = 'cover';
            }
        }
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
    
    // Function to handle videos on slide change
    function handleVideosOnSlideChange() {
        const videos = document.querySelectorAll('.video-wrapper video');
        const activeSlide = document.querySelector('.swiper-slide-active');
        const activeVideo = activeSlide ? activeSlide.querySelector('video') : null;
        
        videos.forEach(function(video) {
            if (video !== activeVideo) {
                video.pause();
                video.dataset.playing = 'false';
                
                // Ensure non-active slides have background
                const videoCard = video.closest('.video-card');
                if (videoCard) {
                    videoCard.style.background = 'var(--card-bg)';
                }
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
                
                // Remove background from active slide
                const activeCard = activeVideo.closest('.video-card');
                if (activeCard) {
                    activeCard.style.background = 'transparent';
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
            
            // Reset background for non-active slides
            if (!slide.classList.contains('swiper-slide-active')) {
                const videoCard = slide.querySelector('.video-card');
                if (videoCard) {
                    videoCard.style.background = 'var(--card-bg)';
                }
            }
        });
    }
    
    // Function to animate active slide
    function animateActiveSlide() {
        const activeSlide = document.querySelector('.swiper-slide-active');
        const allSlides = document.querySelectorAll('.swiper-slide:not(.swiper-slide-active)');
        
        if (activeSlide) {
            const info = activeSlide.querySelector('.video-info');
            const details = activeSlide.querySelectorAll('.video-info p, .video-meta, .watch-btn');
            const videoCard = activeSlide.querySelector('.video-card');
            const videoWrapper = activeSlide.querySelector('.video-wrapper');
            const video = activeSlide.querySelector('video');
            
            // Enhanced active slide styling
            if (videoCard) {
                videoCard.style.background = 'transparent';
                videoCard.style.boxShadow = 'none';
                videoCard.style.border = 'none';
                
                // Add a subtle scale animation
                gsap.to(videoCard, {
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
            
            // Enhance video appearance
            if (video) {
                gsap.to(video, {
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out",
                    borderRadius: '12px'
                });
            }
            
            if (videoWrapper) {
                videoWrapper.style.borderRadius = '0';
                videoWrapper.style.overflow = 'visible';
            }
            
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
        
        // Enhance non-active slides
        allSlides.forEach(slide => {
            const videoCard = slide.querySelector('.video-card');
            if (videoCard) {
                gsap.to(videoCard, {
                    scale: 0.85,
                    opacity: 0.7,
                    filter: 'blur(2px)',
                    duration: 0.4,
                    ease: "power2.out"
                });
            }
        });
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