$(document).ready(function() {
    //for sticky header
    // $(window).scroll(function() {
    //     if ($(this).scrollTop() > 100) {
    //         $('.main_header').addClass("sticky");
    //     } else {
    //         $('.main_header').removeClass("sticky");
    //     }
    // });
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

    // home banner slider
    $('.autoplay').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        // autoplay: true,
        autoplaySpeed: 4000,
        dots: true,
        fade: true,
        adaptiveHeight: true,
  cssEase: 'linear',
  arrows: true,
  
  
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