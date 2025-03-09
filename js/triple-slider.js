$(document).ready(function() {
    // Initialize video elements with film reel effect
    $('.triple-slider-container video').each(function() {
        $(this).on('loadeddata', function() {
            $(this).show();
            // Add vintage film effect
            addVintageEffect(this);
        });
    });

    // Add vintage film effect to videos
    function addVintageEffect(videoElement) {
        // Adjust video contrast and saturation for film look
        $(videoElement).css({
            'filter': 'contrast(1.1) saturate(1.1) brightness(0.95)'
        });
    }

    // Add film flicker effect
    function addFilmFlicker() {
        // Random flicker effect
        setInterval(function() {
            if (Math.random() > 0.97) {
                $('.triple-slider-section').addClass('flicker');
                setTimeout(function() {
                    $('.triple-slider-section').removeClass('flicker');
                }, 100);
            }
        }, 500);
    }
    
    // Call the flicker effect
    addFilmFlicker();

    // Initialize Main Swiper
    const mainSwiper = new Swiper('.mainSwiper', {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChangeTransitionStart: function() {
                // Add film transition sound effect
                playFilmTransitionSound();
            }
        }
    });

    // Initialize Top Swiper with film reel movement
    const topSwiper = new Swiper('.topSwiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            reverseDirection: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });

    // Initialize Bottom Swiper with film reel movement
    const bottomSwiper = new Swiper('.bottomSwiper', {
        slidesPerView: 3,
        spaceBetween: 20,
        loop: true,
        speed: 800,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
            },
            576: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });

    // Sync swipers with film reel behavior
    mainSwiper.on('slideChange', function() {
        // Pause all videos
        $('.triple-slider-container video').each(function() {
            this.pause();
        });
        
        // Add film reel movement effect
        $('.triple-slider-container').addClass('changing');
        
        // Play video in active slide after a short delay
        setTimeout(function() {
            $('.mainSwiper .swiper-slide-active video').each(function() {
                this.play();
            });
            $('.triple-slider-container').removeClass('changing');
        }, 500);
    });

    // Initially play the center video
    $('.mainSwiper .swiper-slide-active video').each(function() {
        this.play();
    });

    // Add reel-style animation effect
    $('.triple-slider-container').on('mouseenter', '.swiper-slide', function() {
        $(this).addClass('hover-effect');
        
        // Add film reel sound on hover
        playFilmReelSound();
    }).on('mouseleave', '.swiper-slide', function() {
        $(this).removeClass('hover-effect');
    });

    // Add click event to open full screen view
    $('.mainSwiper .swiper-slide').on('click', function() {
        const slideIndex = $(this).data('swiper-slide-index');
        
        // Add film frame click sound
        playFilmFrameClickSound();
        
        // You can add full screen functionality here
        // For example, open a modal with the current slide content
        
        // For now, just log the slide index
        console.log('Clicked on slide: ' + slideIndex);
    });
    
    // Simulate film reel sound (can be replaced with actual audio)
    function playFilmReelSound() {
        // This is a placeholder for actual sound implementation
        // You can add actual sound files and play them here
        console.log('Film reel sound played');
    }
    
    // Simulate film transition sound
    function playFilmTransitionSound() {
        // This is a placeholder for actual sound implementation
        console.log('Film transition sound played');
    }
    
    // Simulate film frame click sound
    function playFilmFrameClickSound() {
        // This is a placeholder for actual sound implementation
        console.log('Film frame click sound played');
    }
    
    // Add film reel sprocket animation
    function animateSprocketHoles() {
        // Create sprocket hole animation
        setInterval(function() {
            $('.triple-slider-container::before, .triple-slider-container::after').css({
                'background-position': function(index, value) {
                    return parseInt(value) + 1 + 'px';
                }
            });
        }, 100);
    }
    
    // Add CSS class for film flicker effect
    $('<style>.triple-slider-section.flicker::before { opacity: 0.8; background: rgba(255,255,255,0.1); z-index: 1000; position: absolute; content: ""; top: 0; left: 0; width: 100%; height: 100%; }</style>').appendTo('head');
}); 