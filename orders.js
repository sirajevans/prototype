// remove loader on page load
$(window).on("load", () => {
    setTimeout(() => {
        $("#s_page").fadeOut(100, () => {
            $("#s_page").remove();
        });
    }, 800);
});

// scroll x divider
$(".table-contents").scroll(function () {
    var scroll = $(".table-contents").scrollLeft();
    if (scroll > 0) {
        $(".table-cell-waybill-col").addClass("active");
    } else {
        $(".table-cell-waybill-col").removeClass("active");
    }
});

// btn loader
const BtnLoader = (e) => {
    if (e.target !== this) {
        $("#purchase_labels").addClass("btn-p-loading");
        $("#purchase_labels_loader").addClass("btn-p-loader-active");
    }
};
$("#purchase_labels").on("click", BtnLoader);

// list context menu
$(document).ready(() => {
    $(".shipment-row-context-btn").on("click", function (e) {
        if (e.target.closest(".shipment-row-context-btn")) {
            if ($(this).next(".context-menu-modal").hasClass("active")) {
                $(this).next(".context-menu-modal").removeClass("active");
                $(".table-cell").removeClass("active");
                $(".shipment-row-btn").removeClass("active");
                $(".shipment-row-context-btn").removeClass("active");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").css("display", "none");
                }, 150);
            } else {
                $(".context-menu-modal").removeClass("active");
                $(".table-cell").removeClass("active");
                $(".shipment-row-btn").removeClass("active");
                $(".shipment-row-context-btn").removeClass("active");
                $(this).next(".context-menu-modal").css("display", "block");
                $(this).closest(".table-cell").addClass("active");
                $(this).siblings(".shipment-row-btn").addClass("active");
                $(this).addClass("active");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").addClass("active");
                }, 1);
            }
        }
    });
    $(document).on("click", function (e) {
        if (!e.target.closest(".shipment-row-context-btn, .context-menu-btn")) {
            $(".context-menu-modal").removeClass("active");
            $(".table-cell").removeClass("active");
            $(".shipment-row-btn").removeClass("active");
            $(".shipment-row-context-btn").removeClass("active");
            setTimeout(() => {
                $(".context-menu-modal").css("display", "none");
            }, 150);
        }
    });
});

// context menus
$(document).ready(() => {
    $(".context-menu-btn").on("click", function (e) {
        if (e.target.closest(".context-menu-btn")) {
            if ($(this).next(".context-menu-modal").hasClass("active")) {
                $(this).next(".context-menu-modal").removeClass("active");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").css("display", "none");
                }, 150);
            } else {
                $(".context-menu-modal").removeClass("active");
                $(this).next(".context-menu-modal").css("display", "block");
                setTimeout(() => {
                    $(this).next(".context-menu-modal").addClass("active");
                }, 1);
            };
        }
    });
    $(document).on("click", function (e) {
        if (!e.target.closest(".context-menu-btn")) {
            $(".context-menu-modal").removeClass("active");
            setTimeout(() => {
                $(".context-menu-modal").css("display", "none");
            }, 150);
        }
    });
});

// toggle accordions on accordion-header click
$('.parcels-accordion-header').on('click', function () {
    $(this).parent().toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).siblings('.parcels-accordion-body').toggleClass('active');
});