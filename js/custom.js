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