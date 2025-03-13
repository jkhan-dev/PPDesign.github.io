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
    
    // Video Slider Functionality
    const videoSlider = {
        slides: document.querySelector('.hero-video-slides'),
        slideItems: document.querySelectorAll('.hero-video-slide'),
        prevBtn: document.querySelector('.hero-slider-arrow.prev'),
        nextBtn: document.querySelector('.hero-slider-arrow.next'),
        indicators: document.querySelectorAll('.hero-slider-indicator'),
        currentSlide: 0,
        slideCount: document.querySelectorAll('.hero-video-slide').length,
        autoplayInterval: null,
        autoplayDelay: 8000990, // 8 seconds between slides
        isAnimating: false, // Flag to prevent rapid clicking
        touchStartX: 0,
        touchEndX: 0,
        
        init: function() {
            if (!this.slides || this.slideCount === 0) return;
            
            // Set up event listeners
            this.prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevSlide();
            });
            
            this.nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextSlide();
            });
            
            // Set up indicator clicks
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });
            
            // Initialize videos
            this.initializeVideos();
            
            // Set up touch events for mobile swipe
            this.setupTouchEvents();
            
            // Start autoplay
            this.startAutoplay();
            
            // Pause autoplay on hover
            this.slides.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.slides.addEventListener('mouseleave', () => this.startAutoplay());
            
            // Handle keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') this.prevSlide();
                if (e.key === 'ArrowRight') this.nextSlide();
            });
            
            // Handle visibility change to pause autoplay when tab is not active
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoplay();
                } else {
                    this.startAutoplay();
                }
            });
            
            // Preload next slide video
            this.preloadNextSlide();
        },
        
        setupTouchEvents: function() {
            // Touch events for mobile swipe
            this.slides.addEventListener('touchstart', (e) => {
                this.touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            this.slides.addEventListener('touchend', (e) => {
                this.touchEndX = e.changedTouches[0].screenX;
                this.handleSwipe();
            }, { passive: true });
        },
        
        handleSwipe: function() {
            const threshold = 50; // Minimum distance required for swipe
            const diff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(diff) < threshold) return;
            
            if (diff > 0) {
                // Swipe left, go to next slide
                this.nextSlide();
            } else {
                // Swipe right, go to previous slide
                this.prevSlide();
            }
        },
        
        goToSlide: function(index) {
            if (this.isAnimating) return; // Prevent rapid clicking
            
            if (index < 0) index = this.slideCount - 1;
            if (index >= this.slideCount) index = 0;
            
            // Set animating flag
            this.isAnimating = true;
            
            // Update current slide
            this.currentSlide = index;
            
            // Move slides with transform
            this.slides.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
            
            // Update indicators
            this.indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Pause all videos except current
            this.pauseAllVideosExcept(index);
            
            // Preload next slide video
            this.preloadNextSlide();
            
            // Reset animating flag after transition completes
            setTimeout(() => {
                this.isAnimating = false;
            }, 600); // Match this with CSS transition duration
        },
        
        nextSlide: function() {
            this.goToSlide(this.currentSlide + 1);
        },
        
        prevSlide: function() {
            this.goToSlide(this.currentSlide - 1);
        },
        
        startAutoplay: function() {
            if (this.autoplayInterval) clearInterval(this.autoplayInterval);
            this.autoplayInterval = setInterval(() => this.nextSlide(), this.autoplayDelay);
        },
        
        pauseAutoplay: function() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        },
        
        preloadNextSlide: function() {
            // Calculate next slide index
            const nextIndex = (this.currentSlide + 1) % this.slideCount;
            
            // Get next slide video
            const nextVideo = this.slideItems[nextIndex].querySelector('video');
            
            if (nextVideo && nextVideo.getAttribute('preload') !== 'auto') {
                nextVideo.setAttribute('preload', 'auto');
                
                // Start loading the video without playing it
                if (nextVideo.readyState === 0) {
                    nextVideo.load();
                }
            }
        },
        
        initializeVideos: function() {
            // Get all videos in the slider
            const videos = document.querySelectorAll('.hero-video-slide video');
            
            videos.forEach((video, index) => {
                // Set video attributes
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.setAttribute('playsinline', ''); // For iOS
                
                // Set preload attribute
                if (index === 0) {
                    video.setAttribute('preload', 'auto');
                } else {
                    video.setAttribute('preload', 'metadata');
                }
                
                // Pause all videos except the first one
                // if (index !== 0) {
                    video.pause();
                    video.currentTime = 0;
                // }
                
                // Handle video loading
                video.addEventListener('loadedmetadata', function() {
                    // Check if video is portrait or landscape
                    const isPortrait = video.videoHeight > video.videoWidth;
                    
                    // Adjust styling based on orientation
                    if (isPortrait) {
                        video.style.width = 'auto';
                        video.style.height = '100%';
                        video.classList.remove('landscape');
                    } else {
                        // For landscape videos, we need to ensure they still appear in portrait mode
                        video.style.width = '100%';
                        video.style.height = 'auto';
                        video.style.objectFit = 'cover';
                        video.classList.add('landscape');
                    }
                });
                
                // Handle video loaded data
                video.addEventListener('loadeddata', function() {
                    // Fade in the video once it's loaded
                    video.style.opacity = '1';
                });
            });
        },
        
        pauseAllVideosExcept: function(activeIndex) {
            const videos = document.querySelectorAll('.hero-video-slide video');
            
            videos.forEach((video, index) => {
                if (index === activeIndex) {
                    // Play the active video
                    const playPromise = video.play();
                    
                    // Handle play promise (avoid uncaught promise errors)
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('Video play error:', error);
                            // Auto-play was prevented, add a play button or handle as needed
                        });
                    }
                } else {
                    // Pause all other videos
                    if (!video.paused) {
                        video.pause();
                    }
                    video.currentTime = 0;
                }
            });
            
            // Update video controls to reflect the current video state
            if (videoControls) {
                videoControls.updatePlayPauseButton();
                videoControls.updateProgress();
            }
        }
    };
    
    // Initialize the video slider
    videoSlider.init();
    
    // Video Controls Functionality
    const videoControls = {
        playPauseBtn: document.getElementById('playPauseBtn'),
        muteBtn: document.getElementById('muteBtn'),
        progressBar: document.getElementById('videoProgress'),
        progressContainer: document.querySelector('.video-progress-container'),
        videoTimeDisplay: document.getElementById('videoTime'),
        
        init: function() {
            if (!this.playPauseBtn) return;
            
            // Set up event listeners
            this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
            this.muteBtn.addEventListener('click', () => this.toggleMute());
            this.progressContainer.addEventListener('click', (e) => this.seekVideo(e));
            
            // Update progress bar
            setInterval(() => this.updateProgress(), 100);
            
            // Initial update of play/pause button
            this.updatePlayPauseButton();
        },
        
        togglePlayPause: function() {
            const activeVideo = document.querySelector('.hero-video-slide:nth-child(' + (videoSlider.currentSlide + 1) + ') video');
            if (!activeVideo) return;
            
            if (activeVideo.paused) {
                activeVideo.play();
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                activeVideo.pause();
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        },
        
        updatePlayPauseButton: function() {
            const activeVideo = document.querySelector('.hero-video-slide:nth-child(' + (videoSlider.currentSlide + 1) + ') video');
            if (!activeVideo) return;
            
            this.playPauseBtn.innerHTML = activeVideo.paused ? 
                '<i class="fas fa-play"></i>' : 
                '<i class="fas fa-pause"></i>';
        },
        
        toggleMute: function() {
            const videos = document.querySelectorAll('.hero-video-slide video');
            const isMuted = videos[0].muted;
            
            videos.forEach(video => {
                video.muted = !isMuted;
            });
            
            this.muteBtn.innerHTML = isMuted ? 
                '<i class="fas fa-volume-up"></i>' : 
                '<i class="fas fa-volume-mute"></i>';
        },
        
        updateProgress: function() {
            const activeVideo = document.querySelector('.hero-video-slide:nth-child(' + (videoSlider.currentSlide + 1) + ') video');
            if (!activeVideo) return;
            
            const progress = (activeVideo.currentTime / activeVideo.duration) * 100;
            this.progressBar.style.width = progress + '%';
            
            // Update time display
            this.videoTimeDisplay.textContent = this.formatTime(activeVideo.currentTime);
        },
        
        seekVideo: function(e) {
            const activeVideo = document.querySelector('.hero-video-slide:nth-child(' + (videoSlider.currentSlide + 1) + ') video');
            if (!activeVideo) return;
            
            const rect = this.progressContainer.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            activeVideo.currentTime = pos * activeVideo.duration;
        },
        
        formatTime: function(seconds) {
            const minutes = Math.floor(seconds / 60);
            seconds = Math.floor(seconds % 60);
            return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    };
    
    // Initialize video controls
    videoControls.init();
    
    // Function to adjust portrait video sizing on desktop
    function adjustPortraitVideoSizing() {
        const videos = document.querySelectorAll('.hero-video-slide video');
        
        videos.forEach(video => {
            // Check if video metadata is loaded
            if (video.videoWidth && video.videoHeight) {
                const isPortrait = video.videoHeight > video.videoWidth;
                
                if (isPortrait) {
                    video.style.width = 'auto';
                    video.style.height = '100%';
                    video.classList.remove('landscape');
                } else {
                    video.style.width = '100%';
                    video.style.height = 'auto';
                    video.style.objectFit = 'cover';
                    video.classList.add('landscape');
                }
            } else {
                // If metadata not loaded yet, add event listener
                video.addEventListener('loadedmetadata', function() {
                    const isPortrait = video.videoHeight > video.videoWidth;
                    
                    if (isPortrait) {
                        video.style.width = 'auto';
                        video.style.height = '100%';
                        video.classList.remove('landscape');
                    } else {
                        video.style.width = '100%';
                        video.style.height = 'auto';
                        video.style.objectFit = 'cover';
                        video.classList.add('landscape');
                    }
                });
            }
        });
    }
    
    // Call the function initially
    adjustPortraitVideoSizing();
    
    // Call it on window resize
    window.addEventListener('resize', adjustPortraitVideoSizing);
    
    // Handle video error states
    document.querySelectorAll('.hero-video-slide video').forEach(video => {
        video.addEventListener('error', function() {
            const slide = this.closest('.hero-video-slide');
            if (slide) {
                slide.classList.add('video-error');
                // Add a placeholder image or message if not already present
                if (!slide.querySelector('.video-error-message')) {
                    const errorMsg = document.createElement('div');
                    errorMsg.className = 'video-error-message';
                    errorMsg.innerHTML = '<p>Video could not be loaded</p>';
                    slide.appendChild(errorMsg);
                }
            }
        });
    });
}); 