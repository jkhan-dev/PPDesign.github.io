$(document).ready(function() {
    //for sticky header
    const header = document.querySelector(".main_header");
    const toggleClass = "is-sticky";

    window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 150) {
            header.classList.add(toggleClass);
        } else {
            header.classList.remove(toggleClass);
        }
    });

    // Mobile menu functionality
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInside = navbarCollapse.contains(event.target) || navbarToggler.contains(event.target);
        
        if (!isClickInside && navbarCollapse.classList.contains('show')) {
            $(navbarToggler).trigger('click');
        }
    });
    
    // Close menu when clicking on a nav link (for mobile)
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768 && navbarCollapse.classList.contains('show')) {
                $(navbarToggler).trigger('click');
            }
        });
    });
    
    // Prevent body scrolling when mobile menu is open
    $(navbarToggler).on('click', function() {
        if (window.innerWidth < 768) {
            if (!navbarCollapse.classList.contains('show')) {
                $('body').addClass('menu-open');
            } else {
                $('body').removeClass('menu-open');
            }
        }
    });
    
    // Adjust on resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && $('body').hasClass('menu-open')) {
            $('body').removeClass('menu-open');
        }
    });

    // Initialize video elements
    $('.video-slider video').each(function() {
        $(this).on('loadeddata', function() {
            $(this).show();
        });
    });

    // home banner slider (Suicide Squad style)
    $('.autoplay').slick({
        centerMode: true,
        centerPadding: '100px',
        slidesToShow: 3,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        dots: true,
        arrows: true,
        infinite: true,
        cssEase: 'cubic-bezier(0.7, 0, 0.3, 1)',
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    centerPadding: '60px',
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    centerPadding: '50px',
                }
            }
        ]
    }).on('beforeChange', function(event, slick, currentSlide, nextSlide) {
        // Pause all videos
        $('.slider video').each(function() {
            this.pause();
        });
    }).on('afterChange', function(event, slick, currentSlide) {
        // Play the video in center slide
        $('.slick-center video').each(function() {
            this.play();
        });
    });

    // Initially play the center video
    $('.slick-center video').each(function() {
        this.play();
    });

    // testimonial
    $('.testimonial').slick({
        dots: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [{
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    dots: true
                }
            },
            {
                breakpoint: 767,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // js for sidebar toggler
    $(".sidebar_toggle_btn").click(function() {
        $(".sidebar").toggleClass("open");
        $(this).toggleClass('active');
    });
});