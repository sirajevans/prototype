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

// side menu
function openSideMenu() {
    document.getElementById("side-menu").style.left = "0%";
    document.getElementById("overlay").style.transitionTimingFunction = "ease";
    document.getElementById("overlay").style.transitionDuration = "0ms";
    document.getElementById("overlay").style.zIndex = "1000";
    setTimeout(() => {
        document.getElementById("overlay").style.transitionDuration = "250ms";
        document.getElementById("overlay").style.opacity = "100%";
    }, 10); /* Delay opacity to give zindex time to change from -1 - 1000 wwhile opacity is still at 0*/
}
function closeSideMenu() {
    document.getElementById("side-menu").style.left = "-370px";
    document.getElementById("overlay").style.opacity = "0%";
    setTimeout(() => { document.getElementById("overlay").style.zIndex = "-1"; }, 10); /* Delay zIndex so opacity changes to 0 before zindex is set to -1 */
}

// search suggestions
$(document).ready(() => {
    const shipmentSearch = $("#shipment-search");
    let searchSuggestions = $(".listing-search-suggestions");
    let suggestionItem = $(".listing-search-li");

    shipmentSearch.on("focus", () => {
        searchSuggestions.css("display", "block");
        setTimeout(() => {
            searchSuggestions.addClass("active");
        }, 1);
    });

    shipmentSearch.on("focusout", () => {
        setTimeout(() => {
            searchSuggestions.removeClass("active");
            setTimeout(() => {
                searchSuggestions.css("display", "none");
            }, 150);
        }, 100);
    });

    shipmentSearch.on("keyup", () => {
        if (shipmentSearch.val().trim() === "") {
            searchSuggestions.css("display", "block");
            setTimeout(() => {
                searchSuggestions.addClass("active");
            }, 10);
        } else {
            searchSuggestions.removeClass("active");
            setTimeout(() => {
                searchSuggestions.css("display", "none");
            }, 150);
        }
    });

    suggestionItem.on("click", function () {
        var suggestion = $(this).data("id");
        shipmentSearch.focus();
        shipmentSearch.val(suggestion);
        searchSuggestions.removeClass("active");
        setTimeout(() => {
            searchSuggestions.css("display", "none");
        }, 150);
    });
});

// toggle accordions on accordion-header click
$('.accordion-header').on('click', function () {
    $(this).parent().toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).siblings('.accordion-body').toggleClass('active');
});

// filter side modal
$("#filter_btn").on("click", function () {
    $("#filter_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#filter_modal_container").addClass("side-modal-container-active");
        $("#filter_side_modal").addClass("side-modal-active");
    }, 1);
});

// hide filters side modal
$(".side-modal-container").on("click", function (e) {
    if (e.target == this) {
        $(".side-modal-container").removeClass("side-modal-container-active");
        $(".side-modal").removeClass("side-modal-active");
        setTimeout(() => {
            $(".side-modal-container").css("display", "none");
        }, 120);
    }
});

// hide all modals
$(".close-modal-btn, .center-modal-container").on("click", function (e) {
    if (e.target == this) {
        $(".center-modal-container").removeClass("center-modal-container-active");
        $(".center-modal").removeClass("center-modal-active");
        setTimeout(() => {
            $(".center-modal-container").css("display", "none");
        }, 120);
    }
});

// purchase label center modal
$("#fulfill_btn").on("click", function () {
    $("#purchase_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#purchase_modal_container").addClass("center-modal-container-active");
        $("#purchase_center_modal").addClass("center-modal-active");
    }, 1);
});

// action menu
$(document).ready(function () {
    $('.checkbox-placeholder').click(function () {
        $('.action-menu').toggleClass('active');
    });
});

// ---- order overview page

// init maps
function initMaps() {
    var location = {
        lat: -33.913409,
        lng: 18.393898
    };
    // Initialize collection map
    var shipAddressMap = new google.maps.Map(document.getElementById("ship-address-map"), {
        zoom: 14,
        center: {
            lat: location.lat + 0.0005,
            lng: location.lng
        },
        zoomControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        disableDefaultUI: true,
        mapId: "2f3a9c93fc40c85d",
    });
    var collectionIcon = {
        url: "https://uploads-ssl.webflow.com/5fda6f586fdb5a2f2cc5696a/64aaa7c21ccddd56cca1cad6_verified-map-marker.svg",
        size: new google.maps.Size(129, 57),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(64.5, 50),
    };
    var shipAddressMarker = new google.maps.Marker({
        position: {
            lat: -33.913409,
            lng: 18.393898
        },
        map: shipAddressMap,
        icon: collectionIcon,
    });
}

// toggle accordions on accordion-header click
$('.parcels-accordion-header').on('click', function () {
    $(this).parent().toggleClass('open');
    $(this).find('.accordion-arrow').toggleClass('active');
    $(this).siblings('.parcels-accordion-body').toggleClass('active');
});

// edit items modal
$("#edit_items_btn").on("click", function () {
    $("#items_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#items_modal_container").addClass("center-modal-container-active");
        $("#items_center_modal").addClass("center-modal-active");
    }, 1);
});

// edit notes modal
$("#edit_notes_btn").on("click", function () {
    $("#notes_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#notes_modal_container").addClass("center-modal-container-active");
        $("#notes_center_modal").addClass("center-modal-active");
    }, 1);
});

// edit customer info modal
$("#edit_customer_info_btn").on("click", function () {
    $("#customer_info_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#customer_info_modal_container").addClass("center-modal-container-active");
        $("#customer_info_center_modal").addClass("center-modal-active");
    }, 1);
});

// edit shipping address modal
$("#edit_shipping_address_btn").on("click", function () {
    $("#shipping_address_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#shipping_address_modal_container").addClass("center-modal-container-active");
        $("#shipping_address_center_modal").addClass("center-modal-active");
    }, 1);
});

// edit parcels modal
$("#edit_parcels_btn").on("click", function () {
    $("#parcels_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#parcels_modal_container").addClass("center-modal-container-active");
        $("#parcels_center_modal").addClass("center-modal-active");
    }, 1);
});

// ---- fulfilment page

// collection address modal
$("#collection_btn").on("click", function () {
    $("#collection_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#collection_modal_container").addClass("center-modal-container-active");
        $("#collection_center_modal").addClass("center-modal-active");
    }, 1);
});

// fulfilment service modal
$("#service_btn, #view_all_rates").on("click", function () {
    $("#service_modal_container").css("display", "flex");
    setTimeout(() => {
        $("#service_modal_container").addClass("center-modal-container-active");
        $("#service_center_modal").addClass("center-modal-active");
    }, 1);
});

// modal header shadow
$(".center-modal-body").scroll(function () {
    var scroll = $(this).scrollTop();
    $(".center-modal-header").toggleClass("center-modal-header-active", scroll > 0);
});

$(document).ready(function () {
    // Loop through each fulfill counter container
    $('.fulfill-counter').each(function () {
        var counter = $(this);
        var minusElement = counter.find('.fulfill-counter-minus');
        var plusElement = counter.find('.fulfill-counter-plus');
        var counterBody = counter.find('.fulfil-counter-body div');

        var maxValue = parseInt(counterBody.text().split('/')[1].trim());
        var counterValue = maxValue;

        updateCounterDisplay();

        plusElement.addClass('disabled');
        minusElement.on('click', decreaseCounter);
        plusElement.on('click', increaseCounter);

        function updateCounterDisplay() {
            counterBody.text(counterValue + ' / ' + maxValue);
        }

        function decreaseCounter() {
            counterValue = Math.max(counterValue - 1, 0);
            updateCounterDisplay();

            minusElement.toggleClass('disabled', counterValue === 0);
            plusElement.removeClass('disabled');
        }

        function increaseCounter() {
            counterValue = Math.min(counterValue + 1, maxValue);
            updateCounterDisplay();

            plusElement.toggleClass('disabled', counterValue === maxValue);
            minusElement.removeClass('disabled');
        }
    });
});